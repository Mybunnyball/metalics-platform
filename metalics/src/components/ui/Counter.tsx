import { animate, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

/** عدد شمارنده که هنگام دیده‌شدن، از صفر تا مقدار نهایی می‌شمارد */
export function Counter({ to, decimals = 0, suffix = '' }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  useEffect(() => {
    if (!inView || !ref.current) return
    const nf = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: decimals, minimumFractionDigits: decimals })
    const c = animate(0, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => ref.current && (ref.current.textContent = nf.format(v) + suffix) })
    return () => c.stop()
  }, [inView, to, decimals, suffix])
  return <span ref={ref}>۰</span>
}
