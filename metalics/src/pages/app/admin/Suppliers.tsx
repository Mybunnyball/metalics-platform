import { useState } from 'react'
import { Check, Ban, Eye } from 'lucide-react'
import { PageTitle, Card, Th, Td } from '@/components/app/Kit'
import { Button } from '@/components/ui/Button'
import { Badge, type Tone } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'
import { SUPPLIERS } from '@/data/mock'
import { PROCESSES } from '@/data/catalog'
import { fa } from '@/lib/format'

const ST: Record<string, [string, Tone]> = { ACTIVE: ['فعال', 'ok'], SUSPENDED: ['معلق', 'warn'], PENDING_VERIFICATION: ['در انتظار احراز', 'info'], BLACKLISTED: ['حذف‌شده', 'err'] }

export default function Suppliers() {
  const [list, setList] = useState(SUPPLIERS)
  const [f, setF] = useState<'all' | 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED'>('all')
  const toast = useToast()
  const set = (code: string, status: string) => { setList(list.map((s) => (s.code === code ? { ...s, status, score: status === 'ACTIVE' && !s.score ? 70 : s.score } : s))); toast(`وضعیت ${code} به‌روزرسانی شد`) }
  const shown = list.filter((s) => f === 'all' || s.status === f)
  return (
    <>
      <PageTitle title="مدیریت سازندگان" desc="احراز صلاحیت، تعلیق و رتبه‌بندی. نام واقعی کارگاه‌ها فقط برای مدیریت و کارشناسان قابل مشاهده است." />
      <Tabs className="mb-4 max-w-xl" value={f} onChange={setF} items={[{ id: 'all', label: 'همه', count: list.length }, { id: 'PENDING_VERIFICATION', label: 'در انتظار احراز', count: list.filter((s) => s.status === 'PENDING_VERIFICATION').length }, { id: 'ACTIVE', label: 'فعال' }, { id: 'SUSPENDED', label: 'معلق' }]} />
      <Card pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="border-b border-steel-700"><tr><Th>کد</Th><Th>نام حقوقی</Th><Th>نام مستعار</Th><Th>شهر</Th><Th>توانمندی‌ها</Th><Th>امتیاز</Th><Th>وضعیت</Th><Th /></tr></thead>
            <tbody className="divide-y divide-steel-800">
              {shown.map((s) => (
                <tr key={s.code} className="hover:bg-steel-800/50">
                  <Td className="code text-right text-steel-300">{s.code}</Td>
                  <Td className="font-medium text-white">{s.name}</Td>
                  <Td className="text-steel-300">{s.alias}</Td>
                  <Td className="text-steel-300">{s.city}</Td>
                  <Td><div className="flex flex-wrap gap-1">{s.capabilities.map((c) => <Badge key={c}>{PROCESSES.find((p) => p.id === c)?.short}</Badge>)}</div></Td>
                  <Td>{s.score ? <span className={s.score < 60 ? 'text-err' : s.score >= 85 ? 'text-temper-straw' : 'text-white'}>{fa(s.score)}</span> : '—'}</Td>
                  <Td><Badge tone={ST[s.status][1]} dot>{ST[s.status][0]}</Badge></Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      {s.status !== 'ACTIVE' && <Button size="sm" variant="ok" onClick={() => set(s.code, 'ACTIVE')}><Check size={14} /> {s.status === 'PENDING_VERIFICATION' ? 'احراز' : 'فعال‌سازی'}</Button>}
                      {s.status === 'ACTIVE' && <Button size="sm" variant="danger" onClick={() => set(s.code, 'SUSPENDED')}><Ban size={14} /> تعلیق</Button>}
                      <Button size="sm" variant="ghost" aria-label="جزئیات" onClick={() => toast('پرونده بازدید کارگاه و مدارک حقوقی', 'info')}><Eye size={14} /></Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="mt-4 text-[12.5px] leading-6 text-steel-400">قاعده خودکار: امتیاز زیر ۶۰ ← تعلیق موقت · تخلف سطح ۴ (دور زدن سازمان‌یافته) ← حذف دائم و اقدام قانونی طبق قرارداد ب.</p>
    </>
  )
}
