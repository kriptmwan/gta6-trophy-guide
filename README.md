# Leonida Trophy Guide — GTA VI

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/kriptmwan/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/kriptmwan/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline checklist and guide for all 55 PlayStation 5 trophies in Grand Theft Auto VI: every trophy's official name, description and grade, a how-to for each one with its sources named, a three-step plan for the Platinum, a clear warning about the one trophy that may be missable, and a tracker that remembers which trophies you have already earned.

## What is inside

- **All 55 trophies** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 of them hidden on PlayStation and none of them online. Names, descriptions and grades follow the official list as reported by Exophase and PSNProfiles.
- **A method for every trophy**, written here in this guide's own words, with the source guides credited next to it (PowerPyx, Gamemapa, EGamers, Keengamer, GTABase, Push Square, Insider Gaming, GTA Spotter). Where no guide has confirmed a method yet — five trophies — the page says so plainly instead of making one up.
- **A Platinum roadmap** in three steps: story and side missions (60–80 hours), the 100% checklist and Challenges (around 100 hours), then Strangers & Freaks and cleanup (around 10 hours). It also carries the practical warnings: missions cannot be replayed, so keep chapter saves; cheats turn trophies off.
- **A missable warning** — Positive Mental Attitude is the single trophy two guides call possibly missable (the Chapter 1 balcony meditation). It is flagged on the trophy itself, in a banner at the top of the page, and again in the roadmap.
- **A tracker** — tick trophies off and your progress stays in localStorage; export it to a file and import it back later. Filter by kind (story, missable, collectibles, activities, side quests, robbery, open-world mischief, money, 100% & stunts, online), by grade, or by searching. A spoiler switch keeps the names and descriptions of story trophies hidden until you have earned them.
- **Works fully offline** — plain static files under `app/`, no build step, nothing fetched from the network while it runs. The styling is original CSS; no Rockstar logo or artwork is used anywhere.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. (Node 22 or newer. The server is only a convenience for local use — any static server works with `app/` at its root.)

Hand it in with `main.ts` (Node 22, standard library only):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` into the output folder and writes `dossier.json` using the vendored make.fun library. Running it twice produces identical bytes.

## Screenshots

In `screenshots/`, captured from the running app in a desktop browser at 1280×800:

1. `1-checklist.jpg` — the checklist with the Platinum guide open and its sources (spoilers off).
2. `2-roadmap.jpg` — the roadmap to the platinum.
3. `3-spoiler.jpg` — spoiler mode on: story trophies hidden until earned.
4. `4-silver.jpg` — the Silver filter with a guide open.

`shots.json` records which view each screenshot shows.

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
