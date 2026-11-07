import { Check, Minus, KeyRound } from 'lucide-react'
import { PageTitle, Card } from '@/components/app/Kit'
import { cn } from '@/lib/format'

const ROLES = ['سوپرادمین', 'مدیر فنی', 'مدیر مالی', 'لجستیک', 'کارشناس فنی', 'سازنده', 'خریدار']
type P = 1 | 0 | 2 // 2 = مشروط
const PERMS: [string, P[]][] = [
  ['مشاهده نقشه CAD اصلی (بدون واترمارک)', [1, 1, 0, 0, 1, 0, 1]],
  ['مشاهده هویت خریدار و سازنده', [1, 1, 2, 2, 0, 0, 0]],
  ['تأیید / رد فنی سفارش', [0, 1, 0, 0, 1, 0, 0]],
  ['صدور رأی داوری', [0, 1, 0, 0, 2, 0, 0]],
  ['صدور فاکتور سامانه مؤدیان', [0, 0, 1, 0, 0, 0, 0]],
  ['امضای اول آزادسازی وجه', [0, 0, 1, 0, 0, 0, 0]],
  ['امضای دوم آزادسازی وجه (OTP)', [1, 0, 0, 0, 0, 0, 0]],
  ['مشاهده تراز اسکرو', [1, 0, 1, 0, 0, 2, 2]],
  ['ثبت اطلاعات راننده و حمل', [0, 0, 0, 1, 0, 1, 0]],
  ['مانیتورینگ GPS محموله', [1, 0, 0, 1, 0, 1, 1]],
  ['تعلیق سازنده', [1, 1, 0, 0, 0, 0, 0]],
  ['ویرایش لاگ‌های ممیزی', [0, 0, 0, 0, 0, 0, 0]],
]

export default function Rbac() {
  return (
    <>
      <PageTitle title="ماتریس نقش‌ها و دسترسی (RBAC)" desc="دسترسی هر نقش بر اساس وظیفه کاری تعریف شده تا اطلاعات فنی و مالی بین بخش‌ها نشت نکند." />
      <Card pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[13.5px]">
            <thead className="border-b border-steel-700 bg-steel-850">
              <tr><th className="px-4 py-3 text-right font-medium text-steel-400">مجوز</th>{ROLES.map((r) => <th key={r} className="px-3 py-3 text-center font-medium text-steel-200">{r}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-steel-800">
              {PERMS.map(([p, v]) => (
                <tr key={p} className="hover:bg-steel-800/40">
                  <td className={cn('px-4 py-3', p.includes('لاگ') ? 'text-err' : 'text-white')}>{p}</td>
                  {v.map((x, i) => (
                    <td key={i} className="px-3 py-3 text-center">
                      {x === 1 ? <Check size={17} className="mx-auto text-ok" /> : x === 2 ? <span className="rounded bg-warn/10 px-1.5 py-0.5 text-[11px] text-warn">مشروط</span> : <Minus size={15} className="mx-auto text-steel-600" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ['اصل حداقل دسترسی', 'هر کاربر فقط داده‌های لازم برای وظیفه خود را می‌بیند؛ سازنده فقط سفارش‌های دعوت‌شده خودش.'],
          ['تفکیک وظایف', 'امضاکننده اول و دوم یک تراکنش نمی‌توانند یک نفر باشند؛ حتی سوپرادمین بدون امضای حسابدار.'],
          ['لاگ غیرقابل‌ویرایش', 'هیچ نقشی، حتی سوپرادمین، امکان حذف یا ویرایش رکوردهای ممیزی را ندارد.'],
        ].map(([t, d]) => (
          <div key={t} className="rounded-panel border border-steel-700 bg-steel-850 p-5"><KeyRound size={18} className="text-heat" /><h3 className="mt-3 font-semibold text-white">{t}</h3><p className="mt-1 text-[13.5px] leading-6 text-steel-300">{d}</p></div>
        ))}
      </div>
    </>
  )
}
