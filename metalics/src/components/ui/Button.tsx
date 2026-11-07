import { Link } from 'react-router-dom'
import { cn } from '@/lib/format'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'ok'
type Size = 'sm' | 'md' | 'lg'

const base = 'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-ctl font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45 active:translate-y-px'
const variants: Record<Variant, string> = {
  primary: 'bg-heat text-heat-ink hover:bg-heat-soft shadow-[0_8px_24px_-10px_rgba(240,162,59,.7)]',
  secondary: 'bg-steel-700 text-steel-100 hover:bg-steel-600 border border-steel-600',
  ghost: 'text-steel-200 hover:bg-steel-750 hover:text-white',
  outline: 'border border-cut/50 text-cut hover:bg-cut/10',
  danger: 'bg-err/15 text-err border border-err/40 hover:bg-err/25',
  ok: 'bg-ok/15 text-ok border border-ok/40 hover:bg-ok/25',
}
const sizes: Record<Size, string> = { sm: 'h-8 px-3 text-[13px]', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-[15px]' }

type Props = { variant?: Variant; size?: Size; to?: string; children: ReactNode; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant = 'primary', size = 'md', to, className, children, ...rest }: Props) {
  const cls = cn(base, variants[variant], sizes[size], className)
  if (to) return <Link to={to} className={cls}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}
