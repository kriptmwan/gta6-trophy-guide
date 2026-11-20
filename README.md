# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/kriptmwan/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/kriptmwan/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web guide and tracker for every PlayStation 5 trophy in Grand Theft Auto VI. All 55 trophies — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze, 28 of them hidden — each with its official name, description and grade, a guide in my own words with named sources, a roadmap to the platinum, and the one missable trophy flagged before you can lose it. Progress is a checklist saved in your browser, with search, filters by kind and grade, a spoiler setting that hides story trophies until you earn them, export and import. No network needed: open it and it works.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. To build the submission bundle instead:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` into `out/` and writes `out/dossier.json`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=emz2619t&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
