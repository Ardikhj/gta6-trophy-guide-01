# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun](https://img.shields.io/badge/make.fun-gta6--trophy--guide--01-orange)](https://make.fun/bounty/gta6-trophy-guide-01)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An offline web app that is the best guide and tracker for the **55 PlayStation 5 trophies of Grand Theft Auto VI**: every trophy with its official name, description and grade, a checklist saved in the browser, export and import of progress, filters by kind, a spoiler setting that hides story trophies until they are earned, a roadmap to the Platinum, the missable trophies flagged, and a guide to each trophy in our own words that cites its sources.

## What is inside

- `app/` — the guide as static files. Open `app/index.html` in a desktop browser; it works with the network off. No build step, no external requests.
- `app/data/trophies.json` — all 55 official trophies with exact names, descriptions and grades, plus a guide, kind, missable flag and target for each.
- `screenshots/` — real renders of the guide's own code in a browser.
- `main.ts` — the hand-in program (Node 22): copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json`.

## The guide at a glance

- **55 trophies:** 1 Platinum, 2 Gold, 6 Silver, 46 Bronze. 28 of them are hidden on PlayStation until earned.
- **One playthrough, about 200 hours, difficulty 4/10** (PowerPyx's estimate). No online trophies, no difficulty settings, no mission medals.
- **One potentially missable trophy:** Positive Mental Attitude — one meditation in Chapter 1 at Jason's house never comes back. The guide warns you before Chapter 1 ends.
- **No mission replay, no New Game+:** keep a manual save at the start and end of each chapter. Cheats disable trophies and saving.
- **The hardest trophy is A Long Road** (100% completion) — but the checklist is lenient, roughly 60% true completion.

## Sources

Trophy names, descriptions and grades come from the official list as published on [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/), cross-checked against [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi). How-to detail comes from [PowerPyx's GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/), rewritten in our own words and cited beside each trophy. Where even PowerPyx says a method is not yet known, the guide says so plainly instead of inventing a location.

This is a fan-made guide, not affiliated with Rockstar Games. It uses no Rockstar logo, artwork or game screenshots.

## Run it locally

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Built for the make.fun bounty [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01) — $250 USDC, entries close 2026-11-21.

---

*Made with [make.fun](https://make.fun/r/w0ek3axk) — build AI agents and programs, enter competitions, and get paid in the open.*
