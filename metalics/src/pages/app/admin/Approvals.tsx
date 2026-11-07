import { useState } from 'react'
import { ShieldCheck, Check, KeyRound, UserCog, Lock } from 'lucide-react'
import { PageTitle, Card } from '@/components/app/Kit'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { APPROVALS } from '@/data/mock'
import { cn, fa, toman } from '@/lib/format'

type A = (typeof APPROVALS)[number]

export default function Approvals() {
  const [items, setItems] = useState(APPROVALS)
  const [as, setAs] = useState<'acc' | 'super'>('super')
  const [otpFor, setOtpFor] = useState<A | null>(null)
  const [otp, setOtp] = useState('')
  const toast = useToast()

  const sign1 = (a: A) => { setItems(items.map((x) => (x.id === a.id ? { ...x, step: 1, maker: 'م. رضایی (حسابدار)' } : x))); toast(`امضای اول ${a.id} ثبت شد`) }
  const sign2 = (a: A) => { setItems(items.map((x) => (x.id === a.id ? { ...x, step: 2 } : x))); setOtpFor(null); setOtp(''); toast(`${toman(a.amount)} آزاد و به صف بانک ارسال شد`) }

  return (
    <>
      <PageTitle title="تأیید چهارچشمی تراکنش‌ها" desc="هیچ وجهی با یک امضا جابه‌جا نمی‌شود: ممیزی حسابداری ← تأیید سوپرادمین با رمز یکبارمصرف." actions={
        <div className="flex items-center gap-2 rounded-ctl border border-steel-700 p-1 text-[13px]">
          <UserCog size={16} className="mx-1.5 text-steel-400" />
          {([['acc', 'حسابدار'], ['super', 'سوپرادمین']] as const).map(([k, l]) => <button key={k} onClick={() => setAs(k)} className={cn('rounded-lg px-3 py-1.5', as === k ? 'bg-steel-600 text-white' : 'text-steel-300')}>عمل به‌عنوان {l}</button>)}
        </div>} />

      <div className="temper-border mb-6 flex items-start gap-3 rounded-panel p-4 text-[14px] leading-7 text-steel-200">
        <ShieldCheck className="mt-1 shrink-0 text-temper-straw" size={20} />
        <span>قاعده طلایی: امضاکننده دوم نمی‌تواند همان امضاکننده اول باشد. حتی مدیر مالی بدون رمز یکبارمصرف سوپرادمین قادر به انتقال وجه نیست. همه امضاها با زمان و IP در لاگ غیرقابل‌ویرایش ثبت می‌شوند.</span>
      </div>

      <div className="space-y-3">
        {items.map((a) => (
          <Card key={a.id} className={a.step === 2 ? 'opacity-70' : ''}>
            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1.4fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2"><span className="font-semibold text-white">{a.type}</span><span className="code text-[12px] text-steel-400">{a.id}</span></div>
                <div className="mt-1 text-[13px] text-steel-400">سفارش <span className="code">{a.order}</span> · ذی‌نفع: {a.party}</div>
              </div>
              <div className="font-display text-[20px] font-bold text-white">{toman(a.amount)}</div>
              <ol className="flex items-center gap-2 text-[12.5px]">
                {['ممیزی حسابداری', 'تأیید سوپرادمین'].map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    {i > 0 && <span className={cn('h-px w-6', a.step > i - 0 ? 'bg-ok' : 'bg-steel-600')} />}
                    <span className={cn('flex items-center gap-1.5 rounded-full border px-2.5 py-1', a.step > i ? 'border-ok/40 bg-ok/10 text-ok' : a.step === i ? 'border-heat/40 bg-heat/10 text-heat' : 'border-steel-600 text-steel-400')}>
                      {a.step > i ? <Check size={13} /> : <Lock size={12} />}{s}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="flex justify-end">
                {a.step === 0 && <Button size="sm" disabled={as !== 'acc'} onClick={() => sign1(a)} title={as !== 'acc' ? 'فقط حسابدار' : ''}>امضای اول</Button>}
                {a.step === 1 && <Button size="sm" disabled={as !== 'super'} onClick={() => setOtpFor(a)}><KeyRound size={15} /> تأیید با OTP</Button>}
                {a.step === 2 && <Badge tone="ok" dot>آزاد شد</Badge>}
              </div>
            </div>
            {a.step >= 1 && <p className="mt-3 border-t border-steel-800 pt-2 text-[12px] text-steel-500">امضای اول: {a.maker} · ساعت {a.time}</p>}
          </Card>
        ))}
      </div>

      <Modal open={!!otpFor} onClose={() => setOtpFor(null)} title="تأیید نهایی سوپرادمین">
        {otpFor && (
          <form onSubmit={(e) => { e.preventDefault(); if (otp.length === 6) sign2(otpFor); else toast('کد ۶ رقمی لازم است', 'warn') }} className="space-y-4">
            <p className="text-[14px] leading-7 text-steel-300">آزادسازی <b className="text-white">{toman(otpFor.amount)}</b> به {otpFor.party} برای سفارش <span className="code">{otpFor.order}</span>. کد ارسال‌شده به دستگاه امن سوپرادمین را وارد کنید.</p>
            <input autoFocus value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="••••••" className="field ltr text-center font-mono text-[20px] tracking-[0.5em]" aria-label="کد یکبارمصرف" />
            <p className="text-[12px] text-steel-400">در نسخه نمایشی هر عدد ۶ رقمی پذیرفته می‌شود. تعداد {fa(3)} تلاش ناموفق، حساب را قفل می‌کند.</p>
            <Button type="submit" className="w-full"><ShieldCheck size={16} /> امضای دوم و آزادسازی</Button>
          </form>
        )}
      </Modal>
    </>
  )
}
