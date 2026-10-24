---
slug: vite-plus
date: 2026-10-24
related: laravel, vuejs, react
category: opinion
keywords: Vite+, vite-plus, Vite, Vitest, Oxlint, Oxfmt, Laravel, frontend toolchain, ESLint, Prettier
title: Vite+ 1.0: why I'm starting every new project with it
metaTitle: Vite+ 1.0 for Laravel, Vue and React projects | Ferenc Papp
description: Vite+ 1.0 is stable and MIT licensed. Why it's my default for new projects, what vp migrate changes in a Laravel app, and when I'd wait.
---
Vite+ 1.0 came out on 28 September. It's one command, `vp`, that runs the dev server, the build, tests, linting, formatting, library packaging and the Node.js version, all from a single `vite.config.ts`. It's free and MIT licensed. From now on every new project I start uses it, and I'll move existing ones over when there's a reason to touch their tooling anyway.

Under the hood are the tools you probably already use (Vite, Vitest, Rolldown, Oxlint, Oxfmt, tsdown), released together and tested as one stack by the team that builds them.

## Why now

A year ago I wouldn't have written this. When VoidZero first announced Vite+ in October 2025, it was going to be commercially licensed: free for individuals and small businesses, paid for everyone else. I don't build client projects on a toolchain the client might have to license later. That plan was dropped. Vite+ went MIT, and when VoidZero joined Cloudflare in June, the announcement committed to keeping Vite, Vitest, Rolldown, Oxc and Vite+ open source under MIT.

The other reason is Laravel. Since August, all four official Laravel starter kits (React, Vue, Svelte, Livewire) ship with Vite+. A new Laravel app already starts on it, so for Laravel work the only open question is whether to keep it.

## The short version

1. **New project:** install `vp` and run `vp create`, or start from a Laravel starter kit, which already uses it.
2. **Existing project:** run `vp migrate` on a branch and read the diff before you merge it. Not on a production project the day before a release.
3. **Before the first `vp check --fix`:** set the formatter options to your code style, or it reformats the whole codebase.
4. **In CI:** make lint warnings fail the build (`denyWarnings: true`). By default they don't.

## What it replaces

The tools were never the expensive part. The glue between them was: an ESLint config that fights Prettier, a `typescript-eslint` version that no longer matches TypeScript, Husky plus lint-staged plus a script nobody remembers writing, and three repositories each on a different major version of all of it. Every upgrade is its own small project, and the person who set it up is never the one who has to fix it.

With Vite+, a single `vite-plus` dependency replaces that cluster, and an upgrade is one version bump. The commands are the same in every repository: `vp dev`, `vp build`, `vp test`, `vp check`. The same goes for a new colleague or a coding agent opening the project for the first time, and for the Laravel developer who touches the frontend twice a month.

Speed is a bonus, not the reason. VoidZero's own benchmarks put Oxlint at 50 to 100 times faster than ESLint and Oxfmt at up to 30 times faster than Prettier. Where you feel it is in the pre-commit hook and in CI, which stop being something you wait for.

## What vp migrate does in a Laravel app

On a standard Laravel frontend (Vite, `laravel-vite-plugin`, Tailwind) the migration is small:

- the `dev` and `build` scripts become `vp dev` and `vp build`;
- `vite` stays in `package.json`, but an `overrides` entry points it at `@voidzero-dev/vite-plus-core`, so plugins that import `vite` keep working;
- `vite.config.js` imports `defineConfig` from `vite-plus`, and the plugin list is wrapped in `lazyPlugins()`, which the migration does so that `vp check`, `vp lint` and `vp fmt` can share the same config;
- the build still writes `public/build/manifest.json`, and `@vite` in Blade doesn't change.

One thing catches you out. The formatter defaults to double quotes and two-space indentation, and the migration formats the files it touches, so your `vite.config.js` comes back reformatted. Laravel's own JavaScript uses four spaces and single quotes. Set that before you run `vp check --fix` on the rest of the code, or your first pull request is a few hundred lines of whitespace:

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

`denyWarnings` matters more than it looks. Without it, `vp check` exits with 0 even when it reports warnings, so a CI step that only looks at the exit code passes every time.

## When I'd wait

I wouldn't migrate a project just because Vite+ exists. These are the cases where I'd leave it alone for now:

- **Custom ESLint rules or plugins.** Oxlint is not ESLint, and an ESLint plugin doesn't simply carry over. The migration guide itself says most projects need manual adjustments afterwards. If the team has its own rules, check them against Oxlint first.
- **Husky.** `vp migrate` doesn't convert Husky hooks. It leaves them as they are and warns you. Moving to `vp hooks` and `vp staged` is a manual step.
- **You already manage Node with nvm, asdf or Volta.** The global `vp` takes over the Node.js runtime and package manager by default. If you want to keep your own setup, `vp env off` turns that off.
- **Old Vite.** The migration expects Vite 7 and Vitest 4 or newer. On an older project, that upgrade comes first, and it's the bigger job.

There's one real trade-off. You now depend on a single release cadence. A Hacker News commenter quoted by InfoQ counted five major Vite versions between 2022 and 2026, each with breaking changes, and that kind of churn is the main complaint about Vite+ too. Vite+ doesn't make that go away. It just means one tested upgrade instead of five untested ones. I think that's the better deal, but it's still a dependency on one team.

## Need a hand?

If you have a Laravel, Vue or React project whose frontend tooling has drifted (ESLint and Prettier fighting, an old Vite, CI that takes longer than it should), I can move it to Vite+ on a branch, with a reviewable diff and a working CI. [Get in touch](https://pappfer.hu/en/#contact).

---

**Sources**

- [VoidZero: Announcing Vite+ 1.0](https://voidzero.dev/posts/announcing-vite-plus-1-0)
- [Vite+ documentation: getting started](https://viteplus.dev/guide/)
- [Vite+ documentation: migration guide](https://viteplus.dev/guide/migrate)
- [VoidZero: the original Vite+ announcement and its licensing update](https://voidzero.dev/posts/announcing-vite-plus)
- [VoidZero: joining Cloudflare](https://voidzero.dev/posts/voidzero-cloudflare)
- [Laravel News: Laravel starter kits now ship with Vite+](https://laravel-news.com/laravel-starter-kits-vite-plus)
- [InfoQ: Vite+ reaches 1.0](https://www.infoq.com/news/2026/10/cloudflare-viteplus-stable/)
- [Oxc: linter benchmark](https://github.com/oxc-project/bench-linter) and [formatter benchmark](https://github.com/oxc-project/bench-formatter)
