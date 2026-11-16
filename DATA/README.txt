===============================================================================
  DISNEY'S HERCULES (1997 PC): REQUIRED GAME DATA DIRECTORY ("DATA/")
===============================================================================

Place your extracted original game files in this directory ("DATA/").

For legal and copyright reasons, original Disney game assets are NOT
distributed with this port. You must provide the files from your own legally
acquired copy of the game (original CD-ROM disc, ISO image, or backup).

-------------------------------------------------------------------------------
1. ESSENTIAL GAME FILES (Required to start and play)
-------------------------------------------------------------------------------

These 4 files are mandatory. The game engine cannot initialize without them:

  [ ] HERCULES.FS   - Main game archive (sprite banks, maps, screens, audio SFX)
  [ ] ENG1.DLL      - 2D level engine tables, scripts, physics & enemy logic
  [ ] ENG3.DLL      - 3D runner level engine tables & logic (Gauntlet, Cyclops, Torment)
  [ ] TITLE.DLL     - Main menu, title screen, passwords, and UI logic

-------------------------------------------------------------------------------
2. IN-GAME CUTSCENE VIDEOS (Optional but strongly recommended)
-------------------------------------------------------------------------------

These are the full-motion video (FMV) cutscenes from the original PC CD-ROM.
If present, intro movies, level transitions, and ending cinematics will play:

  [ ] 1.ETV         - Disney Interactive & Eurocom logos / intro video
  [ ] 2.ETV         - Training completion cutscene
  [ ] 3.ETV         - Forest completion cutscene
  [ ] 4.ETV         - Thebes arrival cutscene
  [ ] 5.ETV         - Hydra emergence cutscene
  [ ] 6.ETV         - Hydra defeat cutscene
  [ ] 7.ETV         - Medusa lair intro cutscene
  [ ] 8.ETV         - Medusa defeat cutscene
  [ ] 9.ETV         - Cyclops arrival cutscene
  [ ] 10.ETV        - Titans release cutscene
  [ ] 11.ETV        - Titans defeat cutscene
  [ ] 12.ETV        - Underworld descent cutscene
  [ ] 13.ETV        - Final ending cinematic part 1
  [ ] 14.ETV        - Final ending cinematic part 2
  [ ] 15.ETV        - Bonus / credits cinematic
  [ ] 16.ETV .. 20.ETV (Additional cutscene clips, if present on your disc)

-------------------------------------------------------------------------------
WHERE TO FIND THESE FILES ON YOUR ORIGINAL CD-ROM
-------------------------------------------------------------------------------

1. ETV Cutscenes:
   Located directly in the "DATA" folder on the 1997 PC CD-ROM.

2. Core Game Files (HERCULES.FS, ENG1.DLL, ENG3.DLL, TITLE.DLL):
   These files are packed inside the installer archive "DATA32.Z" (InstallShield 3)
   located on the CD-ROM root. You can extract them using any InstallShield 3 /
   IS3 decompressor (such as i6comp, unshield, or a 7-Zip plugin), OR simply run
   the original Windows installer in Wine or a Windows VM and copy the files from
   the resulting installation folder.

Once placed here, open "index.html" in your browser or run "Hercules.bat".
Have fun playing!
