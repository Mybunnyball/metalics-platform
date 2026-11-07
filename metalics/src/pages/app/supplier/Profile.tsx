import { Gauge, Cpu, Warehouse, BadgeCheck } from 'lucide-react'
import { PageTitle, Card, Progress, Th, Td } from '@/components/app/Kit'
import { Badge } from '@/components/ui/Badge'
import { supplierScore } from '@/lib/scoring'
import { cn, fa } from '@/lib/format'

const MACHINES = [
  { t: 'لیزر فایبر', s: '۱۲ کیلووات · میز ۳×۱۲ متر', tol: '±۰٫۱ mm', load: 72 },
  { t: 'پرس‌برک CNC', s: '۲۲۰ تن · طول ۴ متر · ۴+۱ محور', tol: '±۰٫۵°', load: 55 },
  { t: 'جوش MIG/MAG رباتیک', s: '۲ ایستگاه · WPS تأییدشده', tol: 'AWS D1.1', load: 38 },
  { t: 'فرز CNC سه‌محور', s: '۱۲۰۰ × ۶۰۰ × ۵۰۰ mm', tol: '±۰٫۰۲ mm', load: 81 },
]
const STOCK = [['ST37', '۳ تا ۲۰ mm', '۴۲ تن', 'اکسین'], ['ST52', '۸ تا ۳۰ mm', '۱۸ تن', 'فولاد مبارکه'], ['استنلس ۳۰۴', '۱ تا ۶ mm', '۲٫۵ تن', 'POSCO'], ['Hardox 450', '۱۰ تا ۲۰ mm', '۴ تن', 'SSAB']]
const PARTS = { quality: 94, delivery: 95, price: 82, capacity: 88, risk: 0 }

export default function Profile() {
  const score = supplierScore(PARTS)
  const days = Array.from({ length: 28 }, (_, i) => [72, 85, 90, 60, 40, 0, 0][i % 7] - (i > 14 ? 25 : 0))
  return (
    <>
      <PageTitle title="ماشین‌آلات، ظرفیت و امتیاز" desc="این اطلاعات توسط کارشناس متالیکس احراز شده و مبنای ارسال دعوت‌نامه‌های مناقصه است." />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <Card title={<span className="flex items-center gap-2"><Gauge size={16} />امتیاز سازنده</span>} className="temper-border">
          <div className="flex items-center gap-6">
            <div className="font-display text-[64px] font-black leading-none temper-text">{fa(score)}</div>
            <div><Badge tone="temper">سطح طلایی</Badge><p className="mt-2 text-[13px] leading-6 text-steel-300">اولویت در دعوت به مناقصه‌ها و تسویه سریع‌تر</p></div>
          </div>
          <div className="mt-6 space-y-4">
            {[['کیفیت', PARTS.quality, '۳۰٪'], ['تحویل به‌موقع', PARTS.delivery, '۲۵٪'], ['قیمت رقابتی', PARTS.price, '۲۰٪'], ['ظرفیت و تنوع', PARTS.capacity, '۲۵٪']].map(([l, v, w]) => (
              <div key={l as string}><div className="mb-1.5 flex justify-between text-[13px]"><span className="text-steel-300">{l} <span className="text-steel-500">· وزن {w}</span></span><span className="text-white">{fa(v as number)}</span></div><Progress value={v as number} tone="temper" /></div>
            ))}
            <div className="flex justify-between text-[13px]"><span className="text-steel-300">جریمه ریسک</span><span className="text-ok">بدون تخلف</span></div>
          </div>
        </Card>
        <Card title={<span className="flex items-center gap-2"><Cpu size={16} />ماشین‌آلات احرازشده</span>} pad={false}>
          <ul className="divide-y divide-steel-800">
            {MACHINES.map((m) => (
              <li key={m.t} className="grid gap-2 px-4 py-3.5 sm:grid-cols-[1fr_140px] sm:items-center">
                <div><div className="flex items-center gap-2 font-medium text-white">{m.t}<BadgeCheck size={15} className="text-cut" /></div><div className="text-[12.5px] text-steel-400">{m.s} · دقت {m.tol}</div></div>
                <div><div className="mb-1 flex justify-between text-[12px] text-steel-400"><span>بار هفته جاری</span><span>{fa(m.load)}٪</span></div><Progress value={m.load} tone={m.load > 80 ? 'heat' : 'ok'} /></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="تقویم ظرفیت ۴ هفته آینده">
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] text-steel-400">
            {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((d) => <div key={d}>{d}</div>)}
            {days.map((v, i) => (
              <div key={i} title={`${fa(Math.max(0, v))}٪ رزرو`} className={cn('aspect-square rounded-md', v <= 0 ? 'bg-steel-800' : v > 80 ? 'bg-heat/80' : v > 55 ? 'bg-heat/45' : 'bg-heat/20')} />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 text-[12px] text-steel-400"><span>کم</span><div className="flex gap-1">{['bg-steel-800', 'bg-heat/20', 'bg-heat/45', 'bg-heat/80'].map((c) => <span key={c} className={cn('h-3 w-5 rounded', c)} />)}</div><span>پر</span></div>
        </Card>
        <Card title={<span className="flex items-center gap-2"><Warehouse size={16} />موجودی متریال با MTC</span>} pad={false}>
          <div className="overflow-x-auto"><table className="w-full min-w-[420px]"><thead className="border-b border-steel-700"><tr><Th>گرید</Th><Th>محدوده ضخامت</Th><Th>موجودی</Th><Th>منبع</Th></tr></thead>
            <tbody className="divide-y divide-steel-800">{STOCK.map((r) => <tr key={r[0]}>{r.map((c, i) => <Td key={i} className={i === 0 ? 'font-medium text-white' : 'text-steel-300'}>{c}</Td>)}</tr>)}</tbody></table></div>
        </Card>
      </div>
    </>
  )
}
