# Blog — munkafolyamat agenteknek

Így készül egy cikk a pappfer.hu-ra, attól, hogy Ferenc küld egy linket, addig,
hogy a cikk élesben van. Bármelyik agent ugyanezt a folyamatot követi. A hangról és
a tartalomról a `STYLE.md` szól; azt **írás előtt olvasd el**, és a 9. pontja
szerint ellenőrizd a kész szöveget.

## A megbízás

Ferenc általában ennyit ad:

- egy vagy több **linket** (hír, közlemény, kiadás, cikk), vagy egy témát;
- opcionálisan **pár mondatot a saját véleményéről vagy tapasztalatáról** — ha
  van, erre épül a cikk;
- opcionálisan a cikktípust vagy a nyelveket. Alapértelmezés: **EN + HU**.

Ha a téma nem kapcsolódik Ferenc szolgáltatásaihoz (PHP, Laravel, Symfony, Yii2,
Vue/React, Python, AI-integráció, üzemeltetés, biztonság, régi rendszerek), vagy
nincs benne semmi, amit egy gyakorló fejlesztő hozzá tudna tenni, **írás előtt
szólj**, és javasolj jobb szöget. Rossz cikket nem írunk meg csak azért, mert
kérték.

## 1. Kutatás

1. Olvasd el a megadott linkeket.
2. Keresd meg az **elsődleges forrást** (projekt, gyártó, CVE, hivatalos
   közlemény), és hírreakciónál legalább egy független megerősítést.
3. Jegyezd fel a pontos tényeket: verziók, dátumok (UTC), számok, idézetek, a
   forrás URL-jével együtt.
4. Ha valami ellentmondásos vagy nem erősíthető meg, a cikkben úgy is szerepel
   (vagy kimarad), és Ferencnek a végén jelzed.

## 2. Fájlok

Cikkenként nyelvenként egy fájl: `src/blog/<id>.<lang>.md` (`<id>` általában a
slug). Front matter, utána markdown:

```
---
slug: laravel-12-upgrade
date: 2026-11-03
category: how-to
keywords: Laravel, Laravel 12, upgrade, PHP 8.4
title: …
metaTitle: … | Ferenc Papp
description: …
---
Nyitó bekezdés…
```

- Kötelező: `slug`, `date`, `title`, `metaTitle`, `description`, `category`
  (`security`, `how-to`, `case-study`, `opinion`; lásd `STYLE.md` 8. pont).
  Ugyanaz a kategória kerül mindkét nyelvű változatba.
  Opcionális: `keywords`, `updated` (lásd 7. pont), `related` (szolgáltatásoldalak
  azonosítói a `src/landing.json`-ből, pl. `related: python, ai`: a cikk ezeken az
  oldalakon „A blogból” blokkban jelenik meg; a német oldalak az angol változatra
  linkelnek).
- `date`: a megjelenés napja, **UTC** szerint, `YYYY-MM-DD`.
- A slug nem ütközhet meglévővel (`ls src/blog`), és élesítés után **soha nem
  változik**.
- Támogatott markdown: `##`–`####` címek, bekezdés, `**félkövér**`, `*dőlt*`,
  `` `kód` ``, linkek, számozott és pontozott lista, kódblokk nyelvvel
  (```` ```bash ````), `---`, kép (lásd lent). Táblázat és HTML nincs.
- **Kép:** külön sorban `![alt szöveg](fajlnev.webp "Képaláírás")`. A fájl a
  `src/blog/img/` mappába kerül (élesben `/img/blog/`), neve a cikk slugjával
  kezdődik (`<slug>-<mit-mutat>.webp`), és a két nyelv ugyanazt a fájlt használja,
  ha a képen nincs nyelvfüggő szöveg. **Csak WebP**, legfeljebb 1600 px szélesen:
  `cwebp -q 82 -resize 1080 0 be.png -o src/blog/img/<slug>-x.webp`. Az alt
  szöveg kötelező, és azt írja le, ami a képen látszik; a képaláírás opcionális,
  benne `**félkövér**` és `` `kód` `` használható. A build a fájlból olvassa ki a
  méretet; ha a fájl hiányzik, nem WebP vagy nincs alt szöveg, a build leáll. Az
  álló és a legfeljebb 800 px széles képek (telefonos képernyőkép) keskenyebb,
  középre igazított keretet kapnak.
  Képernyőképen ne legyen személyes adat (vásárló, utalvány kedvezményezettje),
  belső URL, bejelentkezés vagy üzleti szám (foglalások, bevétel), hacsak Ferenc
  kifejezetten nem kéri.
- A `##` címekből horgony lesz, ezért legyenek rövidek és stabilak.

## 3. Megírás és önellenőrzés

Írd meg mindkét nyelvet a `STYLE.md` szerint, **mindkettőt a saját nyelvén**,
ne egymásból fordítva. Utána menj végig a `STYLE.md` 9. pontján, és javítsd,
amit kell. Ez nem opcionális.

## 4. Megosztási kép és build

```bash
CHROME_PATH=/usr/bin/google-chrome npm run generate-og -- --blog-only
node build.js
```

A build hibával leáll, ha egy cikkhez nincs megosztási kép
(`src/og/<lang>-blog-<slug>.jpg`). A kép a cikk kategóriájának nevéből és a `title`-jéből
készül, ezért ha bármelyik változik, generáld újra.

Ellenőrizd:

- `dist/<lang>/blog/<slug>/index.html` létezik, a blogindexen és a főoldal
  „Latest articles” részében megjelenik;
- minden JSON-LD blokk érvényes JSON;
- a cikk belső linkjei létező oldalra mutatnak;
- Lighthouse mindkét nyelvű cikkoldalon 100/100/100/100
  (`CHROME_PATH=/usr/bin/google-chrome npx lighthouse …` egy helyi
  `npx serve dist` ellen).

## 5. Előnézet Ferencnek

A cikk **nem megy egyből a masterre.** Előbb előnézet:

```bash
git switch -c draft/<slug>
git add src/blog src/og src/lastmod.json
git commit -m "Draft: <cím angolul>"
git push -u origin draft/<slug>
```

A Cloudflare Pages a branchet külön előnézetként építi meg:
`https://draft-<slug>.pappfer-hu.pages.dev/en/blog/<slug>/` (és `/hu/…`). A Cloudflare
az aliast 28 karakterre vágja, hosszú slugnál tehát `draft-` + a slug első 22
karaktere lesz a cím. Az
előnézeti címeket a Cloudflare nem engedi indexelni. Ha az előnézet nem jön
létre (a branch-buildek ki vannak kapcsolva), szólj Ferencnek, és addig a helyi
buildet mutasd.

Ferencnek ezt add át, röviden:

1. az előnézeti linkeket;
2. egy-két mondatban, miről szól a cikk és milyen szögből;
3. a bizonytalan pontokat (ellentmondó források, amit nem tudtál ellenőrizni);
4. **kérdést a saját tapasztalatáról**, ha a megbízásban nem volt, és a cikk
   erősebb lenne vele;
5. a LinkedIn-, a /dev/null- és az X-poszt szövegét és a megosztási kép
   URL-jét (6. pont).

## 6. Közösségi posztok

Ferenc minden cikket három helyen oszt meg, **mindenhol angolul**: LinkedInen, a
[/dev/null](https://dev-null.sh/)-en (GitHub-alapú fejlesztői közösségi oldal) és
X-en. A posztok szövegét **minden cikk végén** add át a válaszban, akkor is, ha a
cikk csak magyarul jelent meg (ilyenkor a magyar cikkre linkelj, és a posztban
jelezd, hogy magyar nyelvű). A posztok nem kerülnek a repóba, és ugyanaz a
`STYLE.md` hang érvényes rájuk: első személy, konkrétumok, nincs reklámszöveg.

- **LinkedIn:** az első két sor magában is érthető legyen (a többi a
  „…továbbiak” mögé kerül). 3–8 rövid bekezdés, a cikk legfontosabb gyakorlati
  tanulsága, a link a végén. Legfeljebb 3 hashtag, emoji nincs.
- **/dev/null:** egyszerű szöveg, legfeljebb **280 karakter** a linkkel együtt.
  Egy konkrét állítás vagy buktató a cikkből, utána a link. Hashtag és emoji
  nincs.
- **X:** ugyanaz a szöveg, mint a /dev/null-posztban, csak a saját linkjével.

**A link formája.** Mindhárom posztban a link a végén, **külön sorban, előtte
egy üres sorral** áll, így Ferenc egy az egyben bemásolhatja. Minden platform
**saját `?ref=` paramétert** kap:

- LinkedIn: `https://pappfer.hu/en/blog/<slug>/?ref=linkedin`
- /dev/null: `https://pappfer.hu/en/blog/<slug>/?ref=devnull`
- X: `https://pappfer.hu/en/blog/<slug>/?ref=x`

Ennek oka, hogy a platformok URL-enként tárolják a link előnézetét. Ha egy
címet egyszer üresen kértek le (például élesítés előtt, amikor még 404 volt),
akkor napokig kép nélkül mutatják, és ezt kézzel nem lehet frissíteni. Az X-en
a Vite+ cikknél pontosan ez történt. A cikkben lévő `canonical` link miatt a
paraméter SEO-ban nem árt. Ha a kártya mégsem jelenik meg, Ferenc törölje a
posztot, és tegye ki újra egy másik értékkel (pl. `?ref=x2`). Ezt is mondd el
neki, ha a kártyáról kérdez.

A posztokat Ferenc **csak élesítés után** teszi ki. Előnézeti linket soha ne
adj át megosztásra.

**Kép.** Mindhárom oldal a link előnézetéből mutatja a cikk megosztási képét
(`src/og/en-blog-<slug>.jpg`, élesben
`https://pappfer.hu/img/og/en-blog-<slug>.jpg`, 1200×630). Ezért:

1. A 4. lépés után **nézd meg a képet** (nyisd meg a fájlt): olvasható-e a cím,
   nem lóg-e ki vagy nem törik-e csúnyán, jó-e a kategória. Ha nem, rövidítsd a
   `title`-t, és generáld újra.
2. A válaszban add meg a kép URL-jét is, hogy Ferenc külön fel tudja tölteni, ha
   az előnézet nem jelenik meg.
3. Élesítés után a LinkedIn Post Inspectorban frissítsd az előnézetet, mielőtt
   Ferenc megosztja: https://www.linkedin.com/post-inspector/

## 7. Élesítés

Ha Ferenc azt mondja, mehet (és ha kért javítást, az már benne van):

1. Ha a `date` nem a mai (UTC) nap, állítsd mára mindkét nyelven, és buildelj
   újra (a `lastmod.json` is frissül).
2. Vidd át a masterre, és told fel:

   ```bash
   git switch master && git pull --ff-only
   git merge --squash draft/<slug>
   git commit -m "Publish the <téma> article"
   git push
   git branch -D draft/<slug> && git push origin --delete draft/<slug>
   ```

3. Várd meg, amíg élesben is megjelenik (`curl -s https://pappfer.hu/en/blog/<slug>/`
   mutatja a címet), és szólj Ferencnek a végleges linkekkel. Az IndexNow-t a
   GitHub workflow magától értesíti, kézzel nem kell.

Commit üzenet: sima angol mondat arról, mi változott. Agentre vagy eszközre
utaló sor (pl. „Co-Authored-By”, „Generated with…”) nem kerül bele.

## Megjelent cikk javítása

- Elírás, link: javítsd, buildelj, mehet közvetlenül a masterre.
- Tartalmi változás (új fejlemény, téves állítás): javítsd, és adj hozzá
  `updated: YYYY-MM-DD` sort a front matterhez; a cikk tetején „Frissítve”
  dátum jelenik meg. Ha korábban téves állítás volt benne, a szövegben is
  mondd ki, mi változott.
- A `slug` és a `date` nem változik.
