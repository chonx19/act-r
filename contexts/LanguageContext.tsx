import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Brand
  'company_name_short': { th: 'ACT & R', en: 'ACT & R' },
  'company_full_th': { th: 'บริษัท แอคท์ แอนด์ อาร์ ไฮ พรีซิชั่น พาร์ท จำกัด', en: 'ACT & R HIGH PRECISION PART COMPANY LIMITED' },
  'company_full_en': { th: 'ACT & R HIGH PRECISION PART COMPANY LIMITED', en: 'ACT & R HIGH PRECISION PART COMPANY LIMITED' },
  'company_desc': { th: 'ผู้จัดจำหน่ายเครื่องจักร เครื่องมือ และอุปกรณ์อุตสาหกรรมครบวงจร', en: 'Distributor of Machinery, Tools, and Industrial Equipment' },

  // Nav
  'nav_home': { th: 'หน้าแรก', en: 'Home' },
  'nav_services': { th: 'สินค้าและบริการ', en: 'Products & Services' },
  'nav_about': { th: 'เกี่ยวกับเรา', en: 'About Us' },
  'nav_contact': { th: 'ติดต่อเรา', en: 'Contact' },
  'nav_login': { th: 'เข้าสู่ระบบ', en: 'Login' },
  'nav_logout': { th: 'ออกจากระบบ', en: 'Logout' },

  // Hero
  'hero_title': { th: 'จำหน่ายเครื่องจักร วัสดุ และอุปกรณ์อุตสาหกรรมครบวงจร', en: 'Distributor of Machinery, Materials, and Industrial Equipment' },
  'hero_subtitle': { th: 'ศูนย์รวมวัตถุดิบ วัสดุสิ้นเปลือง เครื่องจักร เครื่องมือเครื่องใช้ และวัสดุอุปกรณ์ทุกชนิด สำหรับโรงงานอุตสาหกรรม', en: 'Your one-stop source for raw materials, consumables, machinery, tools, and all kinds of industrial equipment.' },
  'cta_contact': { th: 'สอบถามราคา', en: 'Inquire Now' },
  'cta_employee': { th: 'สำหรับพนักงาน', en: 'Employee Access' },

  // Services
  'service_title': { th: 'สินค้าและบริการของเรา', en: 'Our Products & Services' },
  'service_1_title': { th: 'เครื่องจักรและเครื่องมือ', en: 'Machinery & Tools' },
  'service_1_desc': { th: 'จำหน่ายเครื่องจักรคุณภาพและเครื่องมือช่างสำหรับทุกอุตสาหกรรม ขายส่งเครื่องจักรและอุปกรณ์อื่นๆ', en: 'Distribution of quality machinery and tools. Wholesale of machinery and equipment.' },
  'service_2_title': { th: 'วัตถุดิบและวัสดุสิ้นเปลือง', en: 'Raw Materials & Consumables' },
  'service_2_desc': { th: 'จัดหาวัตถุดิบและวัสดุสิ้นเปลืองต่างๆ สำหรับกระบวนการผลิตในโรงงานอุตสาหกรรม', en: 'Sourcing raw materials and consumables for industrial manufacturing processes.' },
  'service_3_title': { th: 'จัดหาอุปกรณ์ทุกชนิด', en: 'General Industrial Supply' },
  'service_3_desc': { th: 'บริการจัดหาวัสดุและอุปกรณ์ทุกชนิดตามความต้องการของลูกค้า ครบจบในที่เดียว', en: 'Sourcing service for all kinds of materials and equipment according to customer needs.' },

  // Footer / Contact
  'contact_address': { th: '121/57-58 หมู่ที่ 2 ต.บึง อ.ศรีราชา จ.ชลบุรี 20230', en: '121/57-58 Moo 2, Bueng, Si Racha, Chon Buri 20230' },
  'contact_phone': { th: 'โทร: 086-338-9283', en: 'Tel: 086-338-9283' },
  'google_map_label': { th: 'ดูแผนที่', en: 'View Map' },
  
  // Dashboard Menu
  'menu_dashboard': { th: 'แดชบอร์ด', en: 'Dashboard' },
  'menu_kanban': { th: 'ติดตามงาน (PO)', en: 'PO Tracking' },
  'menu_products': { th: 'รายการสินค้า', en: 'Products' },
  'menu_stock': { th: 'จัดการสต็อก', en: 'Stock Management' },
  'menu_reports': { th: 'รายงาน', en: 'Reports' },
  'menu_categories': { th: 'หมวดหมู่', en: 'Categories' },
  'menu_locations': { th: 'คลังสินค้า', en: 'Locations' },
  'menu_customers': { th: 'ลูกค้า & รายชื่อติดต่อ', en: 'Customers & Contacts' },
  'menu_main': { th: 'เมนูหลัก', en: 'Main Menu' },
  'menu_master': { th: 'ข้อมูลหลัก', en: 'Master Data' },

  // Login
  'login_title': { th: 'เข้าสู่ระบบ', en: 'Sign In' },
  'login_username': { th: 'ชื่อผู้ใช้', en: 'Username' },
  'login_password': { th: 'รหัสผ่าน', en: 'Password' },
  'login_btn': { th: 'เข้าสู่ระบบ', en: 'Sign In' },
  'login_back': { th: 'กลับหน้าหลัก', en: 'Back to Home' },

  // Dashboard Specific
  'dash_title': { th: 'แดชบอร์ด', en: 'Dashboard' },
  'dash_subtitle': { th: 'ภาพรวมคลังสินค้าและการดำเนินงาน', en: 'Overview of warehouse and operations' },
  'dash_total_products': { th: 'จำนวนสินค้าทั้งหมด', en: 'Total Products' },
  'dash_active_jobs': { th: 'งานที่กำลังทำ (Active)', en: 'Active Jobs' },
  'dash_chart_title': { th: 'สรุปยอดงานรายเดือน', en: 'Monthly Job Summary' },
  'dash_chart_axis_y': { th: 'จำนวนงาน', en: 'Jobs Count' },
  'dash_recent_activity': { th: 'การเคลื่อนไหวล่าสุด', en: 'Recent Activity' },
  'dash_view_all': { th: 'ดูประวัติทั้งหมด', en: 'View Full History' },
  'dash_no_activity': { th: 'ไม่มีรายการล่าสุด', en: 'No recent activity' },
  'dash_welcome_customer': { th: 'ยินดีต้อนรับ', en: 'Welcome' },
  'dash_customer_subtitle': { th: 'ติดตามสถานะงานของคุณได้ที่นี่', en: 'Track your job status here' },

  // Product List
  'prod_search_ph': { th: 'ค้นหาด้วยรหัส, ชื่อ หรือบาร์โค้ด...', en: 'Search by Code, Name or Barcode...' },
  'prod_filter_location': { th: 'กรองตามที่เก็บ', en: 'Filter by Location' },
  'prod_filter_supplier': { th: 'กรองตามบริษัท', en: 'Filter by Supplier' },
  'prod_all_locations': { th: 'ทุกสถานที่', en: 'All Locations' },
  'prod_all_suppliers': { th: 'ทุกบริษัท', en: 'All Suppliers' },

  // Kanban
  'kb_title': { th: 'กระดานติดตามงาน (PO Kanban)', en: 'PO Kanban Board' },
  'kb_subtitle': { th: 'ติดตามสถานะงานและคำสั่งซื้อ', en: 'Track status and orders' },
  'kb_new': { th: 'สร้างรายการใหม่', en: 'New Order' },
  'kb_fullscreen': { th: 'เต็มหน้าจอ', en: 'Full Screen' },
  'kb_export': { th: 'พิมพ์ / ส่งออก PDF', en: 'Print / Export PDF' },
  
  // Updated Statuses
  'kb_status_rfq': { th: '1. ขอราคา', en: '1. RFQ' },
  'kb_status_quotation': { th: '2. เสนอราคา', en: '2. Quotation' },
  'kb_status_waiting': { th: '3. รอ PO', en: '3. Waiting PO' },
  'kb_status_progress': { th: '4. กำลังดำเนินการ', en: '4. In Progress' },
  'kb_status_done': { th: '5. เสร็จสิ้น', en: '5. Done' },
  'kb_status_cancelled': { th: '6. ยกเลิก', en: '6. Cancelled' },

  'kb_items': { th: 'รายการย่อย', en: 'Items' },
  'kb_items_add': { th: 'เพิ่มรายการ', en: 'Add Item' },
  'kb_items_placeholder': { th: 'พิมพ์ชื่อสินค้าเพื่อค้นหา...', en: 'Type to search products...' },
};

const LanguageContext = createContext<LanguageContextType>(null!);

export const LanguageProvider = ({ children }: { children?: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('th');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'th' ? 'en' : 'th');
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);