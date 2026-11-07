import { animate } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

/** نقشه ساده‌شده ایران برای ردیابی محموله (بدون نیاز به سرویس نقشه خارجی) */
const OUTLINE: [number, number][] = [
  [44.0, 39.4], [45.0, 39.7], [46.5, 38.9], [48.0, 38.4], [48.9, 38.4], [49.0, 37.6], [50.2, 37.1], [51.5, 36.8], [53.0, 36.9], [54.0, 37.3], [55.5, 37.9],
  [57.0, 38.2], [59.0, 37.5], [60.5, 36.6], [61.2, 36.5], [61.0, 35.0], [60.8, 34.0], [60.6, 33.2], [60.9, 31.5], [61.7, 31.4], [61.8, 30.8], [60.9, 29.9],
  [61.4, 29.3], [62.6, 28.2], [62.8, 27.2], [63.3, 26.6], [61.6, 25.2], [59.0, 25.4], [57.3, 25.8], [56.9, 27.1], [56.2, 27.1], [54.8, 26.5], [53.5, 26.8],
  [52.4, 27.6], [51.4, 27.9], [50.6, 29.1], [50.0, 30.1], [48.9, 30.4], [48.4, 30.0], [47.7, 31.0], [47.7, 32.0], [46.4, 33.0], [45.5, 33.9], [45.4, 35.0],
  [46.0, 35.8], [45.0, 36.6], [44.8, 37.2], [44.2, 38.0], [44.4, 38.4],
]
export const CITIES: Record<string, [number, number]> = {
  تهران: [51.4, 35.7], اصفهان: [51.7, 32.65], سیرجان: [55.68, 29.45], مشهد: [59.6, 36.3], تبریز: [46.3, 38.08],
  شیراز: [52.53, 29.6], اهواز: [48.67, 31.32], بندرعباس: [56.27, 27.18], یزد: [54.36, 31.9], رفسنجان: [55.99, 30.4], اراک: [49.7, 34.1],
}
const P = ([lon, lat]: [number, number]) => [(lon - 43.5) * 20, (40.2 - lat) * 23] as const

function along(pts: (readonly [number, number])[], t: number) {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]))
  const total = seg.reduce((a, b) => a + b, 0)
  let d = t * total
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) { const r = d / seg[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r] }
    d -= seg[i]
  }
  return pts[pts.length - 1]
}

export function IranMap({ route, progress, hideOrigin }: { route: string[]; progress: number; hideOrigin?: boolean }) {
  const [t, setT] = useState(0)
  useEffect(() => { const c = animate(0, progress, { duration: 2.4, ease: [0.16, 1, 0.3, 1], onUpdate: setT }); return () => c.stop() }, [progress])
  const pts = useMemo(() => route.map((c) => P(CITIES[c])), [route])
  const truck = along(pts, t)
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  return (
    <svg viewBox="0 0 410 340" className="h-full w-full" role="img" aria-label="نقشه مسیر محموله">
      <defs>
        <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#334558" /></pattern>
        <linearGradient id="route" x1="0" x2="1"><stop offset="0" stopColor="#E9C878" /><stop offset=".5" stopColor="#C07A3E" /><stop offset="1" stopColor="#7A5AA6" /></linearGradient>
      </defs>
      <polygon points={OUTLINE.map((c) => P(c).join(',')).join(' ')} fill="url(#dots)" stroke="#4A5F75" strokeWidth="1.2" strokeLinejoin="round" />
      {Object.entries(CITIES).map(([n, c]) => {
        const [x, y] = P(c); const onRoute = route.includes(n)
        if (hideOrigin && n === route[0]) return null
        return (
          <g key={n}>
            <circle cx={x} cy={y} r={onRoute ? 3.2 : 2} fill={onRoute ? '#BCC8D4' : '#4A5F75'} />
            <text x={x + 6} y={y + 3.5} fontSize="9.5" fill={onRoute ? '#E7ECF1' : '#64788D'} fontFamily="Vazirmatn Variable" textAnchor="end">{n}</text>
          </g>
        )
      })}
      <path d={path} fill="none" stroke="#334558" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 5" />
      <path d={path} fill="none" stroke="url(#route)" strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray={`${t} 1`} />
      <g transform={`translate(${truck[0]},${truck[1]})`}>
        <circle r="13" fill="#F0A23B" opacity=".18"><animate attributeName="r" values="7;16;7" dur="2s" repeatCount="indefinite" /></circle>
        <circle r="6" fill="#F0A23B" stroke="#1C1307" strokeWidth="2" />
      </g>
      {(() => { const [x, y] = pts[pts.length - 1]; return <g transform={`translate(${x},${y})`}><rect x="-5" y="-5" width="10" height="10" rx="2" fill="#3FCF8E" /></g> })()}
    </svg>
  )
}
