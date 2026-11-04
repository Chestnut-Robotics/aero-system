# Aero Hand & Aero UMI

Official research project website for the Aero Hand and Aero UMI paired platform from Chestnut Robotics.

**Website:** https://chestnut-robotics.github.io/aero-system/

## Development

A buildless static site: `index.html`, `styles.css`, `script.js`, and optimized media in `assets/media/`. No package installation or build step is required.

Run `python3 -m http.server 8765 --bind 127.0.0.1` and open http://127.0.0.1:8765/. The content and native media controls also work without JavaScript.

## Media behavior

The three short demonstrations are silent H.264 MP4s with fast-start metadata, local posters, native controls, and `preload="none"`. Playback starts on visitor action. The small enhancement script pauses other players, offscreen videos, hidden-tab videos, and the introduction film when its disclosure closes. It never automatically resumes playback. Reduced-motion preferences disable smooth scrolling.

The introduction film remains hosted on chestnut.bot and is presented separately from physical demonstrations. Each task caption describes what the footage shows; separate takes and illustrative processing examples are labeled accordingly.

## Publishing

GitHub Pages serves the repository root on `main`. Use a reviewed pull request for subsequent updates; merging to `main` redeploys the same URL. Review the selected content and media before publication. Do not bypass repository protections.

## Scope

This repository contains the website and its selected media only. It is not a release of the robot hardware, firmware, SDK, research data, or technical report.

© 2026 Chestnut Robotics. All rights reserved unless otherwise specified.
