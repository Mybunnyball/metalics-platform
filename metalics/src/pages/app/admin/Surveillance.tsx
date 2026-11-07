import { useMemo, useState } from 'react'
import { Bot, ShieldAlert } from 'lucide-react'
import { PageTitle, Card, Th, Td } from '@/components/app/Kit'
import { Badge } from '@/components/ui/Badge'
import { SURVEILLANCE } from '@/data/mock'
import { maskContacts } from '@/lib/masking'
import { fa } from '@/lib/format'

const SAMPLES = ['قیمت نهایی رو به ایمیل sales@example.com بفرستید', 'آیدی تلگرام ما @fooladsazan هست', 'آدرس سایت ما www.example.ir', 'شماره مستقیم کارگاه ۰۳۱-۳۳۴۴۵۵۶۶']

export default function Surveillance() {
  const [text, setText] = useState('برای هماهنگی سریع‌تر با ۰۹۱۳۱۲۳۴۵۶۷ تماس بگیرید')
  const r = useMemo(() => maskContacts(text), [text])
  return (
    <>
      <PageTitle title="پایش گفتگوها" desc="ایجنت حاکمیت پیام، اطلاعات تماس را پیش از ذخیره در پایگاه داده حذف و تخلف را ثبت می‌کند." />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card title={<span className="flex items-center gap-2"><Bot size={16} className="text-temper-straw" />آزمایشگاه موتور ماسک</span>}>
          <label className="block"><span className="label">پیام ورودی</span><textarea value={text} onChange={(e) => setText(e.target.value)} className="field h-24" /></label>
          <div className="mt-2 flex flex-wrap gap-1.5">{SAMPLES.map((s) => <button key={s} onClick={() => setText(s)} className="rounded-full border border-steel-600 px-2.5 py-1 text-[12px] text-steel-300 hover:text-white">{s.slice(0, 24)}…</button>)}</div>
          <div className="mt-4 rounded-ctl border border-steel-700 bg-steel-950/60 p-4">
            <div className="mb-2 flex items-center justify-between text-[12.5px]"><span className="text-steel-400">خروجی ذخیره‌شده</span>{r.hits.length ? <Badge tone="err" dot>{r.hits.join('، ')}</Badge> : <Badge tone="ok" dot>پاک</Badge>}</div>
            <p className="text-[15px] leading-8 text-white">{r.text}</p>
          </div>
          <p className="mt-3 text-[12.5px] leading-6 text-steel-400">لایه اول: الگوهای Regex برای موبایل، تلفن ثابت، ایمیل، وب‌سایت و شبکه‌های اجتماعی (با تبدیل ارقام فارسی). لایه دوم در نسخه تولید: مدل زبانی محلی برای اشاره‌های ضمنی مثل «کارگاه ما کنار پمپ‌بنزین ورودی شهرک است».</p>
        </Card>
        <Card title={<span className="flex items-center gap-2"><ShieldAlert size={16} className="text-err" />تخلفات اخیر</span>} pad={false}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead className="border-b border-steel-700"><tr><Th>سفارش</Th><Th>فرستنده</Th><Th>قاعده</Th><Th>متن ماسک‌شده</Th><Th>اخطار</Th></tr></thead>
              <tbody className="divide-y divide-steel-800">
                {SURVEILLANCE.map((s) => (
                  <tr key={s.order + s.time}>
                    <Td className="code text-right text-steel-300">{s.order}</Td><Td>{s.from}</Td><Td><Badge tone="warn">{s.rule}</Badge></Td>
                    <Td className="max-w-[220px] truncate text-steel-300">{s.excerpt}</Td>
                    <Td><span className={s.strikes >= 3 ? 'font-semibold text-err' : 'text-steel-200'}>{fa(s.strikes)} از ۳</span></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-steel-800 px-4 py-3 text-[12.5px] text-steel-400">اخطار سوم: مسدودسازی پنل و ضبط وجه ضمانت طبق قرارداد.</p>
        </Card>
      </div>
    </>
  )
}
