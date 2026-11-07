import { motion } from 'framer-motion'
import { lazy, Suspense, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Upload, ShieldCheck, Timer, Scale, EyeOff, FileCheck2, Truck, Factory, Building2, Check, Minus, X as XIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Counter } from '@/components/ui/Counter'
import { SectionHead } from '@/components/ui/Section'
import { PartDrawing } from '@/components/ui/PartDrawing'
import { PROCESSES, MATERIALS, INDUSTRIES } from '@/data/catalog'
import { cn, fa } from '@/lib/format'

const MetalScene = lazy(() => import('@/components/three/MetalScene'))

/* ---------- هیرو: نقشه را رها کنید ---------- */
function HeroDrop() {
  const nav = useNavigate()
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const go = (f?: File) => nav('/quote', { state: f ? { file: f } : { sample: true } })
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); go(e.dataTransfer.files[0]) }}
      className={cn('group relative mt-8 flex flex-col gap-4 rounded-panel border border-dashed p-4 transition-colors sm:flex-row sm:items-center sm:p-5',
        over ? 'border-heat bg-heat/10' : 'border-steel-500 bg-steel-850/80 hover:border-steel-400')}
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-ctl bg-heat/15 text-heat"><Upload size={22} /></div>
      <div className="flex-1">
        <div className="font-medium text-white">نقشه یا مدل قطعه را اینجا رها کنید</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-steel-300"><span className="code text-steel-200">DWG · DXF · STEP · STL · PDF</span><span>حداکثر ۲۰۰ مگابایت، با واترمارک و رمزنگاری</span></div>
      </div>
      <input ref={input} type="file" className="hidden" accept=".dwg,.dxf,.step,.stp,.stl,.pdf,.iges,.igs" onChange={(e) => go(e.target.files?.[0])} />
      <div className="flex gap-2">
        <Button onClick={() => input.current?.click()}>انتخاب فایل</Button>
        <Button variant="ghost" onClick={() => go()}>نمونه آزمایشی</Button>
      </div>
    </div>
  )
}

const CALLOUTS = [
  { x: '6%', y: '14%', t: 'Ø240 — ST52 · t=32', d: 0.9 },
  { x: '64%', y: '9%', t: '8× Ø18 روی PCD170', d: 1.1 },
  { x: '2%', y: '72%', t: 'سوراخ مرکزی Ø110 H7', d: 1.3 },
  { x: '60%', y: '80%', t: 'قیمت آنی: ۲ دقیقه و ۱۴ ثانیه', d: 1.5, hot: true },
]

function Hero() {
  return (
    <section className="relative -mt-16 overflow-hidden pt-16">
      <div className="blueprint-grid absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_40%,black,transparent)]" />
      <div className="pointer-events-none absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-heat/10 blur-[120px]" />
      <div className="container-x relative grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-steel-600 bg-steel-850/80 px-3 py-1 text-[13px] text-steel-200">
            <span className="h-2 w-2 rounded-full bg-ok" /> شبکه کارگاه‌های تأییدشده در ۱۲ استان
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}
            className="text-[36px] font-black leading-[1.25] text-white sm:text-[52px] lg:text-[58px]">
            نقشه را بفرستید،<br />قطعه را <span className="temper-text">تحویل بگیرید</span>.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-5 max-w-xl text-[16.5px] leading-8 text-steel-300">
            برش لیزر، خم‌کاری، ماشین‌کاری CNC و ساخت سازه از شبکه کارگاه‌های تأییدشده ایران — با یک قرارداد، یک فاکتور رسمی، پرداخت امانی و مسئولیت کامل کیفیت توسط متالیکس.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24 }}><HeroDrop /></motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-steel-300">
            <li className="flex items-center gap-2"><Timer size={16} className="text-heat" /> قیمت اولیه در کمتر از ۳ دقیقه</li>
            <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-ok" /> وجه تا تأیید کیفیت در اسکرو</li>
            <li className="flex items-center gap-2"><EyeOff size={16} className="text-cut" /> نقشه شما بی‌نام و واترمارک‌دار</li>
          </motion.ul>
        </div>

        <div className="relative aspect-square w-full max-w-[560px] justify-self-center">
          <div className="absolute inset-[8%] rounded-full border border-steel-700/60" />
          <div className="absolute inset-[22%] rounded-full border border-dashed border-steel-700/50" />
          <Suspense fallback={<div className="grid h-full place-items-center"><PartDrawing kind="flange" className="h-2/3 w-2/3 opacity-60" /></div>}>
            <MetalScene kind="flange" sparks pointer className="absolute inset-0" />
          </Suspense>
          {CALLOUTS.map((c) => (
            <motion.div key={c.t} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: c.d, duration: 0.5 }}
              className={cn('absolute rounded-lg border px-2.5 py-1.5 text-[12px] backdrop-blur-md', c.hot ? 'border-heat/50 bg-heat/15 text-heat' : 'border-cut/30 bg-steel-900/70 text-cut')}
              style={{ left: c.x, top: c.y }}>
              <span className={cn('absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full', c.hot ? 'bg-heat' : 'bg-cut')} />
              {c.t}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- مسیر سفارش (یک توالی واقعی) ---------- */
const STEPS = [
  { icon: Upload, t: 'بارگذاری و تحلیل هوشمند', d: 'هوش مصنوعی ابعاد، ضخامت و تلرانس‌ها را از نقشه می‌خواند و پیش از ساخت، ایرادهای قابلیت ساخت (DFM) را گزارش می‌کند.', meta: 'زیر ۳ دقیقه' },
  { icon: Scale, t: 'مناقصه کور و مقایسه', d: 'نقشه بی‌نام برای ۳ تا ۱۰ کارگاه واجد شرایط ارسال می‌شود. پیشنهادها را با قیمت، زمان، فاصله و امتیاز کیفی مقایسه می‌کنید.', meta: '۶ تا ۷۲ ساعت' },
  { icon: Factory, t: 'پرداخت امانی و ساخت', d: 'وجه نزد متالیکس قفل می‌شود. برای سفارش‌های حساس، نمونه اول (FAI) ساخته و پس از تأیید شما «نمونه طلایی» می‌شود.', meta: 'گزارش تصویری مرحله‌ای' },
  { icon: Truck, t: 'تحویل با کد یکبارمصرف', d: 'بار با برچسب متالیکس و ردیابی زنده ارسال می‌شود. انباردار شما با کد OTP تحویل می‌گیرد و مهلت بازرسی شروع می‌شود.', meta: 'تسویه پس از تأیید' },
]

function Journey() {
  return (
    <section className="container-x py-24">
      <SectionHead title="از فایل نقشه تا قطعه در انبار شما" desc="هر سفارش از یک مسیر مشخص و قابل ردیابی عبور می‌کند. شما در هر مرحله می‌دانید قطعه کجاست و پولتان در چه وضعیتی است." />
      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
        <div className="absolute right-6 top-6 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-l from-heat via-steel-600 to-steel-700 md:block" />
        {STEPS.map((s, i) => (
          <li key={s.t} className="relative">
            <div className="relative z-10 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-steel-600 bg-steel-850 text-heat"><s.icon size={20} /></span>
              <span className="font-brand text-[13px] text-steel-400">{fa(i + 1)}</span>
            </div>
            <h3 className="mt-5 text-[17px] font-bold text-white">{s.t}</h3>
            <p className="mt-2 text-[14px] leading-7 text-steel-300">{s.d}</p>
            <span className="mt-3 inline-block text-[12.5px] text-cut">{s.meta}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ---------- خدمات ساخت: جدول فنی، نه کارت ---------- */
function CapabilityTable() {
  const [hover, setHover] = useState(0)
  const kinds = ['plate', 'plate', 'bracket', 'shaft', 'frame', 'frame', 'flange'] as const
  return (
    <section className="border-y border-steel-700/60 bg-steel-950/60 py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <SectionHead title="فرآیندهایی که سفارش می‌گیریم" desc="متالیکس فقط سفارش‌های دارای ارزش افزوده مهندسی را می‌پذیرد. ورق، شمش یا تیرآهن خام بدون عملیات ساخت فروخته نمی‌شود." />
          <div className="overflow-hidden rounded-panel border border-steel-700">
            <div className="hidden grid-cols-[1.5fr_1fr_1.3fr_.8fr] gap-4 border-b border-steel-700 bg-steel-850 px-5 py-3 text-[12.5px] text-steel-400 md:grid">
              <span>فرآیند</span><span>دقت قابل دستیابی</span><span>حداکثر ابعاد</span><span>ساخت از</span>
            </div>
            {PROCESSES.map((p, i) => (
              <Link to="/capabilities" key={p.id} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)}
                className={cn('grid grid-cols-2 gap-x-4 gap-y-1 border-b border-steel-800 px-5 py-4 transition-colors last:border-0 md:grid-cols-[1.5fr_1fr_1.3fr_.8fr] md:items-center', hover === i ? 'bg-steel-800' : 'hover:bg-steel-850')}>
                <span className="col-span-2 font-medium text-white md:col-span-1">{p.name}</span>
                <span className="code text-right text-cut">{p.tolerance}</span>
                <span className="text-[13.5px] text-steel-300">{p.maxSize}</span>
                <span className="text-[13.5px] text-steel-300">{fa(p.baseDays)} روز کاری</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="sticky top-24 hidden h-fit lg:block">
          <div className="panel-raised blueprint-grid aspect-[4/3] p-4"><PartDrawing kind={kinds[hover]} /></div>
          <p className="mt-4 text-[14px] leading-7 text-steel-300">{PROCESSES[hover].desc}</p>
          <p className="mt-2 text-[13px] text-steel-400">ماشین‌آلات شبکه: {PROCESSES[hover].machines}</p>
        </div>
      </div>
    </section>
  )
}

/* ---------- بازارگاه کور ---------- */
function BlindModel() {
  const [view, setView] = useState<'buyer' | 'supplier'>('buyer')
  const rows = view === 'buyer'
    ? [['نام و آدرس کارگاه', false], ['قیمت نهایی با مالیات و حمل', true], ['زمان ساخت و فاصله تا پروژه', true], ['امتیاز کیفی و سابقه تحویل', true], ['شماره تماس سازنده', false]]
    : [['نام شرکت خریدار', false], ['نقشه با واترمارک اختصاصی', true], ['متریال، تعداد و تلرانس‌ها', true], ['مقصد تقریبی (فاصله به کیلومتر)', true], ['شماره تماس خریدار', false]]
  return (
    <section className="container-x grid items-center gap-12 py-24 lg:grid-cols-2">
      <div>
        <SectionHead className="mb-6" title="متالیکس طرف قرارداد شماست، نه یک دلال" desc="با خریدار و سازنده دو قرارداد مستقل پشت‌به‌پشت بسته می‌شود. هر طرف فقط اطلاعاتی را می‌بیند که برای تصمیم لازم دارد؛ مسئولیت کیفیت، زمان و فاکتور رسمی سامانه مؤدیان با متالیکس است." />
        <ul className="space-y-3 text-[14.5px] text-steel-200">
          <li className="flex gap-3"><FileCheck2 className="mt-1 shrink-0 text-heat" size={18} /> قرارداد الف با خریدار: تحویل طبق نقشه، گارانتی کیفیت، فاکتور رسمی</li>
          <li className="flex gap-3"><FileCheck2 className="mt-1 shrink-0 text-cut" size={18} /> قرارداد ب با سازنده: تعهد کیفی، زمان‌بندی، پاسخ‌گویی به عیب، تضمین پرداخت اسکرو</li>
          <li className="flex gap-3"><EyeOff className="mt-1 shrink-0 text-temper-violet" size={18} /> شماره تلفن، ایمیل و آدرس در گفتگوها خودکار حذف می‌شود</li>
        </ul>
      </div>
      <div className="panel-raised p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm text-steel-300">چه کسی چه می‌بیند؟</span>
          <div className="flex rounded-ctl border border-steel-600 p-0.5 text-[13px]">
            {(['buyer', 'supplier'] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={cn('rounded-lg px-3 py-1.5 transition-colors', view === v ? 'bg-steel-600 text-white' : 'text-steel-300')}>{v === 'buyer' ? 'خریدار' : 'سازنده'}</button>
            ))}
          </div>
        </div>
        <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center text-[13px]">
          <div className={cn('rounded-ctl border px-3 py-3', view === 'buyer' ? 'border-heat/60 bg-heat/10 text-white' : 'border-steel-600 text-steel-300')}><Building2 className="mx-auto mb-1" size={18} />خریدار صنعتی</div>
          <div className="rounded-ctl border border-steel-500 bg-steel-700 px-3 py-3 font-brand text-[12px] tracking-widest text-white ltr">METALICS</div>
          <div className={cn('rounded-ctl border px-3 py-3', view === 'supplier' ? 'border-heat/60 bg-heat/10 text-white' : 'border-steel-600 text-steel-300')}><Factory className="mx-auto mb-1" size={18} />کارگاه سازنده</div>
        </div>
        <motion.ul key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="divide-y divide-steel-700/70">
          {rows.map(([t, ok]) => (
            <li key={t as string} className="flex items-center justify-between py-2.5 text-[14px]">
              <span className={ok ? 'text-steel-100' : 'text-steel-400 line-through decoration-steel-500'}>{t}</span>
              {ok ? <Check size={17} className="text-ok" /> : <span className="code rounded bg-steel-700 px-2 text-[11px] text-steel-300">٭٭٭٭٭٭</span>}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

/* ---------- مقایسه با روش‌های موجود ---------- */
function Compare() {
  const rows: [string, string, string, string][] = [
    ['زمان دریافت قیمت', 'چند روز تماس و پیگیری', '۲ روز کاری برای نقشه دوبعدی و اسمبلی', 'زیر ۳ دقیقه برآورد اولیه'],
    ['خواندن فایل DWG/DXF', 'دستی، توسط کارگاه', 'بررسی دستی کارشناس', 'استخراج خودکار ابعاد و متن‌ها'],
    ['تضمین کیفیت', 'ندارد', 'دارد', 'سه سطح QC + نمونه طلایی'],
    ['امنیت پرداخت', 'پیش‌پرداخت نقدی', 'کارت اعتباری', 'اسکرو و تسویه مرحله‌ای'],
    ['حل اختلاف فنی', 'مراجع قضایی', 'پشتیبانی', 'گیت داوری سه‌مرحله‌ای'],
    ['فاکتور رسمی و مالیات', 'اغلب ندارد', 'خارج از ایران', 'سامانه مؤدیان'],
  ]
  const mark = (s: string, col: number) => col === 3 ? <Check size={15} className="ml-1.5 inline text-ok" /> : s.startsWith('ندارد') || s.includes('دستی') || s.includes('قضایی') ? <XIcon size={15} className="ml-1.5 inline text-err" /> : <Minus size={15} className="ml-1.5 inline text-steel-400" />
  return (
    <section className="container-x py-24">
      <SectionHead title="چرا متالیکس؟" desc="الگوی مرجع ما پلتفرم‌های جهانی مانند Xometry است؛ با یک تفاوت مهم: حذف تأخیر ۴۸ ساعته قیمت‌گذاری دستی با تحلیل هوشمند نقشه، و انطباق کامل با بازار و قوانین ایران." />
      <div className="overflow-x-auto rounded-panel border border-steel-700">
        <table className="w-full min-w-[720px] text-[14px]">
          <thead className="bg-steel-850 text-[13px] text-steel-300">
            <tr><th className="px-5 py-3.5 text-right font-medium"> </th><th className="px-5 py-3.5 text-right font-medium">بازار سنتی</th><th className="px-5 py-3.5 text-right font-medium">پلتفرم‌های خارجی</th><th className="temper-border px-5 py-3.5 text-right font-semibold text-white">متالیکس</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-steel-800">
                <td className="px-5 py-3.5 font-medium text-white">{r[0]}</td>
                {[1, 2, 3].map((c) => <td key={c} className={cn('px-5 py-3.5', c === 3 ? 'bg-steel-850/60 text-white' : 'text-steel-300')}>{mark(r[c], c)}{r[c]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* ---------- اعداد پلتفرم ---------- */
function Numbers() {
  const n = [
    { v: 7, s: '', l: 'فرآیند ساخت' }, { v: 10, s: '', l: 'گرید متریال پایه با MTC' },
    { v: 72, s: ' ساعت', l: 'سقف مهلت مناقصه کور' }, { v: 2, s: ' امضا', l: 'برای هر آزادسازی وجه' },
  ]
  return (
    <section className="border-y border-steel-700/60 bg-steel-950/60">
      <div className="container-x grid grid-cols-2 divide-steel-700 md:grid-cols-4 md:divide-x md:divide-x-reverse">
        {n.map((x) => (
          <div key={x.l} className="px-4 py-10 text-center">
            <div className="font-display text-[34px] font-black text-white sm:text-[42px]"><Counter to={x.v} suffix={x.s} /></div>
            <div className="mt-1 text-[13.5px] text-steel-300">{x.l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Industries() {
  const mats = [...MATERIALS, ...MATERIALS]
  return (
    <section className="py-24">
      <div className="container-x">
        <SectionHead title="برای صنایعی که توقف خط برایشان گران است" />
        <div className="grid gap-px overflow-hidden rounded-panel border border-steel-700 bg-steel-700 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((i) => (
            <div key={i.name} className="bg-steel-900 p-6 transition-colors hover:bg-steel-850">
              <h3 className="text-[17px] font-bold text-white">{i.name}</h3>
              <p className="mt-1.5 text-[14px] text-steel-300">{i.ex}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative mt-16 overflow-hidden border-y border-steel-800 py-4 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]" aria-hidden>
        <div className="flex w-max animate-marquee gap-10">
          {mats.map((m, i) => <span key={i} className="whitespace-nowrap text-[15px] text-steel-400"><span className="text-steel-200">{m.name}</span> · {m.equivalent}</span>)}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="container-x">
      <div className="temper-border relative overflow-hidden rounded-[20px] p-8 sm:p-12">
        <div className="blueprint-grid absolute inset-0 opacity-60" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-[28px] font-black text-white sm:text-[36px]">اولین قطعه را همین امروز قیمت بگیرید</h2>
            <p className="mt-3 max-w-xl text-[15.5px] leading-8 text-steel-300">ثبت سفارش رایگان است. تا وقتی پیشنهادی را انتخاب و پرداخت نکنید، هیچ تعهدی ندارید.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button to="/quote" size="lg"><Upload size={18} /> بارگذاری نقشه</Button>
            <Button to="/suppliers" size="lg" variant="secondary">کارگاه دارم؛ عضو می‌شوم</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (<><Hero /><Journey /><CapabilityTable /><BlindModel /><Numbers /><Compare /><Industries /><FinalCta /></>)
}
