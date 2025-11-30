# STARFIRE IMPACT: REBORN

![Starfire Impact Icon](assets/player%20sprite%20first.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#)
[![Status: Playable](https://img.shields.io/badge/status-playable-brightgreen.svg)](#)
[![Platform: Web PWA](https://img.shields.io/badge/platform-web%20(PWA)-ff6b6b.svg)](#)
[![Tech: JS + Canvas](https://img.shields.io/badge/made%20with-JavaScript%20%7C%20Canvas-5f5fff.svg)](#)

Retro space shooter vibes, fresh coat of paint. Small enough to run in a tab, loud enough to make you grin. Built as a web PWA so you can play on desktop or your phone when you should probably be doing something else.

---

## What This Is

- A browser-first 2D shooter with 10 hand-made stages and boss fights that get mean.
- No big frameworks; just ES6, Canvas, and a simple game loop I can understand at 2 a.m.
- Works offline thanks to a service worker and `manifest.webmanifest`.
- Graphics are tiny and friendly on bandwidth; feels like a nice throwback.

## How to Play

- Desktop: Arrow keys to move, spacebar to fire.
- Mobile: Drag to move. Auto-fire kicks in once you touch the screen (tap if you want to mash).

## Quick Install (Local)

```bash
git clone <your-remote> starfire-impact
cd starfire-impact
python3 -m http.server 8000
# or: npx serve
```

Then open `http://localhost:8000` in a browser. PWA prompts should appear if your browser likes you today.

## Level Cheat Sheet

| Level | Area | Boss | Mood |
| :---: | :---------------- | :--------------- | :------------- |
| 1 | Debris Belt | ScrapGuardian | gentle |
| 2 | Asteroid Field | RaiderCaptain | gentle |
| 3 | Ion Nebula | IonWyrm | warming up |
| 4 | Orbital Dock | DockOverseer | warming up |
| 5 | Bio Labs | MutagenCore | warming up |
| 6 | Defense Grid | RingFortress | spicy |
| 7 | Factory Sector | [REDACTED] | classified |
| 8 | Deep Space | [REDACTED] | classified |
| 9 | The Citadel | [REDACTED] | classified |
| 10 | Apex Void | [REDACTED] | top secret |

## Boss Briefings

- **ScrapGuardian (Lv1)**: Single core eye with mild spread shots; slow zig-zag.
- **RaiderCaptain (Lv2)**: Manta dash volleys; follow-up salvos punish greedy chases.
- **IonWyrm (Lv3)**: Wide sine hover; triple aimed bursts that tighten as you linger.
- **DockOverseer (Lv4)**: Turret drift; paired vertical shots that box you in.
- **MutagenCore (Lv5)**: Spawns escorts frequently; steady bob with periodic rush swarms.
- **RingFortress (Lv6)**: Rotating radial rings plus aimed tri-shots; keep moving around the wheel.
- **Lv7-10**: Classified dossiers. Expect unexpected patterns, layered phases, and harsher audio cues.

## Tech Bits

- Canvas rendering tuned for 60fps on decent phones and laptops.
- Web Audio API makes the pew-pew noises (no sound packs).
- Entity pool keeps garbage collection calm so the frame time stays smooth.
- Assets live in `assets/`; sprites are in `assets/sprites.png` if you want to add your own art.

## Dev Tips

- If you change assets, bump the cache key in `service-worker.js` so players get updates.
- Keep inputs simple; this is meant to be pick-up-and-blast, not study-the-manual.
- I try to keep the code readable over fancy patterns; PRs that keep that vibe are welcome.

## Roadmap (Loose)

- Difficulty presets: Chill / Arcade / Nightmare.
- Score saving that can plug into a leaderboard later.
- Better touch affordances (bigger anchors, optional haptics).

## Credits

Made by **SAIMSKYWALKER**, inspired by Space Impact on the Nokia 3310. MIT licensed. If you have feedback, open an issue and I'll do my best to keep up.
