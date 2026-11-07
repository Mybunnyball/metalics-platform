import { AnimatePresence, motion } from 'framer-motion'
import { Search, CornerDownLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ORDERS } from '@/data/mock'

const PAGES = [
  { to: '/', t: 'صفحه اصلی', g: 'سایت' }, { to: '/quote', t: 'دریافت قیمت آنی و ثبت سفارش', g: 'سایت' },
  { to: '/capabilities', t: 'خدمات ساخت', g: 'سایت' }, { to: '/materials', t: 'کتابخانه متریال', g: 'سایت' },
  { to: '/how-it-works', t: 'نحوه کار، اسکرو و داوری', g: 'سایت' }, { to: '/suppliers', t: 'عضویت سازندگان', g: 'سایت' },
  { to: '/about', t: 'درباره متالیکس و نقشه راه MVP', g: 'سایت' }, { to: '/auth', t: 'ورود / ثبت‌نام', g: 'سایت' },
  { to: '/app', t: 'داشبورد خریدار', g: 'پنل‌ها' }, { to: '/app/orders', t: 'سفارش‌های من', g: 'پنل‌ها' },
  { to: '/app/rfq/MTX-1405-4855', t: 'ماتریس مقایسه پیشنهادها', g: 'پنل‌ها' }, { to: '/app/messages', t: 'پیام‌ها (با ماسک اطلاعات تماس)', g: 'پنل‌ها' },
  { to: '/app/disputes/DSP-1405-031', t: 'گیت داوری سه‌مرحله‌ای', g: 'پنل‌ها' },
  { to: '/supplier', t: 'پنل سازنده — پیشنهادهای کار', g: 'پنل‌ها' }, { to: '/supplier/production', t: 'پنل سازنده — خط تولید', g: 'پنل‌ها' },
  { to: '/supplier/payouts', t: 'پنل سازنده — تسویه‌ها', g: 'پنل‌ها' }, { to: '/supplier/profile', t: 'پنل سازنده — ماشین‌آلات و امتیاز', g: 'پنل‌ها' },
  { to: '/expert', t: 'پنل کارشناس — صف بررسی', g: 'پنل‌ها' }, { to: '/expert/review/MTX-1405-4869', t: 'پنل کارشناس — میز بررسی نقشه', g: 'پنل‌ها' },
  { to: '/admin', t: 'مدیریت — نمای کلی', g: 'پنل‌ها' }, { to: '/admin/approvals', t: 'مدیریت — تأیید چهارچشمی پرداخت', g: 'پنل‌ها' },
  { to: '/admin/suppliers', t: 'مدیریت — احراز سازندگان', g: 'پنل‌ها' }, { to: '/admin/surveillance', t: 'مدیریت — پایش گفتگوها', g: 'پنل‌ها' },
  { to: '/admin/rbac', t: 'مدیریت — ماتریس دسترسی', g: 'پنل‌ها' }, { to: '/admin/audit', t: 'مدیریت — لاگ ممیزی', g: 'پنل‌ها' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const nav = useNavigate()

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o) }
      if (e.key === 'Escape') setOpen(false)
    }
    const o = () => setOpen(true)
    window.addEventListener('keydown', k); window.addEventListener('open-palette', o)
    return () => { window.removeEventListener('keydown', k); window.removeEventListener('open-palette', o) }
  }, [])

  const items = useMemo(() => {
    const all = [...PAGES, ...ORDERS.map((o) => ({ to: `/app/orders/${o.id}`, t: `${o.id} — ${o.title}`, g: 'سفارش‌ها' }))]
    return q ? all.filter((x) => x.t.includes(q) || x.to.includes(q)) : all
  }, [q])

  const go = (to: string) => { nav(to); setOpen(false); setQ(''); setI(0) }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-steel-950/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div initial={{ y: -12, scale: 0.98 }} animate={{ y: 0, scale: 1 }} className="panel-raised relative w-full max-w-xl overflow-hidden">
            <div className="flex items-center gap-3 border-b border-steel-700 px-4">
              <Search size={18} className="text-steel-300" />
              <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setI(0) }} placeholder="جستجوی صفحه، پنل یا کد سفارش…"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(x + 1, items.length - 1)) }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(x - 1, 0)) }
                  if (e.key === 'Enter' && items[i]) go(items[i].to)
                }}
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-steel-400" />
              <kbd className="code rounded border border-steel-600 px-1.5 text-steel-300">Esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {items.length === 0 && <li className="px-3 py-6 text-center text-sm text-steel-300">نتیجه‌ای پیدا نشد. کد سفارش را با پیشوند MTX امتحان کنید.</li>}
              {items.map((it, idx) => (
                <li key={it.to}>
                  <button onMouseEnter={() => setI(idx)} onClick={() => go(it.to)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-right text-sm ${idx === i ? 'bg-steel-700 text-white' : 'text-steel-200'}`}>
                    <span>{it.t}</span>
                    <span className="flex items-center gap-2 text-[12px] text-steel-400">{it.g}{idx === i && <CornerDownLeft size={14} />}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
