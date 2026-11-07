/** ابزارهای قالب‌بندی فارسی: اعداد، مبالغ، تاریخ شمسی */
export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

const nf = new Intl.NumberFormat('fa-IR')
export const fa = (n: number | string) => (typeof n === 'number' ? nf.format(n) : String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]))

/** مبلغ به تومان با جداکننده هزارگان */
export const toman = (n: number) => `${nf.format(Math.round(n))} تومان`

/** نمایش کوتاه مبالغ بزرگ: ۱٫۲ میلیارد */
export function compactToman(n: number) {
  if (n >= 1e9) return `${fa(+(n / 1e9).toFixed(1))} میلیارد`
  if (n >= 1e6) return `${fa(+(n / 1e6).toFixed(1))} میلیون`
  return fa(Math.round(n))
}

const jf = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'long', day: 'numeric' })
const jfShort = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'short', day: 'numeric' })
const jfTime = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { hour: '2-digit', minute: '2-digit' })
export const jdate = (d: Date | string) => jf.format(new Date(d))
export const jshort = (d: Date | string) => jfShort.format(new Date(d))
export const jtime = (d: Date | string) => jfTime.format(new Date(d))

export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000)
export const daysFromNow = (n: number) => addDays(new Date(), n)

/** کد رهگیری سفارش متالیکس */
export function trackingCode() {
  const r = Math.floor(1000 + Math.random() * 9000)
  return `MTX-1405-${r}`
}
