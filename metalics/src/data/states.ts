/** ماشین حالت سفارش — مطابق Master Blueprint بخش ۵ */
export const ORDER_FLOW = [
  { id: 'SUBMITTED', label: 'ثبت سفارش', who: 'خریدار' },
  { id: 'TECH_REVIEW', label: 'بررسی فنی', who: 'کارشناس' },
  { id: 'QUOTING', label: 'مناقصه کور', who: 'سازندگان' },
  { id: 'SUPPLIER_SELECTED', label: 'انتخاب سازنده', who: 'خریدار' },
  { id: 'ESCROW_PAID', label: 'پرداخت امانی', who: 'خریدار' },
  { id: 'IN_PRODUCTION', label: 'در حال ساخت', who: 'سازنده' },
  { id: 'QC_PASSED', label: 'کنترل کیفیت', who: 'بازرس' },
  { id: 'SHIPPED', label: 'در مسیر', who: 'لجستیک' },
  { id: 'DELIVERED', label: 'تحویل با OTP', who: 'انباردار' },
  { id: 'SETTLED', label: 'تسویه', who: 'مالی' },
] as const

export type OrderState = (typeof ORDER_FLOW)[number]['id'] | 'DRAFT' | 'QUOTED' | 'DISPUTED' | 'CANCELLED' | 'CLOSED'

export const STATE_META: Record<string, { label: string; tone: 'muted' | 'info' | 'heat' | 'ok' | 'warn' | 'err' }> = {
  DRAFT: { label: 'پیش‌نویس', tone: 'muted' },
  SUBMITTED: { label: 'ثبت‌شده', tone: 'info' },
  TECH_REVIEW: { label: 'بررسی فنی', tone: 'info' },
  QUOTING: { label: 'در حال مناقصه', tone: 'heat' },
  QUOTED: { label: 'پیشنهادها رسید', tone: 'heat' },
  SUPPLIER_SELECTED: { label: 'سازنده انتخاب شد', tone: 'info' },
  ESCROW_PAID: { label: 'وجه در اسکرو', tone: 'ok' },
  IN_PRODUCTION: { label: 'در حال ساخت', tone: 'heat' },
  QC_PASSED: { label: 'QC تأیید شد', tone: 'ok' },
  SHIPPED: { label: 'در مسیر', tone: 'info' },
  DELIVERED: { label: 'تحویل شد', tone: 'ok' },
  SETTLED: { label: 'تسویه شد', tone: 'ok' },
  CLOSED: { label: 'بسته شد', tone: 'muted' },
  DISPUTED: { label: 'در داوری', tone: 'err' },
  CANCELLED: { label: 'لغو شد', tone: 'muted' },
}

export const flowIndex = (s: string) => ORDER_FLOW.findIndex((f) => f.id === s)
