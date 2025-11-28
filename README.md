# <div align="center" style="font-size:42px;font-weight:800;letter-spacing:1px;">STARFIRE IMPACT: REBORN</div>
<div align="center">
  <p style="font-weight:600;margin:6px 0 14px;background:linear-gradient(120deg,#ff8a00,#ff3d81,#5f5fff);-webkit-background-clip:text;color:transparent;">
    High-speed, retro-inspired space shooter for the modern web
  </p>
  <img src="assets/icon-192.png" alt="Starfire Impact Logo" width="96" height="96" />
  <br />
  <a href="#"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <a href="#"><img alt="Status" src="https://img.shields.io/badge/status-playable-brightgreen.svg"></a>
  <a href="#"><img alt="Platform" src="https://img.shields.io/badge/platform-web%20(PWA)-ff6b6b.svg"></a>
  <a href="#"><img alt="Tech" src="https://img.shields.io/badge/made%20with-JavaScript%20%7C%20Canvas-5f5fff.svg"></a>
</div>

---

**STARFIRE IMPACT: REBORN** is a modern take on the classic 2D space shooter. Glide through hand-tuned levels, clear dynamic enemy waves, and survive boss encounters that push reflexes and positioning to the limit—all in a tiny, dependency-free web build that runs anywhere a browser does.

## 🚀 At a Glance

- 10 handcrafted stages that ramp difficulty and variety.
- Distinct enemy archetypes (scouts, fighters, interceptors, heavy armor) with unique patterns.
- Set-piece boss fights with readable telegraphs and scaling aggression.
- Responsive controls for both keyboard and touch, tuned for 60FPS Canvas rendering.
- Built as a Progressive Web App: offline-ready with a service worker and manifest.

## 🕹️ Controls

**Desktop**
- `Arrow Keys` — move
- `Spacebar` — fire

**Mobile**
- Touch & drag — move
- Auto-fire enabled on interaction (tap to shoot)

## 🧭 Level Guide

| Level | Name | Boss | Threat |
| :---: | :---------------- | :--------------- | :------------- |
| 1 | Debris Belt | ScrapGuardian | 🟢 Low |
| 2 | Asteroid Field | RaiderCaptain | 🟢 Low |
| 3 | Ion Nebula | IonWyrm | 🟡 Medium |
| 4 | Orbital Dock | DockOverseer | 🟡 Medium |
| 5 | Bio Labs | MutagenCore | 🟡 Medium |
| 6 | Defense Grid | RingFortress | 🔴 High |
| 7 | Factory Sector | WarMech | 🔴 High |
| 8 | Deep Space | TunnelSerpent | 🔴 High |
| 9 | The Citadel | CitadelAegis | ⚫ Extreme |
| 10 | Core System | CoreOvermind | ☠️ Nightmare |

## 🧰 Tech Stack

- **Engine:** Custom lightweight ECS-inspired loop written in ES6+ (no frameworks).
- **Rendering:** HTML5 Canvas for low-latency draws and particle flashes.
- **Audio:** Web Audio API for synthesized SFX (no external packs).
- **PWA:** `manifest.webmanifest` + `service-worker.js` for offline play and install prompts.

## ⚡ Run Locally

1) Clone the repo  
```bash
git clone <your-fork-or-remote-url> spaceimpact
cd spaceimpact
```
2) Serve the files (any static server works)  
```bash
python3 -m http.server 8000
# or: npx serve
```
3) Play  
Open `http://localhost:8000` in your browser. Install as a PWA if prompted for offline play.

## 🧠 Dev Notes

- Ships, bullets, and enemies live in a tiny entity pool to keep GC low.
- Rendering is tuned for 60FPS; keep sprites at `assets/sprites.png` if you add art.
- Service worker is basic on purpose: update cache keys when you ship new assets.

## 🗺️ Roadmap Ideas

- Difficulty presets (Chill / Arcade / Nightmare).
- Leaderboard-ready score serialization.
- Touch-friendly accessibility options (left/right anchors).

## 🙌 Credits

Created by **SAIMSKYWALKER**. Inspired by the legendary *Space Impact* on the Nokia 3310.  
MIT License. Enjoy the flight!
