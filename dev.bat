@echo off
echo ========================================
echo   Kuhlshit.com - Dev Server
echo ========================================
echo.
echo Starting development server...
echo.
echo Open http://localhost:3000 in your browser
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.
cd /d "%~dp0"
npm run dev
pause
