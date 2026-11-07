import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, Paperclip, ShieldAlert, Bot, EyeOff } from 'lucide-react'
import { PageTitle } from '@/components/app/Kit'
import { Badge } from '@/components/ui/Badge'
import { MESSAGES, ORDERS } from '@/data/mock'
import { maskContacts } from '@/lib/masking'
import { cn } from '@/lib/format'

type Msg = { from: string; name: string; text: string; time: string; masked?: boolean }

export default function Messages() {
  const threads = ORDERS.slice(0, 5)
  const [active, setActive] = useState(threads[0].id)
  const [msgs, setMsgs] = useState<Msg[]>(MESSAGES)
  const [text, setText] = useState('')
  const live = useMemo(() => maskContacts(text), [text])
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [msgs])

  const send = () => {
    if (!text.trim()) return
    const now = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    const r = maskContacts(text)
    const next: Msg[] = [...msgs, { from: 'me', name: 'شما', text: r.text, time: now, masked: r.hits.length > 0 }]
    if (r.hits.length) next.push({ from: 'system', name: 'سیستم', text: `${r.hits.join('، ')} از پیام حذف شد. طبق قرارداد الف، ارتباط خارج از متالیکس مجاز نیست و تکرار آن به ضبط ضمانت منجر می‌شود.`, time: now })
    setMsgs(next); setText('')
  }

  return (
    <>
      <PageTitle title="گفتگوهای سفارش" desc="همه پرسش‌های فنی در این گفتگوها ثبت می‌شوند و در داوری به‌عنوان مدرک استفاده می‌شوند." />
      <div className="panel grid h-[calc(100vh-13rem)] min-h-[520px] overflow-hidden md:grid-cols-[280px_1fr]">
        <aside className="hidden border-l border-steel-700 md:block">
          <ul className="divide-y divide-steel-800">
            {threads.map((t, i) => (
              <li key={t.id}>
                <button onClick={() => setActive(t.id)} className={cn('w-full px-4 py-3 text-right transition-colors', active === t.id ? 'bg-steel-800' : 'hover:bg-steel-800/50')}>
                  <div className="flex items-center justify-between"><span className="truncate text-[14px] font-medium text-white">{t.title}</span>{i < 2 && <span className="h-2 w-2 rounded-full bg-heat" />}</div>
                  <div className="code mt-0.5 text-right text-[11.5px] text-steel-400">{t.id}</div>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="flex min-h-0 flex-col">
          <header className="flex items-center justify-between border-b border-steel-700 px-4 py-3">
            <div><div className="font-semibold text-white">{threads.find((t) => t.id === active)?.title}</div><div className="text-[12px] text-steel-400">کارشناس متالیکس · سازنده B (ناشناس) · شما</div></div>
            <Badge tone="info"><EyeOff size={13} /> ماسک خودکار فعال</Badge>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => m.from === 'system' ? (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto flex max-w-md items-start gap-2 rounded-ctl border border-warn/30 bg-warn/5 px-3 py-2 text-[12.5px] leading-6 text-warn"><ShieldAlert size={15} className="mt-1 shrink-0" />{m.text}</motion.div>
            ) : (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn('flex flex-col', m.from === 'me' ? 'items-start' : 'items-end')}>
                <span className="mb-1 text-[11.5px] text-steel-400">{m.name} · {m.time}</span>
                <div className={cn('max-w-[78%] rounded-2xl px-4 py-2.5 text-[14px] leading-7', m.from === 'me' ? 'rounded-tr-sm bg-heat/15 text-white' : m.from === 'support' ? 'rounded-tl-sm bg-cut/10 text-white' : 'rounded-tl-sm bg-steel-750 text-steel-100', m.masked && 'ring-1 ring-warn/40')}>{m.text}</div>
              </motion.div>
            ))}
            <div ref={end} />
          </div>
          <footer className="border-t border-steel-700 p-3">
            <AnimatePresence>
              {live.hits.length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mb-2 flex items-center gap-2 rounded-lg bg-warn/10 px-3 py-2 text-[12.5px] text-warn"><Bot size={15} /> ایجنت حاکمیت پیام: {live.hits.join('، ')} شناسایی شد و هنگام ارسال حذف می‌شود.</div>
                </motion.div>
              )}
            </AnimatePresence>
            <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); send() }}>
              <button type="button" className="rounded-ctl border border-steel-600 p-2.5 text-steel-300 hover:text-white" aria-label="پیوست"><Paperclip size={18} /></button>
              <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} rows={1}
                placeholder="امتحان کنید: «با شماره ۰۹۱۲۳۴۵۶۷۸۹ تماس بگیرید»" className="field min-h-[44px] flex-1 resize-none" aria-label="متن پیام" />
              <button type="submit" className="rounded-ctl bg-heat p-2.5 text-heat-ink hover:bg-heat-soft" aria-label="ارسال"><Send size={18} className="-scale-x-100" /></button>
            </form>
          </footer>
        </section>
      </div>
    </>
  )
}
