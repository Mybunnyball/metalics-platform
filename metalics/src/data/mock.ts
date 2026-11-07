/** داده‌های نمایشی — همه نام‌ها و ارقام ساختگی هستند */
import { daysFromNow } from '@/lib/format'

export type Order = {
  id: string; title: string; process: string; material: string; qty: number; amount: number; state: string
  created: Date; due: Date; city: string; buyer: string; supplierAlias?: string; progress: number; thumb: 'flange' | 'bracket' | 'shaft' | 'plate' | 'frame'
}

export const BUYER = { company: 'شرکت فرآوری معدنی کویر سپاهان', person: 'مهندس نیلوفر احمدی', role: 'کارشناس خرید', tier: 'اعتباری شرکتی (Enterprise)', credit: 4_200_000_000 }

export const ORDERS: Order[] = [
  { id: 'MTX-1405-4821', title: 'فلنج اتصال سنگ‌شکن فکی', process: 'برش لیزر + ماشین‌کاری', material: 'ST52', qty: 40, amount: 386_400_000, state: 'IN_PRODUCTION', created: daysFromNow(-12), due: daysFromNow(9), city: 'سیرجان', buyer: BUYER.company, supplierAlias: 'سازنده B', progress: 62, thumb: 'flange' },
  { id: 'MTX-1405-4790', title: 'لاینر ضدسایش شوت تخلیه', process: 'برش پلاسما', material: 'Hardox 450', qty: 24, amount: 712_000_000, state: 'SHIPPED', created: daysFromNow(-20), due: daysFromNow(2), city: 'سیرجان', buyer: BUYER.company, supplierAlias: 'سازنده A', progress: 86, thumb: 'plate' },
  { id: 'MTX-1405-4855', title: 'براکت نگهدارنده نوار نقاله', process: 'برش لیزر + خم‌کاری', material: 'ST37', qty: 320, amount: 148_900_000, state: 'QUOTED', created: daysFromNow(-2), due: daysFromNow(24), city: 'سیرجان', buyer: BUYER.company, progress: 28, thumb: 'bracket' },
  { id: 'MTX-1405-4869', title: 'شفت محرک پمپ دوغاب', process: 'ماشین‌کاری CNC', material: 'MO40', qty: 6, amount: 0, state: 'TECH_REVIEW', created: daysFromNow(-1), due: daysFromNow(30), city: 'سیرجان', buyer: BUYER.company, progress: 12, thumb: 'shaft' },
  { id: 'MTX-1405-4702', title: 'قاب نگهدارنده الکتروموتور', process: 'جوشکاری و مونتاژ', material: 'ST37', qty: 8, amount: 264_000_000, state: 'DISPUTED', created: daysFromNow(-41), due: daysFromNow(-6), city: 'سیرجان', buyer: BUYER.company, supplierAlias: 'سازنده C', progress: 90, thumb: 'frame' },
  { id: 'MTX-1405-4611', title: 'صفحه ستون سوله انبار', process: 'برش پلاسما + سوراخ‌کاری', material: 'ST37', qty: 64, amount: 198_500_000, state: 'SETTLED', created: daysFromNow(-63), due: daysFromNow(-30), city: 'سیرجان', buyer: BUYER.company, supplierAlias: 'سازنده D', progress: 100, thumb: 'plate' },
  { id: 'MTX-1405-4577', title: 'بوش برنجی یاتاقان', process: 'تراش CNC', material: 'برنج', qty: 150, amount: 92_300_000, state: 'SETTLED', created: daysFromNow(-80), due: daysFromNow(-52), city: 'سیرجان', buyer: BUYER.company, supplierAlias: 'سازنده A', progress: 100, thumb: 'shaft' },
]

export type Bid = {
  alias: string; price: number; leadDays: number; city: string; km: number; quality: number; onTime: number; tolerance: number
  completed: number; machines: string; badge?: 'balance' | 'fastest' | 'cheapest'; score: number; note: string; fai: boolean
}

export const BIDS: Bid[] = [
  { alias: 'سازنده A', price: 148_900_000, leadDays: 16, city: 'اصفهان', km: 560, quality: 92, onTime: 95, tolerance: 90, completed: 214, machines: 'لیزر فایبر ۱۲kW + پرس‌برک ۲۲۰ تن', badge: 'balance', score: 91, note: 'متریال ST37 با MTC اکسین در انبار موجود است.', fai: true },
  { alias: 'سازنده B', price: 139_200_000, leadDays: 22, city: 'تهران', km: 980, quality: 84, onTime: 81, tolerance: 86, completed: 97, machines: 'لیزر فایبر ۶kW + پرس‌برک ۱۶۰ تن', badge: 'cheapest', score: 79, note: 'تحویل در دو محموله (۱۶۰+۱۶۰) پیشنهاد می‌شود.', fai: true },
  { alias: 'سازنده C', price: 163_700_000, leadDays: 11, city: 'کرمان', km: 175, quality: 89, onTime: 97, tolerance: 88, completed: 152, machines: 'لیزر فایبر ۲۰kW + خم رباتیک', badge: 'fastest', score: 88, note: 'ظرفیت آزاد خط خم در هفته آینده؛ امکان شروع فوری.', fai: true },
  { alias: 'سازنده D', price: 151_400_000, leadDays: 18, city: 'یزد', km: 390, quality: 80, onTime: 88, tolerance: 79, completed: 61, machines: 'لیزر CO2 ۴kW + پرس‌برک ۱۰۰ تن', score: 74, note: 'نیاز به تأیید شعاع خم داخلی R=۸ دارد.', fai: false },
]

export const NOTIFICATIONS = [
  { t: 'پیشنهادهای مناقصه کامل شد', d: 'برای «براکت نگهدارنده نوار نقاله» ۴ پیشنهاد کور رسیده است.', time: '۱۲ دقیقه پیش', tone: 'heat', link: '/app/rfq/MTX-1405-4855' },
  { t: 'محموله در مسیر است', d: 'لاینر ضدسایش از رفسنجان عبور کرد؛ رسیدن تخمینی فردا ساعت ۱۰.', time: '۱ ساعت پیش', tone: 'info', link: '/app/orders/MTX-1405-4790' },
  { t: 'نمونه اول (FAI) آماده بازرسی است', d: 'گزارش ابعادی فلنج اتصال بارگذاری شد؛ لطفاً تأیید یا رد کنید.', time: '۳ ساعت پیش', tone: 'ok', link: '/app/orders/MTX-1405-4821' },
  { t: 'جلسه داوری سه‌جانبه', d: 'جلسه آنلاین پرونده قاب الکتروموتور پنجشنبه ساعت ۱۱ برگزار می‌شود.', time: 'دیروز', tone: 'err', link: '/app/disputes/DSP-1405-031' },
]

export const MESSAGES = [
  { from: 'support', name: 'کارشناس متالیکس', text: 'سلام، نقشه فلنج بررسی شد. لطفاً تلرانس سوراخ‌های پین را تأیید کنید: H7 یا H8؟', time: '۰۹:۱۲' },
  { from: 'me', name: 'شما', text: 'H7 لازم است. سوراخ‌های M16 هم رزوه کامل باشند.', time: '۰۹:۲۰' },
  { from: 'supplier', name: 'سازنده B (ناشناس)', text: 'برای H7 پیشنهاد می‌کنیم بعد از برش، ریمر شود. زمان ساخت یک روز اضافه می‌شود.', time: '۰۹:۴۱' },
  { from: 'supplier', name: 'سازنده B (ناشناس)', text: 'برای هماهنگی سریع‌تر با شماره ٭٭٭٭٭٭٭٭٭٭٭ تماس بگیرید', time: '۰۹:۴۳', masked: true },
  { from: 'system', name: 'سیستم', text: 'اطلاعات تماس در پیام بالا حذف شد. ارتباط مستقیم خارج از متالیکس طبق قرارداد ب مجاز نیست.', time: '۰۹:۴۳' },
]

export const DISPUTE = {
  id: 'DSP-1405-031', order: 'MTX-1405-4702', title: 'قاب نگهدارنده الکتروموتور — مغایرت فاصله سوراخ‌های پایه', opened: daysFromNow(-5), amount: 264_000_000, held: 264_000_000,
  claim: 'فاصله مرکز تا مرکز سوراخ‌های پایه موتور ۴۰۸ میلی‌متر اندازه‌گیری شده در حالی که نقشه ۴۰۰±۱ میلی‌متر است. موتور روی قاب سوار نمی‌شود.',
  supplierReply: 'نقشه ارسالی نسخه B بوده و در بازنگری C این عدد تغییر کرده است. قطعه مطابق نسخه‌ای که در پنل دریافت کردیم ساخته شده.',
  gate: 2,
}

export const SUPPLIERS = [
  { code: 'SUP-0142', alias: 'سازنده A', name: 'صنایع برش‌کاران سپاهان', city: 'اصفهان', status: 'ACTIVE', score: 91, capabilities: ['laser', 'bending', 'welding'], orders: 214, joined: '۱۴۰۴' },
  { code: 'SUP-0187', alias: 'سازنده B', name: 'تراشکاری دقیق البرز', city: 'تهران', status: 'ACTIVE', score: 79, capabilities: ['cnc', 'laser'], orders: 97, joined: '۱۴۰۴' },
  { code: 'SUP-0203', alias: 'سازنده C', name: 'سازه‌گستر کویر', city: 'کرمان', status: 'ACTIVE', score: 88, capabilities: ['laser', 'structure', 'welding'], orders: 152, joined: '۱۴۰۴' },
  { code: 'SUP-0221', alias: 'سازنده D', name: 'فلزکاران یزد', city: 'یزد', status: 'SUSPENDED', score: 58, capabilities: ['plasma', 'bending'], orders: 61, joined: '۱۴۰۵' },
  { code: 'SUP-0234', alias: '—', name: 'صنعت پرس خراسان', city: 'مشهد', status: 'PENDING_VERIFICATION', score: 0, capabilities: ['bending', 'plasma'], orders: 0, joined: '۱۴۰۵' },
  { code: 'SUP-0238', alias: '—', name: 'ماشین‌سازی پارس تبریز', city: 'تبریز', status: 'PENDING_VERIFICATION', score: 0, capabilities: ['cnc', 'assembly'], orders: 0, joined: '۱۴۰۵' },
]

export const APPROVALS = [
  { id: 'PAY-30911', type: 'آزادسازی اسکرو', order: 'MTX-1405-4611', party: 'سازنده D', amount: 172_400_000, step: 1, maker: 'م. رضایی (حسابدار)', time: '۱۰:۰۴' },
  { id: 'PAY-30915', type: 'آزادسازی مرحله‌ای ۵۰٪', order: 'MTX-1405-4821', party: 'سازنده B', amount: 168_000_000, step: 0, maker: '—', time: '۱۱:۲۲' },
  { id: 'REF-00412', type: 'استرداد جزئی به خریدار', order: 'MTX-1405-4433', party: 'خریدار', amount: 24_800_000, step: 1, maker: 'م. رضایی (حسابدار)', time: '۰۸:۵۱' },
  { id: 'PAY-30920', type: 'آزادسازی اسکرو', order: 'MTX-1405-4577', party: 'سازنده A', amount: 80_100_000, step: 2, maker: 'م. رضایی (حسابدار)', time: 'دیروز' },
]

export const AUDIT = [
  { t: '۱۱:۴۲', who: 'admin@metalics', act: 'UPDATE', ent: 'supplier SUP-0221', d: 'وضعیت ACTIVE → SUSPENDED (امتیاز زیر ۶۰)' },
  { t: '۱۱:۲۲', who: 'system', act: 'CREATE', ent: 'payout PAY-30915', d: 'درخواست آزادسازی مرحله‌ای پس از تأیید FAI' },
  { t: '۱۰:۵۸', who: 'ai-guard', act: 'MASK', ent: 'message #88412', d: 'شماره موبایل در چت سفارش MTX-1405-4821 حذف شد' },
  { t: '۱۰:۰۴', who: 'm.rezaei', act: 'APPROVE_1', ent: 'payout PAY-30911', d: 'مرحله اول ممیزی حسابداری' },
  { t: '۰۹:۳۰', who: 'expert.k', act: 'UPDATE', ent: 'order MTX-1405-4869', d: 'TECH_REVIEW: درخواست شفاف‌سازی جنس متریال' },
  { t: '۰۸:۵۱', who: 'm.rezaei', act: 'APPROVE_1', ent: 'refund REF-00412', d: 'مرحله اول ممیزی حسابداری' },
  { t: '۰۸:۱۵', who: 'system', act: 'CREATE', ent: 'rfq MTX-1405-4855', d: 'ارسال کور به ۴ سازنده؛ مهلت ۲۸ ساعت' },
]

export const SURVEILLANCE = [
  { order: 'MTX-1405-4821', from: 'سازنده B', rule: 'شماره تماس', excerpt: 'با شماره ٭٭٭٭٭٭٭٭٭٭٭ تماس بگیرید', strikes: 1, time: '۱۰:۵۸' },
  { order: 'MTX-1405-4733', from: 'خریدار', rule: 'وب‌سایت', excerpt: 'کاتالوگ کامل در ٭٭٭٭٭٭٭٭٭٭ هست', strikes: 2, time: '۰۹:۱۴' },
  { order: 'MTX-1405-4690', from: 'سازنده D', rule: 'شبکه اجتماعی', excerpt: 'تلگرام ٭٭٭٭٭٭٭٭ پیام بدید', strikes: 3, time: 'دیروز' },
]

export const GMV_SERIES = [
  { m: 'فروردین', gmv: 1.8, orders: 21, take: 0.21 }, { m: 'اردیبهشت', gmv: 2.4, orders: 27, take: 0.28 },
  { m: 'خرداد', gmv: 2.1, orders: 25, take: 0.25 }, { m: 'تیر', gmv: 3.3, orders: 34, take: 0.39 },
  { m: 'مرداد', gmv: 3.9, orders: 41, take: 0.46 }, { m: 'شهریور', gmv: 4.6, orders: 47, take: 0.55 },
  { m: 'مهر', gmv: 5.8, orders: 58, take: 0.69 }, { m: 'آبان', gmv: 6.7, orders: 64, take: 0.8 },
]

export const SPEND_SERIES = [
  { m: 'اردیبهشت', v: 120 }, { m: 'خرداد', v: 210 }, { m: 'تیر', v: 180 }, { m: 'مرداد', v: 340 }, { m: 'شهریور', v: 290 }, { m: 'مهر', v: 520 }, { m: 'آبان', v: 610 },
]

export const JOB_OFFERS = [
  { id: 'MTX-1405-4855', title: 'براکت نگهدارنده نوار نقاله', process: 'برش لیزر + خم', material: 'ST37 t=8', qty: 320, deadline: 19, size: '۲۴۰×۱۶۰ mm', destKm: 560, est: 129_000_000, thumb: 'bracket' as const },
  { id: 'MTX-1405-4872', title: 'صفحه پایه پمپ', process: 'برش پلاسما + سوراخ‌کاری', material: 'ST52 t=25', qty: 12, deadline: 41, size: '۹۰۰×۶۰۰ mm', destKm: 410, est: 61_000_000, thumb: 'plate' as const },
  { id: 'MTX-1405-4879', title: 'فلنج کور ۸ اینچ', process: 'برش لیزر + تراش', material: 'ST52 t=30', qty: 60, deadline: 66, size: 'Ø۳۴۳ mm', destKm: 820, est: 214_000_000, thumb: 'flange' as const },
]

export const KANBAN = {
  'برنامه‌ریزی': [{ id: 'MTX-1405-4890', t: 'ریل راهنمای درب', q: 48 }],
  'برش و ماشین‌کاری': [{ id: 'MTX-1405-4821', t: 'فلنج اتصال سنگ‌شکن', q: 40, fai: true }, { id: 'MTX-1405-4866', t: 'لچکی سازه پایپ‌رک', q: 220 }],
  'جوش و مونتاژ': [{ id: 'MTX-1405-4851', t: 'قاب تابلو برق', q: 12 }],
  'کنترل کیفیت': [{ id: 'MTX-1405-4838', t: 'بوش فولادی', q: 90 }],
  'آماده ارسال': [{ id: 'MTX-1405-4790', t: 'لاینر ضدسایش شوت', q: 24 }],
} as Record<string, { id: string; t: string; q: number; fai?: boolean }[]>

export const REVIEW_QUEUE = [
  { id: 'MTX-1405-4869', title: 'شفت محرک پمپ دوغاب', file: 'shaft-pump-rev2.step', process: 'ماشین‌کاری CNC', material: 'MO40', risk: 'متوسط', waiting: '۳ ساعت', flags: 3 },
  { id: 'MTX-1405-4874', title: 'قاب پایه گیربکس', file: 'gearbox-frame.dwg', process: 'جوشکاری و مونتاژ', material: 'ST37', risk: 'بالا', waiting: '۵ ساعت', flags: 5 },
  { id: 'MTX-1405-4877', title: 'دریچه بازدید هاپر', file: 'hopper-door.dxf', process: 'برش لیزر + خم', material: 'ST37', risk: 'پایین', waiting: '۴۰ دقیقه', flags: 1 },
]
