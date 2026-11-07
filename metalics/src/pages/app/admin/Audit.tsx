import { useState } from 'react'
import { Download, Link2 } from 'lucide-react'
import { PageTitle, Card, Th, Td } from '@/components/app/Kit'
import { Button } from '@/components/ui/Button'
import { Badge, type Tone } from '@/components/ui/Badge'
import { AUDIT } from '@/data/mock'

const TONE: Record<string, Tone> = { CREATE: 'info', UPDATE: 'heat', MASK: 'err', APPROVE_1: 'ok' }
const hash = (s: string) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0).toString(16).padStart(8, '0') }

export default function Audit() {
  const [f, setF] = useState('')
  const rows = AUDIT.filter((a) => (a.who + a.ent + a.d + a.act).includes(f))
  let prev = '00000000'
  const chained = rows.map((a) => { const h = hash(prev + a.t + a.who + a.act + a.ent); const r = { ...a, prev, h }; prev = h; return r })
  return (
    <>
      <PageTitle title="لاگ ممیزی" desc="همه تغییر وضعیت‌ها، پرداخت‌ها و اقدامات کاربران با زنجیره هش ثبت می‌شوند؛ هر دست‌کاری، زنجیره را می‌شکند." actions={<Button variant="secondary"><Download size={16} /> خروجی CSV</Button>} />
      <input value={f} onChange={(e) => setF(e.target.value)} placeholder="فیلتر بر اساس کاربر، موجودیت یا شرح…" className="field mb-4 max-w-md" aria-label="فیلتر" />
      <Card pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-steel-700"><tr><Th>زمان</Th><Th>کاربر</Th><Th>عملیات</Th><Th>موجودیت</Th><Th>شرح</Th><Th>هش زنجیره</Th></tr></thead>
            <tbody className="divide-y divide-steel-800">
              {chained.map((a) => (
                <tr key={a.h} className="hover:bg-steel-800/40">
                  <Td className="code text-right text-steel-400">۱۴۰۵/۰۸/۱۶ {a.t}</Td>
                  <Td className="code text-right">{a.who}</Td>
                  <Td><Badge tone={TONE[a.act] ?? 'muted'}><span className="ltr">{a.act}</span></Badge></Td>
                  <Td className="code text-right text-cut">{a.ent}</Td>
                  <Td className="whitespace-normal text-steel-200">{a.d}</Td>
                  <Td><span className="code flex items-center gap-1 text-steel-400"><Link2 size={12} />{a.h}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
