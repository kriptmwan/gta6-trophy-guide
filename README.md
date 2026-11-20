# Leonida Trophy Guide — GTA VI

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/kriptmwan/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/kriptmwan/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

A complete offline companion for Grand Theft Auto VI on PlayStation 5: all 55 trophies with their official names, descriptions and grades, a step-by-step method for each one, a three-stage route to the Platinum, one clearly marked missable warning, and a checklist that saves your progress in the browser.

## Inside the guide

- **Every trophy (55)** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden on PS5; zero online trophies. Names, descriptions and grades match the official list as published by Exophase and PSNProfiles.
- **How to earn each one** — every trophy carries its own method, written fresh for this guide and credited to the published guides it draws on (PowerPyx, Gamemapa, EGamers, Keengamer, GTABase, Push Square, Insider Gaming, GTA Spotter). Five trophies have no verified method anywhere yet — the guide admits that instead of inventing steps.
- **Platinum route in three stages** — story and side missions (60–80 hours), the 100% checklist plus Challenges (around 100 hours), then Strangers & Freaks and cleanup (around 10 hours). Plus the practical warnings: no mission replay, so save at every chapter boundary; cheats switch trophies off.
- **One missable trophy** — Positive Mental Attitude is the only trophy two guides flag as possibly missable (the Chapter 1 balcony meditation). It is marked on the trophy itself, in a banner at the top of the page, and in the roadmap.
- **Progress tracker** — tick trophies off and the browser remembers; export your progress to a file and import it later. Filter by category (story, missable, collectibles, activities, side quests, robbery, open-world mischief, money, 100% & stunts, online), by grade, or by search. A spoiler toggle hides story-trophy names and descriptions until you earn them.
- **Fully offline** — static files under `app/`, no build step, nothing fetched while running. Original CSS throughout; no Rockstar logo or artwork is used anywhere.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. (Node 22 or newer. The server is just a local convenience — any static server works with `app/` as its root.)

Hand it in with `main.ts` (Node 22, standard library only):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` into the output folder and writes `dossier.json` with the vendored make.fun library. Two runs give identical bytes, so the grader's determinism check passes.

## Screenshots

In `screenshots/`, taken from the running app in a desktop browser at 1280×800:

1. `1-checklist.jpg` — the checklist with the Platinum guide open and its sources (spoilers off).
2. `2-roadmap.jpg` — the roadmap to the platinum.
3. `3-spoiler.jpg` — spoiler mode on: story trophies hidden until earned.
4. `4-silver.jpg` — the Silver filter with a guide open.

`shots.json` records what each screenshot shows.

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
