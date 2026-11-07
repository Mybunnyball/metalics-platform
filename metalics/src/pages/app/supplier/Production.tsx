import { useState } from 'react'
import { GripVertical, Award, Camera, Check, Truck } from 'lucide-react'
import { PageTitle } from '@/components/app/Kit'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { KANBAN } from '@/data/mock'
import { cn, fa } from '@/lib/format'

type Item = { id: string; t: string; q: number; fai?: boolean }
const COLS = Object.keys(KANBAN)
const QC_ITEMS = ['بازرسی ابعادی با کولیس طبق نقشه', 'کنترل ظاهری و رفع پلیسه', 'تطبیق شماره ذوب با MTC', 'عکس از قطعه نهایی (حداقل ۳ زاویه)', 'بسته‌بندی بدون نشان کارگاه']

export default function Production() {
  const [board, setBoard] = useState<Record<string, Item[]>>(KANBAN)
  const [drag, setDrag] = useState<{ id: string; from: string } | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [qc, setQc] = useState<Item | null>(null)
  const [checks, setChecks] = useState<number[]>([])
  const [ship, setShip] = useState<Item | null>(null)
  const toast = useToast()

  const move = (to: string, d = drag) => {
    if (!d || d.from === to) return
    const item = board[d.from].find((x) => x.id === d.id)!
    setBoard({ ...board, [d.from]: board[d.from].filter((x) => x.id !== d.id), [to]: [...board[to], item] })
    toast(`${item.t} → ${to}`, 'info')
    if (to === 'کنترل کیفیت') { setQc(item); setChecks([]) }
    if (to === 'آماده ارسال') setShip(item)
  }

  return (
    <>
      <PageTitle title="خط تولید" desc="کارت‌ها را بین مراحل بکشید. هر جابه‌جایی برای خریدار به‌صورت گزارش پیشرفت (بدون نام کارگاه) ثبت می‌شود." />
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLS.map((c, ci) => (
          <section key={c} onDragOver={(e) => { e.preventDefault(); setOver(c) }} onDragLeave={() => setOver(null)} onDrop={() => { move(c); setOver(null); setDrag(null) }}
            className={cn('flex w-72 shrink-0 flex-col rounded-panel border p-3 transition-colors', over === c ? 'border-heat/60 bg-heat/5' : 'border-steel-700 bg-steel-850/60')}>
            <header className="mb-3 flex items-center justify-between px-1">
              <h2 className="flex items-center gap-2 text-[14px] font-semibold text-white"><span className="text-steel-500">{fa(ci + 1)}</span>{c}</h2>
              <span className="rounded-full bg-steel-700 px-2 text-[12px] text-steel-200">{fa(board[c].length)}</span>
            </header>
            <div className="flex min-h-[140px] flex-1 flex-col gap-2">
              {board[c].map((it) => (
                <article key={it.id} draggable onDragStart={() => setDrag({ id: it.id, from: c })} onDragEnd={() => setDrag(null)}
                  className={cn('cursor-grab rounded-ctl border border-steel-600 bg-steel-800 p-3 shadow-lift transition-transform active:cursor-grabbing', drag?.id === it.id && 'opacity-50')}>
                  <div className="flex items-start gap-2">
                    <GripVertical size={16} className="mt-0.5 shrink-0 text-steel-500" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-medium text-white">{it.t}</div>
                      <div className="code mt-0.5 text-right text-[11.5px] text-steel-400">{it.id}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5"><Badge>{fa(it.q)} عدد</Badge>{it.fai && <Badge tone="temper"><Award size={12} /> FAI</Badge>}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1.5 md:hidden">
                    {ci < COLS.length - 1 && <Button size="sm" variant="secondary" className="w-full" onClick={() => move(COLS[ci + 1], { id: it.id, from: c })}>انتقال به مرحله بعد</Button>}
                  </div>
                </article>
              ))}
              {board[c].length === 0 && <div className="grid flex-1 place-items-center rounded-ctl border border-dashed border-steel-700 text-[12.5px] text-steel-500">کارت را اینجا رها کنید</div>}
            </div>
          </section>
        ))}
      </div>

      <Modal open={!!qc} onClose={() => setQc(null)} title={`چک‌لیست کنترل کیفیت — ${qc?.t ?? ''}`}>
        <ul className="space-y-2">
          {QC_ITEMS.map((x, i) => (
            <li key={x}><label className={cn('flex cursor-pointer items-center gap-3 rounded-ctl border p-3 text-[14px]', checks.includes(i) ? 'border-ok/40 bg-ok/5 text-white' : 'border-steel-700 text-steel-200')}>
              <input type="checkbox" checked={checks.includes(i)} onChange={() => setChecks(checks.includes(i) ? checks.filter((c) => c !== i) : [...checks, i])} className="h-4 w-4 accent-[#3FCF8E]" />{x}
            </label></li>
          ))}
        </ul>
        <div className="mt-4 rounded-ctl border border-dashed border-steel-600 p-4 text-center text-[13px] text-steel-300"><Camera className="mx-auto mb-1 text-steel-400" size={20} />بارگذاری گزارش ابعادی و عکس‌ها</div>
        <Button className="mt-4 w-full" disabled={checks.length < QC_ITEMS.length} onClick={() => { setQc(null); toast('گزارش QC برای بازرس متالیکس ارسال شد') }}><Check size={16} /> ارسال برای تأیید بازرس</Button>
      </Modal>

      <Modal open={!!ship} onClose={() => setShip(null)} title="ثبت اطلاعات حمل">
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setShip(null); toast('اطلاعات حمل ثبت و لینک ردیابی برای راننده پیامک شد') }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label><span className="label">نام راننده</span><input required className="field" /></label>
            <label><span className="label">کد ملی راننده</span><input required className="field ltr text-left" inputMode="numeric" /></label>
            <label><span className="label">موبایل راننده</span><input required className="field ltr text-left" inputMode="tel" /></label>
            <label><span className="label">پلاک کشنده</span><input required className="field" placeholder="۱۳ ع ۴۸۲ | ایران ۲۳" /></label>
          </div>
          <label className="block"><span className="label">شماره بارنامه</span><input required className="field ltr text-left" /></label>
          <div className="rounded-ctl border border-dashed border-steel-600 p-3 text-center text-[13px] text-steel-300">تصویر بارنامه دولتی</div>
          <p className="text-[12.5px] text-steel-400">بار باید بدون اتیکت یا سربرگ کارگاه و با برچسب رهگیری متالیکس ارسال شود.</p>
          <Button type="submit" className="w-full"><Truck size={16} /> ثبت و ارسال لینک ردیابی</Button>
        </form>
      </Modal>
    </>
  )
}
