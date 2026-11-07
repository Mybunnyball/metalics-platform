import { useState } from 'react'
import { Clock, MapPin, Package, Ruler, ShieldCheck, Download, Send, X, Inbox, Gauge, Wallet } from 'lucide-react'
import { PageTitle, Card, Stat } from '@/components/app/Kit'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { PartDrawing } from '@/components/ui/PartDrawing'
import { useToast } from '@/components/ui/Toast'
import { JOB_OFFERS } from '@/data/mock'
import { cn, fa, toman } from '@/lib/format'

type Job = (typeof JOB_OFFERS)[number]

function BidForm({ job, onSent }: { job: Job; onSent: () => void }) {
  const [v, setV] = useState({ material: Math.round(job.est * 0.42), fab: Math.round(job.est * 0.38), qc: 3_500_000, ship: Math.round(job.est * 0.06), days: 16 })
  const total = v.material + v.fab + v.qc + v.ship
  const f = (k: keyof typeof v, l: string) => (
    <label><span className="label">{l}</span><input type="number" value={v[k]} onChange={(e) => setV({ ...v, [k]: +e.target.value })} className="field ltr text-left" /></label>
  )
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSent() }}>
      <div className="grid gap-3 sm:grid-cols-2">{f('material', 'متریال (تومان)')}{f('fab', 'ساخت و ماشین‌کاری (تومان)')}{f('qc', 'بازرسی و گواهی (تومان)')}{f('ship', `حمل تا مقصد · ${fa(job.destKm)} km (تومان)`)}</div>
      <label className="block"><span className="label">زمان ساخت و تحویل (روز کاری)</span><input type="number" value={v.days} onChange={(e) => setV({ ...v, days: +e.target.value })} className="field ltr w-32 text-left" /></label>
      <label className="block"><span className="label">یادداشت فنی برای کارشناس متالیکس</span><textarea className="field h-20" placeholder="مثال: متریال با MTC اکسین در انبار موجود است." /></label>
      <div className="flex items-center justify-between rounded-ctl bg-steel-850 p-4"><span className="text-steel-300">مبلغ خالص دریافتی شما</span><span className="font-display text-[22px] font-bold text-white">{toman(total)}</span></div>
      <p className="text-[12.5px] leading-6 text-steel-400">پرداخت پس از تأیید QC و تحویل از حساب امانی انجام می‌شود. با ارسال پیشنهاد، تعهدات قرارداد ب را می‌پذیرید.</p>
      <Button type="submit" size="lg" className="w-full"><Send size={16} className="-scale-x-100" /> ارسال پیشنهاد کور</Button>
    </form>
  )
}

export default function Jobs() {
  const [open, setOpen] = useState<Job | null>(null)
  const [sent, setSent] = useState<string[]>([])
  const [hidden, setHidden] = useState<string[]>([])
  const toast = useToast()
  return (
    <>
      <PageTitle title="پیشنهادهای کار" desc="سازنده A · SUP-0142 · سفارش‌های متناسب با ماشین‌آلات و ظرفیت آزاد شما" />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="دعوت‌های فعال" value={fa(JOB_OFFERS.length - hidden.length)} icon={<Inbox size={16} />} />
        <Stat label="نرخ برنده‌شدن" value="۳۸٪" hint="۹۰ روز اخیر" accent="ok" />
        <Stat label="امتیاز شما" value="۹۱" hint="سطح طلایی" accent="heat" icon={<Gauge size={16} />} />
        <Stat label="در انتظار تسویه" value="۱۷۲ میلیون" hint="تومان · امانی و تضمین‌شده" icon={<Wallet size={16} />} />
      </div>

      <div className="space-y-4">
        {JOB_OFFERS.filter((j) => !hidden.includes(j.id)).map((j) => {
          const done = sent.includes(j.id)
          return (
            <article key={j.id} className="panel grid gap-5 p-4 md:grid-cols-[220px_1fr_auto] md:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-ctl border border-steel-700 bg-steel-950">
                <div className="blueprint-grid absolute inset-0 opacity-60" />
                <PartDrawing kind={j.thumb} className="relative p-3" />
                <span className="pointer-events-none absolute inset-0 grid place-items-center text-[15px] font-black text-white/[.07] [transform:rotate(-22deg)]">SUP-0142 · METALICS</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2"><h3 className="text-[17px] font-bold text-white">{j.title}</h3>{done ? <Badge tone="ok" dot>پیشنهاد ارسال شد</Badge> : <Badge tone="heat" dot>در انتظار پیشنهاد</Badge>}</div>
                <div className="code mt-0.5 text-right text-[12px] text-steel-400">{j.id}</div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-steel-300">
                  <span className="flex items-center gap-1.5"><Package size={15} />{j.process}</span>
                  <span className="flex items-center gap-1.5"><Ruler size={15} />{j.material} · {j.size}</span>
                  <span>{fa(j.qty)} عدد</span>
                  <span className="flex items-center gap-1.5"><MapPin size={15} />مقصد: {fa(j.destKm)} km (هویت خریدار محفوظ)</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={15} />QC صنعتی + FAI</span>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-2 md:w-48">
                <div className={cn('flex items-center justify-center gap-1.5 rounded-ctl px-3 py-2 text-[13px]', j.deadline < 24 ? 'bg-err/10 text-err' : 'bg-steel-800 text-steel-200')}><Clock size={15} />{fa(j.deadline)} ساعت تا پایان مهلت</div>
                <Button variant="ghost" size="sm" onClick={() => toast('نقشه با واترمارک اختصاصی شما دانلود شد', 'info')}><Download size={15} /> نقشه واترمارک‌دار</Button>
                {!done && <div className="flex gap-2"><Button className="flex-1" onClick={() => setOpen(j)}>ارائه قیمت</Button><Button variant="ghost" aria-label="رد" onClick={() => { setHidden([...hidden, j.id]); toast('دعوت رد شد؛ اثری روی امتیاز شما ندارد', 'info') }}><X size={16} /></Button></div>}
              </div>
            </article>
          )
        })}
      </div>

      <Card title="قوانین مناقصه کور" className="mt-6">
        <ul className="grid gap-2 text-[13.5px] leading-7 text-steel-300 md:grid-cols-2">
          <li>• نام و تماس خریدار تا پایان سفارش نمایش داده نمی‌شود.</li>
          <li>• هرگونه درج شماره یا آدرس در نقشه یا پیام، خودکار حذف و ثبت تخلف می‌شود.</li>
          <li>• قیمت شما با کارمزد متالیکس و مالیات تجمیع و به خریدار نمایش داده می‌شود.</li>
          <li>• رد کردن دعوت اثری روی امتیاز ندارد؛ پاسخ ندادن تا پایان مهلت، اثر جزئی دارد.</li>
        </ul>
      </Card>

      <Modal open={!!open} onClose={() => setOpen(null)} title={`ارائه قیمت — ${open?.title ?? ''}`}>
        {open && <BidForm job={open} onSent={() => { setSent([...sent, open.id]); setOpen(null); toast('پیشنهاد کور شما ثبت شد') }} />}
      </Modal>
    </>
  )
}
