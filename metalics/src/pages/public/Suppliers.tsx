import { useState } from 'react'
import { Wallet, Gauge, EyeOff, CalendarClock, Plus, Trash2, Check } from 'lucide-react'
import { PageHero, SectionHead } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { supplierScore, DEFAULT_WEIGHTS } from '@/lib/scoring'
import { PROCESSES } from '@/data/catalog'
import { cn, fa } from '@/lib/format'

function ScoreSim() {
  const [s, setS] = useState({ quality: 90, delivery: 85, price: 70, capacity: 80, risk: 0 })
  const total = supplierScore(s)
  const rows: [keyof typeof s, string, string][] = [
    ['quality', 'کیفیت (نتیجه QC و داوری‌ها)', `وزن ${fa(DEFAULT_WEIGHTS.quality * 100)}٪`],
    ['delivery', 'تحویل به‌موقع', `وزن ${fa(DEFAULT_WEIGHTS.delivery * 100)}٪`],
    ['price', 'رقابتی بودن قیمت', `وزن ${fa(DEFAULT_WEIGHTS.price * 100)}٪`],
    ['capacity', 'ظرفیت آزاد و تنوع ماشین‌آلات', `وزن ${fa(DEFAULT_WEIGHTS.capacity * 100)}٪`],
    ['risk', 'جریمه ریسک (تخلف، تأخیر، دور زدن)', 'کسر مستقیم'],
  ]
  const tier = total >= 85 ? ['طلایی', 'اولویت در همه مناقصه‌ها و تسویه سریع‌تر', 'text-temper-straw'] : total >= 70 ? ['فعال', 'دریافت مناقصه‌های متناسب با ماشین‌آلات', 'text-ok'] : total >= 60 ? ['زیر نظر', 'تعداد مناقصه‌ها محدود می‌شود', 'text-warn'] : ['تعلیق', 'دریافت استعلام متوقف می‌شود', 'text-err']
  return (
    <div className="panel-raised grid gap-8 p-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-5">
        {rows.map(([k, l, w]) => (
          <label key={k} className="block">
            <div className="mb-2 flex justify-between text-[13.5px]"><span className="text-steel-200">{l}</span><span className="text-steel-400">{w} · <span className="text-white">{fa(s[k])}</span></span></div>
            <input type="range" min={0} max={k === 'risk' ? 30 : 100} value={s[k]} onChange={(e) => setS({ ...s, [k]: +e.target.value })} className="w-full accent-[#F0A23B]" />
          </label>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative h-44 w-44">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <defs><linearGradient id="sg" x1="0" x2="1"><stop offset="0" stopColor="#E9C878" /><stop offset=".5" stopColor="#C07A3E" /><stop offset="1" stopColor="#7A5AA6" /></linearGradient></defs>
            <circle cx="60" cy="60" r="52" fill="none" stroke="#263544" strokeWidth="10" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="url(#sg)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(total / 100) * 327} 327`} className="transition-all duration-500" />
          </svg>
          <div className="absolute inset-0 grid place-items-center"><div><div className="font-display text-[40px] font-black text-white">{fa(total)}</div><div className="text-[12px] text-steel-400">از ۱۰۰</div></div></div>
        </div>
        <div className={cn('mt-4 text-[18px] font-bold', tier[2])}>سطح {tier[0]}</div>
        <p className="mt-1 text-[13.5px] text-steel-300">{tier[1]}</p>
        <code className="code mt-4 rounded bg-steel-950 px-2 py-1 text-steel-400">Score = Σ wᵢ·Sᵢ − P_risk</code>
      </div>
    </div>
  )
}

function Apply() {
  const toast = useToast()
  const [machines, setMachines] = useState([{ type: 'لیزر فایبر', spec: '۱۲ کیلووات، میز ۳×۱۲', tol: '±۰٫۱' }])
  const [caps, setCaps] = useState<string[]>(['laser'])
  const [done, setDone] = useState(false)
  if (done) return (
    <div className="panel-raised p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ok/15 text-ok"><Check size={28} /></div>
      <h3 className="mt-4 text-[22px] font-bold text-white">درخواست عضویت ثبت شد</h3>
      <p className="mx-auto mt-2 max-w-md text-steel-300">کد پیگیری <span className="code text-white">SUP-REQ-0451</span>. کارشناس متالیکس ظرف ۳ روز کاری برای بازدید کارگاه و احراز ماشین‌آلات تماس می‌گیرد.</p>
      <Button to="/supplier" className="mt-6">مشاهده پنل نمونه سازنده</Button>
    </div>
  )
  return (
    <form className="panel-raised space-y-6 p-6" onSubmit={(e) => { e.preventDefault(); setDone(true); toast('درخواست عضویت ثبت شد') }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label><span className="label">نام حقوقی کارگاه یا شرکت</span><input required className="field" placeholder="مثال: صنایع برش‌کاران سپاهان" /></label>
        <label><span className="label">شناسه ملی / کد اقتصادی</span><input required className="field ltr text-left" placeholder="10861234567" /></label>
        <label><span className="label">شهر و شهرک صنعتی</span><input required className="field" placeholder="اصفهان، شهرک صنعتی محمودآباد" /></label>
        <label><span className="label">موبایل مدیر فنی</span><input required className="field ltr text-left" placeholder="0913 000 0000" inputMode="tel" /></label>
      </div>
      <div>
        <span className="label">فرآیندهایی که انجام می‌دهید</span>
        <div className="flex flex-wrap gap-2">
          {PROCESSES.map((p) => (
            <button type="button" key={p.id} onClick={() => setCaps((c) => (c.includes(p.id) ? c.filter((x) => x !== p.id) : [...c, p.id]))}
              className={cn('rounded-full border px-3 py-1.5 text-[13px]', caps.includes(p.id) ? 'border-heat/60 bg-heat/10 text-white' : 'border-steel-600 text-steel-300')}>{p.short}</button>
          ))}
        </div>
      </div>
      <div>
        <span className="label">فهرست ماشین‌آلات</span>
        <div className="space-y-2">
          {machines.map((m, i) => (
            <div key={i} className="grid grid-cols-[1fr_1.4fr_.7fr_auto] gap-2">
              <input className="field" value={m.type} onChange={(e) => setMachines(machines.map((x, k) => (k === i ? { ...x, type: e.target.value } : x)))} aria-label="نوع ماشین" />
              <input className="field" value={m.spec} onChange={(e) => setMachines(machines.map((x, k) => (k === i ? { ...x, spec: e.target.value } : x)))} aria-label="مشخصات" />
              <input className="field" value={m.tol} onChange={(e) => setMachines(machines.map((x, k) => (k === i ? { ...x, tol: e.target.value } : x)))} aria-label="دقت" />
              <button type="button" onClick={() => setMachines(machines.filter((_, k) => k !== i))} className="rounded-ctl border border-steel-600 px-3 text-steel-300 hover:text-err" aria-label="حذف"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => setMachines([...machines, { type: '', spec: '', tol: '' }])}><Plus size={15} /> افزودن ماشین</Button>
      </div>
      <label className="flex items-start gap-3 text-[14px] text-steel-300">
        <input type="checkbox" required className="mt-1.5 h-4 w-4 accent-[#F0A23B]" />
        قرارداد ب (عدم افشا، عدم تماس مستقیم با خریدار، تعهد کیفی و پاسخ‌گویی به عیب) را مطالعه کرده‌ام و می‌پذیرم.
      </label>
      <Button type="submit" size="lg">ارسال درخواست عضویت</Button>
    </form>
  )
}

export default function Suppliers() {
  const benefits = [
    { icon: Wallet, t: 'پول شما از قبل تضمین است', d: 'پیش از برش اولین قطعه، مبلغ در حساب امانی قفل شده است. دیگر دنبال چک برگشتی نمی‌دوید.' },
    { icon: CalendarClock, t: 'ظرفیت خالی پر می‌شود', d: 'سفارش‌ها بر اساس ماشین‌آلات و ظرفیت آزاد شما ارسال می‌شوند، نه بر اساس رابطه.' },
    { icon: EyeOff, t: 'بدون چانه‌زنی و بازاریابی', d: 'شما فقط قیمت و زمان می‌دهید. پیگیری مشتری، فاکتور و حل اختلاف با متالیکس است.' },
    { icon: Gauge, t: 'رتبه شما سرمایه شماست', d: 'هر تحویل به‌موقع و هر QC موفق امتیاز شما را بالا می‌برد و سفارش‌های بزرگ‌تر می‌آورد.' },
  ]
  return (
    <>
      <PageHero title="کارگاه دارید؟ ماشین‌ها را بیکار نگذارید." desc="به شبکه سازندگان متالیکس بپیوندید. سفارش‌های مهندسی‌شده با نقشه کامل و پرداخت تضمین‌شده، مستقیم در پنل شما.">
        <div className="mt-8 flex gap-3"><Button size="lg" onClick={() => document.getElementById('apply')?.scrollIntoView()}>درخواست عضویت</Button><Button to="/supplier" size="lg" variant="secondary">نمونه پنل سازنده</Button></div>
      </PageHero>
      <section className="container-x py-16">
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.t} className="flex gap-4"><b.icon className="mt-1 shrink-0 text-heat" size={26} /><div><h3 className="text-[18px] font-bold text-white">{b.t}</h3><p className="mt-1.5 text-[14.5px] leading-7 text-steel-300">{b.d}</p></div></div>
          ))}
        </div>
      </section>
      <section className="border-y border-steel-700/60 bg-steel-950/60 py-20">
        <div className="container-x">
          <SectionHead title="امتیاز شما چطور محاسبه می‌شود؟" desc="فرمول امتیازدهی شفاف است. اسلایدرها را جابه‌جا کنید تا ببینید هر شاخص چه اثری دارد." />
          <ScoreSim />
        </div>
      </section>
      <section id="apply" className="container-x grid gap-10 py-20 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <SectionHead className="mb-6" title="مراحل عضویت" />
          <ol className="space-y-6">
            {['ثبت درخواست و مدارک حقوقی', 'بازدید کارشناس از کارگاه و احراز ماشین‌آلات', 'سفارش آزمایشی با بازرسی کامل', 'فعال‌سازی و دریافت مناقصه‌ها'].map((t, i) => (
              <li key={t} className="flex gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-steel-600 font-semibold text-heat">{fa(i + 1)}</span><span className="pt-1.5 text-steel-100">{t}</span></li>
            ))}
          </ol>
        </div>
        <Apply />
      </section>
    </>
  )
}
