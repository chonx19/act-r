#!/bin/bash

# Script สำหรับ Deploy ไปยัง GitHub Pages

echo "🚀 เริ่ม Deploy ไปยัง GitHub Pages..."

# ตรวจสอบว่า Git ถูกติดตั้งแล้ว
if ! command -v git &> /dev/null; then
    echo "❌ Git ไม่ได้ถูกติดตั้ง กรุณาติดตั้ง Git ก่อน"
    exit 1
fi

# ตรวจสอบว่า npm ถูกติดตั้งแล้ว
if ! command -v npm &> /dev/null; then
    echo "❌ npm ไม่ได้ถูกติดตั้ง กรุณาติดตั้ง Node.js ก่อน"
    exit 1
fi

# ตรวจสอบว่า build สำเร็จ
echo "📦 กำลัง Build แอป..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build ล้มเหลว กรุณาตรวจสอบ error messages"
    exit 1
fi

echo "✅ Build สำเร็จ!"

# ตรวจสอบว่า Git repository ถูก initialize แล้ว
if [ ! -d ".git" ]; then
    echo "📝 กำลัง Initialize Git repository..."
    git init
    git add .
    git commit -m "Initial commit: ACT&R Inventory System"
    echo "✅ Git repository ถูก initialize แล้ว"
    echo ""
    echo "⚠️  ต่อไปนี้คุณต้อง:"
    echo "1. สร้าง repository บน GitHub"
    echo "2. รันคำสั่ง: git remote add origin https://github.com/YOUR_USERNAME/act.git"
    echo "3. รันคำสั่ง: git push -u origin main"
else
    # Commit และ Push
    echo "📤 กำลัง Commit และ Push..."
    git add .
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    git push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deploy สำเร็จ!"
        echo "🌐 GitHub Actions จะ build และ deploy อัตโนมัติ"
        echo "📋 ตรวจสอบที่: https://github.com/YOUR_USERNAME/act/actions"
    else
        echo "❌ Push ล้มเหลว กรุณาตรวจสอบ error messages"
        exit 1
    fi
fi

echo ""
echo "✨ เสร็จแล้ว!"

