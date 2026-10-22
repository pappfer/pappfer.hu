---
name: cikk
description: Write and publish a pappfer.hu blog article (EN + HU) from a link or topic the owner gives, following src/blog/STYLE.md and src/blog/WORKFLOW.md. Use when the owner asks for an article ("írj cikket erről", "/cikk <link>").
argument-hint: <link vagy téma> [saját vélemény/tapasztalat]
---

Az owner cikket kér erről: $ARGUMENTS

1. Olvasd el teljes egészében a `src/blog/STYLE.md` és a `src/blog/WORKFLOW.md`
   fájlt. Ezek az egyetlen forrásai a szabályoknak, ez a skill csak elindítja őket.
2. Kövesd a `WORKFLOW.md` lépéseit sorban: kutatás, megírás, önellenőrzés,
   megosztási kép, build, ellenőrzések, `draft/<slug>` branch és előnézet.
3. Az 5. lépés végén állj meg, és add át az előnézetet az ownernek. A masterre
   csak akkor kerül, ha ő kifejezetten jóváhagyta.

Magyarul válaszolj.
