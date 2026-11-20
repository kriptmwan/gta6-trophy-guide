# Leonida Trophy Guide — GTA VI

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/kriptmwan/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/kriptmwan/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI: every trophy with its official name, description and grade, a guide in our own words with cited sources, a three-step roadmap to the platinum, a flag for the one possibly missable trophy, and a checklist that saves in the browser.

## What it does

- **All 55 trophies** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze, 28 of them hidden on PlayStation, zero online. Names, descriptions and grades are the official list as carried by Exophase and PSNProfiles.
- **A guide for every trophy**, written for this page, with its sources named and linked beside it (PowerPyx, Gamemapa, EGamers, Keengamer, GTABase, Push Square, Insider Gaming, GTA Spotter). Where no guide has confirmed a method yet — five trophies — the page says so instead of guessing.
- **Roadmap to the platinum** — story and side missions (60–80 hours), the 100% checklist and Challenges (~100 hours), Strangers & Freaks and cleanup (~10 hours) — plus the practical warnings: no mission replay, chapter saves, and cheats disabling trophies.
- **Missable flags** — Positive Mental Attitude is the one trophy two guides flag as possibly missable (the Chapter 1 balcony meditation). It is flagged on the trophy, in a banner, and in the roadmap.
- **Tracker** — tick trophies off and the progress stays in localStorage; export it to a file and import it back. Filter by kind (story, missable, collectibles, activities, side quests, robbery, open-world mischief, money, 100% & stunts, online), by grade, or by search. A spoiler setting hides the names and descriptions of story trophies until they are earned.
- **Offline** — plain static files under `app/`, no build step, no network requests at run time. The look is original CSS; no Rockstar logo or artwork is used.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. (Node 22 or later; the server is a development convenience, any static server works with `app/` at its root.)

Hand it in with `main.ts` (Node 22, standard library only):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

It copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library. Running it twice produces identical bytes.

## Screenshots

In `screenshots/`, taken of the running app in a desktop browser at 1280×800:

1. `1-checklist.jpg` — the checklist with the Platinum guide open and its sources (spoilers off).
2. `2-roadmap.jpg` — the roadmap to the platinum.
3. `3-spoiler.jpg` — spoiler mode on: story trophies hidden until earned.
4. `4-silver.jpg` — the Silver filter with a guide open.

`shots.json` records the view each screenshot was taken of.

## Sources

- PowerPyx — GTA 6 Trophy Guide & Roadmap — https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- Gamemapa — All 55 GTA 6 Trophies — https://gamemapa.com/en/gta-6/guides/gta-6-trophy-achievement-list/
- EGamers — GTA 6 Trophy List: All 55 Trophies — https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/
- Keengamer — GTA 6 Trophy Guide & Platinum Roadmap — https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/
- GTABase — GTA 6 Trophy Guide & Achievements List — https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series
- Push Square — GTA 6 Trophy Guide & Roadmap — https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap
- Insider Gaming — Complete GTA 6 Trophy List — https://insider-gaming.com/complete-gta-6-trophy-list-how-to-get-all-trophies-achievements/
- GTA Spotter — GTA VI trophies: the full official list — https://gtaspotter.com/en/guides/gta-6-trophies-and-achievements/

---

<sub>Entered on [make.fun](https://make.fun/?ref=mosul&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
