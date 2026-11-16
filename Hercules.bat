@echo off
rem Opens index.html in a separate Chrome window that may read the neighbouring DATA and MUSIC folders.
rem No server or Python is used; this only starts the browser with --allow-file-access-from-files.
set "PAGE=%~dp0index.html"
set "PROFILE=%TEMP%\hercules-browser-port-profile"
set "BROWSER="
if not defined BROWSER if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "BROWSER=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER (
  echo Google Chrome was not found. Install Chrome and run this file again.
  pause
  exit /b 1
)
start "" "%BROWSER%" --allow-file-access-from-files --autoplay-policy=no-user-gesture-required --user-data-dir="%PROFILE%" --no-first-run --no-default-browser-check "%PAGE%"
