# คู่มือการ Deploy

## วิธี Deploy แอปนี้

### วิธีที่ 1: Build และ Deploy เอง (แนะนำสำหรับใช้ในเครื่อง)

#### ขั้นตอน:

1. **Build แอป:**
   ```bash
   npm run build
   ```
   ไฟล์ที่ build จะอยู่ในโฟลเดอร์ `dist/`

2. **Preview ในเครื่อง:**
   ```bash
   npm run preview
   ```
   แอปจะเปิดที่ `http://localhost:3000`

3. **Deploy ด้วย HTTP Server:**

   **ใช้ Python:**
   ```bash
   cd dist
   python -m http.server 3000
   ```

   **ใช้ Node.js (serve):**
   ```bash
   npm install -g serve
   serve -s dist -l 3000
   ```

   **ใช้ PHP:**
   ```bash
   cd dist
   php -S localhost:3000
   ```

### วิธีที่ 2: Deploy ไปยัง Cloud Hosting

#### Vercel (แนะนำ - ฟรี)

1. ติดตั้ง Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. หรือเชื่อมต่อ GitHub repository กับ Vercel

#### Netlify

1. ติดตั้ง Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

#### GitHub Pages

1. Build:
   ```bash
   npm run build
   ```

2. Deploy folder `dist/` ไปยัง GitHub Pages branch

### วิธีที่ 3: Deploy บน VPS/Server ของคุณเอง

#### ใช้ Nginx

1. Build:
   ```bash
   npm run build
   ```

2. Copy `dist/` ไปยัง server:
   ```bash
   scp -r dist/* user@your-server:/var/www/html/
   ```

3. ตั้งค่า Nginx:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

#### ใช้ Apache

1. Build:
   ```bash
   npm run build
   ```

2. Copy `dist/` ไปยัง server

3. สร้าง `.htaccess` ใน `dist/`:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### วิธีที่ 4: ใช้ Docker (Optional)

สร้าง `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build และ run:
```bash
docker build -t act-inventory .
docker run -p 80:80 act-inventory
```

## หมายเหตุสำคัญ

- ✅ ไฟล์ template Excel (`RFQ.xlsx`) อยู่ใน `public/Excel/` แล้ว
- ✅ ใช้ HashRouter ดังนั้นไม่ต้องตั้งค่า server-side routing
- ✅ ข้อมูลเก็บใน LocalStorage ของ browser
- ✅ Port default: 3000 (เปลี่ยนได้ใน `vite.config.ts`)

## Troubleshooting

### ปัญหา: หน้าเว็บไม่แสดง
- ตรวจสอบว่า build สำเร็จแล้ว (`dist/` folder มีไฟล์)
- ตรวจสอบว่า web server ตั้งค่าถูกต้อง

### ปัญหา: Excel export ไม่ทำงาน
- ตรวจสอบว่าไฟล์ `public/Excel/RFQ.xlsx` มีอยู่
- ตรวจสอบ console ใน browser สำหรับ error messages

### ปัญหา: Routing ไม่ทำงาน
- ตรวจสอบว่าใช้ HashRouter (ใน `App.tsx`)
- ตรวจสอบว่า web server ตั้งค่า fallback ไปที่ `index.html`

