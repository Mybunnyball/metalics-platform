import { cn } from '@/lib/format'
import { STATE_META } from '@/data/states'
import type { ReactNode } from 'react'

export type Tone = 'muted' | 'info' | 'heat' | 'ok' | 'warn' | 'err' | 'temper'
const tones: Record<Tone, string> = {
  muted: 'bg-steel-700/60 text-steel-200 border-steel-600',
  info: 'bg-cut/10 text-cut border-cut/30',
  heat: 'bg-heat/10 text-heat border-heat/35',
  ok: 'bg-ok/10 text-ok border-ok/30',
  warn: 'bg-warn/10 text-warn border-warn/30',
  err: 'bg-err/10 text-err border-err/35',
  temper: 'temper-border text-temper-straw',
}

export function Badge({ tone = 'muted', children, dot, className }: { tone?: Tone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium leading-5', tones[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function StatePill({ state }: { state: string }) {
  const m = STATE_META[state] ?? { label: state, tone: 'muted' as const }
  return <Badge tone={m.tone} dot>{m.label}</Badge>
}
