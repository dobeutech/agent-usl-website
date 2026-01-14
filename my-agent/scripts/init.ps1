#
# Development Environment Initialization Script (Windows PowerShell)
# Customized for Unique Staffing Professionals project
#

param(
    [switch]$Install,
    [switch]$Build,
    [switch]$Test
)

$ErrorActionPreference = "Stop"

Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "   Unique Staffing Professionals - Dev Environment Setup        " -ForegroundColor Blue
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Blue

# Navigate to project root (two levels up from scripts/ to reach unique-staffing-prof/)
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $projectRoot

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Are you in the project root?" -ForegroundColor Red
    exit 1
}

# Install dependencies if requested or if node_modules doesn't exist
if ($Install -or -not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: npm install failed" -ForegroundColor Red
        exit 1
    }
}

# Run build if requested
if ($Build) {
    Write-Host "Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: build failed" -ForegroundColor Red
        exit 1
    }
}

# Run tests if requested
if ($Test) {
    Write-Host "Running tests..." -ForegroundColor Yellow
    npm test
    exit $LASTEXITCODE
}

# Start development server
Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "────────────────────────────────────────────────────────────────" -ForegroundColor Blue
Write-Host "Server will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "────────────────────────────────────────────────────────────────" -ForegroundColor Blue

npm run dev
