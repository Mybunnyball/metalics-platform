import type { ReactNode } from 'react'
import { cn } from '@/lib/format'

export function PageTitle({ title, desc, actions }: { title: ReactNode; desc?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[22px] font-bold text-white sm:text-[26px]">{title}</h1>
        {desc && <p className="mt-1 text-sm leading-7 text-steel-300">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Stat({ label, value, hint, accent, icon }: { label: string; value: ReactNode; hint?: ReactNode; accent?: 'heat' | 'ok' | 'cut' | 'err'; icon?: ReactNode }) {
  const c = accent === 'heat' ? 'text-heat' : accent === 'ok' ? 'text-ok' : accent === 'err' ? 'text-err' : accent === 'cut' ? 'text-cut' : 'text-white'
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between text-[13px] text-steel-300"><span>{label}</span>{icon && <span className="text-steel-400">{icon}</span>}</div>
      <div className={cn('mt-2 font-display text-[24px] font-bold leading-tight', c)}>{value}</div>
      {hint && <div className="mt-1 text-[12px] text-steel-400">{hint}</div>}
    </div>
  )
}

export function Card({ title, actions, children, className, pad = true }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={cn('panel min-w-0', className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-steel-700/70 px-4 py-3">
          <h2 className="text-[15px] font-semibold text-white">{title}</h2>
          {actions}
        </div>
      )}
      <div className={pad ? 'p-4' : ''}>{children}</div>
    </section>
  )
}

export function Progress({ value, className, tone = 'heat' }: { value: number; className?: string; tone?: 'heat' | 'ok' | 'temper' | 'cut' }) {
  const bg = tone === 'temper' ? 'temper-bar' : tone === 'ok' ? 'bg-ok' : tone === 'cut' ? 'bg-cut' : 'bg-heat'
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-steel-700', className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn('h-full rounded-full transition-[width] duration-700', bg)} style={{ width: `${value}%` }} />
    </div>
  )
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn('whitespace-nowrap px-4 py-3 text-right text-[12.5px] font-medium text-steel-400', className)}>{children}</th>
}
export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn('whitespace-nowrap px-4 py-3 text-sm', className)}>{children}</td>
}
