import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Lock, Unlock, ScanEye, UserCheck, Video, ShieldCheck, Truck, KeyRound, Tag, MapPin } from 'lucide-react'
import { PageHero, SectionHead } from '@/components/ui/Section'
import { ORDER_FLOW } from '@/data/states'
import { cn, fa } from '@/lib/format'

const DETAIL: Record<string, { what: string; money: string; notify: string }> = {
  SUBMITTED: { what: 'نقشه، متریال، تعداد، تلرانس و سطح QC ثبت و یک کد رهگیری صادر می‌شود. تأیید مسئولیت نقشه از خریدار گرفته می‌شود.', money: 'هنوز پرداختی انجام نشده', notify: 'پیامک کد رهگیری به خریدار' },
  TECH_REVIEW: { what: 'کارشناس فنی متالیکس قابلیت ساخت، ابهام‌های نقشه و سطح ریسک سفارش را بررسی می‌کند. اگر ایرادی باشد سفارش برای اصلاح برمی‌گردد.', money: 'بدون تراکنش', notify: 'در صورت ابهام، پرسش فنی در چت سفارش' },
  QUOTING: { what: 'نقشه بی‌نام و واترمارک‌دار برای ۳ تا ۱۰ سازنده واجد شرایط ارسال می‌شود. مهلت پاسخ بین ۶ تا ۷۲ ساعت به‌طور خودکار تعیین می‌شود.', money: 'بدون تراکنش', notify: 'دعوت به مناقصه برای سازندگان منتخب' },
  SUPPLIER_SELECTED: { what: 'خریدار پیشنهادها را در ماتریس مقایسه می‌بیند و انتخاب می‌کند. قراردادهای الف و ب به‌طور خودکار تولید و امضای دیجیتال می‌شوند.', money: 'پیش‌فاکتور رسمی با سربرگ متالیکس', notify: 'اعلام برنده به سازنده و رد مؤدبانه بقیه' },
  ESCROW_PAID: { what: 'مبلغ از طریق درگاه شاپرک یا شناسه واریز به حساب امانی واریز می‌شود. مشتریان اعتباری پیش‌پرداخت و تضمین ارائه می‌دهند.', money: '۱۰۰٪ مبلغ در اسکرو قفل است', notify: 'دستور شروع ساخت به سازنده' },
  IN_PRODUCTION: { what: 'سازنده مراحل ساخت را با عکس و درصد پیشرفت گزارش می‌کند. در صورت فعال بودن FAI، ابتدا یک نمونه ساخته و برای تأیید ارسال می‌شود.', money: 'قفل در اسکرو', notify: 'گزارش هفتگی پیشرفت برای خریدار' },
  QC_PASSED: { what: 'بازرسی طبق سطح انتخابی (پایه/صنعتی/دقیق) انجام و گزارش ابعادی و MTC بارگذاری می‌شود.', money: '۵۰٪ آزادسازی مرحله‌ای (برای سفارش‌های مرحله‌ای)', notify: 'گزارش QC برای خریدار' },
  SHIPPED: { what: 'مشخصات راننده، پلاک و بارنامه ثبت می‌شود. بار با برچسب متالیکس و بدون نشان کارخانه ارسال و موقعیت آن زنده نمایش داده می‌شود.', money: 'قفل در اسکرو', notify: 'لینک ردیابی و زمان رسیدن تخمینی' },
  DELIVERED: { what: 'انباردار خریدار کد یکبارمصرف را به راننده می‌دهد. مهلت ۷۲ ساعته بازرسی فنی پس از تحویل شروع می‌شود.', money: 'قفل تا پایان مهلت بازرسی', notify: 'یادآوری مهلت ثبت مغایرت' },
  SETTLED: { what: 'با تأیید خریدار یا پایان مهلت بدون اعتراض، وجه با تأیید دومرحله‌ای (حسابدار + سوپرادمین) به سازنده پرداخت و فاکتورها در سامانه مؤدیان ثبت می‌شوند.', money: 'آزادسازی کامل با اصل چهارچشمی', notify: 'رسید پرداخت و درخواست امتیازدهی' },
}

function StateMachine() {
  const [i, setI] = useState(4)
  const s = ORDER_FLOW[i]; const d = DETAIL[s.id]
  return (
    <section className="container-x py-16">
      <SectionHead title="چرخه عمر یک سفارش" desc="هر سفارش ده وضعیت اصلی دارد. روی هر مرحله بزنید تا ببینید چه کسی مسئول است و پول شما کجاست." />
      <div className="overflow-x-auto pb-2">
        <ol className="flex min-w-[860px] items-start">
          {ORDER_FLOW.map((f, k) => (
            <li key={f.id} className="relative flex-1">
              {k > 0 && <span className={cn('absolute right-[-50%] top-4 h-0.5 w-full', k <= i ? 'bg-heat' : 'bg-steel-700')} />}
              <button onClick={() => setI(k)} className="relative z-10 flex w-full flex-col items-center gap-2 px-1">
                <span className={cn('grid h-8 w-8 place-items-center rounded-full border text-[13px] font-semibold transition-all',
                  k === i ? 'scale-110 border-heat bg-heat text-heat-ink shadow-glow' : k < i ? 'border-heat bg-steel-850 text-heat' : 'border-steel-600 bg-steel-850 text-steel-400')}>{fa(k + 1)}</span>
                <span className={cn('text-center text-[12.5px] leading-5', k === i ? 'text-white' : 'text-steel-400')}>{f.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
          className="panel-raised mt-6 grid gap-6 p-6 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="code text-right text-[12px] text-steel-400">{s.id}</div>
            <h3 className="mt-1 text-[20px] font-bold text-white">{s.label}</h3>
            <p className="mt-2 text-[14.5px] leading-7 text-steel-300">{d.what}</p>
          </div>
          <div className="border-steel-700 md:border-r md:pr-6"><div className="text-[12.5px] text-steel-400">اقدام‌کننده</div><div className="mt-1 text-white">{s.who}</div><div className="mt-4 text-[12.5px] text-steel-400">اعلان</div><div className="mt-1 text-[14px] text-steel-200">{d.notify}</div></div>
          <div className="border-steel-700 md:border-r md:pr-6"><div className="text-[12.5px] text-steel-400">وضعیت وجه</div><div className="mt-1 flex items-center gap-2 text-heat">{i >= 9 ? <Unlock size={16} /> : <Lock size={16} />}{d.money}</div></div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function Money() {
  return (
    <section className="border-y border-steel-700/60 bg-steel-950/60 py-20">
      <div className="container-x">
        <SectionHead title="پرداخت امانی و تسویه دوسطحی" desc="پول خریدار تا تأیید کیفیت نزد متالیکس می‌ماند و سازنده از اول می‌داند پولش تضمین شده است." />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="panel p-6">
            <h3 className="text-[18px] font-bold text-white">سطح ۱ — نقدی با اسکرو کامل</h3>
            <p className="mt-1 text-[13.5px] text-steel-400">کارگاه‌های صنعتی، ماشین‌سازان کوچک و سفارش‌های استاندارد</p>
            <div className="mt-6 flex items-center gap-2 text-[13px]">
              {['واریز ۱۰۰٪', 'تأیید QC', '۵۰٪ به سازنده', 'تحویل OTP', '۵۰٪ باقی‌مانده'].map((t, k) => (
                <div key={t} className="flex flex-1 flex-col items-center gap-2">
                  <div className={cn('h-2 w-full rounded-full', k === 0 ? 'bg-heat' : k % 2 === 0 ? 'bg-ok' : 'bg-steel-600')} />
                  <span className="text-center text-steel-300">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-6">
            <h3 className="text-[18px] font-bold text-white">سطح ۲ — اعتباری شرکتی</h3>
            <p className="mt-1 text-[13.5px] text-steel-400">معادن، پتروشیمی‌ها، فولادسازان و انبوه‌سازان بزرگ</p>
            <ul className="mt-5 space-y-2 text-[14px] text-steel-200">
              <li>• پیش‌پرداخت رسمی حداقل ۳۰٪ نقدی</li>
              <li>• تضمین معتبر: چک صیادی ثبت‌شده در سامانه صیاد یا ضمانت‌نامه بانکی</li>
              <li>• پوشش سرمایه در گردش سازنده از خطوط اعتباری متالیکس با محاسبه مارجین ریسک</li>
            </ul>
          </div>
        </div>
        <div className="temper-border mt-4 flex flex-col gap-4 rounded-panel p-6 md:flex-row md:items-center">
          <ShieldCheck className="shrink-0 text-temper-straw" size={32} />
          <div>
            <h3 className="font-bold text-white">اصل کنترل چهارچشمی</h3>
            <p className="mt-1 text-[14px] leading-7 text-steel-300">هیچ‌کس، حتی مدیر مالی، نمی‌تواند به‌تنهایی وجهی را آزاد یا مسترد کند. هر تراکنش خروجی دو امضا دارد: ممیزی حسابداری و تأیید سوپرادمین با رمز یکبارمصرف. همه اقدام‌ها در لاگ غیرقابل‌ویرایش ثبت می‌شوند.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Disputes() {
  const gates = [
    { icon: ScanEye, t: 'غربالگری هوشمند', d: 'خریدار تصویر عیب را بارگذاری می‌کند. هوش مصنوعی ابعاد را با نقشه تطبیق می‌دهد و در صورت ابهام، عکس با کولیس یا میکرومتر می‌خواهد.', out: 'تشکیل پرونده فنی ظرف ۱۲ تا ۲۴ ساعت' },
    { icon: UserCheck, t: 'ارزیابی کارشناس متالیکس', d: 'کارشناس متالورژی یا مکانیک، ادله را با نسخه نقشه‌ای که سازنده دریافت کرده و توضیحات سازنده مقایسه می‌کند.', out: 'خطای نقشه خریدار: رد ادعا · قصور سازنده: اخطار اصلاح' },
    { icon: Video, t: 'جلسه داوری سه‌جانبه', d: 'جلسه آنلاین با حفظ کامل ناشناس‌ماندن طرفین. رأی نهایی صادر و مستقیماً روی اسکرو اعمال می‌شود.', out: 'آزادسازی، دوباره‌کاری، ساخت مجدد، کسر خسارت یا استرداد' },
  ]
  return (
    <section className="container-x py-20">
      <SectionHead title="داوری فنی در سه گام" desc="مغایرت پس از تحویل فقط دو منشأ دارد: خطای نقشه یا خطای اجرا. این سه گام مشخص می‌کنند کدام است — و تا پایان داوری، وجه آزاد نمی‌شود." />
      <div className="grid gap-4 md:grid-cols-3">
        {gates.map((g, k) => (
          <div key={g.t} className="relative rounded-panel border border-steel-700 bg-steel-850 p-6">
            <div className="flex items-center justify-between"><g.icon className="text-heat" size={24} /><span className="text-[13px] text-steel-400">گام {fa(k + 1)}</span></div>
            <h3 className="mt-4 text-[18px] font-bold text-white">{g.t}</h3>
            <p className="mt-2 text-[14px] leading-7 text-steel-300">{g.d}</p>
            <p className="mt-4 border-t border-steel-700 pt-3 text-[13px] text-cut">{g.out}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Logistics() {
  const items = [
    { icon: Truck, t: 'حمل با مسئولیت سازنده', d: 'شرایط تحویل DAP؛ آسیب ناشی از مهاربندی نادرست با سازنده است.' },
    { icon: UserCheck, t: 'ثبت هویت بارنامه', d: 'نام و کدملی راننده، پلاک کشنده و تصویر بارنامه پیش از خروج.' },
    { icon: MapPin, t: 'ردیابی زنده', d: 'موقعیت کامیون روی نقشه، بدون افشای مبدأ.' },
    { icon: Tag, t: 'بسته‌بندی بی‌نام', d: 'هیچ برچسب یا سربرگ کارخانه؛ فقط برچسب رهگیری متالیکس.' },
    { icon: KeyRound, t: 'تحویل با کد OTP', d: 'کد به موبایل انباردار شما ارسال می‌شود؛ بدون کد، تحویل ثبت نمی‌شود.' },
  ]
  return (
    <section className="border-t border-steel-700/60 bg-steel-950/60 py-20">
      <div className="container-x">
        <SectionHead title="لجستیک غیرمتمرکز" desc="در فاز اول، متالیکس انبار و ناوگان ملکی ندارد؛ اما هر محموله را از درِ کارگاه تا انبار شما رصد می‌کند." />
        <div className="grid gap-px overflow-hidden rounded-panel border border-steel-700 bg-steel-700 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((x) => (
            <div key={x.t} className="bg-steel-900 p-5"><x.icon className="text-cut" size={22} /><h3 className="mt-3 font-bold text-white">{x.t}</h3><p className="mt-1.5 text-[13.5px] leading-6 text-steel-300">{x.d}</p></div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FAQ = [
  ['آیا متالیکس ورق یا تیرآهن خام هم می‌فروشد؟', 'خیر. متالیکس فقط سفارش‌هایی را می‌پذیرد که ارزش افزوده مهندسی دارند: برش، خم، ماشین‌کاری، سوراخ‌کاری، جوش، مونتاژ، عملیات حرارتی یا پوشش صنعتی.'],
  ['اگر نقشه من اشتباه باشد چه می‌شود؟', 'در گام آخر ثبت سفارش، مسئولیت صحت ابعاد و رواداری‌های نقشه را تأیید می‌کنید. کارشناس فنی پیش از مناقصه ابهام‌ها را می‌پرسد، اما اگر خطا از نقشه باشد، هزینه اصلاح با خریدار است.'],
  ['نقشه‌های من کجا ذخیره می‌شوند و چه کسی آن‌ها را می‌بیند؟', 'روی سرورهای داخلی با رمزنگاری. سازنده فقط نسخه واترمارک‌دار با شناسه خودش را می‌بیند و نام شرکت شما از جدول مشخصات نقشه حذف می‌شود.'],
  ['فاکتور رسمی می‌گیرم؟', 'بله. متالیکس فاکتور فروش با مالیات بر ارزش افزوده را در سامانه مؤدیان به نام شما ثبت می‌کند.'],
  ['حداقل تعداد سفارش چقدر است؟', 'حداقل تعداد نداریم؛ اما برای یک عدد قطعه، هزینه راه‌اندازی ماشین سهم بزرگی از قیمت است. از ۲۰ عدد به بالا تخفیف حجمی اعمال می‌شود.'],
]

function Faq() {
  const [o, setO] = useState<number | null>(0)
  return (
    <section className="container-x max-w-3xl py-20">
      <SectionHead title="پرسش‌های پرتکرار" />
      <div className="divide-y divide-steel-700 rounded-panel border border-steel-700">
        {FAQ.map(([q, a], k) => (
          <div key={q}>
            <button onClick={() => setO(o === k ? null : k)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right font-medium text-white" aria-expanded={o === k}>
              {q}<ChevronDown size={18} className={cn('shrink-0 text-steel-400 transition-transform', o === k && 'rotate-180')} />
            </button>
            <AnimatePresence initial={false}>
              {o === k && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <p className="px-5 pb-5 text-[14.5px] leading-7 text-steel-300">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function HowItWorks() {
  return (
    <>
      <PageHero title="نحوه کار متالیکس" desc="از ثبت نقشه تا تسویه حساب: چه کسی چه کاری می‌کند، پول در هر لحظه کجاست و اگر قطعه مطابق نقشه نبود چه اتفاقی می‌افتد." />
      <StateMachine /><Money /><Disputes /><Logistics /><Faq />
    </>
  )
}
