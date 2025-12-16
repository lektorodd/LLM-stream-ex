@echo off
REM Simple script to start a local server for the LLM Token Visualizer on Windows

echo Starting LLM Token Visualizer server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python
    echo Serving from: %cd%
    echo Open in browser: http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
) else (
    echo Error: Python is not installed
    echo Please install Python or use another method to start a local server.
    echo.
    echo Alternative: If you have Node.js installed, run:
    echo   npx serve
    pause
    exit /b 1
)
