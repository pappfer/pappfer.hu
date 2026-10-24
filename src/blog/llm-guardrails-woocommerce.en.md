---
slug: llm-guardrails-woocommerce
date: 2026-10-23
related: python, ai
kicker: Case study
keywords: FastAPI, LLM integration, WooCommerce, Vue 3, PWA, structured outputs, AI SEO, Python
title: The AI writes the listing, the code checks it: a WooCommerce case study
metaTitle: LLM guardrails in a FastAPI + WooCommerce app | Ferenc Papp
description: A phone app that turns a Facebook post into a WooCommerce event with AI-written SEO, and the six jobs code had to take back from the model.
---
[TiaDor Stúdió](https://tiador.hu/) is my wife's creative studio in Debrecen. It sells painting workshops and kids' events as WooCommerce products. Every event used to be built by hand in WordPress admin: title, description, date, price, places, SEO title, meta description, slug, image. Now she does it on her phone in a small app I built: she pastes the text she already wrote for Facebook, adds the poster, and an LLM fills in the rest.

The interesting part isn't that an LLM writes SEO fields. Anyone can wire that up in an afternoon. The interesting part is what went wrong once real events went live, and why almost every fix moved a job away from the model and into plain Python.

## What the app does

The stack is deliberately boring: a Vue 3 PWA on Cloudflare Pages, a [FastAPI](/en/python-developer/) backend in Docker on a VPS, and no database. The backend is a pass-through to the WordPress and WooCommerce REST APIs, which stay the single source of truth.

Uploading an event takes two steps, and that split is the most important design decision in the project:

1. She fills in the minimum (photo, name, description, date, price) and taps "AI generálás ✨". The backend sends the text, plus the poster downscaled to 1280 px, to the model, and gets back the SEO title, meta description, short description, slug, categories, tags, and any date and duration it found in the text or on the poster.
2. Every generated field shows up as an editable input. Nothing reaches WordPress until she taps "Feltöltés": then the image is resized and uploaded, and the product is created with its Yoast and ACF fields.

![Phone screen of the event uploader: AI-generated SEO title, meta description, short description and slug in editable fields](llm-guardrails-woocommerce-review.webp "The review step. Everything under „AI által kitöltve” (filled in by AI) can still be edited before anything is uploaded.")

If the model is down, the form still works and the SEO fields can be typed by hand. An AI feature that can stop a small business from publishing is a liability.

## Six jobs code took back from the model

Each of these reached the live site at least once before it was fixed. That's the actual case study.

**1. Slugs.** The prompt asked the model for a Hungarian slug without accents. In September it turned "Gyertyadíszítő" into `gyertyadisito`, dropping a letter, and that URL went live and got shared. Transliteration is a solved, deterministic problem, so the model shouldn't be doing it. The slug base is now rebuilt from the final title by a short function. (`ő` and `ű` need an explicit map, because unlike `é` they don't decompose under Unicode NFKD.) The model's slug only contributes the date suffix.

**2. Tags.** Every few weeks the model invented a new spelling of an existing tag: `oszi-szunet` next to `osziszunet`, `korvaszon` next to `korvazszon`. Each one became a thin, near-empty tag archive. Two layers fixed it. The prompt now gets the site's 60 most used tags, and before saving, every tag is matched to an existing one by an accent-, case- and hyphen-insensitive key, then by `difflib` with a 0.88 cutoff for typos. Only a genuinely new tag gets created.

**3. Categories.** Listing the categories in the prompt wasn't enough; the model still returned slugs that didn't exist. With OpenAI's strict structured outputs, the JSON schema now narrows `category_slugs` to an `enum` of the shop's real categories, built per request. The model can't return an invalid one even if it tries.

**4. The wrong address.** This was the worst one. Another business's street address ended up in the location line of live events. Duplicated events had inherited it from an old draft written before the prompt was grounded in the studio's real address. Fixing the prompt doesn't clean up data that already exists, so every write path now runs a check: a location line whose street address isn't the event's own is replaced with the correct one.

**5. Weekdays.** Duplicating an event for a new date means rewriting "október 25-én, szombaton" with Hungarian suffixes that depend on the number. I left that job with the model on purpose. Real descriptions say "szeptember 13-i" or "Október 29-30.", and a regex would quietly miss some of them. What the model doesn't get to do is work out the weekday: that's computed in code and passed in. Afterwards, code scans the rewritten text for any leftover old date and shows a warning with an "open for editing" button instead of saving silently.

**6. Formatting.** Text pasted from Facebook arrives as one line per paragraph, sprinkled with zero-width spaces, and WordPress rendered it as one wall of `<br>` tags. I could have asked the model to "format it nicely". I didn't, because a model that's allowed to rewrite the text will rewrite the text. A deterministic formatter turns label lines, lists and headings into HTML and never changes a word; I checked it against 14 real descriptions before running it on the live events.

## What the model is good at

The model still does most of the work, and does it well. It writes the meta description and short description in the studio's voice, reads the date and opening hours off a poster (on a real kids' day-camp poster it read "8:00–16:00" correctly), and fixes typos. The typo fixes come back as a list ("hibás → javított"), and only those exact replacements are applied to the original text, so the wording stays hers.

![Status message listing the spelling fixes the model made](llm-guardrails-woocommerce-corrections.webp "Typo fixes come back as a list, and only those replacements are applied.")

Model choice mattered less than the guardrails. I compared `gpt-6-luna` and `gpt-6.1-sol` on the same real products, and with the category enum in place both returned identical, valid categories and dates. The bigger model wrote descriptions one and a half to two times longer and twice added an off-topic tag, so the smaller one stayed. The backend also supports Anthropic's API; switching is one environment variable.

## The rule I'd take to any LLM project

If a rule can be stated precisely, it belongs in code: transliteration, which tags and categories exist, which address is correct, what weekday a date falls on. The model gets the parts that need judgement and language. Its output goes through a schema and a few checks, and a person sees the result before it's published. Each bug above is now a regression test. The backend has 53 tests, and most of the dated cases are bugs that really shipped.

None of this is exotic. It's ordinary software engineering applied to a component that is confidently wrong a few percent of the time, which is exactly where ordinary engineering earns its keep.

## Need a hand?

If you want an LLM inside an existing PHP, WordPress or Python system, and it has to be boring and reliable rather than impressive in a demo, that's the [AI integration](/en/ai-llm-integration/) work I do. [Tell me what you're working on](https://pappfer.hu/en/#contact).

---

**Sources**

- [OpenAI: Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
- [Python docs: difflib.get_close_matches](https://docs.python.org/3/library/difflib.html#difflib.get_close_matches)
- [Python docs: unicodedata.normalize](https://docs.python.org/3/library/unicodedata.html#unicodedata.normalize)
- [WooCommerce REST API documentation: products](https://woocommerce.github.io/woocommerce-rest-api-docs/#products)
