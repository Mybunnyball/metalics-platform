import { Link } from 'react-router-dom'
import { ClipboardCheck, Timer, Gavel, AlertTriangle } from 'lucide-react'
import { PageTitle, Stat, Card, Th, Td } from '@/components/app/Kit'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { REVIEW_QUEUE } from '@/data/mock'
import { fa } from '@/lib/format'

export default function Queue() {
  return (
    <>
      <PageTitle title="صف بررسی فنی" desc="مهندس کیان صدری · کارشناس مکانیک و متالورژی" />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="در صف بررسی" value={fa(REVIEW_QUEUE.length)} icon={<ClipboardCheck size={16} />} />
        <Stat label="میانگین زمان بررسی" value="۲ ساعت و ۱۰ دقیقه" hint="هدف: زیر ۴ ساعت" accent="ok" icon={<Timer size={16} />} />
        <Stat label="پرونده داوری محوله" value="۱" accent="err" icon={<Gavel size={16} />} />
        <Stat label="بررسی‌های این ماه" value="۶۴" hint="۹ مورد برگشت برای اصلاح" />
      </div>
      <Card title="سفارش‌های منتظر بررسی" pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-steel-700"><tr><Th>سفارش</Th><Th>فایل</Th><Th>فرآیند / متریال</Th><Th>ریسک اولیه</Th><Th>هشدارهای AI</Th><Th>انتظار</Th><Th /></tr></thead>
            <tbody className="divide-y divide-steel-800">
              {REVIEW_QUEUE.map((r) => (
                <tr key={r.id} className="hover:bg-steel-800/50">
                  <Td><div className="font-medium text-white">{r.title}</div><div className="code text-right text-[11.5px] text-steel-400">{r.id}</div></Td>
                  <Td className="code text-right text-cut">{r.file}</Td>
                  <Td className="text-steel-300">{r.process} · {r.material}</Td>
                  <Td><Badge tone={r.risk === 'بالا' ? 'err' : r.risk === 'متوسط' ? 'warn' : 'ok'} dot>{r.risk}</Badge></Td>
                  <Td><span className="flex items-center gap-1.5 text-warn"><AlertTriangle size={14} />{fa(r.flags)}</span></Td>
                  <Td className="text-steel-300">{r.waiting}</Td>
                  <Td><Button size="sm" to={`/expert/review/${r.id}`}>شروع بررسی</Button></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
