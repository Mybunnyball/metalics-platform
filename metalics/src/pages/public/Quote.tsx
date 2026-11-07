import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import {
  Upload, FileCheck2, Check, Loader2, AlertTriangle, Sparkles, Box, PenTool, ChevronLeft, ChevronRight, Bot, Info,
  Zap, Gavel, Copy, ShieldCheck, Truck, CalendarDays,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PartDrawing } from '@/components/ui/PartDrawing'
import { Icon } from '@/components/layout/Icon'
import { useToast } from '@/components/ui/Toast'
import { Nesting } from '@/components/quote/Nesting'
import { SAMPLE, PIPELINE, guessKind, type Analysis } from '@/components/quote/analysis'
import { meshVolume } from '@/components/three/geometry'
import { MATERIALS, PROCESSES, QC_TIERS, FINISHES, CERTS } from '@/data/catalog'
import { priceQuote, biddingWindowHours, CITY_DISTANCE, type QuoteInput } from '@/lib/pricing'
import { cn, fa, toman, jdate, daysFromNow, trackingCode } from '@/lib/format'

const MetalScene = lazy(() => import('@/components/three/MetalScene'))

const STEPS = ['فایل نقشه', 'مشخصات ساخت', 'تحلیل هوشمند', 'کیفیت و گواهی', 'تحویل', 'بازبینی و ثبت']

/* ======================= گام ۱: بارگذاری و تحلیل ======================= */
function UploadStep({ analysis, setAnalysis, setGeo, initial }: { analysis: Analysis | null; setAnalysis: (a: Analysis) => void; setGeo: (g?: THREE.BufferGeometry) => void; initial?: File | 'sample' }) {
  const [busy, setBusy] = useState<string | null>(null)
  const [stage, setStage] = useState(0)
  const [over, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  const run = useCallback(async (file?: File) => {
    const name = file?.name ?? 'conveyor-bracket-rev3.dxf'
    const ext = (name.split('.').pop() || '').toUpperCase()
    setBusy(name); setStage(0)
    let real: Partial<Analysis> = {}
    let geo: THREE.BufferGeometry | undefined
    if (file && ext === 'STL') {
      try {
        const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader.js')
        geo = new STLLoader().parse(await file.arrayBuffer())
        geo.computeBoundingBox(); geo.computeVertexNormals()
        const s = new THREE.Vector3(); geo.boundingBox!.getSize(s)
        const dims = [s.x, s.y, s.z].map((v) => Math.round(v)).sort((a, b) => b - a) as [number, number, number]
        const vol = meshVolume(geo) / 1000
        real = { real: true, dims, thickness: Math.max(1, Math.round(dims[2])), areaM2: (dims[0] * dims[1]) / 1e6, triangles: geo.attributes.position.count / 3, volumeCm3: vol, cutLengthM: (2 * (dims[0] + dims[1])) / 1000, holes: 0, bends: 0 }
      } catch { /* اگر STL خراب بود، به حالت نمایشی برمی‌گردیم */ }
    }
    for (let i = 0; i < PIPELINE.length; i++) { setStage(i); await new Promise((r) => setTimeout(r, 520)) }
    const kind = guessKind(name)
    setGeo(geo)
    setAnalysis({ ...SAMPLE[kind], fileName: name, ext, real: false, titleBlockRemoved: 'شرکت فرآوری معدنی کویر سپاهان', layers: ext === 'DXF' || ext === 'DWG' ? ['CUT', 'BEND', 'DIM', 'TEXT', 'TITLE'] : ['BODY'], ...real })
    setBusy(null)
  }, [setAnalysis, setGeo])

  const started = useRef(false)
  useEffect(() => { if (initial && !started.current && !analysis) { started.current = true; run(initial === 'sample' ? undefined : initial) } }, [initial, analysis, run])

  if (busy) return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
      <div className="panel blueprint-grid relative aspect-[4/3] overflow-hidden p-6">
        <PartDrawing kind={guessKind(busy)} className="opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-cut/25 to-transparent" />
      </div>
      <div>
        <div className="mb-4 flex items-center gap-2 text-sm"><FileCheck2 size={18} className="text-cut" /><span className="code text-white">{busy}</span></div>
        <ol className="space-y-3">
          {PIPELINE.map((p, i) => (
            <li key={p} className={cn('flex items-center gap-3 text-[14px] transition-colors', i < stage ? 'text-steel-300' : i === stage ? 'text-white' : 'text-steel-500')}>
              {i < stage ? <Check size={17} className="text-ok" /> : i === stage ? <Loader2 size={17} className="animate-spin text-heat" /> : <span className="h-[17px] w-[17px] rounded-full border border-steel-600" />}
              {p}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )

  if (analysis) return <AnalysisView a={analysis} onReplace={() => input.current?.click()} inputEl={<input ref={input} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && run(e.target.files[0])} />} />

  return (
    <div onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); e.dataTransfer.files[0] && run(e.dataTransfer.files[0]) }}
      className={cn('grid place-items-center rounded-panel border-2 border-dashed px-6 py-16 text-center transition-colors', over ? 'border-heat bg-heat/5' : 'border-steel-600 bg-steel-850/50')}>
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-heat/15 text-heat"><Upload size={28} /></div>
      <h3 className="mt-5 text-[20px] font-bold text-white">فایل نقشه یا مدل سه‌بعدی را رها کنید</h3>
      <p className="mt-2 max-w-md text-[14px] leading-7 text-steel-300">نقشه‌های دوبعدی اتوکد هم پذیرفته می‌شوند. اگر فایل STL بارگذاری کنید، ابعاد و حجم واقعی آن همین‌جا محاسبه و سه‌بعدی نمایش داده می‌شود.</p>
      <p className="code mt-3 text-steel-400">DWG · DXF · STEP · STP · IGES · STL · PDF</p>
      <input ref={input} type="file" className="hidden" accept=".dwg,.dxf,.step,.stp,.stl,.pdf,.iges,.igs" onChange={(e) => e.target.files?.[0] && run(e.target.files[0])} />
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={() => input.current?.click()}><Upload size={16} /> انتخاب فایل</Button>
        <Button variant="secondary" onClick={() => run()}>استفاده از نقشه نمونه</Button>
      </div>
    </div>
  )
}

function AnalysisView({ a, onReplace, inputEl }: { a: Analysis; onReplace: () => void; inputEl: React.ReactNode }) {
  const [view, setView] = useState<'3d' | '2d'>('3d')
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2"><FileCheck2 size={18} className="text-ok" /><span className="code text-white">{a.fileName}</span><Badge tone={a.real ? 'ok' : 'info'}>{a.real ? 'تحلیل واقعی هندسه' : 'تحلیل نمایشی'}</Badge></div>
        <div className="flex gap-2">
          <div className="flex rounded-ctl border border-steel-600 p-0.5 text-[13px]">
            <button onClick={() => setView('3d')} className={cn('flex items-center gap-1 rounded-lg px-2.5 py-1', view === '3d' ? 'bg-steel-600 text-white' : 'text-steel-300')}><Box size={14} /> سه‌بعدی</button>
            <button onClick={() => setView('2d')} className={cn('flex items-center gap-1 rounded-lg px-2.5 py-1', view === '2d' ? 'bg-steel-600 text-white' : 'text-steel-300')}><PenTool size={14} /> نقشه</button>
          </div>
          <Button variant="ghost" size="sm" onClick={onReplace}>تعویض فایل</Button>{inputEl}
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
        <div className="panel relative aspect-[4/3] overflow-hidden">
          <div className="blueprint-grid absolute inset-0 opacity-70" />
          {view === '3d' ? <ViewerSlot kind={a.kind} /> : <div className="relative h-full p-6"><PartDrawing kind={a.kind} /></div>}
          <span className="absolute bottom-3 right-3 rounded bg-steel-950/80 px-2 py-1 text-[11.5px] text-steel-300">{view === '3d' ? 'برای چرخاندن بکشید' : 'نمای واترمارک‌دار سازنده'}</span>
          {view === '2d' && <span className="pointer-events-none absolute inset-0 grid place-items-center text-[38px] font-black text-white/[.04] [transform:rotate(-24deg)]">METALICS · SUP-****</span>}
        </div>
        <dl className="grid h-fit grid-cols-2 gap-px overflow-hidden rounded-panel border border-steel-700 bg-steel-700 text-[13.5px]">
          {[
            ['ابعاد کلی', <span className="code">{a.dims.map((d) => Math.round(d)).join(' × ')} mm</span>],
            ['ضخامت', a.thickness ? `${fa(a.thickness)} mm` : <span className="text-warn">در نقشه نیامده</span>],
            ['طول مسیر برش', `${fa(+a.cutLengthM.toFixed(2))} متر`],
            ['سوراخ / خم', `${fa(a.holes)} / ${fa(a.bends)}`],
            ...(a.real ? [['حجم', `${fa(Math.round(a.volumeCm3 ?? 0))} cm³`], ['مثلث‌های مش', fa(a.triangles ?? 0)]] : [['لایه‌ها', <span className="code">{a.layers.join(' ')}</span>], ['نوع فایل', a.ext]]),
          ].map(([k, v], i) => <div key={i} className="bg-steel-850 p-3"><dt className="text-steel-400">{k}</dt><dd className="mt-0.5 text-white">{v}</dd></div>)}
          <div className="col-span-2 bg-steel-850 p-3"><dt className="text-steel-400">حذف از جدول مشخصات</dt><dd className="mt-0.5 text-white"><span className="line-through decoration-err/70">{a.titleBlockRemoved}</span> ← <span className="code text-cut">MTX-1405-****</span></dd></div>
        </dl>
      </div>
    </div>
  )
}

/* بیننده سه‌بعدی؛ هندسه واقعی STL از context خوانده می‌شود */
let currentGeo: THREE.BufferGeometry | undefined
function ViewerSlot({ kind }: { kind: Analysis['kind'] }) {
  return <Suspense fallback={<div className="grid h-full place-items-center"><Loader2 className="animate-spin text-steel-400" /></div>}><MetalScene kind={kind} geometry={currentGeo} controls className="absolute inset-0" /></Suspense>
}

/* ======================= گام ۲: مشخصات ======================= */
function Seg<T extends string | number>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { v: T; l: string; d?: string }[] }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((it) => (
        <button type="button" key={String(it.v)} onClick={() => onChange(it.v)} className={cn('rounded-ctl border px-2 py-2.5 text-center text-[13px] transition-colors', value === it.v ? 'border-heat/60 bg-heat/10 text-white' : 'border-steel-600 text-steel-300 hover:border-steel-500')}>
          <div className="font-medium">{it.l}</div>{it.d && <div className="code mt-0.5 text-[11px] text-steel-400">{it.d}</div>}
        </button>
      ))}
    </div>
  )
}

function SpecStep({ q, set, partName, setPartName }: { q: QuoteInput; set: (p: Partial<QuoteInput>) => void; partName: string; setPartName: (s: string) => void }) {
  return (
    <div className="space-y-7">
      <label className="block"><span className="label">نام قطعه یا پروژه</span><input value={partName} onChange={(e) => setPartName(e.target.value)} className="field" placeholder="مثال: براکت نگهدارنده نوار نقاله" /></label>
      <div>
        <span className="label">فرآیند اصلی ساخت</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PROCESSES.map((p) => (
            <button type="button" key={p.id} onClick={() => set({ process: p.id })} className={cn('flex flex-col items-start gap-2 rounded-ctl border p-3 text-right transition-colors', q.process === p.id ? 'border-heat/60 bg-heat/10' : 'border-steel-600 hover:border-steel-500')}>
              <Icon name={p.icon} size={18} className={q.process === p.id ? 'text-heat' : 'text-steel-400'} />
              <span className="text-[13px] font-medium text-white">{p.short}</span>
              <span className="code text-[11px] text-steel-400">{p.tolerance}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label><span className="label">متریال</span>
          <select value={q.material} onChange={(e) => set({ material: e.target.value })} className="field">{MATERIALS.map((m) => <option key={m.id} value={m.id}>{m.name} — {m.equivalent}</option>)}</select></label>
        <label><span className="label">ضخامت ورق / قطر (mm)</span>
          <input type="number" min={0.5} step={0.5} value={q.thickness} onChange={(e) => set({ thickness: Math.max(0.5, +e.target.value) })} className="field ltr text-left" /></label>
      </div>
      <div>
        <span className="label">تعداد</span>
        <div className="flex flex-wrap items-center gap-2">
          <input type="number" min={1} value={q.quantity} onChange={(e) => set({ quantity: Math.max(1, Math.round(+e.target.value)) })} className="field w-32 ltr text-left" aria-label="تعداد" />
          {[1, 10, 50, 100, 320, 500].map((n) => <button type="button" key={n} onClick={() => set({ quantity: n })} className={cn('rounded-full border px-3 py-1.5 text-[13px]', q.quantity === n ? 'border-heat/60 text-white' : 'border-steel-600 text-steel-300')}>{fa(n)}</button>)}
        </div>
        <p className="mt-2 text-[12.5px] text-steel-400">از ۲۰ عدد تخفیف حجمی ۸٪، از ۱۰۰ عدد ۱۸٪ و از ۵۰۰ عدد ۲۸٪ اعمال می‌شود.</p>
      </div>
      <div><span className="label">کلاس تلرانس</span>
        <Seg value={q.tolerance} onChange={(v) => set({ tolerance: v })} items={[{ v: 'standard', l: 'عمومی', d: 'ISO 2768-m' }, { v: 'fine', l: 'دقیق', d: 'ISO 2768-f' }, { v: 'precision', l: 'بسیار دقیق', d: 'IT7 / طبق نقشه' }]} /></div>
      <label className="block"><span className="label">پوشش نهایی</span>
        <select value={q.finish} onChange={(e) => set({ finish: e.target.value })} className="field">{FINISHES.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></label>
    </div>
  )
}

/* ======================= گام ۳: تحلیل DFM ======================= */
function DfmStep({ q, set, a }: { q: QuoteInput; set: (p: Partial<QuoteInput>) => void; a: Analysis }) {
  const [thkAnswered, setThk] = useState(a.thickness !== null)
  const [fixed, setFixed] = useState<string[]>([])
  const findings = useMemo(() => {
    const f: { id: string; sev: 'high' | 'mid' | 'low'; t: string; d: string; fix: string }[] = []
    if (q.process === 'bending' || a.bends > 0) f.push({ id: 'hole-bend', sev: 'high', t: 'سوراخ Ø۱۲ در ۹ میلی‌متری خط خم', d: `حداقل فاصله مجاز برای ورق ${fa(q.thickness)} میلی‌متری حدود ${fa(Math.round(q.thickness * 2.5 + q.thickness))} میلی‌متر است. سوراخ پس از خم بیضی می‌شود.`, fix: 'جابه‌جایی سوراخ به ۲۸ mm یا سوراخ‌کاری پس از خم' })
    if (q.process === 'cnc') f.push({ id: 'corner', sev: 'high', t: '۴ گوشه داخلی تیز ۹۰ درجه', d: 'فرز انگشتی نمی‌تواند گوشه داخلی تیز بسازد؛ نیاز به وایرکات و افزایش هزینه دارد.', fix: 'افزودن Fillet با شعاع R3' })
    if (q.process === 'laser' || q.process === 'plasma' || a.holes > 3) f.push({ id: 'small-hole', sev: 'mid', t: `۲ سوراخ کوچک‌تر از ضخامت ورق`, d: `قطر Ø۶ در ورق ${fa(q.thickness)} میلی‌متری؛ لبه سوراخ می‌سوزد و دقت H7 حاصل نمی‌شود.`, fix: 'برش Ø۵ و مته‌کاری/ریمر پس از برش' })
    if (q.material === 'hardox450' && (q.process === 'bending' || a.bends > 0)) f.push({ id: 'hardox-r', sev: 'high', t: 'شعاع خم برای Hardox کم است', d: 'Hardox 450 به شعاع داخلی حداقل ۴ برابر ضخامت نیاز دارد.', fix: `افزایش شعاع به R${fa(q.thickness * 4)}` })
    f.push({ id: 'weld', sev: 'low', t: 'علامت جوش مشخص نشده', d: 'در نقشه خطوط اتصال دیده می‌شود ولی نوع و اندازه جوش نیامده است.', fix: 'جوش گوشه a۵ دوطرفه طبق استاندارد پیش‌فرض' })
    return f
  }, [q.process, q.thickness, q.material, a.bends, a.holes])

  return (
    <div className="space-y-6">
      {!thkAnswered && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="temper-border flex gap-3 rounded-panel p-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-temper-violet/25 text-temper-straw"><Bot size={18} /></div>
          <div className="flex-1">
            <p className="text-[14.5px] leading-7 text-white">ضخامت ورق در فایل مشخص نشده. با توجه به ابعاد و بار احتمالی، <b>۸ میلی‌متر ST37</b> مد نظر شماست؟</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => { set({ thickness: 8, material: 'st37' }); setThk(true) }}>بله، ۸ میلی‌متر ST37</Button>
              <Button size="sm" variant="secondary" onClick={() => { set({ thickness: 10, material: 'st52' }); setThk(true) }}>۱۰ میلی‌متر ST52</Button>
              <Button size="sm" variant="ghost" onClick={() => setThk(true)}>خودم در گام قبل وارد کرده‌ام</Button>
            </div>
          </div>
        </motion.div>
      )}
      <div>
        <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold text-white">بررسی قابلیت ساخت (DFM)</h3><span className="text-[12.5px] text-steel-400">{fa(findings.length - fixed.length)} مورد باز</span></div>
        <ul className="space-y-2.5">
          {findings.map((f) => {
            const done = fixed.includes(f.id)
            return (
              <li key={f.id} className={cn('rounded-panel border p-4 transition-colors', done ? 'border-ok/30 bg-ok/5' : 'border-steel-700 bg-steel-850')}>
                <div className="flex items-start gap-3">
                  {done ? <Check size={18} className="mt-1 shrink-0 text-ok" /> : <AlertTriangle size={18} className={cn('mt-1 shrink-0', f.sev === 'high' ? 'text-err' : f.sev === 'mid' ? 'text-warn' : 'text-cut')} />}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2"><span className="font-medium text-white">{f.t}</span><Badge tone={f.sev === 'high' ? 'err' : f.sev === 'mid' ? 'warn' : 'info'}>{f.sev === 'high' ? 'بحرانی' : f.sev === 'mid' ? 'متوسط' : 'توصیه'}</Badge></div>
                    <p className="mt-1 text-[13.5px] leading-6 text-steel-300">{f.d}</p>
                    {!done ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button size="sm" variant="ok" onClick={() => setFixed([...fixed, f.id])}><Sparkles size={14} /> {f.fix}</Button>
                        <Button size="sm" variant="ghost" onClick={() => setFixed([...fixed, f.id])}>مطابق نقشه بماند</Button>
                      </div>
                    ) : <p className="mt-2 text-[12.5px] text-ok">ثبت شد و به یادداشت فنی سفارش اضافه می‌شود.</p>}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      {(q.process === 'laser' || q.process === 'plasma' || q.process === 'bending') && (
        <div>
          <h3 className="mb-1 font-semibold text-white">چیدمان روی ورق (Nesting)</h3>
          <p className="mb-3 text-[13px] text-steel-400">ورق استاندارد ۱۵۰۰ × ۳۰۰۰ میلی‌متر. پرت کمتر یعنی قیمت متریال کمتر.</p>
          <Nesting qty={q.quantity} w={a.dims[0]} h={a.dims[1]} />
        </div>
      )}
    </div>
  )
}

/* ======================= گام ۴: کیفیت ======================= */
function QcStep({ q, set }: { q: QuoteInput; set: (p: Partial<QuoteInput>) => void }) {
  return (
    <div className="space-y-7">
      <div className="grid gap-3 md:grid-cols-3">
        {QC_TIERS.map((t) => (
          <button type="button" key={t.id} onClick={() => set({ qc: t.id })} className={cn('rounded-panel border p-4 text-right transition-colors', q.qc === t.id ? 'border-heat/60 bg-heat/10' : 'border-steel-600 hover:border-steel-500')}>
            <div className="flex items-center justify-between"><span className="text-[16px] font-bold text-white">{t.name}</span><span className={cn('grid h-5 w-5 place-items-center rounded-full border', q.qc === t.id ? 'border-heat bg-heat text-heat-ink' : 'border-steel-500')}>{q.qc === t.id && <Check size={13} />}</span></div>
            <div className="mt-1 text-[12.5px] text-heat">{t.price}</div>
            <ul className="mt-3 space-y-1.5 text-[13px] text-steel-300">{t.items.map((x) => <li key={x}>• {x}</li>)}</ul>
          </button>
        ))}
      </div>
      <div>
        <span className="label">گواهی‌نامه‌ها</span>
        <div className="grid gap-2 sm:grid-cols-2">
          {CERTS.map((c) => {
            const on = q.certs.includes(c.id)
            return (
              <label key={c.id} className={cn('flex cursor-pointer gap-3 rounded-ctl border p-3', on ? 'border-cut/50 bg-cut/5' : 'border-steel-600')}>
                <input type="checkbox" checked={on} onChange={() => set({ certs: on ? q.certs.filter((x) => x !== c.id) : [...q.certs, c.id] })} className="mt-1 h-4 w-4 accent-[#5BB8EA]" />
                <span><span className="block text-[14px] font-medium text-white">{c.name}</span><span className="text-[12.5px] text-steel-400">{c.desc}</span></span>
              </label>
            )
          })}
        </div>
      </div>
      <label className={cn('flex cursor-pointer items-start gap-4 rounded-panel border p-4', q.fai ? 'border-temper-bronze/60 bg-temper-bronze/10' : 'border-steel-600')}>
        <input type="checkbox" checked={q.fai} onChange={(e) => set({ fai: e.target.checked })} className="mt-1 h-4 w-4 accent-[#C07A3E]" />
        <span>
          <span className="block font-semibold text-white">ساخت نمونه اول (FAI) و قفل «نمونه طلایی»</span>
          <span className="mt-1 block text-[13.5px] leading-6 text-steel-300">سازنده ابتدا یک قطعه می‌سازد. پس از تأیید شما، همان قطعه مبنای قانونی پذیرش کل محموله می‌شود. حدود ۴ روز به زمان ساخت اضافه می‌کند.</span>
        </span>
      </label>
    </div>
  )
}

/* ======================= گام ۵: تحویل ======================= */
function DeliveryStep({ q, set, split, setSplit, date, setDate, pay, setPay }: { q: QuoteInput; set: (p: Partial<QuoteInput>) => void; split: boolean; setSplit: (b: boolean) => void; date: string; setDate: (s: string) => void; pay: string; setPay: (s: string) => void }) {
  return (
    <div className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <label><span className="label">شهر محل تحویل</span>
          <select value={q.city} onChange={(e) => set({ city: e.target.value })} className="field">{Object.keys(CITY_DISTANCE).map((c) => <option key={c}>{c}</option>)}</select></label>
        <label><span className="label">تاریخ مورد نیاز</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field ltr text-left" />
          <span className="mt-1 block text-[12.5px] text-steel-400">{date ? jdate(date) : ''}</span></label>
      </div>
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-panel border border-steel-600 p-4">
        <span><span className="block font-medium text-white">ساخت فوری</span><span className="text-[13px] text-steel-400">اولویت در خط تولید؛ حدود ۳ روز زودتر با ۳۵٪ هزینه ساخت بیشتر</span></span>
        <input type="checkbox" checked={q.rush} onChange={(e) => set({ rush: e.target.checked })} className="h-5 w-5 accent-[#F0A23B]" />
      </label>
      <div className="rounded-panel border border-steel-600 p-4">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span><span className="block font-medium text-white">ارسال مرحله‌ای (Split Shipment)</span><span className="text-[13px] text-steel-400">برای تیراژ بالا؛ هزینه انبارداری شما و فشار خط تولید کارگاه را کم می‌کند</span></span>
          <input type="checkbox" checked={split} onChange={(e) => setSplit(e.target.checked)} className="h-5 w-5 accent-[#F0A23B]" />
        </label>
        <AnimatePresence>{split && <motion.textarea initial={{ height: 0, opacity: 0 }} animate={{ height: 90, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="field mt-3" defaultValue={`${fa(Math.round(q.quantity / 3))} عدد تا دو هفته دیگر، مابقی تا پایان ماه`} aria-label="برنامه ارسال مرحله‌ای" />}</AnimatePresence>
      </div>
      <div><span className="label">روش پرداخت</span>
        <Seg value={pay} onChange={setPay} items={[{ v: 'escrow', l: 'نقدی با اسکرو کامل', d: 'SME' }, { v: 'credit', l: 'اعتباری شرکتی', d: 'Enterprise' }]} /></div>
      <p className="flex gap-2 text-[13px] leading-6 text-steel-400"><Truck size={16} className="mt-0.5 shrink-0" /> شرایط تحویل DAP: حمل و مسئولیت سلامت بار تا انبار شما با سازنده است. تحویل فقط با کد یکبارمصرف انباردار ثبت می‌شود.</p>
    </div>
  )
}

/* ======================= پنل قیمت زنده ======================= */
function LivePrice({ q, a, partName }: { q: QuoteInput; a: Analysis | null; partName: string }) {
  const p = priceQuote(q)
  const win = biddingWindowHours(q)
  return (
    <aside className="panel-raised overflow-hidden lg:sticky lg:top-20">
      <div className="flex items-center gap-3 border-b border-steel-700 p-4">
        <div className="blueprint-grid h-14 w-16 shrink-0 rounded-lg border border-steel-600 p-1">{a ? <PartDrawing kind={a.kind} /> : null}</div>
        <div className="min-w-0"><div className="truncate font-semibold text-white">{partName || 'قطعه بدون نام'}</div><div className="truncate text-[12.5px] text-steel-400">{fa(q.quantity)} عدد · {MATERIALS.find((m) => m.id === q.material)?.name} · {fa(q.thickness)} mm</div></div>
      </div>
      {a ? (<>
        <ul className="space-y-2 p-4 text-[13px]">
          {p.lines.map((l) => (
            <li key={l.key} className="flex justify-between gap-3"><span className="text-steel-300">{l.label}</span><motion.span key={Math.round(l.value)} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} className="shrink-0 text-steel-100">{fa(Math.round(l.value / 1000) * 1000)}</motion.span></li>
          ))}
        </ul>
        <div className="border-t border-steel-700 bg-steel-850 p-4">
          <div className="flex items-end justify-between"><span className="text-[13px] text-steel-300">برآورد کل (تومان)</span><motion.span key={Math.round(p.total)} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-[26px] font-black text-white">{fa(Math.round(p.total / 10000) * 10000)}</motion.span></div>
          <div className="mt-1 flex justify-between text-[12.5px] text-steel-400"><span>قیمت هر عدد</span><span>{toman(Math.round(p.unit / 100) * 100)}</span></div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[12px]">
            <div className="rounded-lg bg-steel-800 py-2"><div className="text-steel-400">زمان ساخت</div><div className="font-semibold text-white">{fa(p.leadDays)} روز کاری</div></div>
            <div className="rounded-lg bg-steel-800 py-2"><div className="text-steel-400">مهلت مناقصه</div><div className="font-semibold text-white">{fa(win)} ساعت</div></div>
          </div>
          <p className="mt-3 flex gap-1.5 text-[11.5px] leading-5 text-steel-400"><Info size={13} className="mt-0.5 shrink-0" />برآورد هوشمند اولیه. قیمت قطعی پس از بررسی فنی یا مناقصه کور اعلام می‌شود.</p>
        </div>
      </>) : <p className="p-6 text-center text-[13.5px] text-steel-400">پس از بارگذاری نقشه، قیمت تفکیکی اینجا به‌روز می‌شود.</p>}
    </aside>
  )
}

/* ======================= صفحه اصلی ویزارد ======================= */
export default function Quote() {
  const loc = useLocation() as { state?: { file?: File; sample?: boolean } | null }
  const nav = useNavigate()
  const toast = useToast()
  const initial: File | 'sample' | undefined = loc.state?.file ?? (loc.state?.sample ? 'sample' : undefined)
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Analysis | null>(null)
  const [, force] = useState(0)
  const [partName, setPartName] = useState('براکت نگهدارنده نوار نقاله')
  const [split, setSplit] = useState(false)
  const [date, setDate] = useState(daysFromNow(24).toISOString().slice(0, 10))
  const [pay, setPay] = useState('escrow')
  const [agree, setAgree] = useState(false)
  const [path, setPath] = useState<'instant' | 'tender'>('tender')
  const [done, setDone] = useState<string | null>(null)
  const [q, setQ] = useState<QuoteInput>({ process: 'laser', material: 'st37', thickness: 8, quantity: 320, tolerance: 'standard', finish: 'epoxy', qc: 'standard', fai: true, certs: ['mtc', 'coc'], rush: false, city: 'سیرجان', areaM2: 0.072, cutLengthM: 1.24, holes: 3, bends: 1 })
  const set = (p: Partial<QuoteInput>) => setQ((s) => ({ ...s, ...p }))

  const onAnalysis = useCallback((x: Analysis) => {
    setA(x)
    setQ((s) => ({ ...s, areaM2: x.areaM2, cutLengthM: x.cutLengthM, holes: x.holes, bends: x.bends, thickness: x.thickness ?? s.thickness, process: x.bends > 0 ? 'bending' : x.kind === 'shaft' ? 'cnc' : x.kind === 'frame' ? 'welding' : 'laser' }))
    if (x.kind !== 'bracket') setPartName(x.fileName.replace(/\.[^.]+$/, ''))
  }, [])
  const onGeo = useCallback((g?: THREE.BufferGeometry) => { currentGeo = g; force((n) => n + 1) }, [])
  useEffect(() => () => { currentGeo = undefined }, [])

  const canNext = step === 0 ? !!a : step === 5 ? agree : true
  const p = priceQuote(q)

  if (done) return (
    <section className="container-x grid min-h-[75vh] place-items-center py-16">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-ok/15 text-ok"><Check size={40} /></motion.div>
        <h1 className="mt-6 text-[30px] font-black text-white">{path === 'tender' ? 'سفارش ثبت و به مناقصه کور رفت' : 'سفارش ثبت شد'}</h1>
        <div className="mt-4 inline-flex items-center gap-2 rounded-ctl border border-steel-600 bg-steel-850 px-4 py-2">
          <span className="text-steel-400">کد رهگیری</span><span className="code text-[16px] text-white">{done}</span>
          <button onClick={() => { navigator.clipboard?.writeText(done); toast('کد رهگیری کپی شد', 'info') }} className="text-steel-400 hover:text-white" aria-label="کپی"><Copy size={15} /></button>
        </div>
        <p className="mx-auto mt-5 max-w-lg leading-8 text-steel-300">
          {path === 'tender'
            ? `کارشناس فنی نقشه را بررسی می‌کند و سپس برای ${fa(Math.min(10, 3 + Math.floor(q.quantity / 80)))} سازنده واجد شرایط ارسال می‌شود. مهلت پاسخ ${fa(biddingWindowHours(q))} ساعت است و نتیجه با پیامک اطلاع داده می‌شود.`
            : 'پیش‌فاکتور رسمی با سربرگ متالیکس صادر شد. پس از واریز به حساب امانی، ساخت با بهترین سازنده آزاد شروع می‌شود.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => nav('/app/rfq/MTX-1405-4855')}><Gavel size={16} /> نمونه ماتریس مقایسه پیشنهادها</Button>
          <Button variant="secondary" onClick={() => nav('/app')}>رفتن به داشبورد</Button>
        </div>
      </motion.div>
    </section>
  )

  return (
    <section className="container-x py-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-[26px] font-bold text-white">سفارش جدید و قیمت آنی</h1>
        <p className="text-[14px] text-steel-300">شش گام، کمتر از سه دقیقه. هر تغییر، قیمت سمت چپ را همان لحظه به‌روز می‌کند.</p>
      </div>

      <ol className="mb-8 flex gap-1.5 overflow-x-auto pb-1" aria-label="مراحل">
        {STEPS.map((s, i) => (
          <li key={s} className="min-w-[110px] flex-1">
            <button disabled={i > 0 && !a} onClick={() => setStep(i)} className="w-full text-right disabled:cursor-not-allowed">
              <div className={cn('h-1 rounded-full transition-colors', i < step ? 'bg-heat' : i === step ? 'temper-bar' : 'bg-steel-700')} />
              <div className={cn('mt-2 text-[12.5px]', i === step ? 'text-white' : 'text-steel-400')}><span className="ml-1 text-steel-500">{fa(i + 1)}</span>{s}</div>
            </button>
          </li>
        ))}
      </ol>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div className="panel p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.22 }}>
              {step === 0 && <UploadStep analysis={a} setAnalysis={onAnalysis} setGeo={onGeo} initial={initial} />}
              {step === 1 && <SpecStep q={q} set={set} partName={partName} setPartName={setPartName} />}
              {step === 2 && a && <DfmStep q={q} set={set} a={a} />}
              {step === 3 && <QcStep q={q} set={set} />}
              {step === 4 && <DeliveryStep q={q} set={set} split={split} setSplit={setSplit} date={date} setDate={setDate} pay={pay} setPay={setPay} />}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="grid gap-3 md:grid-cols-2">
                    {([
                      { id: 'tender', icon: Gavel, t: 'مناقصه کور (پیشنهادی)', d: `ارسال بی‌نام برای ۳ تا ۱۰ سازنده؛ مقایسه قیمت، زمان و امتیاز. مهلت ${fa(biddingWindowHours(q))} ساعت.` },
                      { id: 'instant', icon: Zap, t: 'قیمت آنی و شروع فوری', d: `پیش‌فاکتور ${toman(Math.round(p.total / 10000) * 10000)} همین حالا؛ تخصیص خودکار به بهترین سازنده آزاد.` },
                    ] as const).map((o) => (
                      <button key={o.id} onClick={() => setPath(o.id)} className={cn('rounded-panel border p-4 text-right', path === o.id ? 'border-heat/60 bg-heat/10' : 'border-steel-600')}>
                        <o.icon size={20} className={path === o.id ? 'text-heat' : 'text-steel-400'} />
                        <div className="mt-2 font-semibold text-white">{o.t}</div><div className="mt-1 text-[13px] leading-6 text-steel-300">{o.d}</div>
                      </button>
                    ))}
                  </div>
                  <dl className="divide-y divide-steel-700 rounded-panel border border-steel-700 text-[14px]">
                    {[
                      ['فایل', <span className="code">{a?.fileName}</span>], ['فرآیند', PROCESSES.find((x) => x.id === q.process)?.name], ['متریال و ضخامت', `${MATERIALS.find((m) => m.id === q.material)?.name} · ${fa(q.thickness)} mm`],
                      ['تعداد', `${fa(q.quantity)} عدد`], ['کنترل کیفیت', `${QC_TIERS.find((t) => t.id === q.qc)?.name}${q.fai ? ' + نمونه اول (FAI)' : ''}`], ['گواهی‌ها', q.certs.map((c) => CERTS.find((x) => x.id === c)?.name.split(' (')[0]).join('، ') || '—'],
                      ['تحویل', <span className="flex items-center gap-1.5"><CalendarDays size={14} />{q.city} · {jdate(date)}{split ? ' · مرحله‌ای' : ''}</span>], ['پرداخت', pay === 'escrow' ? 'نقدی با اسکرو کامل' : 'اعتباری شرکتی'],
                    ].map(([k, v], i) => <div key={i} className="flex justify-between gap-4 px-4 py-2.5"><dt className="text-steel-400">{k}</dt><dd className="text-left text-white">{v}</dd></div>)}
                  </dl>
                  <label className="flex cursor-pointer items-start gap-3 rounded-panel border border-warn/30 bg-warn/5 p-4 text-[14px] leading-7 text-steel-200">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1.5 h-4 w-4 accent-[#F5D04C]" />
                    تأیید می‌کنم ابعاد و رواداری‌ها دقیقاً طبق فایل بارگذاری‌شده است و مسئولیت خطاهای نقشه اولیه با سفارش‌دهنده است.
                  </label>
                  <p className="flex items-center gap-2 text-[12.5px] text-steel-400"><ShieldCheck size={15} className="text-ok" /> تا انتخاب و پرداخت، هیچ تعهد مالی ایجاد نمی‌شود.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between border-t border-steel-700 pt-5">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}><ChevronRight size={16} /> قبلی</Button>
            {step < 5
              ? <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>{step === 0 ? 'ادامه با این فایل' : 'گام بعد'} <ChevronLeft size={16} /></Button>
              : <Button disabled={!agree} size="lg" onClick={() => { const c = trackingCode(); setDone(c); toast(`سفارش ${c} ثبت شد`) }}>{path === 'tender' ? 'ثبت و ارسال به مناقصه' : 'ثبت و صدور پیش‌فاکتور'}</Button>}
          </div>
        </div>
        <LivePrice q={q} a={a} partName={partName} />
      </div>
    </section>
  )
}
