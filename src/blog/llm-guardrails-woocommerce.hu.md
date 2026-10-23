---
slug: llm-guardrails-woocommerce
date: 2026-10-23
related: python, ai
kicker: Esettanulmány
keywords: FastAPI, AI-integráció, LLM, WooCommerce, Vue 3, PWA, structured outputs, AI SEO, Python
title: Az AI megírja, a kód ellenőrzi: esettanulmány egy WooCommerce-appról
metaTitle: AI-integráció FastAPI-val és WooCommerce-szel | Papp Ferenc
description: Telefonos app, ami egy Facebook-posztból AI-val írt SEO-val kész WooCommerce-eseményt csinál, és hat feladat, amit a kódnak kellett visszavennie a modelltől.
---
A [TiaDor Stúdió](https://tiador.hu/) a feleségem debreceni kreatív stúdiója: festős workshopokat és gyerekprogramokat árul WooCommerce-termékként. Korábban minden eseményt kézzel kellett összerakni a WordPress adminban: cím, leírás, dátum, ár, helyek száma, SEO-cím, meta leírás, slug, kép. Most a telefonján csinálja egy kis appban, amit én írtam: bemásolja a szöveget, amit amúgy is megírt a Facebookra, hozzáteszi a plakátot, a többit pedig kitölti egy nyelvi modell.

Az, hogy egy LLM SEO-mezőket ír, önmagában nem érdekes, ezt bárki összerakja egy délután. Az az érdekes, ami élesben elromlott, és hogy szinte mindegyik javítás azzal járt, hogy egy feladatot elvettem a modelltől, és sima Pythonban oldottam meg.

## Mit csinál az app?

A technológia szándékosan unalmas: Vue 3 PWA a Cloudflare Pagesen, [FastAPI](/hu/python-fejleszto/) backend Dockerben egy VPS-en, adatbázis nincs. A backend csak továbbítja az adatokat a WordPress és a WooCommerce REST API felé, az igazság végig a webshopban van.

Egy esemény feltöltése két lépés, és ez a kettéválasztás a projekt legfontosabb döntése:

1. Kitölti a minimumot (fotó, név, leírás, dátum, ár), és megnyomja az „SEO generálás” gombot. A backend elküldi a modellnek a szöveget és a 1280 pixelesre kicsinyített plakátot. Visszakapja a SEO-címet, a meta leírást, a rövid leírást, a slugot, a kategóriákat, a címkéket, és ha a szövegben vagy a plakáton talált, a dátumot és az időtartamot.
2. Minden generált mező szerkeszthető mezőként jelenik meg. A WordPressbe csak akkor kerül bármi, amikor a „Feltöltés” gombra bök: ekkor átméretezi és feltölti a képet, és létrehozza a terméket a Yoast- és ACF-mezőkkel együtt.

Ha a modell nem elérhető, az űrlap akkor is működik, a SEO-mezőket kézzel is ki lehet tölteni. Egy AI-funkció, ami miatt egy kisvállalkozás nem tud publikálni, többet árt, mint használ.

## Hat feladat, amit a kód vett vissza

Mindegyik legalább egyszer kikerült az éles oldalra, mielőtt javítottam. Ez az igazi esettanulmány.

**1. Slug.** A prompt azt kérte a modelltől, hogy írjon ékezet nélküli magyar slugot. Szeptemberben a „Gyertyadíszítő” szóból `gyertyadisito` lett, elveszett egy „z”, és ez az URL élesbe került, meg is osztották. Az ékezetmentesítés megoldott, determinisztikus feladat, a modellnek ehhez semmi köze. A slug alapját most egy rövid függvény építi újra a végleges címből. (Az `ő` és az `ű` külön táblázatot kér, mert az `é`-vel ellentétben Unicode NFKD-vel nem bomlanak szét.) A modell slugjából csak a dátum utótag marad meg.

**2. Címkék.** A modell néhány hetente kitalálta egy meglévő címke új írásmódját: `oszi-szunet` mellé `osziszunet`, `korvaszon` mellé `korvazszon`. Mindegyikből egy szinte üres címkeoldal lett. Két réteg oldotta meg. A prompt most megkapja az oldal 60 leggyakoribb címkéjét, mentés előtt pedig minden címkét összepárosítok egy meglévővel: előbb ékezet, kisbetű-nagybetű és kötőjel nélküli kulcs alapján, elírásnál `difflib`-bel, 0,88-as küszöbbel. Új címke csak akkor jön létre, ha tényleg új.

**3. Kategóriák.** Nem volt elég felsorolni őket a promptban, a modell így is visszaadott nem létező slugokat. Az OpenAI szigorú structured outputs módjával most maga a JSON-séma szűkíti a `category_slugs` mezőt a webshop valódi kategóriáinak listájára (`enum`), kérésenként frissen. A modell akkor sem tud érvénytelent visszaadni, ha akarna.

**4. Rossz cím.** Ez volt a legkínosabb. Élő eseményeknél a helyszín sorában egy másik cég utcacíme jelent meg. A duplikált események egy régi piszkozatból örökölték, ami még azelőtt készült, hogy a prompt megkapta volna a stúdió valódi címét. A prompt javítása nem tisztítja meg a már meglévő adatot, ezért most minden mentésnél fut egy ellenőrzés: ha egy helyszínsorban nem az esemény saját címe szerepel, a kód kicseréli a helyesre.

**5. A hét napjai.** Ha egy eseményt új dátummal duplikálunk, az „október 25-én, szombaton” típusú mondatokat át kell írni, a számtól függő ragokkal együtt. Ezt szándékosan a modellnél hagytam: a valódi leírásokban van „szeptember 13-i” és „Október 29-30.” is, egy reguláris kifejezés ezek egy részét csendben kihagyná. A hét napját viszont nem a modell számolja ki, hanem a kód, és készen adja át neki. Utána a kód átnézi az átírt szöveget, és ha maradt benne régi dátum, figyelmeztetést mutat egy „szerkesztés” gombbal, ahelyett hogy csendben elmentené.

**6. Formázás.** A Facebookról bemásolt szöveg soronként egy bekezdés, tele láthatatlan nulla szélességű szóközökkel, és a WordPress egyetlen `<br>`-ekkel teli tömbként jelenítette meg. Kérhettem volna a modelltől, hogy „formázza meg szépen”. Nem tettem, mert ha a modell átírhatja a szöveget, át is fogja írni. Egy determinisztikus formázó alakítja HTML-lé a címkés sorokat, a listákat és az alcímeket, és egyetlen szót sem változtat. Mielőtt az élő eseményeken lefuttattam, 14 valódi leíráson ellenőriztem.

## Miben jó a modell?

Mindezek ellenére a munka nagyját továbbra is a modell végzi, és jól. A stúdió hangján írja meg a meta leírást és a rövid leírást, leolvassa a plakátról a dátumot és az időpontot (egy valódi napközis tábor plakátjáról helyesen olvasta le, hogy „8:00–16:00”), és kijavítja az elírásokat. A javításokat listában adja vissza („hibás → javított”), és csak pontosan ezeket a cseréket alkalmazom az eredeti szövegen, így a megfogalmazás az övé marad.

A modellválasztás kevesebbet számított, mint a korlátok. Ugyanazokon a valódi termékeken összehasonlítottam a `gpt-6-luna`-t és a `gpt-6.1-sol`-t: a kategória-enum mellett mindkettő ugyanazokat a helyes kategóriákat és dátumokat adta. A nagyobb modell másfél-kétszer hosszabb leírásokat írt, és kétszer is oda nem illő címkét tett hozzá, így maradt a kisebb. A backend az Anthropic API-ját is támogatja, a váltás egyetlen környezeti változó.

## A szabály, amit bármelyik LLM-projektbe vinnék

Ha egy szabályt pontosan meg lehet fogalmazni, annak a kódban a helye: ékezetmentesítés, milyen címkék és kategóriák léteznek, melyik a helyes cím, milyen napra esik egy dátum. A modell azt kapja, amihez ítélőképesség és nyelvérzék kell. A kimenete átmegy egy sémán és néhány ellenőrzésen, és élesítés előtt egy ember is ránéz. A fenti hibák mindegyikéből regressziós teszt lett. A backendnek 53 tesztje van, és a dátummal jelölt esetek többsége élesben is előfordult hiba.

Ebben semmi egzotikus nincs. Hétköznapi szoftverfejlesztés egy olyan komponens köré, ami az esetek néhány százalékában magabiztosan téved. Pont itt térül meg a legjobban.

## Segítsek?

Ha egy meglévő PHP-, WordPress- vagy Python-rendszerbe szeretnél nyelvi modellt építeni, és annak unalmasan megbízhatónak kell lennie, nem csak egy demón látványosnak, ez az az [AI-integrációs munka](/hu/ai-integracio/), amit csinálok. [Írd meg, min dolgozol](https://pappfer.hu/hu/#contact).

---

**Források**

- [OpenAI: Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
- [Python dokumentáció: difflib.get_close_matches](https://docs.python.org/3/library/difflib.html#difflib.get_close_matches)
- [Python dokumentáció: unicodedata.normalize](https://docs.python.org/3/library/unicodedata.html#unicodedata.normalize)
- [WooCommerce REST API dokumentáció: termékek](https://woocommerce.github.io/woocommerce-rest-api-docs/#products)
