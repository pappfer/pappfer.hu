# Blog — szerkesztési szabályzat

Ez a fájl írja le, hogyan szólnak a pappfer.hu cikkei. Minden cikk ehhez igazodik,
bármelyik agent írja is (Claude, Codex vagy más). A lépésenkénti munkafolyamat a
`WORKFLOW.md`-ben van.

A cikkeket Papp Ferenc neve alatt tesszük közzé, ezért úgy kell szólniuk, mintha ő
írta volna: egy tapasztalt fejlesztő, aki ért hozzá, és nem akar senkit lenyűgözni.
Ha egy olvasó a cikk közepén azt gondolja, hogy „ezt egy AI írta”, akkor a cikk
elbukott, akármilyen pontos.

---

## 1. Kinek írunk

Két olvasó van, és mindkettőnek a saját nyelvén kell szólni:

- **a fejlesztő vagy üzemeltető**, aki ma este megcsinálja: pontos parancsot,
  verziószámot, buktatót akar;
- **a döntéshozó** (cégvezető, termékfelelős), akinek el kell döntenie, foglalkozzon-e
  vele, és kit hívjon: azt akarja tudni, mekkora a baj, és mit kérjen a csapatától.

A cikk eleje a döntéshozónak szól, a közepe a fejlesztőnek. A cél mindig az, hogy
az olvasó a cikk után tudja, mit csináljon. Ha ezt egy mondatban nem tudod
megfogalmazni, még ne írj.

## 2. A hang

Ferenc így beszél: egyenesen, gyakorlatiasan, felesleges kör nélkül. Őszinte akkor
is, ha az nem hízelgő („ezt nem lehet megúszni”, „erre nincs jó válasz”). Nem
okoskodik, nem ad el, nem riogat. Ha valami bizonytalan, kimondja, hogy
bizonytalan.

- **Első személy, egyes szám.** „Én ezt csinálnám”, „ügyfeleknél azt látom”, nem
  „javasolt”, „érdemes lehet megfontolni”.
- **Magyarul tegezünk.** Az angol változat természetes, közvetlen „you”.
- **Véleménye van.** Ha két út van, megmondja, melyiket választaná és miért. A
  „mindkettőnek megvannak az előnyei” típusú semleges összegzés tilos.
- **Konkrét.** Verziószám, parancs, dátum, név, szám. Ahol általánosság állna,
  oda példa kell.
- **Szárazon humoros, ritkán.** Legfeljebb egy-két félmondat cikkenként, ha
  magától adódik. Viccet erőltetni rosszabb, mint kihagyni.
- **Nem tanárbácsi.** Nem magyarázza el, amit az olvasó úgyis tud, és nem zárja
  erkölcsi tanulsággal azt, ami magától értetődik.

### Saját tapasztalat — csak ami tényleg megtörtént

Ami a cikket Ferencévé teszi, az a saját nézőpontja: mit látott ügyfeleknél, mit
csinál ő maga, mi a véleménye. **Ezt nem szabad kitalálni.** Ha a megbízásban
(lásd `WORKFLOW.md`) Ferenc megadott egy élményt vagy véleményt, arra épüljön a
cikk. Ha nem adott meg, a cikk ne állítson saját esetet („egy ügyfelemnél
múlt héten…”), hanem maradjon a szakmai ítéletnél („én ezzel kezdeném”, „ezt
láttam már elcsúszni”), és az agent a végén kérdezzen rá, van-e konkrét
tapasztalat, amit beírhatunk.

Ügyfelet, céget név szerint csak akkor említünk, ha Ferenc kifejezetten kéri.

## 3. Amitől egy szöveg AI-szagú — és amit helyette csinálunk

Ezek a minták egyenként ártatlanok, együtt viszont azonnal elárulják a gépet. A
kész szöveget kifejezetten ezekre kell átnézni (lásd 9. pont).

### Szerkezet

- **Minden szakasz ugyanolyan hosszú, ugyanolyan felépítésű.** Ember nem így ír:
  egyik rész három mondat, a másik egy oldal, mert annyi kell.
- **Hármas felsorolások mindenhol** („gyors, biztonságos és skálázható”). Ha kettő
  van, kettőt írj; ha négy, négyet.
- **Minden bekezdés végén összegző mondat**, ami megismétli az előzőt. Törölni.
- **„Nem X, hanem Y” fordulat** újra meg újra. Cikkenként legfeljebb egyszer.
- **Felsorolás ott, ahol folyó szöveg kellene.** Lista akkor jó, ha az olvasó
  tényleg sorban végigmegy rajta (lépések, ellenőrzőlista). Gondolatmenetet
  bekezdésben írunk.
- **Túl sok vastagítás.** Bekezdésenként legfeljebb egy, és csak azon, amit
  átfutva is látni kell (verzió, parancs, határidő).
- **Kérdéssel nyitó cím vagy bekezdés** („Gondoltál már arra, hogy…?”). Nem.
- **Lezáró „Összegzés” vagy „Konklúzió” szakasz**, ami elismétli a cikket. A cikk
  ott ér véget, ahol elfogyott a mondanivaló; a végén a CTA jön.

### Szavak és fordulatok

Magyarul kerülendő:

- „napjainkban”, „a mai rohanó világban”, „egyre inkább”, „manapság”
- „elengedhetetlen”, „kulcsfontosságú”, „kiemelt fontosságú”, „kritikus
  jelentőségű” (kivéve, ha szó szerint a CVSS „kritikus” besorolásról van szó)
- „fontos megjegyezni”, „érdemes kiemelni”, „nem utolsósorban”, „összességében
  elmondható”
- „ebben a cikkben bemutatom / megvizsgáljuk”, „nézzük meg közelebbről”,
  „merüljünk el”
- „nem csupán…, hanem…”, „legyen szó akár…, akár…”
- „-val/-vel történő”, „kerül + igenév” („bevezetésre kerül”), „által”
  szerkezetek halmozása: ezek tükörfordításból jönnek. Magyarul igével mondjuk:
  „bevezetik”, „frissíted”
- „megoldás” minden második mondatban, „hatékony”, „zökkenőmentes”, „innovatív”,
  „robusztus”
- magázás, „Ön”, „Kedves Olvasó”

Angolul kerülendő:

- delve, dive into, landscape, realm, tapestry, navigate (átvitt értelemben),
  leverage, harness, unlock, elevate, empower, streamline, seamless, robust,
  cutting-edge, game-changer, crucial, pivotal, vital, essential (töltelékként)
- "In today's fast-paced world", "In the ever-evolving…", "It's worth noting
  that", "It's important to remember", "When it comes to", "At the end of the
  day", "In conclusion", "Let's break it down"
- "Whether you're a … or a …", "Not only … but also"
- "Here's the thing:", "The bottom line?", "Spoiler:" és a hasonló, kettősponttal
  felvezetett csattanók
- Ha bármelyik mégis a legpontosabb szó, maradhat. A tilalom a töltelékszóra
  vonatkozik, nem a jelentésre.

### Írásjelek és forma

- **Gondolatjel (—) cikkenként legfeljebb 2–3.** Az AI-szöveg egyik legbiztosabb
  jele a gondolatjeles közbeszúrás minden második mondatban. Helyette vessző,
  pont, zárójel vagy kettőspont.
- Emoji nincs. Felkiáltójel szinte soha.
- Ne legyen minden mondat ugyanolyan hosszú. Egy rövid mondat. Aztán egy
  hosszabb, ami kifejti, miért számít, és mit kell vele kezdeni.
- Magyarul magyar idézőjel („…”), angolul egyenes vagy kacsa, de egy cikken belül
  egységesen.

### A magyar nem fordítás

A HU és az EN változat ugyanazt mondja, de **mindkettőt a saját nyelvén kell
megírni**, nem egymásból fordítani. A magyar olvasónak magyar példák kellenek
(megosztott tárhely, magyar szolgáltatók, forint, ha releváns), a mondatszerkezet
magyar legyen: ige előre, kevés főnév, kevés szenvedő szerkezet. Ha egy mondat
fordításnak hangzik, írd újra úgy, ahogy egy magyar fejlesztő mondaná a
kollégájának.

## 4. Cikktípusok

| Típus | Mikor | Terjedelem | Kötelező elem |
|-------|-------|------------|----------------|
| **Gyorsreagálás** (security advisory, fontos kiadás, kivezetés) | 24–48 órán belül | 900–1600 szó | „Röviden” lista az elején, pontos teendők, források |
| **Gyakorlati útmutató** (hogyan csinálj meg X-et) | bármikor | 1200–2500 szó | működő kód/parancs, buktatók, „mikor ne így csináld” |
| **Esettanulmány** | ha Ferenc ad anyagot | 800–1500 szó | probléma → döntés → eredmény számokkal, ügyfél engedélyével |
| **Vélemény** (trend, eszköz, döntés) | ha Ferencnek van álláspontja | 600–1200 szó | egyértelmű állítás az elején, érvek, ellenérvek őszintén |

Vélemény és esettanulmány csak Ferenc saját inputjával készülhet (lásd 2. pont).

## 5. Felépítés

1. **Nyitó bekezdés (2–4 mondat):** mi történt vagy mi a téma, kit érint, mi a
   tét. Nincs bevezető köröző, nincs „ebben a cikkben”. Az első mondatból kiderül,
   miről szól.
2. **Miért most / miért számít** (egy rövid bekezdés), ha nem nyilvánvaló.
3. **„Röviden” / "The short version"** — számozott lista a teendőkről, ha a
   cikk teendőket ad. Aki csak ezt olvassa el, az is tudja, mit kell tenni.
4. **Törzs:** `##` szakaszok, a címük megmondja, mi van alatta („Hogyan
   frissíts?”, nem „Megoldási lehetőségek”). `###` csak ha tényleg kell.
5. **Lezárás:** egy bekezdés arról, mi a nagyobb tanulság vagy mi a következő
   lépés, ha van ilyen. Ha nincs, kihagyjuk.
6. **„Segítsek?” / "Need a hand?"** — rövid, első személyű CTA, a témához
   kötve: miben tud Ferenc konkrétan segíteni, link a kapcsolatfelvételre
   (`https://pappfer.hu/<lang>/#contact`). Egy bekezdés, nem reklám.
7. **Források** — `---` után, félkövér „Források” / "Sources" címke, listában.

## 6. Tények és források

- **Minden nem nyilvánvaló állításnak legyen forrása.** Verziószám, dátum,
  CVSS, „támadásokat észleltek”, „kiszivárgott”: mind a Források között legyen
  vagy a szövegben linkelve.
- **Elsődleges forrás előre:** gyártó, projekt, CVE-adatbázis, hivatalos
  közlemény. Utána a megbízható másodlagosak (biztonsági cégek elemzései,
  disztribúciók). Hírportál csak kiegészítésnek.
- **Hírreakciónál legalább két független forrás** erősítse meg a lényeges
  állításokat. Amit csak egy forrás mond, azt úgy írjuk („a Sansec szerint…”).
- **Ne erősebben, mint a forrás.** Ha az ENISA „mielőbb” frissítést kér, nem
  írjuk, hogy „azonnal”. Ha valami nem biztos, kimondjuk.
- **Parancsot, kódot csak ellenőrizve.** Ha az agent nem tudja lefuttatni, a
  hivatalos dokumentációval vesse össze a szintaxist.
- A link szövege mondja meg, mi van mögötte („php.net: hivatalos biztonsági
  közlemény”), nem „itt” vagy „link”.
- A Források lista nyelve a cikk nyelve, a link maradhat angol oldalra.

## 7. Belső linkek

Ahol természetesen adódik, linkelj a saját oldalakra, cikkenként 1–3 helyen:

- szolgáltatás-oldalak: `/en/laravel-developer/`, `/hu/laravel-fejleszto/`,
  `/en/ai-llm-integration/`, `/hu/ai-integracio/`, `/en/python-developer/`,
  `/hu/python-fejleszto/` stb. (a teljes lista a `dist/<lang>/` mappában);
- AI-szótár fogalmai: `/en/ai-glossary/#<term-id>`, `/hu/ai-szotar/#<term-id>`;
- korábbi cikkek: `/<lang>/blog/<slug>/`.

Ne erőltesd: ha egy link nem segít az olvasónak, ne legyen ott.

## 8. Cím, slug, meta

- **`title`** (H1): konkrét, megmondja, mit kap az olvasó. Legfeljebb ~70
  karakter. Kattintásvadász cím nincs („Ez az egy hiba mindent megváltoztat”).
- **`metaTitle`**: a keresőnek, ~60 karakter, a végén `| Ferenc Papp` /
  `| Papp Ferenc`.
- **`description`**: 140–160 karakter, a lényeg és hogy mit kap az olvasó.
- **`kicker`**: egy-két szavas műfajcímke a cím fölött (Security advisory /
  Biztonsági figyelmeztetés, How-to / Útmutató, Case study / Esettanulmány,
  Opinion / Vélemény).
- **`slug`**: rövid, angol vagy a téma saját neve, dátum nélkül, kötőjellel
  (`php2shell`, `laravel-12-upgrade`). **Egyszer élesítve soha nem változik.**
  A HU slug lehet ugyanaz, mint az EN, ha a téma neve nemzetközi.
- **`keywords`**: 5–10, vesszővel, a cikk nyelvén.

## 9. Önellenőrzés beadás előtt

A kész szöveget az agent olvassa végig még egyszer, kifejezetten ezekkel a
kérdésekkel. Ami nem megy át, azt átírja, nem csak jelzi:

1. Az első mondatból kiderül, miről szól a cikk?
2. Van-e benne legalább egy dolog, amit csak egy gyakorló fejlesztő tudna
   (buktató, ellenőrzés, tapasztalati szabály)? Ha nincs, a cikk még gyenge.
3. Keress rá a 3. pont szavaira és fordulataira mindkét nyelven. Hány
   gondolatjel van?
4. Olvasd fel magadban a magyar szöveget: hangzik-e valahol fordításnak?
5. Van-e állítás forrás nélkül, vagy erősebben, mint a forrás?
6. Kitalált-e a szöveg bármilyen személyes élményt, ügyfelet, számot?
7. Ha Ferenc hangosan felolvasná egy ügyfélnek, szégyellné-e valamelyik mondatot?
