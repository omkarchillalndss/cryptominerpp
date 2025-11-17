@echo off
cls
echo ========================================
echo   CryptoMiner Admin Dashboard
echo ========================================
echo.
echo Stopping any running Node processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak > nul
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
echo.
echo Starting Admin Panel...
start "Admin Panel" cmd /k "cd adminpanel && npm run dev"
echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Wait for "ready in" message, then:
echo.
echo 1. Open the URL shown (usually http://localhost:5173)
echo 2. Press Ctrl+Shift+R to hard refresh
echo.
echo You should see a beautiful dark-themed dashboard!
echo ========================================
echo.
pause
