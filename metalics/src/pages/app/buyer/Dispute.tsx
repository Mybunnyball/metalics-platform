import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScanEye, UserCheck, Video, Lock, Bot, Check, Building2, Factory, CalendarClock, Gavel, FileDiff } from 'lucide-react'
import { PageTitle, Card } from '@/components/app/Kit'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { DISPUTE } from '@/data/mock'
import { cn, fa, toman, jdate } from '@/lib/format'

const GATES = [
  { i: ScanEye, t: 'غربالگری هوشمند', d: 'پرونده فنی در ۱۴ ساعت تشکیل شد' },
  { i: UserCheck, t: 'ارزیابی کارشناس', d: 'در حال بررسی · مهندس کیان صدری' },
  { i: Video, t: 'جلسه سه‌جانبه', d: 'پنجشنبه ساعت ۱۱:۰۰' },
]

const VERDICTS = [
  { id: 'REJECT', t: 'رد ادعا', d: 'آزادسازی کامل اسکرو به نفع سازنده' },
  { id: 'PARTIAL', t: 'پذیرش جزئی', d: 'اصلاح سوراخ‌ها با هزینه مشترک' },
  { id: 'REMAKE', t: 'ساخت مجدد', d: 'سازنده موظف به ساخت دوباره' },
  { id: 'REFUND', t: 'استرداد کامل', d: 'بازگشت وجه به خریدار' },
]

function Rev({ rev, val, hl }: { rev: string; val: string; hl?: boolean }) {
  return (
    <div className={cn('rounded-ctl border p-3', hl ? 'border-heat/50 bg-heat/5' : 'border-steel-700 bg-steel-900/50')}>
      <div className="mb-2 flex items-center justify-between text-[12.5px]"><span className="code text-steel-300">Rev {rev}</span>{hl && <Badge tone="heat">نسخه دریافتی سازنده</Badge>}</div>
      <svg viewBox="0 0 220 110" className="w-full">
        <g fill="none" stroke="#BCC8D4" strokeWidth="1.2"><rect x="20" y="15" width="180" height="60" /><circle cx="60" cy="45" r="5" /><circle cx={rev === 'B' ? 168 : 160} cy="45" r="5" /></g>
        <g stroke="#5BB8EA" strokeWidth=".8" fill="#5BB8EA"><line x1="60" y1="92" x2={rev === 'B' ? 168 : 160} y2="92" /><text x={rev === 'B' ? 114 : 110} y="88" fontSize="10" textAnchor="middle" stroke="none" fontFamily="JetBrains Mono Variable">{val}</text></g>
      </svg>
    </div>
  )
}

export default function Dispute() {
  const [verdict, setVerdict] = useState<string | null>(null)
  const [issued, setIssued] = useState(false)
  const toast = useToast()
  return (
    <>
      <PageTitle title={<span className="flex flex-wrap items-center gap-3">پرونده داوری <span className="code text-[18px] text-steel-300">{DISPUTE.id}</span><Badge tone="err" dot>در حال بررسی</Badge></span>}
        desc={`${DISPUTE.title} · سفارش ${DISPUTE.order} · گشایش ${jdate(DISPUTE.opened)}`} />

      <div className="grid gap-3 sm:grid-cols-3">
        {GATES.map((g, i) => {
          const st = i + 1 < DISPUTE.gate ? 'done' : i + 1 === DISPUTE.gate ? 'now' : 'next'
          return (
            <div key={g.t} className={cn('relative overflow-hidden rounded-panel border p-4', st === 'now' ? 'border-heat/50 bg-heat/5' : 'border-steel-700 bg-steel-850')}>
              {st === 'now' && <motion.div className="absolute inset-x-0 bottom-0 h-0.5 bg-heat" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2 }} style={{ transformOrigin: 'right' }} />}
              <div className="flex items-center gap-3">
                <span className={cn('grid h-9 w-9 place-items-center rounded-full', st === 'done' ? 'bg-ok/15 text-ok' : st === 'now' ? 'bg-heat/15 text-heat' : 'bg-steel-700 text-steel-400')}>{st === 'done' ? <Check size={18} /> : <g.i size={18} />}</span>
                <div><div className="text-[12px] text-steel-400">گام {fa(i + 1)}</div><div className="font-semibold text-white">{g.t}</div></div>
              </div>
              <p className="mt-2 text-[13px] text-steel-300">{g.d}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card title={<span className="flex items-center gap-2"><Building2 size={16} className="text-heat" />ادعای خریدار</span>}><p className="text-[14px] leading-7 text-steel-200">{DISPUTE.claim}</p><p className="mt-3 text-[12.5px] text-steel-400">۴ تصویر با متر لیزری و کولیس · خواسته: ساخت مجدد</p></Card>
            <Card title={<span className="flex items-center gap-2"><Factory size={16} className="text-cut" />پاسخ سازنده C</span>}><p className="text-[14px] leading-7 text-steel-200">{DISPUTE.supplierReply}</p><p className="mt-3 text-[12.5px] text-steel-400">پیوست: نقشه دانلودشده از پنل با واترمارک SUP-0203</p></Card>
          </div>
          <Card title={<span className="flex items-center gap-2"><FileDiff size={16} />مقایسه نسخه‌های نقشه</span>}>
            <div className="grid gap-3 sm:grid-cols-2"><Rev rev="B" val="408" hl /><Rev rev="C" val="400 ±1" /></div>
          </Card>
          <Card title={<span className="flex items-center gap-2"><Bot size={16} className="text-temper-straw" />ارزیابی ایجنت غربالگری</span>} className="temper-border">
            <ul className="space-y-2.5 text-[14px] leading-7 text-steel-200">
              <li>• فاصله اندازه‌گیری‌شده ۴۰۸ mm با نسخه B نقشه (بارگذاری ۵ مهر) دقیقاً منطبق است.</li>
              <li>• نسخه C در ۱۸ مهر، <b className="text-white">پس از</b> امضای قرارداد ب و شروع ساخت، توسط خریدار بارگذاری شده و درخواست تغییر رسمی ثبت نشده است.</li>
              <li>• کیفیت جوش و سایر ابعاد در تصاویر مطابق نقشه است.</li>
            </ul>
            <div className="mt-4 rounded-ctl bg-steel-900/70 p-3 text-[13px] text-steel-300">پیشنهاد غیرالزام‌آور: منشأ مغایرت <b className="text-white">تغییر نقشه از سوی خریدار</b> است. اصلاح سوراخ‌ها (۲ ساعت کار) با هزینه خریدار.</div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="وضعیت مالی پرونده">
            <div className="flex items-center gap-3"><Lock className="text-heat" size={22} /><div><div className="font-display text-[22px] font-bold text-white">{toman(DISPUTE.held)}</div><div className="text-[12.5px] text-steel-400">تا صدور رأی در اسکرو مسدود است</div></div></div>
          </Card>
          <Card title="جلسه داوری سه‌جانبه">
            <div className="flex items-center gap-3 text-[14px]"><CalendarClock size={18} className="text-cut" /><span className="text-white">پنجشنبه ۲۱ آبان · ۱۱:۰۰</span></div>
            <p className="mt-2 text-[13px] leading-6 text-steel-300">در محیط اختصاصی متالیکس، با صدای کنترل‌شده و بدون نمایش نام یا تصویر طرفین.</p>
            <Button variant="secondary" className="mt-4 w-full" onClick={() => toast('یادآوری جلسه برای شما فعال شد', 'info')}>افزودن به تقویم</Button>
          </Card>
          <Card title={<span className="flex items-center gap-2"><Gavel size={16} />صدور رأی (کارشناس ارشد)</span>}>
            {issued ? (
              <div className="text-center"><div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-ok/15 text-ok"><Check /></div><p className="mt-3 font-semibold text-white">رأی صادر شد: {VERDICTS.find((v) => v.id === verdict)?.t}</p><p className="mt-1 text-[13px] text-steel-400">اثر آن روی اسکرو در صف تأیید چهارچشمی قرار گرفت.</p></div>
            ) : (<>
              <div className="space-y-2">
                {VERDICTS.map((v) => (
                  <label key={v.id} className={cn('flex cursor-pointer items-start gap-3 rounded-ctl border p-3', verdict === v.id ? 'border-heat/60 bg-heat/10' : 'border-steel-700')}>
                    <input type="radio" name="v" checked={verdict === v.id} onChange={() => setVerdict(v.id)} className="mt-1.5 accent-[#F0A23B]" />
                    <span><span className="block text-[14px] text-white">{v.t}</span><span className="text-[12.5px] text-steel-400">{v.d}</span></span>
                  </label>
                ))}
              </div>
              <Button className="mt-4 w-full" disabled={!verdict} onClick={() => { setIssued(true); toast('رأی داوری صادر شد') }}>صدور رأی نهایی</Button>
            </>)}
          </Card>
        </div>
      </div>
    </>
  )
}
