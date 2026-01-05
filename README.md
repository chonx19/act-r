# ACT&R Inventory Management System

ระบบจัดการคลังสินค้าและใบเสนอราคา สำหรับ ACT&R HIGH PRECISION PART CO.,LTD.

## Features

- 📦 จัดการสินค้าและคลังสินค้า
- 📋 ระบบ Kanban Board สำหรับจัดการ Purchase Orders
- 👥 จัดการลูกค้าและข้อมูลติดต่อ
- 📊 Dashboard และรายงาน
- 📄 Export ใบเสนอราคาเป็น Excel (ใช้ Template)
- 🌐 รองรับหลายภาษา (ไทย/อังกฤษ)
- 🌓 Dark Mode

## Prerequisites

- Node.js 18+ 
- npm หรือ yarn

## Installation

1. ติดตั้ง dependencies:
```bash
npm install
```

2. (Optional) ตั้งค่า Environment Variables:
สร้างไฟล์ `.env.local` และเพิ่ม:
```
GEMINI_API_KEY=your_api_key_here
```

## Development

รันแอปในโหมด development:
```bash
npm run dev
```

แอปจะเปิดที่ `http://localhost:3000`

## Build for Production

สร้าง production build:
```bash
npm run build
```

ไฟล์ที่ build จะอยู่ในโฟลเดอร์ `dist/`

## Preview Production Build

ดู production build ในเครื่อง:
```bash
npm run preview
```

## Deployment

### Option 1: Deploy to Static Hosting (แนะนำ)

แอปนี้เป็น Static Web App สามารถ deploy ไปยัง:

- **Vercel**: 
  ```bash
  npm install -g vercel
  vercel
  ```

- **Netlify**:
  ```bash
  npm install -g netlify-cli
  netlify deploy --prod
  ```

- **GitHub Pages**:
  1. Build: `npm run build`
  2. Deploy folder `dist/` ไปยัง GitHub Pages

### Option 2: Deploy with Simple HTTP Server

1. Build แอป:
   ```bash
   npm run build
   ```

2. ใช้ HTTP server ใดๆ เช่น:
   - **Python**:
     ```bash
     cd dist
     python -m http.server 3000
     ```
   
   - **Node.js (serve)**:
     ```bash
     npm install -g serve
     serve -s dist -l 3000
     ```

   - **PHP**:
     ```bash
     cd dist
     php -S localhost:3000
     ```

### Option 3: Deploy to VPS/Server

1. Build แอป:
   ```bash
   npm run build
   ```

2. Copy โฟลเดอร์ `dist/` ไปยัง server

3. ตั้งค่า web server (Nginx/Apache) ให้ serve ไฟล์จาก `dist/`

**ตัวอย่าง Nginx config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Important Notes

- ไฟล์ `Excel/RFQ.xlsx` ถูกคัดลอกไปยัง `public/Excel/` แล้ว
- ข้อมูลทั้งหมดเก็บใน LocalStorage ของ browser
- ใช้ HashRouter เพื่อรองรับ static hosting
- Port default: 3000 (สามารถเปลี่ยนใน `vite.config.ts`)

## Project Structure

```
act/
├── public/          # Static files (Excel templates)
├── components/     # React components
├── contexts/        # React contexts (Auth, Inventory, etc.)
├── pages/           # Page components
├── services/        # Services (storage, etc.)
├── types.ts         # TypeScript types
└── dist/            # Production build (generated)
```

## License

Private - ACT&R HIGH PRECISION PART CO.,LTD.
