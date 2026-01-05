# PowerShell Script สำหรับ Deploy ไปยัง GitHub Pages

Write-Host "🚀 เริ่ม Deploy ไปยัง GitHub Pages..." -ForegroundColor Cyan

# ตรวจสอบว่า Git ถูกติดตั้งแล้ว
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git ไม่ได้ถูกติดตั้ง กรุณาติดตั้ง Git ก่อน" -ForegroundColor Red
    exit 1
}

# ตรวจสอบว่า npm ถูกติดตั้งแล้ว
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm ไม่ได้ถูกติดตั้ง กรุณาติดตั้ง Node.js ก่อน" -ForegroundColor Red
    exit 1
}

# ตรวจสอบว่า build สำเร็จ
Write-Host "📦 กำลัง Build แอป..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build ล้มเหลว กรุณาตรวจสอบ error messages" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build สำเร็จ!" -ForegroundColor Green

# ตรวจสอบว่า Git repository ถูก initialize แล้ว
if (-not (Test-Path ".git")) {
    Write-Host "📝 กำลัง Initialize Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: ACT&R Inventory System"
    Write-Host "✅ Git repository ถูก initialize แล้ว" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  ต่อไปนี้คุณต้อง:" -ForegroundColor Yellow
    Write-Host "1. สร้าง repository บน GitHub"
    Write-Host "2. รันคำสั่ง: git remote add origin https://github.com/YOUR_USERNAME/act.git"
    Write-Host "3. รันคำสั่ง: git push -u origin main"
} else {
    # Commit และ Push
    Write-Host "📤 กำลัง Commit และ Push..." -ForegroundColor Yellow
    git add .
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Deploy: $timestamp"
    git push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Deploy สำเร็จ!" -ForegroundColor Green
        Write-Host "🌐 GitHub Actions จะ build และ deploy อัตโนมัติ" -ForegroundColor Cyan
        Write-Host "📋 ตรวจสอบที่: https://github.com/YOUR_USERNAME/act/actions" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Push ล้มเหลว กรุณาตรวจสอบ error messages" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✨ เสร็จแล้ว!" -ForegroundColor Green

