import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, MapPin, Star, Timer, Award, Zap, Coins, Check, ShieldCheck, Lock, FileSignature, Loader2 } from 'lucide-react'
import { PageTitle, Card, Progress } from '@/components/app/Kit'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { PartDrawing } from '@/components/ui/PartDrawing'
import { useToast } from '@/components/ui/Toast'
import { BIDS, type Bid } from '@/data/mock'
import { cn, fa, toman, jdate, daysFromNow } from '@/lib/format'

const BidRadar = lazy(() => import('@/components/charts/Charts').then((m) => ({ default: m.BidRadar })))
const COLORS = ['#F0A23B', '#5BB8EA', '#3FCF8E', '#A78BDA']
const BADGE = { balance: { t: 'بهترین تعادل قیمت و کیفیت', i: Award, tone: 'temper' as const }, fastest: { t: 'سریع‌ترین تحویل', i: Zap, tone: 'info' as const }, cheapest: { t: 'اقتصادی‌ترین', i: Coins, tone: 'ok' as const } }
const VAT = 0.1

function Countdown() {
  const [s, setS] = useState(47 * 3600 + 12 * 60 + 9)
  useEffect(() => { const t = setInterval(() => setS((x) => x - 1), 1000); return () => clearInterval(t) }, [])
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return <span className="code text-[15px] text-white">{[h, m, sec].map((x) => String(x).padStart(2, '0')).join(':')}</span>
}

function PayFlow({ bid, onDone }: { bid: Bid; onDone: () => void }) {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const total = bid.price * (1 + VAT)
  if (step === 2) return (
    <div className="py-4 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ok/15 text-ok"><Lock size={26} /></motion.div>
      <h4 className="mt-4 text-[18px] font-bold text-white">{toman(total)} در حساب امانی قفل شد</h4>
      <p className="mt-2 text-[14px] leading-7 text-steel-300">دستور ساخت برای {bid.alias} صادر شد. این مبلغ تا تأیید نمونه اول و تحویل نهایی آزاد نمی‌شود.</p>
      <Button className="mt-5" onClick={onDone}>مشاهده پیگیری سفارش</Button>
    </div>
  )
  return (
    <div className="space-y-5">
      <ol className="space-y-3">
        {[['قرارداد الف (شما و متالیکس)', 'تحویل طبق نقشه Rev C، تضمین کیفیت، داوری سه‌مرحله‌ای'], ['قرارداد ب (متالیکس و سازنده)', 'به‌طور هم‌زمان و بدون افشای هویت شما امضا می‌شود']].map(([t, d]) => (
          <li key={t} className="flex gap-3 rounded-ctl border border-steel-700 p-3"><FileSignature size={18} className="mt-0.5 shrink-0 text-cut" /><div><div className="text-[14px] text-white">{t}</div><div className="text-[12.5px] text-steel-400">{d}</div></div></li>
        ))}
      </ol>
      <dl className="space-y-2 rounded-ctl bg-steel-850 p-4 text-[14px]">
        <div className="flex justify-between"><dt className="text-steel-400">مبلغ پیشنهاد (با حمل و QC)</dt><dd>{toman(bid.price)}</dd></div>
        <div className="flex justify-between"><dt className="text-steel-400">مالیات بر ارزش افزوده ۱۰٪</dt><dd>{toman(bid.price * VAT)}</dd></div>
        <div className="flex justify-between border-t border-steel-700 pt-2 font-semibold"><dt>قابل پرداخت به اسکرو</dt><dd className="text-heat">{toman(total)}</dd></div>
      </dl>
      <div className="grid grid-cols-2 gap-2 text-[13px]">
        <button className="rounded-ctl border border-heat/60 bg-heat/10 p-3 text-white">درگاه شاپرک</button>
        <button className="rounded-ctl border border-steel-600 p-3 text-steel-300">شناسه واریز بانکی</button>
      </div>
      <Button size="lg" className="w-full" disabled={step === 1} onClick={() => { setStep(1); setTimeout(() => setStep(2), 1600) }}>
        {step === 1 ? <><Loader2 size={18} className="animate-spin" /> در حال اتصال به درگاه…</> : <><ShieldCheck size={18} /> امضای قرارداد و پرداخت امانی</>}
      </Button>
    </div>
  )
}

export default function RfqCompare() {
  const [sort, setSort] = useState<'score' | 'price' | 'lead'>('score')
  const [pick, setPick] = useState<Bid | null>(null)
  const nav = useNavigate(); const toast = useToast()
  const bids = useMemo(() => [...BIDS].sort((a, b) => (sort === 'price' ? a.price - b.price : sort === 'lead' ? a.leadDays - b.leadDays : b.score - a.score)), [sort])
  const minP = Math.min(...BIDS.map((b) => b.price)), maxP = Math.max(...BIDS.map((b) => b.price))
  const radar = ['کیفیت', 'تحویل به‌موقع', 'دقت تلرانسی', 'قیمت', 'سرعت'].map((axis) => {
    const r: Record<string, string | number> = { axis }
    BIDS.forEach((b) => (r[b.alias] = axis === 'کیفیت' ? b.quality : axis === 'تحویل به‌موقع' ? b.onTime : axis === 'دقت تلرانسی' ? b.tolerance : axis === 'قیمت' ? Math.round(100 - ((b.price - minP) / (maxP - minP)) * 40) : Math.round(100 - (b.leadDays - 10) * 3)))
    return r
  })

  return (
    <>
      <PageTitle title="مقایسه پیشنهادهای مناقصه کور" desc={<>براکت نگهدارنده نوار نقاله · ۳۲۰ عدد · ST37 t=8 · <span className="code">MTX-1405-4855</span></>}
        actions={<div className="flex items-center gap-2 rounded-ctl border border-steel-700 px-3 py-2 text-[13px] text-steel-300"><Clock size={15} className="text-heat" /> اعتبار پیشنهادها <Countdown /></div>} />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13.5px] text-steel-300">نام، آدرس و تماس سازندگان مخفی است. قیمت‌ها شامل متریال، ساخت، QC، حمل تا سیرجان و خدمات متالیکس است.</p>
        <Tabs className="sm:w-80" value={sort} onChange={setSort} items={[{ id: 'score', label: 'پیشنهاد متالیکس' }, { id: 'price', label: 'ارزان‌ترین' }, { id: 'lead', label: 'سریع‌ترین' }]} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {bids.map((b, i) => {
          const badge = b.badge ? BADGE[b.badge] : null
          return (
            <motion.article layout key={b.alias} transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className={cn('relative flex flex-col rounded-panel border p-5', b.badge === 'balance' ? 'temper-border' : 'border-steel-700 bg-steel-850')}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full font-brand text-[15px] font-bold text-steel-900 ltr" style={{ background: COLORS[BIDS.indexOf(b)] }}>{b.alias.slice(-1)}</span>
                  <div><div className="font-semibold text-white">{b.alias}</div><div className="flex items-center gap-1 text-[12.5px] text-steel-400"><MapPin size={12} />{b.city} · {fa(b.km)} km تا پروژه</div></div>
                </div>
                {i === 0 && sort === 'score' && <span className="text-[11px] text-steel-400">رتبه ۱</span>}
              </div>
              {badge && <Badge tone={badge.tone} className="mt-4 w-fit"><badge.i size={13} />{badge.t}</Badge>}
              <div className="mt-4"><div className="font-display text-[26px] font-black text-white">{fa(b.price / 1e6)} <span className="text-[14px] font-normal text-steel-400">میلیون تومان</span></div>
                <div className="text-[12.5px] text-steel-400">هر عدد {toman(Math.round(b.price / 320 / 100) * 100)} · بدون مالیات</div></div>
              <dl className="mt-4 space-y-2.5 text-[13px]">
                <div className="flex items-center justify-between"><dt className="flex items-center gap-1.5 text-steel-400"><Timer size={14} />زمان ساخت و تحویل</dt><dd className="text-white">{fa(b.leadDays)} روز · {jdate(daysFromNow(b.leadDays + 2))}</dd></div>
                <div><div className="mb-1 flex justify-between"><dt className="flex items-center gap-1.5 text-steel-400"><Star size={14} />امتیاز کیفی</dt><dd className="text-white">{fa(b.quality)}</dd></div><Progress value={b.quality} tone="ok" /></div>
                <div><div className="mb-1 flex justify-between"><dt className="text-steel-400">تحویل به‌موقع</dt><dd className="text-white">{fa(b.onTime)}٪</dd></div><Progress value={b.onTime} tone="cut" /></div>
                <div className="flex justify-between"><dt className="text-steel-400">سوابق تکمیل‌شده</dt><dd>{fa(b.completed)} سفارش</dd></div>
                <div className="flex justify-between"><dt className="text-steel-400">نمونه اول (FAI)</dt><dd>{b.fai ? <Check size={15} className="text-ok" /> : <span className="text-warn">ندارد</span>}</dd></div>
              </dl>
              <p className="mt-4 rounded-ctl bg-steel-900/60 p-3 text-[12.5px] leading-6 text-steel-300">{b.machines}<br />{b.note}</p>
              <Button className="mt-5" variant={b.badge === 'balance' ? 'primary' : 'secondary'} onClick={() => setPick(b)}>انتخاب {b.alias}</Button>
            </motion.article>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card title="نمای راداری شاخص‌ها"><Suspense fallback={<div className="h-72" />}><BidRadar data={radar} keys={BIDS.map((b, i) => ({ k: b.alias, c: COLORS[i] }))} /></Suspense></Card>
        <Card title="مشورت هوشمند متالیکس">
          <div className="flex gap-4">
            <div className="blueprint-grid h-24 w-28 shrink-0 rounded-ctl border border-steel-700 p-2"><PartDrawing kind="bracket" /></div>
            <div className="space-y-3 text-[14px] leading-7 text-steel-200">
              <p><b className="text-white">سازنده A</b> با ۷٪ قیمت بیشتر از ارزان‌ترین گزینه، ۶ روز زودتر تحویل می‌دهد و کیفیت ۸ امتیاز بالاتری دارد. ریسک توقف خط شما را کمتر می‌کند.</p>
              <p><b className="text-white">سازنده C</b> نزدیک‌ترین کارگاه به پروژه است؛ اگر زمان مهم‌ترین معیار است، انتخاب مناسبی است.</p>
              <p className="text-[12.5px] text-steel-400">نشان‌ها فقط پیشنهاد هستند. تصمیم نهایی کاملاً با شماست.</p>
            </div>
          </div>
        </Card>
      </div>

      <Modal open={!!pick} onClose={() => setPick(null)} title={`انتخاب ${pick?.alias ?? ''} و پرداخت امانی`}>
        {pick && <PayFlow bid={pick} onDone={() => { setPick(null); toast('سفارش وارد مرحله ساخت شد'); nav('/app/orders/MTX-1405-4821') }} />}
      </Modal>
    </>
  )
}
