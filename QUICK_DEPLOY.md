# 🚀 คู่มือ Deploy เร็ว (5 นาที)

## วิธีที่ 1: Vercel (แนะนำ - ง่ายที่สุด) ⭐

### ขั้นตอน:

1. **ติดตั้ง Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - กด Enter เพื่อใช้ default settings
   - เลือก Yes สำหรับ production

4. **ได้ URL ฟรีทันที:**
   - จะได้ URL แบบ: `act-xxxxx.vercel.app`
   - หรือตั้งชื่อเอง: `actr.vercel.app`

5. **ตั้งค่า Custom Domain (ถ้ามี):**
   ```bash
   vercel domains add actr.tk
   ```
   - แล้วตั้งค่า DNS ตามที่ Vercel แนะนำ

---

## วิธีที่ 2: Netlify

### ขั้นตอน:

1. **ติดตั้ง Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **ได้ URL ฟรี:**
   - จะได้ URL แบบ: `act-xxxxx.netlify.app`

---

## วิธีที่ 3: GitHub Pages

### ขั้นตอน:

1. **สร้าง GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/act.git
   git push -u origin main
   ```

2. **เปิด GitHub Pages:**
   - ไปที่ Settings > Pages
   - เลือก Source: GitHub Actions
   - GitHub จะ deploy อัตโนมัติ

3. **ได้ URL:**
   - `username.github.io/act`

---

## 🌐 ขอ Domain ฟรี (.tk, .ml, .ga)

### ใช้ Freenom (ฟรี 100%)

1. **ไปที่:** https://www.freenom.com
2. **ค้นหา:** actr
3. **เลือก domain ฟรี:** .tk, .ml, .ga, .cf, .gq
4. **สมัครสมาชิก** (ใช้ Gmail ได้)
5. **ยืนยันอีเมล**
6. **เพิ่ม domain ลงบัญชี**

### ตั้งค่า DNS สำหรับ Vercel:

1. **ใน Vercel Dashboard:**
   - ไปที่ Settings > Domains
   - เพิ่ม domain: `actr.tk`
   - จะได้ DNS records

2. **ใน Freenom:**
   - ไปที่ Manage Domain > Management Tools > Manage Freenom DNS
   - เพิ่ม A record:
     - Name: `@`
     - Target: `76.76.21.21`
     - TTL: `3600`
   - เพิ่ม CNAME record:
     - Name: `www`
     - Target: `cname.vercel-dns.com`
     - TTL: `3600`

3. **รอ 24-48 ชั่วโมง** (DNS propagation)

---

## ✅ Checklist

- [ ] Build แอปสำเร็จ (`npm run build`)
- [ ] Deploy ไปยัง Vercel/Netlify
- [ ] ทดสอบ URL ที่ได้
- [ ] (Optional) ขอ domain ฟรีจาก Freenom
- [ ] ตั้งค่า DNS records
- [ ] รอ DNS propagation
- [ ] ทดสอบ domain ใหม่

---

## 🆘 Troubleshooting

### ปัญหา: Build ไม่สำเร็จ
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
npm run build
```

### ปัญหา: หน้าเว็บไม่แสดง
- ตรวจสอบว่า build สำเร็จ (`dist/` folder มีไฟล์)
- ตรวจสอบ console ใน browser

### ปัญหา: Domain ไม่ทำงาน
- ตรวจสอบ DNS records ถูกต้อง
- รอ DNS propagation (อาจใช้เวลา 24-48 ชม.)
- ใช้ https://dnschecker.org ตรวจสอบ

---

## 📞 ต้องการความช่วยเหลือ?

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Freenom Help: https://www.freenom.com/en/faq.html

