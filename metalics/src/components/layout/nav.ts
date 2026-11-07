/** تعریف مرکزی منوها — برای افزودن صفحه جدید فقط اینجا را ویرایش کنید */
export const PUBLIC_NAV = [
  { to: '/capabilities', label: 'خدمات ساخت' },
  { to: '/materials', label: 'متریال‌ها' },
  { to: '/how-it-works', label: 'نحوه کار' },
  { to: '/suppliers', label: 'برای سازندگان' },
  { to: '/about', label: 'درباره و نقشه راه' },
]

export type Role = 'buyer' | 'supplier' | 'expert' | 'admin'

export const ROLES: Record<Role, { label: string; home: string; person: string; org: string }> = {
  buyer: { label: 'خریدار', home: '/app', person: 'نیلوفر احمدی', org: 'فرآوری معدنی کویر سپاهان' },
  supplier: { label: 'سازنده', home: '/supplier', person: 'حمید کاظمی', org: 'سازنده A (SUP-0142)' },
  expert: { label: 'کارشناس فنی', home: '/expert', person: 'مهندس کیان صدری', org: 'دفتر فنی متالیکس' },
  admin: { label: 'مدیریت', home: '/admin', person: 'سوپرادمین', org: 'متالیکس' },
}

export const APP_NAV: Record<Role, { to: string; label: string; icon: string; badge?: number }[]> = {
  buyer: [
    { to: '/app', label: 'داشبورد', icon: 'LayoutDashboard' },
    { to: '/quote', label: 'سفارش جدید', icon: 'Plus' },
    { to: '/app/orders', label: 'سفارش‌ها', icon: 'Package' },
    { to: '/app/rfq/MTX-1405-4855', label: 'مقایسه پیشنهادها', icon: 'Scale', badge: 4 },
    { to: '/app/messages', label: 'پیام‌ها', icon: 'MessagesSquare', badge: 2 },
    { to: '/app/disputes/DSP-1405-031', label: 'داوری', icon: 'Gavel' },
  ],
  supplier: [
    { to: '/supplier', label: 'پیشنهادهای کار', icon: 'Inbox', badge: 3 },
    { to: '/supplier/production', label: 'خط تولید', icon: 'Factory' },
    { to: '/supplier/payouts', label: 'تسویه‌ها', icon: 'Wallet' },
    { to: '/supplier/profile', label: 'ماشین‌آلات و امتیاز', icon: 'Gauge' },
  ],
  expert: [
    { to: '/expert', label: 'صف بررسی فنی', icon: 'ClipboardCheck', badge: 3 },
    { to: '/expert/review/MTX-1405-4869', label: 'میز بررسی نقشه', icon: 'ScanSearch' },
    { to: '/app/disputes/DSP-1405-031', label: 'پرونده‌های داوری', icon: 'Gavel' },
  ],
  admin: [
    { to: '/admin', label: 'نمای کلی', icon: 'Activity' },
    { to: '/admin/approvals', label: 'تأیید چهارچشمی', icon: 'ShieldCheck', badge: 3 },
    { to: '/admin/suppliers', label: 'سازندگان', icon: 'Factory' },
    { to: '/admin/surveillance', label: 'پایش گفتگوها', icon: 'Eye' },
    { to: '/admin/rbac', label: 'نقش‌ها و دسترسی', icon: 'KeyRound' },
    { to: '/admin/audit', label: 'لاگ ممیزی', icon: 'ScrollText' },
  ],
}
