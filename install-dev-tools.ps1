# WinnerLens 개발 환경 자동 설치 스크립트
# 관리자 권한으로 실행해야 합니다

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "WinnerLens 개발 환경 설치 시작" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 관리자 권한 확인
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ 이 스크립트는 관리자 권한으로 실행해야 합니다." -ForegroundColor Red
    Write-Host "PowerShell을 관리자 권한으로 다시 실행해주세요." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "방법: PowerShell 아이콘 우클릭 → '관리자 권한으로 실행'" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ 관리자 권한 확인 완료" -ForegroundColor Green
Write-Host ""

# Chocolatey 설치 확인
Write-Host "📦 Chocolatey 패키지 매니저 확인 중..." -ForegroundColor Yellow

if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey가 설치되어 있지 않습니다. 설치를 시작합니다..." -ForegroundColor Yellow
    
    # Chocolatey 설치
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    Write-Host "✅ Chocolatey 설치 완료" -ForegroundColor Green
} else {
    Write-Host "✅ Chocolatey가 이미 설치되어 있습니다." -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "개발 도구 설치 시작" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Node.js 설치
Write-Host "1️⃣ Node.js 20 LTS 설치 중..." -ForegroundColor Yellow
choco install nodejs-lts -y
Write-Host "✅ Node.js 설치 완료" -ForegroundColor Green
Write-Host ""

# Python 설치
Write-Host "2️⃣ Python 3.11 설치 중..." -ForegroundColor Yellow
choco install python311 -y
Write-Host "✅ Python 설치 완료" -ForegroundColor Green
Write-Host ""

# Docker Desktop 설치
Write-Host "3️⃣ Docker Desktop 설치 중..." -ForegroundColor Yellow
choco install docker-desktop -y
Write-Host "✅ Docker Desktop 설치 완료" -ForegroundColor Green
Write-Host ""

# Git 설치 (이미 설치되어 있을 수 있음)
Write-Host "4️⃣ Git 확인 및 설치 중..." -ForegroundColor Yellow
choco install git -y
Write-Host "✅ Git 설치 완료" -ForegroundColor Green
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "설치 완료!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 설치된 도구:" -ForegroundColor Green
Write-Host "  ✅ Node.js 20 LTS" -ForegroundColor White
Write-Host "  ✅ Python 3.11" -ForegroundColor White
Write-Host "  ✅ Docker Desktop" -ForegroundColor White
Write-Host "  ✅ Git" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  중요: 설치를 완료하려면 컴퓨터를 재시작해야 합니다." -ForegroundColor Yellow
Write-Host ""

$restart = Read-Host "지금 재시작하시겠습니까? (Y/N)"
if ($restart -eq 'Y' -or $restart -eq 'y') {
    Write-Host "컴퓨터를 재시작합니다..." -ForegroundColor Yellow
    Restart-Computer
} else {
    Write-Host "나중에 수동으로 재시작해주세요." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "재시작 후 새 PowerShell 창에서 다음 명령어로 확인하세요:" -ForegroundColor Cyan
Write-Host "  node --version" -ForegroundColor White
Write-Host "  python --version" -ForegroundColor White
Write-Host "  docker --version" -ForegroundColor White
Write-Host ""
