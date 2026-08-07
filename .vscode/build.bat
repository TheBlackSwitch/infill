setlocal

cd "%~dp0..\"

if not exist node_modules (
    call npm install
)

call npm run build

:: use this to copy the library to your demo folder
:: copy /Y "%~dp0..\dist\main.js" "%~dp0..\demo\lib\template.js"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0play_sound.ps1"

