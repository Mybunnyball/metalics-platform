import { useState } from 'react'
import { AlertTriangle, Check } from 'lucide-react'
import { PageHero, SectionHead } from '@/components/ui/Section'
import { PartDrawing, type PartKind } from '@/components/ui/PartDrawing'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/layout/Icon'
import { PROCESSES, QC_TIERS, FINISHES, MATERIALS } from '@/data/catalog'
import { cn, fa, toman } from '@/lib/format'

/** قواعد طراحی برای ساخت (DFM) — پایه پرامپت‌ها و الگوریتم‌های تحلیل هوشمند نقشه */
const DFM: Record<string, { rule: string; why: string }[]> = {
  laser: [
    { rule: 'حداقل قطر سوراخ برابر ضخامت ورق باشد', why: 'سوراخ کوچک‌تر از ضخامت لبه را می‌سوزاند و گرد درنمی‌آید.' },
    { rule: 'عرض شیار و پل‌های باریک ≥ ۱٫۵ برابر ضخامت', why: 'پل‌های باریک در اثر حرارت تاب برمی‌دارند.' },
    { rule: 'فاصله سوراخ تا لبه ≥ ضخامت ورق', why: 'از ترک‌خوردن و تغییر شکل لبه جلوگیری می‌کند.' },
  ],
  plasma: [
    { rule: 'برای سوراخ‌های دقیق، مته‌کاری بعد از برش در نظر بگیرید', why: 'پلاسما لبه مخروطی (Bevel) ۱ تا ۳ درجه دارد.' },
    { rule: 'حداقل قطر سوراخ ۱٫۵ برابر ضخامت', why: 'شروع قوس پلاسما در سوراخ کوچک دقیق نیست.' },
  ],
  bending: [
    { rule: 'فاصله سوراخ تا خط خم ≥ ۲٫۵ ضخامت + شعاع خم', why: 'در غیر این صورت سوراخ بیضی و دفرمه می‌شود.' },
    { rule: 'شعاع داخلی خم ≥ ضخامت ورق (برای ST37)', why: 'شعاع کوچک‌تر باعث ترک در سطح بیرونی می‌شود؛ برای Hardox تا ۴ برابر.' },
    { rule: 'حداقل طول بال خم ۴ برابر ضخامت', why: 'بال کوتاه روی قالب V پرس‌برک جا نمی‌شود.' },
  ],
  cnc: [
    { rule: 'گوشه‌های داخلی تیز ۹۰ درجه را با Fillet طراحی کنید', why: 'فرز انگشتی گرد است؛ گوشه تیز فقط با وایرکات یا اسپارک ساخته می‌شود.' },
    { rule: 'نسبت عمق به قطر سوراخ ≤ ۴ (استاندارد)', why: 'سوراخ عمیق‌تر به مته مخصوص و زمان بیشتر نیاز دارد.' },
    { rule: 'ضخامت دیواره ≥ ۰٫۸ mm برای فولاد', why: 'دیواره نازک در ماشین‌کاری می‌لرزد و ابزار را می‌شکند.' },
  ],
  welding: [
    { rule: 'نوع و اندازه جوش را با علائم استاندارد ISO 2553 مشخص کنید', why: 'بدون علامت جوش، سازنده بر اساس حدس قیمت می‌دهد.' },
    { rule: 'برای جوش نفوذی کامل، پخ‌زنی لبه را در نقشه بیاورید', why: 'هزینه و زمان آماده‌سازی لبه قابل توجه است.' },
  ],
  structure: [
    { rule: 'نقشه‌های شاپ با شماره‌گذاری قطعات (Mark No.) ارسال شود', why: 'برای مونتاژ در محل و کنترل تحویل الزامی است.' },
    { rule: 'محدودیت حمل جاده‌ای (عرض ۲٫۵ متر) را در تقسیم‌بندی قطعات لحاظ کنید', why: 'قطعات بزرگ‌تر به مجوز حمل ترافیکی نیاز دارند.' },
  ],
  assembly: [
    { rule: 'نقشه اسمبلی همراه BOM و مشخصات قطعات خریدنی', why: 'جک، پمپ و شیرها باید با برند و فشار کاری مشخص شوند.' },
    { rule: 'شرایط تست عملکرد را تعریف کنید (فشار، زمان، نشتی)', why: 'معیار پذیرش بدون تعریف تست قابل داوری نیست.' },
  ],
}

const KIND: Record<string, PartKind> = { laser: 'plate', plasma: 'plate', bending: 'bracket', cnc: 'shaft', welding: 'frame', structure: 'frame', assembly: 'flange' }

export default function Capabilities() {
  const [active, setActive] = useState(PROCESSES[0].id)
  const p = PROCESSES.find((x) => x.id === active)!
  const fits = MATERIALS.filter((m) => (p.id === 'cnc' ? m.machinability <= 1.4 : m.family !== 'مس و برنج')).slice(0, 6)

  return (
    <>
      <PageHero title="خدمات ساخت، با مشخصات فنی واقعی" desc="هر فرآیند با محدوده دقت، ابعاد و قواعد طراحی‌اش. پیش از بارگذاری نقشه، قواعد DFM را مرور کنید تا سفارش سریع‌تر و ارزان‌تر قیمت بخورد." />

      <section className="container-x grid gap-8 py-14 lg:grid-cols-[260px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:sticky lg:top-24 lg:h-fit lg:flex-col lg:overflow-visible" aria-label="فرآیندها">
          {PROCESSES.map((x) => (
            <button key={x.id} onClick={() => setActive(x.id)}
              className={cn('flex shrink-0 items-center gap-3 rounded-ctl border px-3.5 py-3 text-right text-sm transition-colors',
                active === x.id ? 'border-heat/50 bg-heat/10 text-white' : 'border-steel-700 text-steel-300 hover:border-steel-500 hover:text-white')}>
              <Icon name={x.icon} size={18} className={active === x.id ? 'text-heat' : 'text-steel-400'} />
              {x.name}
            </button>
          ))}
        </nav>

        <div key={p.id} className="min-w-0">
          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <div>
              <h2 className="text-[28px] font-bold text-white">{p.name}</h2>
              <p className="mt-3 text-[15.5px] leading-8 text-steel-300">{p.desc}</p>
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-steel-700 bg-steel-700">
                {[['دقت ابعادی', p.tolerance], ['حداکثر ابعاد', p.maxSize], ['ماشین‌آلات شبکه', p.machines], ['زمان ساخت پایه', `${fa(p.baseDays)} روز کاری`]].map(([k, v]) => (
                  <div key={k} className="bg-steel-850 p-4"><dt className="text-[12.5px] text-steel-400">{k}</dt><dd className="mt-1 font-medium text-white">{v}</dd></div>
                ))}
              </dl>
            </div>
            <div className="panel-raised blueprint-grid aspect-square p-5"><PartDrawing kind={KIND[p.id]} /></div>
          </div>

          <h3 className="mt-12 text-[19px] font-bold text-white">قواعد طراحی برای ساخت (DFM)</h3>
          <p className="mt-1 text-sm text-steel-400">موتور تحلیل متالیکس نقشه شما را با همین قواعد بررسی می‌کند و پیش از ارسال به کارگاه هشدار می‌دهد.</p>
          <ul className="mt-5 space-y-3">
            {DFM[p.id].map((d) => (
              <li key={d.rule} className="flex gap-4 rounded-panel border border-steel-700 bg-steel-850 p-4">
                <AlertTriangle className="mt-1 shrink-0 text-warn" size={18} />
                <div><div className="font-medium text-white">{d.rule}</div><div className="mt-1 text-[14px] text-steel-300">{d.why}</div></div>
              </li>
            ))}
          </ul>

          <h3 className="mt-12 text-[19px] font-bold text-white">متریال‌های رایج برای این فرآیند</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {fits.map((m) => <span key={m.id} className="rounded-full border border-steel-600 px-3 py-1 text-[13px] text-steel-200">{m.name} <span className="text-steel-400">· {m.equivalent}</span></span>)}
          </div>
          <Button to="/quote" className="mt-8">دریافت قیمت {p.short}</Button>
        </div>
      </section>

      <section className="border-t border-steel-700/60 bg-steel-950/60 py-20">
        <div className="container-x">
          <SectionHead title="سه سطح کنترل کیفیت" desc="هزینه اثبات کیفیت جدا از هزینه ساخت محاسبه می‌شود. سطح متناسب با حساسیت قطعه را انتخاب کنید." />
          <div className="grid gap-4 md:grid-cols-3">
            {QC_TIERS.map((t, i) => (
              <div key={t.id} className={cn('rounded-panel border p-6', i === 1 ? 'temper-border' : 'border-steel-700 bg-steel-850')}>
                <div className="flex items-baseline justify-between"><h3 className="text-[20px] font-bold text-white">{t.name}</h3><span className="text-[13px] text-heat">{t.price}</span></div>
                <p className="mt-1 text-[13px] text-steel-400">مناسب {t.fit}</p>
                <ul className="mt-5 space-y-2.5">{t.items.map((x) => <li key={x} className="flex gap-2 text-[14px] text-steel-200"><Check size={16} className="mt-1 shrink-0 text-ok" />{x}</li>)}</ul>
              </div>
            ))}
          </div>

          <h3 className="mb-4 mt-16 text-[19px] font-bold text-white">پوشش و عملیات سطحی</h3>
          <div className="overflow-hidden rounded-panel border border-steel-700">
            {FINISHES.filter((f) => f.id !== 'none').map((f) => (
              <div key={f.id} className="flex items-center justify-between border-b border-steel-800 px-5 py-3.5 last:border-0">
                <span className="text-white">{f.name}</span><span className="text-[14px] text-steel-300">از {toman(f.pricePerM2)} / متر مربع</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
