# ⚡ GitHub Pages Quick Start (5 นาที)

## 🚀 Deploy เร็วที่สุด

### 1. สร้าง Repository บน GitHub

1. ไปที่ https://github.com/new
2. Repository name: `act`
3. เลือก Public
4. คลิก "Create repository"

### 2. Push โค้ด (เลือกวิธีใดวิธีหนึ่ง)

#### วิธี A: ใช้ PowerShell Script (Windows)

```powershell
.\deploy-github.ps1
```

#### วิธี B: ใช้ Git Command

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/act.git
git push -u origin main
```

**แทน `YOUR_USERNAME` ด้วย username ของคุณ**

### 3. ตั้งค่า GitHub Pages

1. ไปที่ Repository > **Settings** > **Pages**
2. **Source:** เลือก **"GitHub Actions"**
3. รอ 2-5 นาที

### 4. ได้ URL ฟรี!

```
https://YOUR_USERNAME.github.io/act
```

---

## 📝 หมายเหตุ

- ✅ ใช้ **HashRouter** แล้ว (ไม่ต้องตั้งค่า base path)
- ✅ GitHub Actions workflow พร้อมแล้ว
- ✅ Auto deploy เมื่อ push code ใหม่

---

## 🔄 Update เว็บไซต์

ทุกครั้งที่แก้ไขโค้ด:

```bash
git add .
git commit -m "Update: description"
git push
```

GitHub จะ build และ deploy อัตโนมัติ!

---

## 🆘 ปัญหาที่พบบ่อย

### Build ล้มเหลว?
- ตรวจสอบ `package.json` มี dependencies ครบ
- ตรวจสอบ Actions tab สำหรับ error messages

### หน้าเว็บไม่แสดง?
- ตรวจสอบว่าใช้ HashRouter (ใน `App.tsx`)
- ตรวจสอบ URL ถูกต้อง

---

## 📚 ดูคู่มือละเอียด

ดู `GITHUB_PAGES_DEPLOY.md` สำหรับคู่มือแบบละเอียด

