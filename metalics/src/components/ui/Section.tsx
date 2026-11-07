import type { ReactNode } from 'react'
import { cn } from '@/lib/format'

export function SectionHead({ title, desc, className, align = 'start' }: { title: ReactNode; desc?: ReactNode; className?: string; align?: 'start' | 'center' }) {
  return (
    <div className={cn('mb-10 max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      <h2 className="text-[28px] font-bold text-white sm:text-[34px]">{title}</h2>
      {desc && <p className="mt-3 text-[15.5px] leading-8 text-steel-300">{desc}</p>}
    </div>
  )
}

export function PageHero({ title, desc, children }: { title: ReactNode; desc?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-steel-700/60">
      <div className="blueprint-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_0%,black,transparent_70%)]" />
      <div className="container-x relative py-14 sm:py-20">
        <h1 className="max-w-3xl text-[32px] font-extrabold leading-[1.3] text-white sm:text-[44px]">{title}</h1>
        {desc && <p className="mt-4 max-w-2xl text-[16px] leading-8 text-steel-300">{desc}</p>}
        {children}
      </div>
    </section>
  )
}
