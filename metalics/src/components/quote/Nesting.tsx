import { motion } from 'framer-motion'
import { fa } from '@/lib/format'

/** شبیه‌سازی چیدمان قطعات روی ورق استاندارد ۱۵۰۰×۳۰۰۰ */
export function Nesting({ qty, w, h }: { qty: number; w: number; h: number }) {
  const W = 3000, H = 1500, gap = 10
  const pw = Math.max(40, Math.min(w, 1400)), ph = Math.max(40, Math.min(h, 1400))
  const cols = Math.max(1, Math.floor(W / (pw + gap))), rows = Math.max(1, Math.floor(H / (ph + gap)))
  const perSheet = cols * rows
  const shown = Math.min(qty, perSheet)
  const sheets = Math.ceil(qty / perSheet)
  const util = Math.min(96, ((shown * pw * ph) / (W * H)) * 100 * (shown === perSheet ? 1 : 1))
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg border border-steel-600 bg-steel-950" role="img" aria-label="چیدمان قطعات روی ورق">
        <rect width={W} height={H} fill="#16202A" />
        {Array.from({ length: shown }, (_, i) => {
          const c = i % cols, r = Math.floor(i / cols)
          return (
            <motion.rect key={i} x={gap + c * (pw + gap)} y={gap + r * (ph + gap)} width={pw} height={ph} rx={8}
              fill="rgba(240,162,59,.18)" stroke="#F0A23B" strokeWidth={4}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.015, 1.2) }} />
          )
        })}
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[12.5px]">
        <div className="rounded-lg bg-steel-800 py-2"><div className="text-steel-400">قطعه در هر ورق</div><div className="font-semibold text-white">{fa(perSheet)}</div></div>
        <div className="rounded-lg bg-steel-800 py-2"><div className="text-steel-400">تعداد ورق</div><div className="font-semibold text-white">{fa(sheets)}</div></div>
        <div className="rounded-lg bg-steel-800 py-2"><div className="text-steel-400">بهره‌وری ورق</div><div className="font-semibold text-ok">{fa(Math.round(util))}٪</div></div>
      </div>
    </div>
  )
}
