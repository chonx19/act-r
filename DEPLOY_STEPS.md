# 📋 ขั้นตอนการ Deploy แบบละเอียด

## 🎯 เป้าหมาย: Deploy ไปยัง actr.tk (หรือ domain ฟรีอื่นๆ)

---

## ขั้นตอนที่ 1: เตรียมแอป

```bash
# 1. ตรวจสอบว่าแอป build ได้
npm run build

# 2. ทดสอบ production build
npm run preview
```

---

## ขั้นตอนที่ 2: Deploy ไปยัง Vercel (แนะนำ)

### 2.1 ติดตั้ง Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Login Vercel

```bash
vercel login
```
- จะเปิด browser ให้ login ด้วย GitHub/Google/Email

### 2.3 Deploy

```bash
# Deploy ครั้งแรก
vercel

# หรือใช้ script
npm run deploy:vercel
```

**คำถามที่ Vercel จะถาม:**
- Set up and deploy? → **Y**
- Which scope? → เลือก account ของคุณ
- Link to existing project? → **N** (ครั้งแรก)
- What's your project's name? → **act** หรือชื่อที่ต้องการ
- In which directory is your code located? → **./** (Enter)
- Want to override the settings? → **N**

### 2.4 ได้ URL ฟรีทันที

หลัง deploy สำเร็จ จะได้ URL แบบนี้:
- `act-xxxxx.vercel.app` (อัตโนมัติ)
- หรือ `actr.vercel.app` (ถ้าตั้งชื่อ)

**ทดสอบ:** เปิด URL ใน browser ดูว่าแอปทำงาน

---

## ขั้นตอนที่ 3: ขอ Domain ฟรี (.tk, .ml, .ga)

### 3.1 ไปที่ Freenom

1. เปิด https://www.freenom.com
2. คลิก "Services" > "Register a New Domain"
3. ค้นหา: **actr**
4. เลือก domain ฟรี: **.tk** หรือ **.ml** หรือ **.ga**
5. คลิก "Get it now!" > "Complete Order"

### 3.2 สมัครสมาชิก

1. คลิก "Create Account"
2. กรอกข้อมูล:
   - Email: ใช้ Gmail ได้
   - Password: ตั้งรหัสผ่าน
3. ยืนยันอีเมล (ตรวจสอบ inbox)

### 3.3 เพิ่ม Domain ลงบัญชี

1. Login เข้า Freenom
2. ไปที่ "My Domains"
3. Domain ที่ขอไว้จะแสดงอยู่
4. คลิก "Manage Domain"

---

## ขั้นตอนที่ 4: ตั้งค่า Custom Domain ใน Vercel

### 4.1 เพิ่ม Domain ใน Vercel Dashboard

1. ไปที่ https://vercel.com/dashboard
2. เลือกโปรเจค **act**
3. ไปที่ **Settings** > **Domains**
4. คลิก **Add Domain**
5. พิมพ์: **actr.tk** (หรือ domain ที่คุณได้)
6. คลิก **Add**

### 4.2 ดู DNS Records

Vercel จะแสดง DNS records ที่ต้องตั้งค่า:
- **A Record:**
  - Name: `@`
  - Value: `76.76.21.21`
- **CNAME Record:**
  - Name: `www`
  - Value: `cname.vercel-dns.com`

---

## ขั้นตอนที่ 5: ตั้งค่า DNS ใน Freenom

### 5.1 ไปที่ DNS Management

1. ใน Freenom: ไปที่ **Management Tools** > **Manage Freenom DNS**
2. หรือคลิก **Manage Domain** > **Management Tools** > **Nameservers**

### 5.2 ตั้งค่า Nameservers (วิธีที่ 1 - แนะนำ)

1. เลือก **Use Freenom Nameservers**
2. คลิก **Change Nameservers**
3. ตั้งค่า:
   - **Nameserver 1:** `ns1.vercel-dns.com`
   - **Nameserver 2:** `ns2.vercel-dns.com`
4. คลิก **Change Nameservers**
5. รอ 5-10 นาที

### 5.3 หรือตั้งค่า DNS Records (วิธีที่ 2)

ถ้าใช้ Freenom DNS แทน:

1. ไปที่ **Management Tools** > **Manage Freenom DNS**
2. ลบ records เดิม (ถ้ามี)
3. เพิ่ม A Record:
   - **Name:** `@` หรือเว้นว่าง
   - **Type:** `A`
   - **Target:** `76.76.21.21`
   - **TTL:** `3600`
4. เพิ่ม CNAME Record:
   - **Name:** `www`
   - **Type:** `CNAME`
   - **Target:** `cname.vercel-dns.com`
   - **TTL:** `3600`
5. คลิก **Save Changes**

---

## ขั้นตอนที่ 6: รอ DNS Propagation

### 6.1 ตรวจสอบ DNS

ใช้เว็บไซต์ตรวจสอบ:
- https://dnschecker.org
- ค้นหา: `actr.tk`
- ตรวจสอบว่า A record ชี้ไปที่ `76.76.21.21`

### 6.2 เวลาที่ใช้

- **Nameservers:** 5-30 นาที
- **DNS Records:** 1-24 ชั่วโมง (ปกติ 1-2 ชั่วโมง)

---

## ขั้นตอนที่ 7: ทดสอบ

### 7.1 ทดสอบ Domain

1. เปิด browser
2. ไปที่: `https://actr.tk`
3. ควรเห็นแอปของคุณ

### 7.2 ตรวจสอบ HTTPS

Vercel จะตั้งค่า HTTPS อัตโนมัติ (ใช้เวลา 1-2 ชั่วโมง)

---

## ✅ Checklist

- [ ] Build แอปสำเร็จ (`npm run build`)
- [ ] Deploy ไปยัง Vercel
- [ ] ทดสอบ URL จาก Vercel
- [ ] ขอ domain ฟรีจาก Freenom
- [ ] ตั้งค่า Nameservers หรือ DNS Records
- [ ] รอ DNS propagation
- [ ] ทดสอบ domain ใหม่
- [ ] ตรวจสอบ HTTPS

---

## 🆘 ปัญหาที่พบบ่อย

### ปัญหา: Domain ไม่ทำงาน

**แก้ไข:**
1. ตรวจสอบ DNS records ถูกต้อง
2. รอ DNS propagation (อาจใช้เวลา 24 ชม.)
3. ล้าง DNS cache: `ipconfig /flushdns` (Windows)

### ปัญหา: HTTPS ไม่ทำงาน

**แก้ไข:**
- Vercel จะตั้งค่า HTTPS อัตโนมัติ
- รอ 1-2 ชั่วโมง
- ตรวจสอบใน Vercel Dashboard > Domains

### ปัญหา: หน้าเว็บไม่แสดง

**แก้ไข:**
1. ตรวจสอบว่า build สำเร็จ
2. ตรวจสอบ console ใน browser
3. ตรวจสอบ Vercel logs

---

## 📞 ต้องการความช่วยเหลือ?

- **Vercel Support:** https://vercel.com/support
- **Freenom Help:** https://www.freenom.com/en/faq.html
- **DNS Checker:** https://dnschecker.org

---

## 🎉 เสร็จแล้ว!

ตอนนี้คุณมี:
- ✅ เว็บแอปที่ deploy แล้ว
- ✅ Domain ฟรี (.tk, .ml, .ga)
- ✅ HTTPS อัตโนมัติ
- ✅ URL: https://actr.tk

**หมายเหตุ:** Domain ฟรีจาก Freenom ต้องต่ออายุทุกปี (ฟรี) แต่ต้อง login และต่ออายุเอง

