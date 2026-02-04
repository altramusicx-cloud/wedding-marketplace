# setup-after-node18.ps1
# Run this AFTER installing Node 18 LTS

Write-Host "=== SETUP AFTER NODE 18 INSTALL ===" -ForegroundColor Cyan

# 1. Verify Node version
Write-Host "1. Checking Node version..." -ForegroundColor White
$nodeVersion = node -v
if ($nodeVersion -match "v18") {
    Write-Host "   ✅ Node 18 detected: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ Wrong Node version: $nodeVersion" -ForegroundColor Red
    Write-Host "   Please install Node 18 LTS first!" -ForegroundColor Yellow
    exit 1
}

# 2. Clean install
Write-Host "`n2. Cleaning old dependencies..." -ForegroundColor White
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue

# 3. Fresh install
Write-Host "3. Installing fresh dependencies..." -ForegroundColor White
npm install

# 4. Create .nvmrc
Write-Host "`n4. Creating .nvmrc file..." -ForegroundColor White
"18" | Out-File ".nvmrc" -Encoding UTF8
Write-Host "   ✅ .nvmrc created" -ForegroundColor Green

# 5. Update package.json engines
Write-Host "5. Updating package.json engines..." -ForegroundColor White
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
if (-not $packageJson.engines) {
    $packageJson | Add-Member -NotePropertyName "engines" -NotePropertyValue @{} -Force
}
$packageJson.engines.node = ">=18 <19"
$packageJson | ConvertTo-Json -Depth 20 | Out-File "package.json" -Encoding UTF8
Write-Host "   ✅ package.json updated" -ForegroundColor Green

# 6. Test build
Write-Host "`n6. Testing build..." -ForegroundColor White
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉🎉🎉 SETUP COMPLETE!" -ForegroundColor Green
    Write-Host "Build successful with Node 18!" -ForegroundColor Cyan
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "• Continue with Phase 3.2: Image optimization" -ForegroundColor White
    Write-Host "• Run: npm run dev for development" -ForegroundColor Green
} else {
    Write-Host "`n❌ Build failed" -ForegroundColor Red
    Write-Host "Check the error above" -ForegroundColor Yellow
}
