import { Bot, FileLock2, ScanEye, Server, Layout, Database, Cloud } from 'lucide-react'
import { PageHero, SectionHead } from '@/components/ui/Section'
import { LogoMark } from '@/components/ui/Logo'
import { cn, fa } from '@/lib/format'

const ROADMAP = [
  { from: 1, to: 3, t: 'زیرساخت داده و هسته امنیتی', d: 'مدل داده PostgreSQL، طراحی RBAC، ورود پیامکی، ماژول ماسک اطلاعات تماس', c: 'bg-temper-straw' },
  { from: 4, to: 6, t: 'فرم هوشمند و موتور مناقصه', d: 'Intake Wizard، واترمارک خودکار CAD، پنل مناقصه کور', c: 'bg-temper-bronze' },
  { from: 7, to: 10, t: 'ماژول مالی، اسکرو و قرارداد', d: 'درگاه شاپرک، شناسه واریز، تسویه چهارچشمی، تولید خودکار قراردادهای الف و ب', c: 'bg-temper-violet' },
  { from: 11, to: 12, t: 'لجستیک، داوری و پایلوت', d: 'ثبت راننده و OTP، پروتکل FAI، پایلوت با ۵ سفارش واقعی، اتصال سامانه مؤدیان', c: 'bg-temper-blue' },
]

const AGENTS = [
  { icon: Bot, t: 'ایجنت حاکمیت پیام', d: 'ترکیب الگوهای Regex و مدل زبانی محلی برای تشخیص شماره تماس، شبکه اجتماعی و اشاره‌های ضمنی به آدرس کارگاه، پیش از ذخیره پیام.' },
  { icon: FileLock2, t: 'ایجنت پیش‌پردازش و واترمارک CAD', d: 'حذف نام کارفرما از جدول مشخصات نقشه، درج کد رهگیری و واترمارک اختصاصی هر سازنده روی PDF، DWG، DXF و STEP.' },
  { icon: ScanEye, t: 'ایجنت غربالگری نقص', d: 'در گام اول داوری، ابعاد اعلام‌شده در تصاویر را با تلرانس‌های نقشه مقایسه و در صورت نیاز، عکس با ابزار اندازه‌گیری درخواست می‌کند.' },
]

const STACK = [
  { icon: Layout, t: 'رابط کاربری', d: 'React + TypeScript + Tailwind CSS (همین نسخه ارائه) — در فاز تولید: Next.js و PWA' },
  { icon: Server, t: 'سرور', d: 'Python FastAPI، ناهمگام و یکپارچه با ماژول‌های هوش مصنوعی و بینایی ماشین' },
  { icon: Database, t: 'داده', d: 'PostgreSQL با JSONB برای مشخصات فنی + Redis برای صف پردازش و کش' },
  { icon: Cloud, t: 'میزبانی', d: 'دیتاسنتر داخلی هماهنگ با شاپرک، ذخیره‌ساز سازگار با S3 و رمزنگاری نقشه‌ها' },
]

const KPIS = [
  ['نرخ تبدیل سفارش', 'سفارش‌های بسته‌شده ÷ سفارش‌های ثبت‌شده'],
  ['میانگین زمان چرخه', 'از ثبت سفارش تا تأیید نهایی خریدار'],
  ['تحویل به‌موقع', 'سفارش‌های تحویل‌شده تا تاریخ تعهد ÷ کل'],
  ['نرخ اختلاف', 'پرونده‌های داوری ÷ سفارش‌های تحویل‌شده'],
]

export default function About() {
  return (
    <>
      <PageHero title="درباره متالیکس" desc="بازار سنتی فولاد ایران دهه‌هاست درگیر واسطه‌گری، عدم انطباق محصول با نقشه، تأخیرهای کارگاهی و فرار از مسئولیت عیب است. متالیکس با یک ایده ساده شروع شد: یک طرف قرارداد که مسئولیت همه این‌ها را بپذیرد." />

      <section className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5 text-[15.5px] leading-8 text-steel-300">
          <p>متالیکس نخستین بازارگاه مهندسی‌شده و مدیریت‌شده در صنعت ساخت قطعات و سازه‌های فلزی سفارشی ایران است. ما میان سفارش‌دهندگان صنعتی — شرکت‌های EPC، معادن، سیمان، فولاد، نفت و گاز و انبوه‌سازان — و کارگاه‌ها و کارخانه‌های مجهز به ماشین‌آلات پیشرفته قرار می‌گیریم.</p>
          <p>ما فروشنده آهن‌آلات خام نیستیم. هر سفارش در متالیکس ارزش افزوده مهندسی دارد: برش لیزر و پلاسما، خم‌کاری، ماشین‌کاری CNC، جوشکاری تخصصی، مونتاژ، عملیات حرارتی یا پوشش صنعتی.</p>
          <p>الگوی مرجع ما پلتفرم‌های جهانی مانند Xometry است. تفاوت ما در دو نقطه است: حذف تأخیر چندروزه قیمت‌گذاری دستی با تحلیل هوشمند نقشه‌های دوبعدی، و انطباق کامل با واقعیت‌های بازار ایران — از سامانه مؤدیان و چک صیادی تا لجستیک جاده‌ای.</p>
        </div>
        <aside className="temper-border h-fit rounded-panel p-6">
          <LogoMark className="h-12 w-12" />
          <div className="mt-5 text-[13px] text-steel-400">بنیان‌گذار، طراح و معمار پلتفرم</div>
          <div className="mt-1 text-[22px] font-bold text-white">احسان کوثری هاشمی</div>
          <div className="mt-1 text-steel-300">کارشناس ارشد مهندسی عمران</div>
          <p className="mt-4 border-t border-steel-700 pt-4 text-[14px] leading-7 text-steel-300">طراحی‌شده بر پایه تجربه میدانی تولید صنعتی و انطباق با موازین مالیاتی و حقوقی ایران.</p>
        </aside>
      </section>

      <section id="roadmap" className="border-y border-steel-700/60 bg-steel-950/60 py-20">
        <div className="container-x">
          <SectionHead title="نقشه راه MVP — ۱۲ هفته" desc="پیاده‌سازی فشرده با اولویت آزمودن جریان کامل سفارش در بازار واقعی." />
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[220px_repeat(12,1fr)] gap-px text-center text-[12px] text-steel-400">
                <div />{Array.from({ length: 12 }, (_, i) => <div key={i} className="py-2">هفته {fa(i + 1)}</div>)}
              </div>
              {ROADMAP.map((r) => (
                <div key={r.t} className="grid grid-cols-[220px_repeat(12,1fr)] items-center gap-px border-t border-steel-800 py-3">
                  <div className="pl-4"><div className="text-[14px] font-medium text-white">{r.t}</div><div className="text-[12px] leading-5 text-steel-400">{r.d}</div></div>
                  {Array.from({ length: 12 }, (_, i) => {
                    const on = i + 1 >= r.from && i + 1 <= r.to
                    return <div key={i} className={cn('h-7', on ? r.c : 'bg-steel-850', on && i + 1 === r.from && 'rounded-r-md', on && i + 1 === r.to && 'rounded-l-md')} />
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <SectionHead title="سه ایجنت هوشمند در قلب پلتفرم" />
        <div className="grid gap-4 md:grid-cols-3">
          {AGENTS.map((a) => (
            <div key={a.t} className="rounded-panel border border-steel-700 bg-steel-850 p-6"><a.icon className="text-heat" size={26} /><h3 className="mt-4 text-[17px] font-bold text-white">{a.t}</h3><p className="mt-2 text-[14px] leading-7 text-steel-300">{a.d}</p></div>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-12 pb-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-[24px] font-bold text-white">پشته فناوری</h2>
          <ul className="space-y-5">{STACK.map((s) => <li key={s.t} className="flex gap-4"><s.icon className="mt-1 shrink-0 text-cut" size={20} /><div><div className="font-medium text-white">{s.t}</div><div className="text-[14px] leading-7 text-steel-300">{s.d}</div></div></li>)}</ul>
        </div>
        <div>
          <h2 className="mb-6 text-[24px] font-bold text-white">شاخص‌های کلیدی موفقیت</h2>
          <dl className="divide-y divide-steel-700 rounded-panel border border-steel-700">
            {KPIS.map(([k, v]) => <div key={k} className="px-5 py-4"><dt className="font-medium text-white">{k}</dt><dd className="mt-1 text-[14px] text-steel-300">{v}</dd></div>)}
          </dl>
        </div>
      </section>
    </>
  )
}
