import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Percent, Package, Gavel, Timer, ShieldCheck, Eye, Activity } from 'lucide-react'
import { PageTitle, Stat, Card } from '@/components/app/Kit'
import { Badge } from '@/components/ui/Badge'
import { GMV_SERIES, AUDIT, APPROVALS } from '@/data/mock'
import { cn, fa } from '@/lib/format'

const GmvChart = lazy(() => import('@/components/charts/Charts').then((m) => ({ default: m.GmvChart })))

const FUNNEL = [['ثبت سفارش', 64], ['تأیید فنی', 57], ['دریافت پیشنهاد', 54], ['انتخاب سازنده', 46], ['پرداخت امانی', 44], ['تحویل و تسویه', 41]] as const

export default function Overview() {
  return (
    <>
      <PageTitle title="مرکز کنترل متالیکس" desc="نمای لحظه‌ای عملیات، مالی و ریسک پلتفرم · آبان ۱۴۰۵" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="ارزش معاملات آبان (GMV)" value="۶٫۷ میلیارد" hint="تومان · ۱۶٪+ نسبت به مهر" accent="cut" icon={<TrendingUp size={16} />} />
        <Stat label="درآمد ناخالص بازرگانی" value="۸۰۴ میلیون" hint="حاشیه میانگین ۱۲٪" accent="heat" icon={<Percent size={16} />} />
        <Stat label="نرخ تبدیل سفارش" value="۶۴٪" hint="بسته‌شده ÷ ثبت‌شده" accent="ok" icon={<Package size={16} />} />
        <Stat label="اختلاف باز" value="۳" hint="نرخ اختلاف ۲٫۱٪" accent="err" icon={<Gavel size={16} />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card title="رشد ماهانه"><Suspense fallback={<div className="h-72" />}><GmvChart data={GMV_SERIES} /></Suspense></Card>
        <Card title="قیف سفارش آبان">
          <ul className="space-y-3">
            {FUNNEL.map(([l, v], i) => (
              <li key={l}>
                <div className="mb-1 flex justify-between text-[13px]"><span className="text-steel-300">{l}</span><span className="text-white">{fa(v)}</span></div>
                <div className="h-6 overflow-hidden rounded-md bg-steel-800"><div className={cn('h-full rounded-md', i === FUNNEL.length - 1 ? 'bg-ok/70' : 'temper-bar opacity-80')} style={{ width: `${(v / 64) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[12.5px]">
            <div className="rounded-lg bg-steel-800 py-2"><div className="text-steel-400">میانگین چرخه</div><div className="font-semibold text-white">۱۸٫۴ روز</div></div>
            <div className="rounded-lg bg-steel-800 py-2"><div className="text-steel-400">تحویل به‌موقع</div><div className="font-semibold text-ok">۹۱٪</div></div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title={<span className="flex items-center gap-2"><ShieldCheck size={16} />تأییدهای مالی معوق</span>} actions={<Link to="/admin/approvals" className="text-[13px] text-cut hover:underline">صف کامل</Link>}>
          <ul className="space-y-3">{APPROVALS.filter((a) => a.step < 2).map((a) => (
            <li key={a.id} className="flex items-center justify-between text-[13.5px]"><span><span className="block text-white">{a.type}</span><span className="code text-[11.5px] text-steel-400">{a.id}</span></span><Badge tone={a.step === 1 ? 'info' : 'heat'}>در انتظار امضای {fa(a.step + 1)}</Badge></li>
          ))}</ul>
        </Card>
        <Card title={<span className="flex items-center gap-2"><Eye size={16} />ایجنت حاکمیت پیام</span>} actions={<Link to="/admin/surveillance" className="text-[13px] text-cut hover:underline">جزئیات</Link>}>
          <div className="flex items-end gap-6"><div><div className="font-display text-[34px] font-black text-white">۱۲۷</div><div className="text-[12.5px] text-steel-400">پیام ماسک‌شده در آبان</div></div><div><div className="font-display text-[34px] font-black text-err">۴</div><div className="text-[12.5px] text-steel-400">کاربر با ۳ اخطار</div></div></div>
          <p className="mt-3 text-[12.5px] leading-6 text-steel-400">۸۲٪ شماره موبایل، ۱۱٪ شبکه اجتماعی، ۷٪ وب‌سایت و ایمیل</p>
        </Card>
        <Card title={<span className="flex items-center gap-2"><Activity size={16} />رویدادهای اخیر</span>} actions={<Link to="/admin/audit" className="text-[13px] text-cut hover:underline">لاگ ممیزی</Link>}>
          <ul className="space-y-2.5">{AUDIT.slice(0, 4).map((a) => (
            <li key={a.t + a.ent} className="flex gap-3 text-[13px]"><span className="code shrink-0 text-steel-500">{a.t}</span><span className="text-steel-200">{a.d}</span></li>
          ))}</ul>
        </Card>
      </div>

      <Card title="سلامت سرویس‌ها" className="mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[['API', '۹۹٫۹۸٪', 'ok'], ['درگاه شاپرک', 'متصل', 'ok'], ['سامانه مؤدیان', 'صف: ۳', 'warn'], ['پیامک', 'متصل', 'ok'], ['پردازش CAD', '۲۲ ثانیه', 'ok'], ['پشتیبان‌گیری', '۰۳:۰۰', 'ok']].map(([n, v, t]) => (
            <div key={n} className="flex items-center gap-2.5 rounded-ctl bg-steel-800 px-3 py-2.5"><span className={cn('h-2 w-2 rounded-full', t === 'ok' ? 'bg-ok' : 'bg-warn')} /><span className="flex-1 text-[13px] text-steel-200">{n}</span><span className="text-[12px] text-steel-400">{v}</span></div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[12px] text-steel-500"><Timer size={13} /> به‌روزرسانی: هر ۳۰ ثانیه (نمایشی)</p>
      </Card>
    </>
  )
}
