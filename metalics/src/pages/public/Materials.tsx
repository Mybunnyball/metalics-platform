import { useMemo, useState } from 'react'
import { Search, X, GitCompareArrows } from 'lucide-react'
import { PageHero } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { MATERIALS, type Material } from '@/data/catalog'
import { cn, fa } from '@/lib/format'

const FAMILIES = ['همه', ...Array.from(new Set(MATERIALS.map((m) => m.family)))]

function Bar({ v, max, tone }: { v: number; max: number; tone: string }) {
  return <div className="h-1.5 w-full rounded-full bg-steel-700"><div className={cn('h-full rounded-full', tone)} style={{ width: `${(v / max) * 100}%` }} /></div>
}

export default function Materials() {
  const [q, setQ] = useState('')
  const [fam, setFam] = useState('همه')
  const [sel, setSel] = useState<string[]>(['st37', 'st52'])
  const list = useMemo(() => MATERIALS.filter((m) => (fam === 'همه' || m.family === fam) && (m.name + m.equivalent + m.uses + m.standard).toLowerCase().includes(q.toLowerCase())), [q, fam])
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 3 ? [...s.slice(1), id] : [...s, id]))
  const compare = sel.map((id) => MATERIALS.find((m) => m.id === id)!) as Material[]
  const maxT = Math.max(...MATERIALS.map((m) => m.tensile))

  return (
    <>
      <PageHero title="کتابخانه متریال" desc="گریدهای پرکاربرد صنعتی با معادل بین‌المللی، خواص مکانیکی و منبع گواهی MTC. تا سه متریال را برای مقایسه انتخاب کنید." />
      <section className="container-x py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-steel-400" size={17} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجو: ST52، 4140، استنلس، لاینر…" className="field pr-10" aria-label="جستجوی متریال" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {FAMILIES.map((f) => (
              <button key={f} onClick={() => setFam(f)} className={cn('shrink-0 rounded-full border px-3 py-1.5 text-[13px]', fam === f ? 'border-heat/60 bg-heat/10 text-white' : 'border-steel-700 text-steel-300 hover:text-white')}>{f}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-panel border border-steel-700">
          <table className="w-full min-w-[900px] text-[14px]">
            <thead className="bg-steel-850 text-[12.5px] text-steel-400">
              <tr>{['مقایسه', 'گرید', 'خانواده', 'معادل', 'استحکام کششی (MPa)', 'سختی', 'جوش‌پذیری', 'محدوده ضخامت/قطر', 'کاربرد'].map((h) => <th key={h} className="px-4 py-3 text-right font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {list.map((m) => (
                <tr key={m.id} className={cn('border-t border-steel-800 transition-colors', sel.includes(m.id) ? 'bg-heat/5' : 'hover:bg-steel-850')}>
                  <td className="px-4 py-3"><input type="checkbox" checked={sel.includes(m.id)} onChange={() => toggle(m.id)} className="h-4 w-4 accent-[#F0A23B]" aria-label={`انتخاب ${m.name} برای مقایسه`} /></td>
                  <td className="px-4 py-3 font-semibold text-white">{m.name}</td>
                  <td className="px-4 py-3 text-steel-300">{m.family}</td>
                  <td className="code px-4 py-3 text-right text-cut">{m.equivalent}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><span className="w-12">{fa(m.tensile)}</span><div className="w-24"><Bar v={m.tensile} max={maxT} tone="bg-cut" /></div></div></td>
                  <td className="px-4 py-3 text-steel-200">{m.hardness}</td>
                  <td className="px-4 py-3 text-steel-200">{m.weldability}</td>
                  <td className="px-4 py-3 text-steel-300">{m.thickness} mm</td>
                  <td className="max-w-[240px] truncate px-4 py-3 text-steel-300" title={m.uses}>{m.uses}</td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-steel-300">متریالی با این مشخصات پیدا نشد. فیلتر خانواده را روی «همه» بگذارید.</td></tr>}
            </tbody>
          </table>
        </div>

        {compare.length > 0 && (
          <div className="mt-10">
            <div className="mb-4 flex items-center gap-2"><GitCompareArrows className="text-heat" size={20} /><h2 className="text-[20px] font-bold text-white">مقایسه کنار هم</h2></div>
            <div className={cn('grid gap-4', compare.length === 3 ? 'md:grid-cols-3' : compare.length === 2 ? 'md:grid-cols-2' : '')}>
              {compare.map((m) => (
                <div key={m.id} className="panel-raised p-5">
                  <div className="flex items-start justify-between">
                    <div><h3 className="text-[22px] font-bold text-white">{m.name}</h3><div className="code mt-1 text-right text-cut">{m.standard} · {m.equivalent}</div></div>
                    <button onClick={() => toggle(m.id)} className="rounded-lg p-1 text-steel-400 hover:bg-steel-700 hover:text-white" aria-label="حذف از مقایسه"><X size={16} /></button>
                  </div>
                  <div className="mt-5 space-y-4 text-[13.5px]">
                    <div><div className="mb-1.5 flex justify-between text-steel-300"><span>استحکام کششی</span><span className="text-white">{fa(m.tensile)} MPa</span></div><Bar v={m.tensile} max={maxT} tone="bg-cut" /></div>
                    <div><div className="mb-1.5 flex justify-between text-steel-300"><span>استحکام تسلیم</span><span className="text-white">{fa(m.yield)} MPa</span></div><Bar v={m.yield} max={1200} tone="bg-temper-violet" /></div>
                    <div><div className="mb-1.5 flex justify-between text-steel-300"><span>سختی ماشین‌کاری (نسبی)</span><span className="text-white">{fa(m.machinability)}×</span></div><Bar v={m.machinability} max={1.6} tone="bg-heat" /></div>
                  </div>
                  <dl className="mt-5 space-y-2 border-t border-steel-700 pt-4 text-[13.5px]">
                    <div className="flex justify-between"><dt className="text-steel-400">جوش‌پذیری</dt><dd>{m.weldability}</dd></div>
                    <div className="flex justify-between"><dt className="text-steel-400">منبع MTC</dt><dd>{m.mtc}</dd></div>
                    <div><dt className="text-steel-400">کاربرد</dt><dd className="mt-1 leading-7">{m.uses}</dd></div>
                  </dl>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12.5px] text-steel-400">اعداد مقادیر حداقل استاندارد هستند. برای سفارش‌های حساس، گواهی MTC 3.1 و آنالیز کوانتومتری را در فرم سفارش فعال کنید.</p>
            <Button to="/quote" className="mt-6">سفارش با این متریال</Button>
          </div>
        )}
      </section>
    </>
  )
}
