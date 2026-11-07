import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Search, ChevronDown, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/format'
import { PUBLIC_NAV, ROLES, type Role } from './nav'

function PanelsMenu() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button onClick={() => setOpen((o) => !o)} onMouseEnter={() => setOpen(true)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-steel-200 hover:text-white" aria-expanded={open}>
        پنل‌ها <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute left-0 top-full z-50 w-64 pt-2">
            <div className="panel-raised p-1.5">
              {(Object.keys(ROLES) as Role[]).map((r) => (
                <Link key={r} to={ROLES[r].home} className="flex flex-col rounded-lg px-3 py-2 hover:bg-steel-700">
                  <span className="text-sm font-medium text-white">پنل {ROLES[r].label}</span>
                  <span className="text-[12px] text-steel-300">{ROLES[r].org}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', s, { passive: true }); return () => window.removeEventListener('scroll', s)
  }, [])
  return (
    <header className={cn('sticky top-0 z-50 transition-colors duration-300', scrolled ? 'border-b border-steel-700/70 bg-steel-900/85 backdrop-blur-xl' : 'bg-transparent')}>
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="منوی اصلی">
            {PUBLIC_NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => cn('rounded-lg px-3 py-2 text-sm transition-colors', isActive ? 'text-white' : 'text-steel-300 hover:text-white')}>{n.label}</NavLink>
            ))}
            <PanelsMenu />
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.dispatchEvent(new Event('open-palette'))} className="hidden items-center gap-2 rounded-ctl border border-steel-700 px-3 py-1.5 text-[13px] text-steel-300 hover:border-steel-500 md:flex" aria-label="جستجو">
            <Search size={15} /> جستجو <kbd className="code rounded bg-steel-800 px-1.5 text-[11px]">Ctrl K</kbd>
          </button>
          <Button to="/auth" variant="ghost" size="sm" className="hidden sm:inline-flex">ورود</Button>
          <Button to="/quote" size="sm"><Upload size={15} /> دریافت قیمت</Button>
          <button className="rounded-lg p-2 text-steel-200 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="منو">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-steel-700 bg-steel-900 lg:hidden">
            <div className="container-x flex flex-col py-3">
              {PUBLIC_NAV.map((n) => <NavLink key={n.to} to={n.to} className="rounded-lg px-3 py-2.5 text-steel-100 hover:bg-steel-800">{n.label}</NavLink>)}
              <div className="my-2 h-px bg-steel-700" />
              {(Object.keys(ROLES) as Role[]).map((r) => <Link key={r} to={ROLES[r].home} className="rounded-lg px-3 py-2.5 text-steel-300 hover:bg-steel-800">پنل {ROLES[r].label}</Link>)}
              <Link to="/auth" className="rounded-lg px-3 py-2.5 text-steel-300 hover:bg-steel-800">ورود / ثبت‌نام</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-steel-700/70 bg-steel-950">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-7 text-steel-300">بازارگاه مدیریت‌شده ساخت قطعات و سازه‌های فلزی سفارشی. متالیکس طرف قرارداد شماست؛ کیفیت، زمان تحویل و پرداخت را تضمین می‌کند.</p>
          <p className="mt-4 text-[12px] text-steel-400">متالیکس فروشنده آهن‌آلات خام نیست. هر سفارش باید شامل برش، خم، ماشین‌کاری، جوش یا مونتاژ باشد.</p>
        </div>
        {[
          { h: 'سفارش‌دهندگان', l: [['/quote', 'دریافت قیمت آنی'], ['/capabilities', 'خدمات ساخت'], ['/materials', 'متریال‌ها'], ['/how-it-works', 'پرداخت امانی و داوری']] },
          { h: 'سازندگان', l: [['/suppliers', 'عضویت کارگاه'], ['/supplier', 'پنل سازنده'], ['/supplier/profile', 'امتیازدهی سازندگان']] },
          { h: 'متالیکس', l: [['/about', 'درباره ما'], ['/about#roadmap', 'نقشه راه MVP'], ['/auth', 'ورود به حساب']] },
        ].map((c) => (
          <div key={c.h}>
            <h4 className="mb-3 text-sm font-semibold text-white">{c.h}</h4>
            <ul className="space-y-2">{c.l.map(([to, t]) => <li key={to}><Link to={to} className="text-sm text-steel-300 hover:text-white">{t}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="border-t border-steel-800">
        <div className="container-x flex flex-col gap-2 py-5 text-[12px] text-steel-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© ۱۴۰۵ متالیکس — نسخه نمایشی برای ارائه. همه داده‌ها ساختگی هستند.</span>
          <span className="temper-text font-medium">طراحی و توسعه: علی پیوند</span>
        </div>
      </div>
    </footer>
  )
}

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  )
}
