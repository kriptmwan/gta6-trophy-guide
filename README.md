# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/kriptmwan/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/kriptmwan/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline trophy guide and tracker for Grand Theft Auto VI on PlayStation 5: all 55 official trophies (1 Platinum, 2 Gold, 6 Silver, 46 Bronze, 28 hidden), each with a guide in the author's own words and its cited sources, a roadmap to the platinum, the one possibly missable trophy flagged, and a checklist saved in your browser with export and import. No account, no network, no Rockstar artwork — it runs entirely from its own files.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Or open `app/index.html` straight from the files — the guide fetches its trophy data from `app/data/trophies.json` next to it. `node main.ts` (with `MAKEFUN_OUTPUT_DIR` set) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` for the make.fun grader.

## What is inside

- **Checklist** — tick trophies as you earn them; progress is saved in localStorage. Filter by kind (story, strangers, collectibles, activities, robberies, combat, exploration) and by grade, or search by name.
- **Spoiler setting (on by default)** — story trophy names and descriptions stay hidden until you earn them.
- **Roadmap to the Platinum** — three steps (story 60–80h, the 100% checklist ~100h, Strangers & Freaks cleanup ~10h), chapter-save advice, and the cheats warning.
- **Missables** — Positive Mental Attitude is the only trophy flagged as possibly missable: do the Chapter 1 balcony meditation before the chapter ends.
- **Guides with sources** — every guide names where it came from (PowerPyx, GamesRadar+, EGamers, Gamemapa, Keengamer). Where a method is unconfirmed, the guide says so instead of inventing steps.

## Sources

- PowerPyx — GTA 6 Trophy Guide & Roadmap — https://www.powerpyx.com/gta-6-trophy-guide-roadmap/
- GamesRadar+ — GTA 6 Trophy and Achievement list — https://www.gamesradar.com/gta-6-trophy-achievement-list/
- EGamers — GTA 6 Trophy List: All 55 Trophies And Achievements — https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/
- Gamemapa — All 55 GTA 6 Trophies: Full List, Gamerscore and Platinum Roadmap — https://gamemapa.com/en/gta-6/guides/gta-6-trophy-achievement-list/
- Keengamer — GTA 6 Trophy Guide & Platinum Roadmap – All 55 Trophies — https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/

Trophy names, descriptions and grades are the official PlayStation list as published on Exophase and PSNProfiles. An unofficial fan guide, not affiliated with or endorsed by Rockstar Games.

---

<sub>Entered on [make.fun](https://make.fun/?ref=emz2619t&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
