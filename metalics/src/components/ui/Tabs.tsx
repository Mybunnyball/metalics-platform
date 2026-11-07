import { motion } from 'framer-motion'
import { cn } from '@/lib/format'
import { useId } from 'react'

export function Tabs<T extends string>({ items, value, onChange, className }: { items: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void; className?: string }) {
  const id = useId()
  return (
    <div role="tablist" className={cn('flex gap-1 overflow-x-auto rounded-ctl border border-steel-700 bg-steel-950/50 p-1', className)}>
      {items.map((it) => (
        <button key={it.id} role="tab" aria-selected={value === it.id} onClick={() => onChange(it.id)}
          className={cn('relative flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors', value === it.id ? 'text-white' : 'text-steel-300 hover:text-steel-100')}>
          {value === it.id && <motion.span layoutId={`tab-${id}`} className="absolute inset-0 rounded-lg bg-steel-700" transition={{ type: 'spring', damping: 30, stiffness: 380 }} />}
          <span className="relative flex items-center justify-center gap-1.5">
            {it.label}
            {it.count !== undefined && <span className="rounded-full bg-steel-600 px-1.5 text-[11px] leading-4">{it.count}</span>}
          </span>
        </button>
      ))}
    </div>
  )
}
