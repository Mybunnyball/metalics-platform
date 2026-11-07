import { lazy, Suspense } from 'react'
import { Lock, CheckCircle2, Clock, Landmark } from 'lucide-react'
import { PageTitle, Card, Stat, Th, Td } from '@/components/app/Kit'
import { Badge } from '@/components/ui/Badge'
import { fa, toman } from '@/lib/format'

const MiniBars = lazy(() => import('@/components/charts/Charts').then((m) => ({ default: m.MiniBars })))

const ROWS = [
  { id: 'PAY-30920', order: 'MTX-1405-4577', t: 'بوش برنجی یاتاقان', amount: 80_100_000, st: 'step2', d: 'امروز' },
  { id: 'PAY-30902', order: 'MTX-1405-4790', t: 'لاینر ضدسایش شوت — ۵۰٪ اول', amount: 309_700_000, st: 'paid', d: '۱۰ آبان' },
  { id: 'PAY-30881', order: 'MTX-1405-4611', t: 'صفحه ستون سوله', amount: 172_400_000, st: 'paid', d: '۲۸ مهر' },
  { id: 'ESC-4790-B', order: 'MTX-1405-4790', t: 'لاینر ضدسایش شوت — ۵۰٪ دوم', amount: 309_700_000, st: 'locked', d: 'پس از تحویل OTP' },
]

export default function Payouts() {
  return (
    <>
      <PageTitle title="تسویه‌ها" desc="همه پرداخت‌ها از حساب امانی متالیکس و با تأیید دومرحله‌ای انجام می‌شوند." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="تضمین‌شده در اسکرو" value="۳۸۹ میلیون" hint="تومان · برای سفارش‌های جاری" accent="heat" icon={<Lock size={16} />} />
        <Stat label="در صف تأیید" value="۸۰ میلیون" hint="مرحله دوم: سوپرادمین" icon={<Clock size={16} />} />
        <Stat label="پرداخت‌شده ۱۴۰۵" value="۲٫۴ میلیارد" hint="تومان" accent="ok" icon={<CheckCircle2 size={16} />} />
        <Stat label="میانگین زمان تسویه" value="۱٫۸ روز" hint="پس از تأیید خریدار" accent="cut" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card title="تراکنش‌ها" pad={false}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead className="border-b border-steel-700"><tr><Th>شناسه</Th><Th>سفارش</Th><Th>مبلغ</Th><Th>وضعیت</Th><Th>تاریخ</Th></tr></thead>
              <tbody className="divide-y divide-steel-800">
                {ROWS.map((r) => (
                  <tr key={r.id}>
                    <Td className="code text-right text-steel-300">{r.id}</Td>
                    <Td><div className="text-white">{r.t}</div><div className="code text-right text-[11.5px] text-steel-400">{r.order}</div></Td>
                    <Td>{toman(r.amount)}</Td>
                    <Td>{r.st === 'paid' ? <Badge tone="ok" dot>واریز شد</Badge> : r.st === 'step2' ? <Badge tone="info" dot>تأیید ۱ از ۲</Badge> : <Badge>قفل در اسکرو</Badge>}</Td>
                    <Td className="text-steel-300">{r.d}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="space-y-6">
          <Card title="دریافتی ماهانه (میلیون تومان)"><Suspense fallback={<div className="h-40" />}><MiniBars data={[{ m: 'خرداد', v: 210 }, { m: 'تیر', v: 340 }, { m: 'مرداد', v: 290 }, { m: 'شهریور', v: 460 }, { m: 'مهر', v: 520 }, { m: 'آبان', v: 482 }]} /></Suspense></Card>
          <Card title="حساب تسویه">
            <div className="flex items-center gap-3"><Landmark className="text-steel-400" size={22} /><div><div className="text-white">بانک ملت · شبای تأییدشده</div><div className="code text-right text-[12.5px] text-steel-400">IR•• •••• •••• •••• 4471</div></div></div>
            <p className="mt-3 text-[12.5px] leading-6 text-steel-400">تغییر شماره شبا فقط با تأیید پیامکی مدیرعامل و بررسی دستی واحد مالی امکان‌پذیر است.</p>
          </Card>
          <p className="text-[12.5px] leading-6 text-steel-400">فاکتور فروش شما باید به نام متالیکس در سامانه مؤدیان صادر شود. {fa(1)} فاکتور در انتظار ثبت دارید.</p>
        </div>
      </div>
    </>
  )
}
