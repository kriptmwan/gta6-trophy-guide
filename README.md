# Leonida Trophy Guide — GTA VI

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/kriptmwan/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/kriptmwan/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

A complete offline tracker for every PlayStation 5 trophy in Grand Theft Auto VI: all 55 trophies with their official names, descriptions and grades, a written guide for each one with its sources cited, a three-step route to the Platinum, a warning for the single trophy that might be missable, and a checklist that remembers what you have earned.

## What you get

- **The full set of 55** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze, 28 hidden on PlayStation, none of them online. Names, descriptions and grades follow the official list as reported by Exophase and PSNProfiles.
- **A method for each trophy**, written for this guide and credited to its sources beside it (PowerPyx, Gamemapa, EGamers, Keengamer, GTABase, Push Square, Insider Gaming, GTA Spotter). For the five trophies whose method no guide has confirmed yet, the page admits that rather than inventing one.
- **A Platinum roadmap** — story and side missions (60–80 hours), the 100% checklist and Challenges (about 100 hours), Strangers & Freaks plus cleanup (about 10 hours) — along with the practical cautions: missions cannot be replayed, keep chapter saves, and cheats switch trophies off.
- **Missable warning** — Positive Mental Attitude is the one trophy two guides call possibly missable (the Chapter 1 balcony meditation). It carries a flag on the trophy itself, in a banner, and in the roadmap.
- **A tracker** — check trophies off and your progress is kept in localStorage; you can export it to a file and import it again later. Filter by type (story, missable, collectibles, activities, side quests, robbery, open-world mischief, money, 100% & stunts, online), by grade, or by searching. A spoiler switch hides the names and descriptions of story trophies until you have earned them.
- **Fully offline** — plain static files in `app/`, no build step, nothing fetched over the network while it runs. The styling is original CSS; no Rockstar logo or artwork appears anywhere.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. (Node 22 or newer; the server is just a convenience for development — any static server works with `app/` at its root.)

Hand it in with `main.ts` (Node 22, standard library only):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` into the output folder and writes `dossier.json` using the vendored make.fun library. Running it twice gives identical bytes.

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
