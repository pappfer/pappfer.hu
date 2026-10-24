---
slug: vite-plus
date: 2026-10-24
related: laravel, vuejs, react
category: opinion
keywords: Vite+, vite-plus, Vite, Vitest, Oxlint, Oxfmt, Laravel, frontend eszközök, ESLint, Prettier
title: Vite+ 1.0: mostantól ezzel indítok minden új projektet
metaTitle: Vite+ 1.0 Laravel, Vue és React projektekhez | Papp Ferenc
description: Stabil lett a Vite+, és MIT-licenszes. Miért ezzel kezdem az új projekteket, mit változtat a vp migrate egy Laravel-appban, és mikor várnék még vele.
---
Szeptember 28-án megjelent a Vite+ 1.0. Egyetlen parancs, a `vp` intézi a dev szervert, a buildet, a teszteket, a lintelést, a formázást, a csomagkészítést és a Node.js-verziót, mindezt egyetlen `vite.config.ts`-ből. Ingyenes és MIT-licenszes. Mostantól minden új projektemet ezzel kezdem, a meglévőket pedig akkor viszem át, amikor amúgy is hozzá kell nyúlnom a buildhez vagy a linterhez.

A háttérben azok az eszközök futnak, amiket jó eséllyel most is használsz (Vite, Vitest, Rolldown, Oxlint, Oxfmt, tsdown). A különbség annyi, hogy most egyben adja ki és egyben teszteli őket az a csapat, amelyik fejleszti is.

## Miért most?

Egy éve még nem írtam volna meg ezt a cikket. Amikor a VoidZero 2025 októberében bejelentette a Vite+-t, fizetős licenszet terveztek hozzá: magánszemélyeknek és kisvállalkozásoknak ingyen, mindenki másnak pénzért. Ügyfélprojektet nem építek olyan eszközre, amiért később az ügyfélnek licenszdíjat kellhet fizetnie. Ebből végül nem lett semmi, a Vite+ MIT-licenszet kapott. Amikor pedig júniusban a VoidZero a Cloudflare-hez került, azt is vállalták, hogy a Vite, a Vitest, a Rolldown, az Oxc és a Vite+ nyílt forráskódú és MIT-licenszes marad.

A másik ok a Laravel. Augusztus óta mind a négy hivatalos Laravel starter kit (React, Vue, Svelte, Livewire) Vite+-szal jön. Egy új Laravel-app tehát eleve ezzel indul, vagyis Laravelnél már csak az a kérdés, hogy megtartod-e.

## Röviden

1. **Új projekt:** telepítsd a `vp`-t, és indítsd `vp create`-tel, vagy egy Laravel starter kitből, abban már benne van.
2. **Meglévő projekt:** a `vp migrate`-et külön branchen futtasd, és merge előtt nézd végig a diffet. Éles projektnél semmiképp ne a kiadás előtti napon.
3. **Az első `vp check --fix` előtt** állítsd be a formázót a saját kódstílusodra, különben az egész kódbázist átformázza.
4. **CI-ban** kapcsold be a `denyWarnings: true` opciót, hogy a build a lint-figyelmeztetéseken is elbukjon. Alapból csak a hibákon bukik el.

## Mit vált ki?

Nem maguk az eszközök viszik el az időt, hanem az, ami összeköti őket. Az ESLint-konfig, ami ütközik a Prettierrel. A `typescript-eslint`, ami már nem passzol a TypeScript-verzióhoz. A Husky, mellette lint-staged, mellette egy szkript, amiről senki nem tudja, ki írta. És három repó, mindegyik más főverzión. Minden frissítés egy külön kis projekt, és sosem az javítja meg, aki annak idején beállította.

A Vite+-szal ebből egyetlen `vite-plus` függőség lesz, a frissítés pedig annyi, hogy átírod a verziószámot. A parancsok minden repóban ugyanazok: `vp dev`, `vp build`, `vp test`, `vp check`. Ennek örül az új kolléga, a kódoló agent, amelyik először nyitja meg a projektet, és az a Laravel-fejlesztő is, aki havonta kétszer nyúl a frontendhez.

A sebesség csak ráadás. A VoidZero saját mérései szerint az Oxlint 50–100-szor gyorsabb az ESLintnél, az Oxfmt pedig akár 30-szor a Prettiernél. Ez a pre-commit hooknál és a CI-ban jön ki igazán, ott egyszer csak nem kell várni.

## Mit csinál a vp migrate egy Laravel-appban?

Egy szokásos Laravel-frontenden (Vite, `laravel-vite-plugin`, Tailwind) nem sok minden változik:

- a `dev` és a `build` szkriptből `vp dev` és `vp build` lesz;
- a `vite` bent marad a `package.json`-ban, de egy `overrides` bejegyzés a `@voidzero-dev/vite-plus-core` csomagra irányítja, így a `vite`-ot importáló pluginek ugyanúgy működnek;
- a `vite.config.js` a `vite-plus`-ból importálja a `defineConfig`-ot, a pluginlistát pedig `lazyPlugins()` veszi körbe, hogy a `vp check`, a `vp lint` és a `vp fmt` ugyanazt a konfigot használhassa;
- a build ugyanúgy a `public/build/manifest.json`-t írja, a Blade-ben a `@vite` direktívához nem kell hozzányúlni.

Egy dologra viszont figyelj. A formázó alapból dupla idézőjelet és két szóközös behúzást használ, a migráció pedig formázza a fájlokat, amikhez hozzányúl, így a `vite.config.js` átformázva jön vissza. A Laravel saját JavaScript-kódja viszont négy szóközt és szimpla idézőjelet használ. Ezt állítsd be, mielőtt a kód többi részén is lefuttatod a `vp check --fix`-et, különben az első pull requested pár száz sornyi szóközcsere lesz:

```ts
import { defineConfig, lazyPlugins } from 'vite-plus'
import laravel from 'laravel-vite-plugin'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  fmt: { tabWidth: 4, singleQuote: true },
  lint: {
    ignorePatterns: ['vendor/**', 'public/build/**'],
    options: { denyWarnings: true },
  },
  plugins: lazyPlugins(() => [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
    }),
    tailwindcss(),
  ]),
})
```

A `denyWarnings` többet számít, mint gondolnád. Nélküle a `vp check` akkor is 0-val lép ki, ha figyelmeztetéseket ír ki, és a CI, amelyik csak a kilépési kódot nézi, mindig zöld marad.

## Mikor várnék még vele?

Attól, hogy megjelent a Vite+, még nem állnék neki minden projektet átállítani. Ezekben az esetekben egyelőre hozzá sem nyúlnék:

- **Saját ESLint-szabályok vagy pluginek.** Az Oxlint nem az ESLint, a pluginek nem jönnek át maguktól. A migrációs útmutató is leírja, hogy a legtöbb projektnél utána kézzel is igazítani kell. Ha a csapatnak saját szabályai vannak, előbb nézd meg, mi lesz velük Oxlintben.
- **Husky.** A `vp migrate` nem alakítja át a Husky hookokat: úgy hagyja őket, ahogy vannak, és csak figyelmeztet. A `vp hooks`-ra és a `vp staged`-re kézzel kell átállni.
- **Már nvm-mel, asdf-fel vagy Voltával kezeled a Node-ot.** A globálisan telepített `vp` alapból magához veszi a Node.js és a csomagkezelő kezelését. Ha maradnál a megszokott eszközödnél, a `vp env off` kikapcsolja ezt.
- **Régi Vite.** A migráció legalább Vite 7-et és Vitest 4-et vár. Régebbi projektnél előbb ezekre kell frissíteni, és általában az a nagyobb munka.

Egy dolgot viszont be kell vállalni: mostantól egyetlen csapat kiadási ütemétől függsz. Az InfoQ idéz egy Hacker News-hozzászólót, aki öt Vite-főverziót számolt össze 2022 és 2026 között, mindegyikben visszafelé nem kompatibilis változásokkal, és a Vite+-t is főleg emiatt kritizálják. Ezen a Vite+ sem segít, csak annyit ér el, hogy öt külön frissítés helyett egyet csinálsz, amit előtte együtt teszteltek. Szerintem így is megéri, de ezzel tisztában kell lenni.

## Segítsek?

Ha van egy Laravel-, Vue- vagy React-projekted, ahol a frontend eszközei az évek alatt szétcsúsztak (ütközik az ESLint a Prettierrel, régi a Vite, lassú a CI), szívesen átviszem Vite+-ra egy külön branchen, átnézhető diffel és működő CI-jal. [Írj nekem](https://pappfer.hu/hu/#contact).

---

**Források**

- [VoidZero: a Vite+ 1.0 bejelentése](https://voidzero.dev/posts/announcing-vite-plus-1-0)
- [Vite+ dokumentáció: első lépések](https://viteplus.dev/guide/)
- [Vite+ dokumentáció: migrációs útmutató](https://viteplus.dev/guide/migrate)
- [VoidZero: az eredeti Vite+-bejelentés és a licenszváltozás](https://voidzero.dev/posts/announcing-vite-plus)
- [VoidZero: csatlakozás a Cloudflare-hez](https://voidzero.dev/posts/voidzero-cloudflare)
- [Laravel News: a Laravel starter kitek már Vite+-szal jönnek](https://laravel-news.com/laravel-starter-kits-vite-plus)
- [InfoQ: 1.0-s verzióhoz ért a Vite+](https://www.infoq.com/news/2026/10/cloudflare-viteplus-stable/)
- [Oxc: linter-benchmark](https://github.com/oxc-project/bench-linter) és [formázó-benchmark](https://github.com/oxc-project/bench-formatter)
