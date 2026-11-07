import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Factory, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { cn, fa } from '@/lib/format'

const ROLES = [
  { id: 'buyer', t: 'سفارش‌دهنده', d: 'شرکت صنعتی یا پیمانکار', icon: Building2, home: '/app' },
  { id: 'supplier', t: 'سازنده', d: 'کارگاه یا کارخانه', icon: Factory, home: '/supplier' },
  { id: 'expert', t: 'کارشناس فنی', d: 'بازرس و داور', icon: ShieldCheck, home: '/expert' },
]

function OtpInput({ onDone }: { onDone: () => void }) {
  const [v, setV] = useState(['', '', '', '', ''])
  const refs = useRef<(HTMLInputElement | null)[]>([])
  useEffect(() => { refs.current[0]?.focus() }, [])
  useEffect(() => { if (v.every(Boolean)) onDone() }, [v, onDone])
  return (
    <div className="flex justify-center gap-2 ltr">
      {v.map((d, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el }} value={d} inputMode="numeric" maxLength={1} aria-label={`رقم ${i + 1}`}
          onChange={(e) => { const c = e.target.value.replace(/\D/g, '').slice(-1); const n = [...v]; n[i] = c; setV(n); if (c) refs.current[i + 1]?.focus() }}
          onKeyDown={(e) => { if (e.key === 'Backspace' && !v[i]) refs.current[i - 1]?.focus() }}
          className="h-14 w-12 rounded-ctl border border-steel-600 bg-steel-950/60 text-center font-mono text-[22px] text-white focus:border-heat focus:outline-none focus:ring-2 focus:ring-heat/30" />
      ))}
    </div>
  )
}

export default function Auth() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [role, setRole] = useState('buyer')
  const [phone, setPhone] = useState('')
  const [sec, setSec] = useState(90)
  const nav = useNavigate()
  const toast = useToast()
  useEffect(() => { if (step !== 'otp') return; const t = setInterval(() => setSec((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t) }, [step])

  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      <div className="blueprint-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="container-x relative grid place-items-center py-16">
        <div className="panel-raised w-full max-w-md p-7">
          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.form key="p" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                onSubmit={(e) => { e.preventDefault(); setStep('otp'); setSec(90); toast('کد ورود ارسال شد (در نسخه نمایشی هر ۵ رقمی قبول است)', 'info') }}>
                <h1 className="text-[24px] font-bold text-white">ورود یا ثبت‌نام</h1>
                <p className="mt-1 text-[14px] text-steel-300">با شماره موبایل وارد شوید؛ رمز عبور لازم نیست.</p>
                <div className="mt-6 grid grid-cols-3 gap-2" role="radiogroup" aria-label="نوع حساب">
                  {ROLES.map((r) => (
                    <button type="button" key={r.id} role="radio" aria-checked={role === r.id} onClick={() => setRole(r.id)}
                      className={cn('flex flex-col items-center gap-1.5 rounded-ctl border px-2 py-3 text-center transition-colors', role === r.id ? 'border-heat/60 bg-heat/10 text-white' : 'border-steel-600 text-steel-300 hover:border-steel-500')}>
                      <r.icon size={20} className={role === r.id ? 'text-heat' : ''} /><span className="text-[13px] font-medium">{r.t}</span><span className="text-[11px] text-steel-400">{r.d}</span>
                    </button>
                  ))}
                </div>
                <label className="mt-6 block"><span className="label">شماره موبایل</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required inputMode="tel" placeholder="09xx xxx xxxx" className="field ltr text-left font-mono text-[16px] tracking-wider" /></label>
                <Button type="submit" size="lg" className="mt-5 w-full">دریافت کد ورود</Button>
                <p className="mt-4 text-center text-[12px] leading-6 text-steel-400">ورود به معنای پذیرش قوانین متالیکس و قرارداد عدم دور زدن پلتفرم است.</p>
              </motion.form>
            ) : (
              <motion.div key="o" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <button onClick={() => setStep('phone')} className="mb-4 flex items-center gap-1 text-[13px] text-steel-300 hover:text-white"><ArrowRight size={15} /> تغییر شماره</button>
                <h1 className="text-[24px] font-bold text-white">کد ۵ رقمی را وارد کنید</h1>
                <p className="mt-1 text-[14px] text-steel-300">پیامک به <span className="code text-white">{phone || '0912•••••••'}</span> ارسال شد.</p>
                <div className="mt-7"><OtpInput onDone={() => { toast('خوش آمدید'); nav(ROLES.find((r) => r.id === role)!.home) }} /></div>
                <p className="mt-6 text-center text-[13px] text-steel-400">{sec > 0 ? `ارسال دوباره تا ${fa(sec)} ثانیه دیگر` : <button className="link" onClick={() => setSec(90)}>ارسال دوباره کد</button>}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
