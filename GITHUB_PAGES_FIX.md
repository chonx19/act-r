# 🔧 แก้ไขปัญหา GitHub Pages ไม่แสดง

## ปัญหา: "There isn't a GitHub Pages site here"

### สาเหตุที่เป็นไปได้:
1. ยังไม่ได้ตั้งค่า GitHub Pages ใน Settings
2. GitHub Actions workflow ยังไม่ทำงาน
3. ไฟล์ workflow ยังไม่ได้ push ขึ้น GitHub

---

## ✅ วิธีแก้ไข (ทำตามขั้นตอน)

### ขั้นตอนที่ 1: ตรวจสอบว่าไฟล์ workflow ถูก push แล้ว

```bash
# ตรวจสอบว่าไฟล์ workflow มีอยู่
git ls-files .github/workflows/

# ถ้ายังไม่มี ให้เพิ่มและ push
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages workflow"
git push
```

### ขั้นตอนที่ 2: ตั้งค่า GitHub Pages ใน Settings

1. **ไปที่ Repository:**
   - เปิด https://github.com/chonx19/act-r

2. **ไปที่ Settings:**
   - คลิกแท็บ **"Settings"** (ด้านบน)

3. **ไปที่ Pages:**
   - ในเมนูด้านซ้าย คลิก **"Pages"** (ใต้ "Code and automation")

4. **ตั้งค่า Source:**
   - **Source:** เลือก **"GitHub Actions"**
   - **อย่า** เลือก "Deploy from a branch"

5. **บันทึก:**
   - GitHub จะแสดงข้อความว่า "Your site is ready to be published at..."

### ขั้นตอนที่ 3: ตรวจสอบ GitHub Actions

1. **ไปที่ Actions:**
   - คลิกแท็บ **"Actions"** (ด้านบน)

2. **ตรวจสอบ Workflow:**
   - ควรเห็น workflow **"Deploy to GitHub Pages"**
   - ถ้ายังไม่มี ให้ push code ใหม่:
     ```bash
     git add .
     git commit -m "Trigger GitHub Pages deployment"
     git push
     ```

3. **รอ Workflow เสร็จ:**
   - คลิก workflow ที่กำลังรัน
   - รอให้ build และ deploy เสร็จ (ประมาณ 2-5 นาที)

### ขั้นตอนที่ 4: ตรวจสอบ Permissions

ถ้า workflow ล้มเหลว อาจต้องตั้งค่า Permissions:

1. **ไปที่ Settings > Actions > General**
2. **Workflow permissions:**
   - เลือก **"Read and write permissions"**
   - Check **"Allow GitHub Actions to create and approve pull requests"**
3. **Save**

---

## 🚀 วิธีแก้ไขเร็ว (ทำทั้งหมดในครั้งเดียว)

### 1. Push workflow file (ถ้ายังไม่มี)

```bash
# ตรวจสอบว่า workflow file มีอยู่
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push
```

### 2. ตั้งค่า GitHub Pages

1. ไปที่ https://github.com/chonx19/act-r/settings/pages
2. **Source:** เลือก **"GitHub Actions"**
3. Save

### 3. Trigger Workflow

```bash
# สร้าง commit ใหม่เพื่อ trigger workflow
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push
```

### 4. ตรวจสอบ

- ไปที่ https://github.com/chonx19/act-r/actions
- รอ workflow เสร็จ
- ไปที่ https://github.com/chonx19/act-r/settings/pages
- ดู URL ที่ได้

---

## 🔍 ตรวจสอบปัญหา

### ถ้า Workflow ไม่ทำงาน:

1. **ตรวจสอบว่าไฟล์ workflow ถูก push:**
   ```bash
   git ls-files .github/workflows/
   ```

2. **ตรวจสอบ Actions tab:**
   - ไปที่ https://github.com/chonx19/act-r/actions
   - ดูว่ามี workflow หรือไม่

3. **ตรวจสอบ error messages:**
   - คลิก workflow ที่ล้มเหลว
   - ดู error messages

### ถ้า Workflow ทำงานแต่ Pages ไม่แสดง:

1. **ตรวจสอบ Settings > Pages:**
   - ไปที่ https://github.com/chonx19/act-r/settings/pages
   - ตรวจสอบว่า Source ตั้งค่าเป็น "GitHub Actions"

2. **รอสักครู่:**
   - GitHub Pages อาจใช้เวลา 1-2 นาที ในการ deploy

3. **ตรวจสอบ URL:**
   - URL ควรเป็น: `https://chonx19.github.io/act-r`
   - หรือ `https://chonx19.github.io/act-r/` (มี slash ท้าย)

---

## 📝 Checklist

- [ ] ไฟล์ `.github/workflows/deploy.yml` ถูก push ขึ้น GitHub
- [ ] ตั้งค่า Settings > Pages > Source = "GitHub Actions"
- [ ] GitHub Actions workflow ทำงานสำเร็จ
- [ ] ตรวจสอบ URL: https://chonx19.github.io/act-r

---

## 🆘 ยังไม่ได้?

### วิธีที่ 2: ใช้ Deploy from a branch (ง่ายกว่า)

1. **Build ในเครื่อง:**
   ```bash
   npm run build
   ```

2. **Push dist folder:**
   ```bash
   # สร้าง branch ใหม่
   git checkout --orphan gh-pages
   git rm -rf .
   cp -r dist/* .
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

3. **ตั้งค่า Pages:**
   - Settings > Pages
   - Source: **"Deploy from a branch"**
   - Branch: **gh-pages** > **/ (root)**

---

## 📞 ต้องการความช่วยเหลือ?

- **GitHub Docs:** https://docs.github.com/en/pages
- **Actions Docs:** https://docs.github.com/en/actions

