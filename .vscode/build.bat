setlocal

cd "%~dp0..\"

if not exist node_modules (
    call npm install
)

call npm run build
xcopy /E /I /Y "%~dp0..\src\styles" "%~dp0..\dist\css"

:: use this to copy the library to your demo folder
copy /Y "%~dp0..\dist\esm\main.js" "%~dp0..\demo\infill\main.js"
xcopy /E /I /Y "%~dp0..\src\styles" "%~dp0..\demo\infill\styles"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0play_sound.ps1"

