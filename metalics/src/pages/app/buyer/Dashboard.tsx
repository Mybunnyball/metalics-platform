import { Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Plus, Lock, Timer, Gavel, ArrowLeft, Scale, ClipboardCheck, CreditCard } from 'lucide-react'
import { PageTitle, Stat, Card, Progress } from '@/components/app/Kit'
import { Button } from '@/components/ui/Button'
import { StatePill } from '@/components/ui/Badge'
import { PartDrawing } from '@/components/ui/PartDrawing'
import { ORDERS, BUYER, SPEND_SERIES, NOTIFICATIONS } from '@/data/mock'
import { compactToman, fa, jshort, cn } from '@/lib/format'

const SpendArea = lazy(() => import('@/components/charts/Charts').then((m) => ({ default: m.SpendArea })))

export default function Dashboard() {
  const active = ORDERS.filter((o) => !['SETTLED', 'CLOSED'].includes(o.state))
  const escrow = ORDERS.filter((o) => ['IN_PRODUCTION', 'SHIPPED', 'DISPUTED'].includes(o.state)).reduce((s, o) => s + o.amount, 0)
  const used = 1_362_400_000
  return (
    <>
      <PageTitle title={`صبح بخیر، ${BUYER.person.split(' ').slice(-2).join(' ')}`} desc={`${BUYER.company} · ${BUYER.tier}`} actions={<Button to="/quote"><Plus size={16} /> سفارش جدید</Button>} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="سفارش‌های جاری" value={fa(active.length)} hint="۲ مورد نیازمند اقدام شما" icon={<ClipboardCheck size={16} />} />
        <Stat label="وجه در اسکرو" value={compactToman(escrow)} hint="تا تأیید کیفیت آزاد نمی‌شود" accent="heat" icon={<Lock size={16} />} />
        <Stat label="تحویل به‌موقع (۶ ماه)" value="۹۴٪" hint="۱۵ از ۱۶ سفارش" accent="ok" icon={<Timer size={16} />} />
        <Stat label="پرونده داوری باز" value="۱" hint="جلسه سه‌جانبه پنجشنبه" accent="err" icon={<Gavel size={16} />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card title="نیازمند اقدام شما">
            <div className="grid gap-3 md:grid-cols-2">
              <Link to="/app/rfq/MTX-1405-4855" className="group flex gap-4 rounded-ctl border border-heat/40 bg-heat/5 p-4 transition-colors hover:bg-heat/10">
                <Scale className="mt-1 shrink-0 text-heat" size={22} />
                <div className="flex-1"><div className="font-semibold text-white">۴ پیشنهاد برای براکت نوار نقاله</div><div className="mt-1 text-[13px] text-steel-300">از ۱۳۹ تا ۱۶۴ میلیون تومان · مهلت انتخاب ۴۸ ساعت</div></div>
                <ArrowLeft size={18} className="mt-1 text-steel-400 transition-transform group-hover:-translate-x-1" />
              </Link>
              <Link to="/app/orders/MTX-1405-4821" className="group flex gap-4 rounded-ctl border border-ok/30 bg-ok/5 p-4 transition-colors hover:bg-ok/10">
                <ClipboardCheck className="mt-1 shrink-0 text-ok" size={22} />
                <div className="flex-1"><div className="font-semibold text-white">تأیید نمونه اول فلنج سنگ‌شکن</div><div className="mt-1 text-[13px] text-steel-300">گزارش ابعادی FAI بارگذاری شده است</div></div>
                <ArrowLeft size={18} className="mt-1 text-steel-400 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </Card>

          <Card title="سفارش‌های جاری" actions={<Link to="/app/orders" className="text-[13px] text-cut hover:underline">همه سفارش‌ها</Link>} pad={false}>
            <ul className="divide-y divide-steel-800">
              {active.map((o) => (
                <li key={o.id}>
                  <Link to={o.state === 'QUOTED' ? `/app/rfq/${o.id}` : o.state === 'DISPUTED' ? '/app/disputes/DSP-1405-031' : `/app/orders/${o.id}`} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-steel-800/60">
                    <div className="blueprint-grid hidden h-12 w-14 shrink-0 rounded-lg border border-steel-700 p-1 sm:block"><PartDrawing kind={o.thumb} /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2"><span className="truncate font-medium text-white">{o.title}</span><StatePill state={o.state} /></div>
                      <div className="mt-1 flex flex-wrap gap-x-3 text-[12.5px] text-steel-400"><span className="code">{o.id}</span><span>{o.material} · {fa(o.qty)} عدد</span><span>تحویل {jshort(o.due)}</span></div>
                    </div>
                    <div className="hidden w-32 md:block"><Progress value={o.progress} tone={o.state === 'DISPUTED' ? 'heat' : 'temper'} /><div className="mt-1 text-left text-[11.5px] text-steel-400">{fa(o.progress)}٪</div></div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="خط اعتباری شرکت" actions={<CreditCard size={16} className="text-steel-400" />}>
            <div className="flex items-end justify-between"><span className="text-[13px] text-steel-300">استفاده‌شده</span><span className="font-display text-[20px] font-bold text-white">{compactToman(used)} <span className="text-[13px] font-normal text-steel-400">از {compactToman(BUYER.credit)} تومان</span></span></div>
            <Progress value={(used / BUYER.credit) * 100} className="mt-3 h-2" tone="temper" />
            <p className="mt-3 text-[12.5px] leading-6 text-steel-400">پیش‌پرداخت ۳۰٪ + چک صیادی ثبت‌شده. سررسید بعدی: ۲۵ آذر.</p>
          </Card>
          <Card title="خرید ماهانه (میلیون تومان)">
            <Suspense fallback={<div className="h-56" />}><SpendArea data={SPEND_SERIES} /></Suspense>
          </Card>
          <Card title="آخرین رویدادها" pad={false}>
            <ul className="divide-y divide-steel-800">
              {NOTIFICATIONS.map((n) => (
                <li key={n.t}><Link to={n.link} className="flex gap-3 px-4 py-3 hover:bg-steel-800/60">
                  <span className={cn('mt-2 h-2 w-2 shrink-0 rounded-full', n.tone === 'heat' ? 'bg-heat' : n.tone === 'ok' ? 'bg-ok' : n.tone === 'err' ? 'bg-err' : 'bg-cut')} />
                  <span><span className="block text-[13.5px] text-white">{n.t}</span><span className="text-[12px] text-steel-400">{n.time}</span></span>
                </Link></li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
