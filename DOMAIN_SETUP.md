# คู่มือการตั้งค่า Domain ฟรี

## ตัวเลือก Domain ฟรี

### 1. Domain ฟรี (.tk, .ml, .ga, .cf, .gq)
- **Freenom** (https://www.freenom.com) - ให้ domain ฟรี .tk, .ml, .ga, .cf, .gq
- **ตัวอย่าง**: actr.tk, actr.ml, actr.ga

### 2. Subdomain ฟรี
- **Vercel**: your-app.vercel.app (ฟรี)
- **Netlify**: your-app.netlify.app (ฟรี)
- **GitHub Pages**: username.github.io/act (ฟรี)

## วิธี Deploy และตั้งค่า Domain

### วิธีที่ 1: Deploy บน Vercel (แนะนำ - ง่ายที่สุด)

#### ขั้นตอน:

1. **Build แอป:**
   ```bash
   npm run build
   ```

2. **ติดตั้ง Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - ตอบคำถามตามที่ถาม
   - เลือก Yes สำหรับ production deployment

4. **ตั้งค่า Custom Domain:**
   - ไปที่ https://vercel.com/dashboard
   - เลือกโปรเจคของคุณ
   - ไปที่ Settings > Domains
   - เพิ่ม domain ของคุณ (เช่น actr.tk)
   - ตั้งค่า DNS records ตามที่ Vercel แนะนำ

### วิธีที่ 2: Deploy บน Netlify

#### ขั้นตอน:

1. **Build แอป:**
   ```bash
   npm run build
   ```

2. **ติดตั้ง Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **ตั้งค่า Custom Domain:**
   - ไปที่ https://app.netlify.com
   - เลือกไซต์ของคุณ
   - ไปที่ Domain settings
   - เพิ่ม custom domain
   - ตั้งค่า DNS records

### วิธีที่ 3: Deploy บน GitHub Pages

#### ขั้นตอน:

1. **สร้าง GitHub Repository:**
   - สร้าง repo ใหม่บน GitHub
   - Push โค้ดขึ้น GitHub

2. **ตั้งค่า GitHub Pages:**
   - ไปที่ Settings > Pages
   - เลือก Source: GitHub Actions
   - หรือใช้ Deploy from a branch: main, / (root)

3. **สร้าง GitHub Actions Workflow:**
   - สร้างไฟล์ `.github/workflows/deploy.yml`
   - ดูตัวอย่างด้านล่าง

4. **ตั้งค่า Custom Domain:**
   - ใน GitHub Pages settings
   - เพิ่ม custom domain
   - ตั้งค่า DNS records

## ตัวอย่าง GitHub Actions Workflow

สร้างไฟล์ `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```

## วิธีขอ Domain ฟรีจาก Freenom

1. **ไปที่ https://www.freenom.com**
2. **ค้นหา domain ที่ต้องการ** (เช่น actr)
3. **เลือก domain ฟรี** (.tk, .ml, .ga, .cf, .gq)
4. **สมัครสมาชิกและยืนยันอีเมล**
5. **เพิ่ม domain ลงในบัญชี**
6. **ตั้งค่า DNS:**
   - ไปที่ Manage Domain
   - ไปที่ Management Tools > Nameservers
   - ใช้ Nameservers จาก Vercel/Netlify:
     - **Vercel**: 
       - ns1.vercel-dns.com
       - ns2.vercel-dns.com
     - **Netlify**:
       - dns1.p01.nsone.net
       - dns2.p01.nsone.net
       - dns3.p01.nsone.net
       - dns4.p01.nsone.net

## ตัวอย่าง DNS Records สำหรับ Vercel

เมื่อเพิ่ม domain ใน Vercel แล้ว จะได้ DNS records แบบนี้:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

ตั้งค่าใน Freenom:
- ไปที่ Management Tools > Manage Freenom DNS
- เพิ่ม A record: @ -> 76.76.21.21
- เพิ่ม CNAME record: www -> cname.vercel-dns.com

## ตัวอย่าง DNS Records สำหรับ Netlify

เมื่อเพิ่ม domain ใน Netlify แล้ว จะได้ DNS records แบบนี้:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

## หมายเหตุสำคัญ

- ⚠️ Domain .co.th **ไม่ฟรี** ต้องจ่ายเงิน (~500-1000 บาท/ปี)
- ✅ Domain ฟรี (.tk, .ml, .ga, .cf, .gq) จาก Freenom
- ✅ Subdomain ฟรีจาก Vercel/Netlify
- ⏱️ DNS propagation อาจใช้เวลา 24-48 ชั่วโมง
- 🔒 HTTPS จะถูกตั้งค่าอัตโนมัติเมื่อใช้ Vercel/Netlify

## แนะนำ

**สำหรับเริ่มต้น:**
1. ใช้ Vercel (ง่ายที่สุด, เร็วที่สุด)
2. ใช้ subdomain ฟรีก่อน: `actr.vercel.app`
3. ต่อมาค่อยขอ domain ฟรีจาก Freenom และตั้งค่า custom domain

**สำหรับ Production:**
- พิจารณาซื้อ domain จริง (.com, .co.th) เพื่อความน่าเชื่อถือ
- ราคา: .com ~300-500 บาท/ปี, .co.th ~500-1000 บาท/ปี

