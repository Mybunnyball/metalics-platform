import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessagesSquare, AlertOctagon, Check, X, Lock, FileText, Download, KeyRound, Truck, Camera, Award, User, ShieldCheck } from 'lucide-react'
import { PageTitle, Card, Th, Td } from '@/components/app/Kit'
import { Button } from '@/components/ui/Button'
import { Badge, StatePill } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { PartDrawing } from '@/components/ui/PartDrawing'
import { IranMap } from '@/components/app/IranMap'
import { useToast } from '@/components/ui/Toast'
import { ORDERS } from '@/data/mock'
import { ORDER_FLOW, flowIndex } from '@/data/states'
import { cn, fa, jdate, toman, daysFromNow, jshort } from '@/lib/format'

type T = 'overview' | 'tracking' | 'fai' | 'docs' | 'money'

const FAI_ROWS = [
  { f: 'قطر خارجی', nom: 'Ø240', tol: '±0.5', m: '239.82', ok: true },
  { f: 'قطر سوراخ مرکزی', nom: 'Ø110 H7', tol: '+0.035/0', m: '110.021', ok: true },
  { f: 'دایره سوراخ‌ها (PCD)', nom: '170', tol: '±0.2', m: '170.08', ok: true },
  { f: 'قطر سوراخ پیچ (۸×)', nom: 'Ø18', tol: '+0.3/0', m: '18.12', ok: true },
  { f: 'ضخامت', nom: '32', tol: '±0.3', m: '31.94', ok: true },
  { f: 'تختی سطح', nom: '—', tol: '0.1', m: '0.06', ok: true },
  { f: 'سختی سطح', nom: '160 HB', tol: '±15', m: '158 HB', ok: true },
]

function Timeline({ state }: { state: string }) {
  const idx = state === 'DISPUTED' ? 8 : state === 'QUOTED' ? 2 : Math.max(0, flowIndex(state))
  return (
    <div className="panel overflow-x-auto p-5">
      <ol className="flex min-w-[820px] items-start">
        {ORDER_FLOW.map((f, k) => (
          <li key={f.id} className="relative flex-1">
            {k > 0 && <span className={cn('absolute right-[-50%] top-3.5 h-0.5 w-full', k <= idx ? 'bg-heat' : 'bg-steel-700')} />}
            <div className="relative z-10 flex flex-col items-center gap-2 px-1">
              <span className={cn('grid h-7 w-7 place-items-center rounded-full border text-[12px]', k < idx ? 'border-heat bg-heat text-heat-ink' : k === idx ? 'border-heat bg-steel-900 text-heat ring-4 ring-heat/20' : 'border-steel-600 bg-steel-850 text-steel-500')}>
                {k < idx ? <Check size={14} /> : fa(k + 1)}
              </span>
              <span className={cn('text-center text-[12px] leading-5', k <= idx ? 'text-steel-100' : 'text-steel-500')}>{f.label}</span>
              {k < idx && <span className="text-[11px] text-steel-500">{jshort(daysFromNow(-(idx - k) * 2))}</span>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Overview({ o }: { o: (typeof ORDERS)[number] }) {
  const photos = ['برش لیزر ورق', 'تراش سوراخ مرکزی', 'سوراخ‌کاری PCD', 'کنترل ابعادی']
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
      <Card title="مشخصات فنی">
        <div className="blueprint-grid mb-4 aspect-[16/9] rounded-ctl border border-steel-700 p-4"><PartDrawing kind={o.thumb} /></div>
        <dl className="grid grid-cols-2 gap-y-3 text-[14px]">
          {[['فرآیند', o.process], ['متریال', `${o.material} با MTC 3.1`], ['تعداد', `${fa(o.qty)} عدد`], ['کنترل کیفیت', 'صنعتی + FAI'], ['پوشش', 'سندبلاست + زینک‌ریچ'], ['محل تحویل', o.city]].map(([k, v]) => (
            <div key={k}><dt className="text-[12.5px] text-steel-400">{k}</dt><dd className="text-white">{v}</dd></div>
          ))}
        </dl>
      </Card>
      <Card title="گزارش تصویری ساخت" actions={<Badge tone="heat" dot>{fa(o.progress)}٪ پیشرفت</Badge>}>
        <div className="grid grid-cols-2 gap-3">
          {photos.map((p, i) => (
            <figure key={p} className={cn('relative aspect-[4/3] overflow-hidden rounded-ctl border', i < 3 ? 'border-steel-600' : 'border-dashed border-steel-700')}>
              {i < 3 ? (
                <div className="absolute inset-0 bg-gradient-to-br from-steel-600 via-steel-750 to-steel-900">
                  <div className="blueprint-grid absolute inset-0 opacity-50" />
                  <PartDrawing kind={o.thumb} className="absolute inset-0 p-6 opacity-40" />
                  <Camera className="absolute left-3 top-3 text-steel-300" size={16} />
                </div>
              ) : <div className="grid h-full place-items-center text-[12.5px] text-steel-500">در انتظار</div>}
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-steel-950/90 to-transparent px-3 py-2 text-[12.5px] text-white">{p}{i < 3 && <span className="block text-[11px] text-steel-400">{jshort(daysFromNow(-6 + i * 2))} · بدون نشان کارگاه</span>}</figcaption>
            </figure>
          ))}
        </div>
      </Card>
    </div>
  )
}

function Tracking({ o }: { o: (typeof ORDERS)[number] }) {
  const toast = useToast()
  const [otp, setOtp] = useState('')
  const [delivered, setDelivered] = useState(false)
  const route = o.supplierAlias === 'سازنده A' ? ['اصفهان', 'یزد', 'رفسنجان', 'سیرجان'] : ['تهران', 'اصفهان', 'یزد', 'رفسنجان', 'سیرجان']
  const shipped = ['SHIPPED', 'DELIVERED', 'SETTLED'].includes(o.state)
  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
      <Card title="موقعیت زنده محموله" actions={<Badge tone={shipped ? 'info' : 'muted'} dot>{shipped ? 'در مسیر · ۶۸ km/h' : 'هنوز ارسال نشده'}</Badge>}>
        <div className="aspect-[410/340] w-full"><IranMap route={route} progress={shipped ? 0.82 : 0} /></div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[12.5px]">
          <div className="rounded-lg bg-steel-800 py-2"><div className="text-steel-400">مسافت باقی‌مانده</div><div className="font-semibold text-white">{shipped ? '۸۷ کیلومتر' : '—'}</div></div>
          <div className="rounded-lg bg-steel-800 py-2"><div className="text-steel-400">رسیدن تخمینی</div><div className="font-semibold text-white">{shipped ? 'فردا ۱۰:۱۵' : '—'}</div></div>
          <div className="rounded-lg bg-steel-800 py-2"><div className="text-steel-400">شرایط تحویل</div><div className="font-semibold text-white">DAP</div></div>
        </div>
      </Card>
      <div className="space-y-6">
        <Card title="مشخصات حمل">
          <ul className="space-y-3 text-[14px]">
            <li className="flex items-center gap-3"><User size={16} className="text-steel-400" /><span className="text-steel-400">راننده</span><span className="mr-auto text-white">ع. محمدی · ۰۹۱۳ ٭٭٭ ٭٭۴۲</span></li>
            <li className="flex items-center gap-3"><Truck size={16} className="text-steel-400" /><span className="text-steel-400">پلاک کشنده</span><span className="mr-auto rounded border border-steel-500 bg-steel-100 px-2 text-[13px] font-semibold text-steel-900">۱۳ ع ۴۸۲ | ایران ۲۳</span></li>
            <li className="flex items-center gap-3"><FileText size={16} className="text-steel-400" /><span className="text-steel-400">شماره بارنامه</span><span className="code mr-auto text-white">BN-14051108-77213</span></li>
            <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-steel-400" /><span className="text-steel-400">بسته‌بندی</span><span className="mr-auto text-white">برچسب متالیکس، بدون نشان کارگاه</span></li>
          </ul>
        </Card>
        <Card title="تحویل با کد یکبارمصرف">
          {delivered ? (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ok/15 text-ok"><Check /></div>
              <p className="mt-3 font-semibold text-white">تحویل ثبت شد</p>
              <p className="mt-1 text-[13px] text-steel-300">مهلت ۷۲ ساعته بازرسی فنی شروع شد. در صورت مغایرت از دکمه «ثبت مغایرت» استفاده کنید.</p>
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (otp.length === 6) { setDelivered(true); toast('تحویل محموله با کد یکبارمصرف ثبت شد') } else toast('کد ۶ رقمی را کامل وارد کنید', 'warn') }}>
              <p className="mb-3 text-[13.5px] leading-6 text-steel-300">کد به موبایل انباردار شما (۰۹۱۲ ٭٭٭ ٭٭۱۸) ارسال شده است. هنگام تخلیه بار، کد را از راننده بگیرید و اینجا وارد کنید.</p>
              <div className="flex gap-2"><input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="۶ رقم" inputMode="numeric" className="field ltr flex-1 text-center font-mono tracking-[0.4em]" aria-label="کد تحویل" />
                <Button type="submit" disabled={!shipped}><KeyRound size={16} /> تأیید تحویل</Button></div>
              {!shipped && <p className="mt-2 text-[12px] text-steel-400">پس از ارسال محموله فعال می‌شود.</p>}
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

function Fai() {
  const toast = useToast()
  const [st, setSt] = useState<'pending' | 'approved' | 'rejected'>('pending')
  return (
    <Card title="گزارش بازرسی نمونه اول (FAI)" actions={st === 'approved' ? <Badge tone="temper"><Award size={13} /> نمونه طلایی قفل شد</Badge> : st === 'rejected' ? <Badge tone="err">رد شد — اصلاح در همان سازنده</Badge> : <Badge tone="heat" dot>در انتظار تأیید شما</Badge>} pad={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-steel-700"><tr><Th>مشخصه</Th><Th>مقدار اسمی</Th><Th>رواداری</Th><Th>اندازه‌گیری‌شده</Th><Th>نتیجه</Th></tr></thead>
          <tbody className="divide-y divide-steel-800">
            {FAI_ROWS.map((r) => (
              <tr key={r.f}><Td className="text-white">{r.f}</Td><Td className="code text-right">{r.nom}</Td><Td className="code text-right text-steel-300">{r.tol}</Td><Td className="code text-right text-white">{r.m}</Td><Td>{r.ok ? <span className="flex items-center gap-1 text-ok"><Check size={15} /> قبول</span> : <span className="text-err">مردود</span>}</Td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-steel-700 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-6 text-steel-300">اندازه‌گیری با میکرومتر دیجیتال و CMM توسط بازرس متالیکس. با تأیید شما، این قطعه مبنای پذیرش کل محموله می‌شود و ۵۰٪ وجه با تأیید چهارچشمی آزاد می‌شود.</p>
        {st === 'pending' && (
          <div className="flex shrink-0 gap-2">
            <Button variant="danger" onClick={() => { setSt('rejected'); toast('نمونه رد شد؛ سازنده موظف به اصلاح است', 'warn') }}><X size={16} /> رد نمونه</Button>
            <Button variant="ok" onClick={() => { setSt('approved'); toast('نمونه طلایی تأیید و قفل شد') }}><Check size={16} /> تأیید نمونه</Button>
          </div>
        )}
      </div>
    </Card>
  )
}

function Docs({ o }: { o: (typeof ORDERS)[number] }) {
  const docs = [
    ['قرارداد الف — متالیکس و خریدار', 'امضای دیجیتال · ' + jdate(o.created), 'ok'], ['پیش‌فاکتور رسمی با سربرگ متالیکس', 'PI-' + o.id.slice(-4), 'ok'],
    ['فاکتور سامانه مؤدیان', 'پس از تحویل صادر می‌شود', 'muted'], ['گواهی متریال MTC 3.1', 'اکسین خوزستان · ذوب 51834', 'ok'],
    ['گزارش FAI و ابعادی', 'بارگذاری توسط بازرس', 'ok'], ['نقشه نهایی تأییدشده (Rev C)', 'نسخه قفل‌شده مبنای داوری', 'ok'],
  ]
  return (
    <Card title="اسناد سفارش" pad={false}>
      <ul className="divide-y divide-steel-800">
        {docs.map(([t, d, s]) => (
          <li key={t} className="flex items-center gap-4 px-4 py-3.5">
            <FileText size={20} className={s === 'ok' ? 'text-cut' : 'text-steel-500'} />
            <div className="flex-1"><div className="text-white">{t}</div><div className="text-[12.5px] text-steel-400">{d}</div></div>
            <Button size="sm" variant="ghost" disabled={s !== 'ok'}><Download size={15} /> دریافت</Button>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function Money({ o }: { o: (typeof ORDERS)[number] }) {
  const rows = [
    { t: 'واریز به حساب امانی', a: o.amount, s: 'ESCROW_HOLD', d: jdate(daysFromNow(-10)) },
    { t: 'آزادسازی ۵۰٪ پس از تأیید FAI', a: o.amount * 0.5 * 0.87, s: 'PENDING', d: 'در انتظار تأیید چهارچشمی' },
    { t: 'آزادسازی ۵۰٪ پس از تحویل OTP', a: o.amount * 0.5 * 0.87, s: 'LOCKED', d: 'پس از مهلت بازرسی' },
    { t: 'کارمزد و خدمات متالیکس', a: o.amount * 0.13, s: 'LOCKED', d: 'هم‌زمان با تسویه نهایی' },
  ]
  return (
    <Card title="دفتر اسکرو" actions={<span className="flex items-center gap-1.5 text-[13px] text-heat"><Lock size={14} /> {toman(o.amount)} قفل</span>} pad={false}>
      <table className="w-full">
        <tbody className="divide-y divide-steel-800">
          {rows.map((r) => (
            <tr key={r.t}><Td className="text-white">{r.t}<div className="text-[12px] text-steel-400">{r.d}</div></Td><Td>{toman(Math.round(r.a / 1000) * 1000)}</Td>
              <Td><Badge tone={r.s === 'ESCROW_HOLD' ? 'heat' : r.s === 'PENDING' ? 'info' : 'muted'}>{r.s === 'ESCROW_HOLD' ? 'مسدود در اسکرو' : r.s === 'PENDING' ? 'در صف تأیید' : 'قفل'}</Badge></Td></tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

export default function OrderDetail() {
  const { id } = useParams()
  const o = useMemo(() => ORDERS.find((x) => x.id === id) ?? ORDERS[0], [id])
  const [tab, setTab] = useState<T>(o.state === 'SHIPPED' ? 'tracking' : o.state === 'IN_PRODUCTION' ? 'fai' : 'overview')
  const [dispute, setDispute] = useState(false)
  const toast = useToast()
  return (
    <>
      <div className="mb-2 text-[13px] text-steel-400"><Link to="/app/orders" className="hover:text-white">سفارش‌ها</Link> / <span className="code">{o.id}</span></div>
      <PageTitle
        title={<span className="flex flex-wrap items-center gap-3">{o.title}<StatePill state={o.state} /></span>}
        desc={<>سازنده: {o.supplierAlias ?? 'در حال انتخاب'} (هویت محفوظ) · موعد تحویل {jdate(o.due)} · {toman(o.amount)}</>}
        actions={<><Button to="/app/messages" variant="secondary"><MessagesSquare size={16} /> گفتگوی سفارش</Button><Button variant="danger" onClick={() => setDispute(true)}><AlertOctagon size={16} /> ثبت مغایرت</Button></>}
      />
      <Timeline state={o.state} />
      <Tabs className="my-6 max-w-2xl" value={tab} onChange={setTab} items={[{ id: 'overview', label: 'نمای کلی' }, { id: 'tracking', label: 'ردیابی' }, { id: 'fai', label: 'نمونه اول' }, { id: 'docs', label: 'اسناد' }, { id: 'money', label: 'مالی' }]} />
      <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        {tab === 'overview' && <Overview o={o} />}
        {tab === 'tracking' && <Tracking o={o} />}
        {tab === 'fai' && <Fai />}
        {tab === 'docs' && <Docs o={o} />}
        {tab === 'money' && <Money o={o} />}
      </motion.div>

      <Modal open={dispute} onClose={() => setDispute(false)} title="ثبت مغایرت فنی">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDispute(false); toast('پرونده مغایرت ثبت شد؛ وجه تا صدور رأی مسدود می‌ماند', 'info') }}>
          <label className="block"><span className="label">نوع مغایرت</span><select className="field"><option>مغایرت ابعادی با نقشه</option><option>عیب جوش یا ظاهری</option><option>متریال مغایر با MTC</option><option>کسری تعداد</option><option>آسیب حین حمل</option></select></label>
          <label className="block"><span className="label">شرح دقیق</span><textarea className="field h-24" required placeholder="کدام ابعاد؟ مقدار اندازه‌گیری‌شده؟ با چه ابزاری؟" /></label>
          <div className="rounded-ctl border border-dashed border-steel-600 p-4 text-center text-[13px] text-steel-300"><Camera className="mx-auto mb-1 text-steel-400" size={20} />تصاویر عیب را همراه کولیس یا میکرومتر بارگذاری کنید</div>
          <p className="text-[12.5px] leading-6 text-steel-400">گام ۱: غربالگری هوشمند (۱۲ تا ۲۴ ساعت) · گام ۲: ارزیابی کارشناس · گام ۳: جلسه داوری سه‌جانبه</p>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setDispute(false)}>انصراف</Button><Button type="submit" variant="danger">ثبت پرونده</Button></div>
        </form>
      </Modal>
    </>
  )
}
