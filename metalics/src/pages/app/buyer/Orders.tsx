import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Download } from 'lucide-react'
import { PageTitle, Th, Td, Progress } from '@/components/app/Kit'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { StatePill } from '@/components/ui/Badge'
import { ORDERS } from '@/data/mock'
import { fa, jdate, toman } from '@/lib/format'

type F = 'all' | 'active' | 'action' | 'done'

export default function Orders() {
  const [f, setF] = useState<F>('all')
  const [q, setQ] = useState('')
  const list = useMemo(() => ORDERS.filter((o) => {
    const m = f === 'all' || (f === 'done' ? ['SETTLED', 'CLOSED'].includes(o.state) : f === 'action' ? ['QUOTED', 'DISPUTED'].includes(o.state) : !['SETTLED', 'CLOSED'].includes(o.state))
    return m && (o.title + o.id + o.material).includes(q)
  }), [f, q])
  const link = (o: (typeof ORDERS)[number]) => (o.state === 'QUOTED' ? `/app/rfq/${o.id}` : o.state === 'DISPUTED' ? '/app/disputes/DSP-1405-031' : `/app/orders/${o.id}`)
  return (
    <>
      <PageTitle title="سفارش‌ها" desc="همه سفارش‌های شرکت، از پیش‌نویس تا تسویه." actions={<><Button variant="secondary"><Download size={16} /> خروجی اکسل</Button><Button to="/quote"><Plus size={16} /> سفارش جدید</Button></>} />
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs value={f} onChange={setF} className="md:w-[460px]" items={[{ id: 'all', label: 'همه', count: ORDERS.length }, { id: 'active', label: 'جاری' }, { id: 'action', label: 'نیازمند اقدام', count: 2 }, { id: 'done', label: 'تسویه‌شده' }]} />
        <div className="relative md:w-72"><Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="عنوان، کد یا متریال" className="field pr-9" aria-label="جستجو" /></div>
      </div>
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[880px]">
          <thead className="border-b border-steel-700"><tr><Th>کد سفارش</Th><Th>عنوان</Th><Th>وضعیت</Th><Th>پیشرفت</Th><Th>تعداد</Th><Th>مبلغ</Th><Th>سازنده</Th><Th>موعد تحویل</Th></tr></thead>
          <tbody className="divide-y divide-steel-800">
            {list.map((o) => (
              <tr key={o.id} className="transition-colors hover:bg-steel-800/50">
                <Td><Link to={link(o)} className="code text-cut hover:underline">{o.id}</Link></Td>
                <Td><Link to={link(o)} className="font-medium text-white">{o.title}</Link><div className="text-[12px] text-steel-400">{o.process} · {o.material}</div></Td>
                <Td><StatePill state={o.state} /></Td>
                <Td className="w-36"><Progress value={o.progress} tone="temper" /></Td>
                <Td>{fa(o.qty)}</Td>
                <Td>{o.amount ? toman(o.amount) : <span className="text-steel-400">در انتظار قیمت</span>}</Td>
                <Td className="text-steel-300">{o.supplierAlias ?? '—'}</Td>
                <Td className="text-steel-300">{jdate(o.due)}</Td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-steel-300">سفارشی با این فیلتر نیست. فیلتر «همه» را انتخاب کنید یا سفارش جدید ثبت کنید.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
