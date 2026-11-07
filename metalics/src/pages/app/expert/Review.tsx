import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Check, X, MessageCircleQuestion, MapPin } from 'lucide-react'
import { PageTitle, Card } from '@/components/app/Kit'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PartDrawing } from '@/components/ui/PartDrawing'
import { useToast } from '@/components/ui/Toast'
import { REVIEW_QUEUE } from '@/data/mock'
import { cn, fa } from '@/lib/format'

const PINS = [
  { x: 30, y: 42, t: 'جای خار Ø60: تلرانس عرض خار مشخص نیست', sev: 'mid' },
  { x: 74, y: 38, t: 'پله Ø۷۲ بدون شعاع انتقالی؛ تمرکز تنش در شفت تحت پیچش', sev: 'high' },
  { x: 55, y: 74, t: 'عملیات حرارتی MO40 (کوئنچ و تمپر) در نقشه نیامده', sev: 'high' },
]
const CHECK = ['متریال و استاندارد آن صریح است', 'تلرانس‌های بحرانی مشخص شده‌اند', 'زبری سطح در نواحی یاتاقان آمده است', 'عملیات حرارتی و سختی هدف مشخص است', 'قابل ساخت با شبکه فعلی سازندگان است']

export default function Review() {
  const { id } = useParams()
  const r = REVIEW_QUEUE.find((x) => x.id === id) ?? REVIEW_QUEUE[0]
  const [zoom, setZoom] = useState(1)
  const [pin, setPin] = useState<number | null>(1)
  const [checks, setChecks] = useState<number[]>([0, 4])
  const [risk, setRisk] = useState('MEDIUM')
  const [note, setNote] = useState('لطفاً سختی هدف پس از عملیات حرارتی و شعاع انتقالی پله Ø۷۲ را مشخص کنید.')
  const toast = useToast(); const nav = useNavigate()
  return (
    <>
      <PageTitle title={<span className="flex flex-wrap items-center gap-3">{r.title}<Badge tone="info" dot>TECH_REVIEW</Badge></span>} desc={<><span className="code">{r.id}</span> · {r.file} · {r.process} · {r.material}</>} />
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card title="میز نقشه" actions={<div className="flex gap-1"><Button size="sm" variant="ghost" onClick={() => setZoom((z) => Math.max(1, z - 0.25))} aria-label="کوچک‌نمایی"><ZoomOut size={15} /></Button><span className="grid w-12 place-items-center text-[12px] text-steel-300">{fa(Math.round(zoom * 100))}٪</span><Button size="sm" variant="ghost" onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))} aria-label="بزرگ‌نمایی"><ZoomIn size={15} /></Button></div>} pad={false}>
          <div className="relative aspect-[4/3] overflow-hidden bg-steel-950">
            <div className="blueprint-grid absolute inset-0" />
            <motion.div className="absolute inset-0 p-10" animate={{ scale: zoom }} transition={{ type: 'spring', damping: 25 }}>
              <PartDrawing kind="shaft" />
              {PINS.map((p, i) => (
                <button key={i} onClick={() => setPin(i)} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-label={`یادداشت ${i + 1}`}>
                  <MapPin size={24} className={cn('drop-shadow', p.sev === 'high' ? 'fill-err/30 text-err' : 'fill-warn/30 text-warn', pin === i && 'scale-125')} />
                </button>
              ))}
            </motion.div>
            <div className="absolute bottom-3 right-3 rounded border border-steel-600 bg-steel-900/90 px-2 py-1 text-[11px] text-steel-300">جدول مشخصات پاک‌سازی شد · کارفرما: ٭٭٭٭٭٭</div>
          </div>
          <ul className="divide-y divide-steel-800 border-t border-steel-700">
            {PINS.map((p, i) => (
              <li key={i}><button onClick={() => setPin(i)} className={cn('flex w-full items-start gap-3 px-4 py-3 text-right text-[13.5px]', pin === i ? 'bg-steel-800' : 'hover:bg-steel-800/50')}>
                <span className={cn('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-steel-900', p.sev === 'high' ? 'bg-err' : 'bg-warn')}>{fa(i + 1)}</span>
                <span className="text-steel-100">{p.t}</span><Badge tone="muted" className="mr-auto shrink-0">پیشنهاد AI</Badge>
              </button></li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card title="چک‌لیست بررسی فنی">
            <ul className="space-y-2">
              {CHECK.map((c, i) => (
                <li key={c}><label className="flex cursor-pointer items-center gap-3 text-[14px] text-steel-200">
                  <input type="checkbox" checked={checks.includes(i)} onChange={() => setChecks(checks.includes(i) ? checks.filter((x) => x !== i) : [...checks, i])} className="h-4 w-4 accent-[#3FCF8E]" />{c}
                </label></li>
              ))}
            </ul>
          </Card>
          <Card title="سطح ریسک سفارش">
            <div className="grid grid-cols-3 gap-2">
              {[['LOW', 'پایین', 'ok'], ['MEDIUM', 'متوسط', 'warn'], ['HIGH', 'بالا', 'err']].map(([k, l, t]) => (
                <button key={k} onClick={() => setRisk(k)} className={cn('rounded-ctl border py-2 text-[13px]', risk === k ? (t === 'ok' ? 'border-ok/60 bg-ok/10 text-ok' : t === 'warn' ? 'border-warn/60 bg-warn/10 text-warn' : 'border-err/60 bg-err/10 text-err') : 'border-steel-600 text-steel-300')}>{l}</button>
              ))}
            </div>
            <p className="mt-2 text-[12.5px] text-steel-400">ریسک بالا: QC دقیق اجباری و فقط سازندگان سطح طلایی دعوت می‌شوند.</p>
          </Card>
          <Card title="نظر کارشناس">
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="field h-24" aria-label="نظر کارشناس" />
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Button variant="ok" onClick={() => { toast('تأیید فنی ثبت شد؛ سفارش وارد مناقصه کور شد'); nav('/expert') }}><Check size={16} /> تأیید</Button>
              <Button variant="secondary" onClick={() => toast('پرسش فنی در گفتگوی سفارش برای خریدار ارسال شد', 'info')}><MessageCircleQuestion size={16} /> پرسش</Button>
              <Button variant="danger" onClick={() => { toast('سفارش برای اصلاح نقشه برگشت داده شد', 'warn'); nav('/expert') }}><X size={16} /> برگشت</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
