@echo off
:: ===================================================================
:: MSK YTDL - Trusted Publisher Certificate Installer
:: Publisher: MSK Software Solutions
:: ===================================================================
echo [MSK Software Solutions] Installing Trusted Publisher Certificate...
echo This ensures Windows Defender SmartScreen recognizes MSK YTDL safely.
echo.

openfiles >nul 2>&1
if %errorlevel% neq 0 (
    echo [REQUESTING ADMIN PRIVILEGES]
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cd /d "%~dp0"
if not exist "MSK_Software_Solutions.cer" (
    echo [ERROR] MSK_Software_Solutions.cer not found in this folder.
    pause
    exit /b 1
)

echo Importing certificate into Windows Trusted Root and Trusted Publisher stores...
certutil -addstore -f "Root" "MSK_Software_Solutions.cer"
certutil -addstore -f "TrustedPublisher" "MSK_Software_Solutions.cer"

echo.
echo ===================================================================
echo SUCCESS! Certificate for "MSK Software Solutions" is now trusted.
echo Windows SmartScreen warnings for MSK YTDL are now resolved.
echo ===================================================================
pause
