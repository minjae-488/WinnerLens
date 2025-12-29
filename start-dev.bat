@echo off
chcp 65001 >nul
title WinnerLens 개발 서버 시작

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   🚀 WinnerLens 개발 서버 시작
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM PowerShell 스크립트 실행
powershell -ExecutionPolicy Bypass -File "%~dp0start-dev.ps1"

if errorlevel 1 (
    echo.
    echo ❌ 서버 시작 중 오류가 발생했습니다.
    echo.
    pause
    exit /b 1
)

pause
