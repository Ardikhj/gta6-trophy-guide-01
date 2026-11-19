# Leonida Platinum — GTA VI Trophy Guide & Tracker

![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)
![Rank](https://make.fun/badge/gta6-trophy-guide-01/Ardikhj/gta6-trophy-guide-01/rank.svg)
![Reward](https://make.fun/badge/gta6-trophy-guide-01/Ardikhj/gta6-trophy-guide-01/reward.svg)

An offline web app that is the best guide and tracker for the **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze). Built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01) ($250 USDC).

## What it does

- **Tracker** — every trophy with its official name, description and grade, a checklist saved in the browser (localStorage), export and import of progress, search, grade filter, kind filters (story, missable, collectibles, activities, robberies, exploration, side quests, money — plus an Online filter that correctly shows there are no online trophies), and a spoiler setting that hides story trophies until they are earned.
- **Roadmap to the platinum** — three steps built from the official descriptions: story (60–80 h), the 100% completion checklist (~100 h), then Strangers & Freaks and cleanup (~10 h). About 200 hours total, difficulty 4/10, one playthrough, no online trophies.
- **Missable trophies flagged** — exactly one is potentially missable: **Positive Mental Attitude**, whose Chapter 1 balcony meditation disappears after Chapter 1. The guide gives the exact steps and the save advice (manual saves, no mission replay, cheats disable trophies).
- **A guide for every trophy, in our own words, with its sources** — what to do, where and how, and when it can be missed. Each guide names its sources (Exophase for the official list, PSNProfiles, PowerPyx, KeenGamer, Output Lag, GTA Zone). Five trophies have no confirmed unlock method yet at launch (In The Beginning…, Bad Luck, I Guess, The Truth Is Out There, Ten Pin, plus the exact animal for Fair Game) — their guides say so plainly instead of inventing a method.

## Run it offline

```sh
node serve.ts
# open http://localhost:8080
```

Static files under `app/` — no build step, no network request at run time. Open `app/index.html` in desktop Chrome with the network off and it works.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with `vendor/makefun-frontend.ts`.

## Screenshots

- `1-tracker-guide.jpg` — the checklist with the missable trophy's guide and sources open
- `2-roadmap.jpg` — the roadmap to the platinum with the counts that matter
- `3-missable-spoilers.jpg` — the missable warning with the spoiler setting hiding story trophies
- `4-filters-progress.jpg` — kind filters and saved progress at work

All four are real renders of this app in a desktop browser.

## Sources

- Exophase — Grand Theft Auto VI Trophies (PS5): https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/
- PSNProfiles — Grand Theft Auto VI trophies: https://psnprofiles.com/trophies/43531-grand-theft-auto-vi
- PowerPyx — GTA 6 Trophy Guide & Roadmap: https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap: https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/
- Output Lag — GTA 6 Trophy List: https://outputlag.com/guides/gta-6-trophy-list/
- GTA Zone — GTA 6 Trophies and Achievements: https://gta-zone.com/news/gta-6-trophies-achievements/
- Planet GTA 6 — GTA 6 Trophies: https://www.planetgta6.com/en/gta-6-trophies/

## License

MIT. An unofficial, fan-made guide — no Rockstar Games logo, artwork or game screenshots are used.

---

Built with [make.fun](https://make.fun/r/w0ek3axk) — try make.fun with my referral link: https://make.fun/r/w0ek3axk
