import { Link } from 'react-router-dom'
import { cn } from '@/lib/format'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('h-8 w-8', className)} aria-hidden>
      <defs>
        <linearGradient id="lg-temper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9C878" /><stop offset=".45" stopColor="#C07A3E" /><stop offset=".75" stopColor="#7A5AA6" /><stop offset="1" stopColor="#3C7DC4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="#16202A" stroke="#334558" />
      <path d="M15 46V18l17 15 17-15v28" fill="none" stroke="url(#lg-temper)" strokeWidth="5.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="32" cy="33" r="2.6" fill="#F0A23B" />
    </svg>
  )
}

export function Logo({ to = '/', compact }: { to?: string; compact?: boolean }) {
  return (
    <Link to={to} className="group flex items-center gap-2.5" aria-label="متالیکس — صفحه اصلی">
      <LogoMark className="transition-transform duration-300 group-hover:rotate-[-8deg]" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-brand text-[15px] font-semibold tracking-[0.12em] text-white ltr">METALICS</span>
          <span className="mt-1 text-[11px] text-steel-300">متالیکس</span>
        </span>
      )}
    </Link>
  )
}
