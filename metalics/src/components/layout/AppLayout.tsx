import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Menu, Search, X, LogOut, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/format'
import { APP_NAV, ROLES, type Role } from './nav'
import { Icon } from './Icon'
import { NOTIFICATIONS } from '@/data/mock'

function roleFromPath(p: string): Role {
  if (p.startsWith('/supplier')) return 'supplier'
  if (p.startsWith('/expert')) return 'expert'
  if (p.startsWith('/admin')) return 'admin'
  return 'buyer'
}

function Sidebar({ role, onNav }: { role: Role; onNav?: () => void }) {
  const nav = useNavigate()
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-steel-700/70 px-5"><Logo /></div>
      <div className="px-3 pt-4">
        <label className="mb-1.5 block px-2 text-[12px] text-steel-400">نمایش به عنوان</label>
        <div className="grid grid-cols-2 gap-1 rounded-ctl border border-steel-700 bg-steel-950/50 p-1">
          {(Object.keys(ROLES) as Role[]).map((r) => (
            <button key={r} onClick={() => { nav(ROLES[r].home); onNav?.() }} className={cn('rounded-lg px-2 py-1.5 text-[12.5px] transition-colors', r === role ? 'bg-steel-700 text-white' : 'text-steel-300 hover:text-white')}>{ROLES[r].label}</button>
          ))}
        </div>
      </div>
      <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-3" aria-label="منوی پنل">
        {APP_NAV[role].map((n) => (
          <NavLink key={n.to} to={n.to} end onClick={onNav}
            className={({ isActive }) => cn('group relative flex items-center gap-3 rounded-ctl px-3 py-2.5 text-sm transition-colors', isActive ? 'bg-steel-750 text-white' : 'text-steel-300 hover:bg-steel-800 hover:text-white')}>
            {({ isActive }) => (<>
              {isActive && <motion.span layoutId="side-active" className="absolute inset-y-2 right-0 w-[3px] rounded-full bg-heat" />}
              <Icon name={n.icon} size={18} className={isActive ? 'text-heat' : ''} />
              <span className="flex-1">{n.label}</span>
              {n.badge && <span className="rounded-full bg-heat/15 px-2 text-[11px] font-semibold text-heat">{new Intl.NumberFormat('fa-IR').format(n.badge)}</span>}
            </>)}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-ctl border border-steel-700 bg-steel-800/60 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-steel-600 text-sm font-bold">{ROLES[role].person[0]}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{ROLES[role].person}</div>
            <div className="truncate text-[12px] text-steel-400">{ROLES[role].org}</div>
          </div>
          <Link to="/" className="rounded-lg p-1.5 text-steel-400 hover:bg-steel-700 hover:text-white" aria-label="خروج به سایت"><LogOut size={16} /></Link>
        </div>
      </div>
    </div>
  )
}

function Notifications() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="relative rounded-ctl border border-steel-700 p-2 text-steel-200 hover:border-steel-500" aria-label="اعلان‌ها">
        <Bell size={18} />
        <span className="absolute -left-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-heat"><span className="absolute inset-0 animate-pulseRing rounded-full bg-heat" /></span>
      </button>
      <AnimatePresence>
        {open && (<>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="panel-raised absolute left-0 top-12 z-50 w-[min(92vw,380px)] p-2">
            <div className="flex items-center justify-between px-2 py-1.5"><span className="text-sm font-semibold">اعلان‌ها</span><span className="text-[12px] text-steel-400">پیامک · ایمیل · درون‌پلتفرمی</span></div>
            {NOTIFICATIONS.map((n) => (
              <Link key={n.t} to={n.link} onClick={() => setOpen(false)} className="flex gap-3 rounded-lg p-2.5 hover:bg-steel-700">
                <span className={cn('mt-2 h-2 w-2 shrink-0 rounded-full', n.tone === 'heat' ? 'bg-heat' : n.tone === 'ok' ? 'bg-ok' : n.tone === 'err' ? 'bg-err' : 'bg-cut')} />
                <span className="min-w-0"><span className="block text-sm font-medium text-white">{n.t}</span><span className="block text-[12.5px] leading-6 text-steel-300">{n.d}</span><span className="text-[11px] text-steel-400">{n.time}</span></span>
              </Link>
            ))}
          </motion.div>
        </>)}
      </AnimatePresence>
    </div>
  )
}

export default function AppLayout() {
  const loc = useLocation()
  const role = roleFromPath(loc.pathname)
  const [mobile, setMobile] = useState(false)
  useEffect(() => setMobile(false), [loc.pathname])
  return (
    <div className="min-h-screen bg-steel-900">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 border-l border-steel-700/70 bg-steel-950 lg:block"><Sidebar role={role} /></aside>
      <AnimatePresence>
        {mobile && (<>
          <motion.div className="fixed inset-0 z-50 bg-black/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobile(false)} />
          <motion.aside className="fixed inset-y-0 right-0 z-50 w-72 border-l border-steel-700 bg-steel-950 lg:hidden" initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
            <button onClick={() => setMobile(false)} className="absolute left-3 top-4 rounded-lg p-1.5 text-steel-300" aria-label="بستن منو"><X size={18} /></button>
            <Sidebar role={role} onNav={() => setMobile(false)} />
          </motion.aside>
        </>)}
      </AnimatePresence>
      <div className="lg:pr-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-steel-700/70 bg-steel-900/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-steel-200 lg:hidden" onClick={() => setMobile(true)} aria-label="منو"><Menu size={20} /></button>
            <button onClick={() => window.dispatchEvent(new Event('open-palette'))} className="flex items-center gap-2 rounded-ctl border border-steel-700 bg-steel-950/40 px-3 py-2 text-[13px] text-steel-400 hover:border-steel-500 sm:w-80">
              <Search size={15} /><span className="hidden sm:inline">جستجوی سفارش، صفحه یا کد…</span><kbd className="code mr-auto hidden rounded bg-steel-800 px-1.5 text-[11px] sm:inline">Ctrl K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-2.5 py-1 text-[12px] text-ok md:flex"><span className="h-1.5 w-1.5 rounded-full bg-ok" />حالت نمایشی — داده‌ها ساختگی است</span>
            <Notifications />
            <Link to="/" className="hidden items-center gap-1.5 rounded-ctl border border-steel-700 px-3 py-2 text-[13px] text-steel-300 hover:text-white sm:flex"><ExternalLink size={15} />سایت</Link>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8"><Outlet /></main>
      </div>
    </div>
  )
}

