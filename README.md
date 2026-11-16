# Disney's Hercules (Browser & PWA Port)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20PWA%20%7C%20Mobile%20%7C%20Desktop-brightgreen.svg)]() [![JavaScript](https://img.shields.io/badge/Language-Pure%20JavaScript%20(ES2022)-blue.svg)]() [![PWA Ready](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-orange.svg)]() [![Zero Runtime](https://img.shields.io/badge/Dependencies-Zero%20(No%20Wasm%20%2F%20No%20Server)-blueviolet.svg)]()

A pure JavaScript browser port of the 1997 PC release of Disney's Hercules Action Game.

Runs directly in modern web browsers without WebAssembly, Emscripten, or server-side runtimes. It can be played on desktop computers, mobile phones, and tablets, with offline support via Progressive Web App (PWA) caching.

---

## Screenshots

<table>
  <tr>
    <td align="center" valign="bottom">
      <img src="https://github.com/user-attachments/assets/f0fe1a83-bc80-440f-9be6-946129abca14" width="300" alt="Mobile Phone (Samsung Galaxy S23)" />
    </td>
    <td align="center" valign="bottom">
      <img src="https://github.com/user-attachments/assets/35570cc5-70a6-42e5-8d62-69860567a89a" width="300" alt="Tablet (Samsung Galaxy Tab)" />
    </td>
    <td align="center" valign="bottom">
      <img src="https://github.com/user-attachments/assets/88c3fa8c-76b9-4d42-8f12-d1f4681f1e51" width="300" alt="Desktop (Google Chrome)" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>Mobile Phone</b><br>Samsung Galaxy S23</td>
    <td align="center"><b>Tablet</b><br>Samsung Galaxy Tab</td>
    <td align="center"><b>Desktop</b><br>Google Chrome</td>
  </tr>
</table>

---

## Background and Motivation

This project was inspired by [hercules-native](https://github.com/yelnady/hercules-native), which reverse-engineered the original 1997 PC executable and created a native C11/SDL2 port for modern Apple Silicon Macs.

That work showed that the original game logic could be accurately reconstructed. The goal of this web port was to take that idea one step further: make the game playable on virtually any device with a modern browser, including Windows, Linux, macOS, Android, iOS, and handheld devices like the Steam Deck, without requiring a compiler, toolchain, or native installation.

The native C engine (roughly 25,000 lines of game logic, 2D platforming, 3D runner stages, enemy behaviors, video decoding, and audio mixing) was translated function by function into modern JavaScript (ES2022). It uses standard HTML5 Canvas/WebGL rendering and the Web Audio API to achieve full-speed gameplay with original frame pacing.

---

## Decompilation Bugfixes

During the translation and testing against the original disassembly, several longstanding logic bugs from the 1997 PC release were identified and fixed:

- **Fireball spell hit truncation:** In the original game, fireball bursts could pass through multiple enemies because of a missing break condition. Fire streams now properly truncate upon hitting the first target.
- **Checkpoint statues:** Restored the missing golden sparkle particle shower (`0x2010`) and idle bobbing animation.
- **3D runner levels (Gauntlet, Cyclops, Torment):** Hercules previously stalled on level entry until specific directional keys were pressed. The player now automatically runs forward from start and checkpoint respawns.
- **Hydra canyon lighting:** Restored dynamic darkness presets that change as Hydra heads are cut, along with lightning flashes and thunder ambience triggers (`0x202c`).
- **3D positional audio:** Corrected depth attenuation and camera frustum visibility checks for 3D sound effects.
- **Waypoint auto-saves:** Fixed duplicate entries in the Load Game menu so checkpoint progress cleanly updates without creating redundant slots.

---

## Engine Improvements

- **Upscaling shaders:** Includes retro pixel-art rendering along with Super-xBR, ScaleFX, and bilinear texture smoothing filters for crisp display on high-resolution and 4K screens.
- **Soundtrack support:** The original PC game streamed music directly from CD-Audio tracks on the disc. This port includes an integrated audio player supporting all 14 original tracks in MP3 format.
- **Touch controls:** Context-sensitive virtual touch controls with ergonomic button layout for phones and tablets, including haptic vibration feedback.
- **Quality of life:** Fullscreen toggle (`Alt+Enter`), custom keyboard and gamepad remapping, Quick Resume on app switch, and an in-game save deletion confirmation dialog.

---

## Game Files (Bring Your Own)

> This repository and release archive do not contain copyrighted game data, artwork, music, or original binaries.

You need files from your own copy of the 1997 PC CD-ROM. The release archive includes two pre-configured directories:

### 1. `DATA/` (Core Game Assets)
Place the following files here:
- `HERCULES.FS` (Required): Main game archive (sprites, maps, sounds).
- `ENG1.DLL` (Required): 2D level engine tables and logic.
- `ENG3.DLL` (Required): 3D runner engine tables and logic.
- `TITLE.DLL` (Required): Menus, title screen, passwords, and UI.
- `*.ETV` (Optional): Cutscene video files (`1.ETV` to `20.ETV`) from the disc's `DATA` directory.

These files are stored inside `DATA32.Z` on the CD-ROM root (extractable via InstallShield 3 extractors like i6comp or 7-Zip plugins), or available in the install folder after running the Windows installer.

### 2. `MUSIC/` (Soundtrack)
To enable the original soundtrack, rip the CD-Audio tracks to MP3 format and name them as follows:
- `01. Main Menu.mp3`
- `02. Passwords.mp3`
- `03. Loading.mp3`
- `04. Your Basic D.I.D..mp3` (Level 1: Training)
- `05. Hero's Gauntlet.mp3` (Level 2: Gauntlet)
- `06. The Centaur's Forest.mp3` (Level 3: Forest)
- `07. The Centaur's Forest Boss.mp3` (Centaur Boss)
- `08. The Big Olive.mp3` (Level 4: Thebes)
- `09. The Hydra Canyon.mp3` (Level 5: Hydra)
- `10. Medusa's Lair.mp3` (Level 6: Medusa)
- `11. Cyclops Attacks.mp3` (Level 7: Cyclops)
- `12. Titan Flight.mp3` (Level 8: Titans)
- `13. Passageways Of Eternal Torment.mp3` (Level 9: Torment)
- `14. Vortex Of Souls.mp3` (Level 10: Underworld)

Detailed checklists are included in `DATA/README.txt` and `MUSIC/README.txt`.

---

## Installing as a PWA on Mobile and Tablet

The game can be installed directly to the home screen on mobile devices. Once installed, it runs in fullscreen without browser navigation bars and works offline.

### Android (Chrome, Samsung Internet, Edge)
1. Open the game URL in Chrome or your preferred browser.
2. Tap the browser menu (three dots in the upper right).
3. Select "Install app" or "Add to Home screen".
4. Confirm installation. The game icon will appear on your home screen.

### iOS (iPhone and iPad / Safari)
1. Open the game URL in Safari.
2. Tap the Share button (square with an upward arrow).
3. Scroll down and select "Add to Home Screen".
4. Tap "Add" in the upper right. Launch the game from your home screen.

### Offline Use
The built-in Service Worker caches necessary engine files on first load. After initial setup, the game can run without an active internet connection.

---

## Desktop Launch

### Windows
Run `Hercules.bat`. This starts Chrome with local file permissions enabled so the browser can read `DATA/` and `MUSIC/` directly from disk (`file://`).

### macOS and Linux
Serve the directory with any local static HTTP server:
```bash
python3 -m http.server 8080
# or
npx serve .
```
Then open `http://localhost:8080` in your browser.

---

## Controls

### Keyboard
| Action | Key |
|---|---|
| Move / Aim | Arrow Keys |
| Jump | `Z` (hold `↓` + `Z` for Ground Pound) |
| Sword Slash | `X` |
| Punch | `C` |
| Power Punch | `D` |
| Cycle / Use Gift Weapon | `S` |
| Pause Menu | `Esc` |
| Options & Settings | `F2` or `O` |
| Restart Level | `F3` or `R` |
| Fullscreen Toggle | `Alt + Enter` |

Bindings can be customized in Options › Controller.

### Gamepad (Xbox, PlayStation, Generic)
- D-Pad / Left Stick: Move and aim
- A / Cross: Jump / Confirm in menus
- X / Square: Sword
- B / Circle: Punch
- Y / Triangle: Power Punch
- LB / RB (L1 / R1): Cycle Gift Weapons
- Start: Pause

### Touch Controls
On touchscreen devices, on-screen virtual controls activate automatically with responsive directional input and action buttons.

---

## Credits

- **hercules-native:** Created by [yelnady](https://github.com/yelnady). The reverse-engineering work, data format decoders, and C implementation served as the foundation and inspiration for this project.
- **Original Game:** Developed by Eurocom Developments Ltd. and published by Disney Interactive in 1997.

---

## License

This project is licensed under the [MIT License](LICENSE).

Disclaimer: This is an independent open-source recreation for preservation and educational purposes. It is not affiliated with or endorsed by Disney Enterprises, Inc. or Eurocom.
