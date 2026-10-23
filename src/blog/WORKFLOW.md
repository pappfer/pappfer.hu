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
kicker: How-to
keywords: Laravel, Laravel 12, upgrade, PHP 8.4
title: …
metaTitle: … | Ferenc Papp
description: …
---
Nyitó bekezdés…
```

- Kötelező: `slug`, `date`, `title`, `metaTitle`, `description`, `kicker`.
  Opcionális: `keywords`, `updated` (lásd 7. pont), `related` (szolgáltatásoldalak
  azonosítói a `src/landing.json`-ből, pl. `related: python, ai`: a cikk ezeken az
  oldalakon „A blogból” blokkban jelenik meg; a német oldalak az angol változatra
  linkelnek).
- `date`: a megjelenés napja, **UTC** szerint, `YYYY-MM-DD`.
- A slug nem ütközhet meglévővel (`ls src/blog`), és élesítés után **soha nem
  változik**.
- Támogatott markdown: `##`–`####` címek, bekezdés, `**félkövér**`, `*dőlt*`,
  `` `kód` ``, linkek, számozott és pontozott lista, kódblokk nyelvvel
  (```` ```bash ````), `---`. Táblázat, kép, HTML nincs.
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
(`src/og/<lang>-blog-<slug>.jpg`). A kép a cikk `kicker`-éből és `title`-jéből
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
5. a közösségimédia-posztok szövegét (6. pont).

## 6. Közösségi posztok

A posztokat a válaszban adod át, nem kerülnek a repóba. Ugyanaz a `STYLE.md` hang
érvényes rájuk.

- **LinkedIn, angol** — a megjelenés napján; **LinkedIn, magyar** — másnap reggel.
  Az első két sor magában is érthető legyen (a többi a „továbbiak” mögé kerül).
  3–8 rövid bekezdés, a cikk legfontosabb gyakorlati tanulsága, a link a végén.
  Legfeljebb 3 hashtag, emoji nincs.
- **X, angol** — egy poszt, legfeljebb 280 karakter a linkkel együtt (a link 23
  karakternek számít).
- Megosztás előtt a LinkedIn Post Inspectorban érdemes frissíteni az előnézetet:
  https://www.linkedin.com/post-inspector/

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
