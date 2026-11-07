/** نقشه‌های فنی کوچک (SVG) برای نمایش قطعات — به جای عکس، به زبان مهندس‌ها */
import { cn } from '@/lib/format'

export type PartKind = 'flange' | 'bracket' | 'shaft' | 'plate' | 'frame'

const S = { line: '#BCC8D4', dim: '#5BB8EA', hidden: '#64788D', center: '#C07A3E' }

function Dim({ x1, y1, x2, y2, label, off = 0 }: { x1: number; y1: number; x2: number; y2: number; label: string; off?: number }) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
  return (
    <g stroke={S.dim} strokeWidth=".7" fill={S.dim}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} markerStart="url(#arr)" markerEnd="url(#arr)" />
      <text x={mx} y={my - 3 + off} fontSize="7" textAnchor="middle" stroke="none" fontFamily="JetBrains Mono Variable, monospace">{label}</text>
    </g>
  )
}

export function PartDrawing({ kind, className }: { kind: PartKind; className?: string }) {
  return (
    <svg viewBox="0 0 200 140" className={cn('h-full w-full', className)} role="img" aria-label="نقشه فنی قطعه">
      <defs>
        <marker id="arr" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 z" fill={S.dim} /></marker>
      </defs>
      <g fill="none" stroke={S.line} strokeWidth="1.2" strokeLinejoin="round">
        {kind === 'flange' && (<>
          <circle cx="100" cy="68" r="46" /><circle cx="100" cy="68" r="17" />
          {[0, 60, 120, 180, 240, 300].map((a) => <circle key={a} cx={100 + 32 * Math.cos((a * Math.PI) / 180)} cy={68 + 32 * Math.sin((a * Math.PI) / 180)} r="5" />)}
          <circle cx="100" cy="68" r="32" stroke={S.center} strokeDasharray="6 2 1 2" strokeWidth=".6" />
          <line x1="44" y1="68" x2="156" y2="68" stroke={S.center} strokeDasharray="6 2 1 2" strokeWidth=".6" />
          <line x1="100" y1="14" x2="100" y2="122" stroke={S.center} strokeDasharray="6 2 1 2" strokeWidth=".6" />
          <Dim x1={54} y1={128} x2={146} y2={128} label="Ø240" />
          <Dim x1={168} y1={51} x2={168} y2={85} label="Ø84 H7" off={0} />
        </>)}
        {kind === 'bracket' && (<>
          <path d="M40 112 V40 h18 v54 h100 v18 z" />
          <path d="M58 94 l14 -14" stroke={S.hidden} strokeDasharray="3 2" />
          <circle cx="49" cy="58" r="4" /><circle cx="120" cy="103" r="4" /><circle cx="142" cy="103" r="4" />
          <line x1="58" y1="40" x2="58" y2="94" stroke={S.hidden} strokeDasharray="3 2" />
          <Dim x1={40} y1={124} x2={158} y2={124} label="240" />
          <Dim x1={28} y1={40} x2={28} y2={112} label="160" />
          <text x="80" y="76" fontSize="7" fill={S.center} stroke="none" fontFamily="JetBrains Mono Variable">R8 · t=8</text>
        </>)}
        {kind === 'shaft' && (<>
          <path d="M22 58 h30 v-8 h70 v-6 h40 v16 h16 v16 h-16 v16 h-40 v-6 h-70 v-8 h-30 z" />
          <line x1="14" y1="68" x2="186" y2="68" stroke={S.center} strokeDasharray="8 2 1 2" strokeWidth=".6" />
          <rect x="72" y="50" width="30" height="5" rx="2.5" />
          <Dim x1={22} y1={104} x2={178} y2={104} label="620" />
          <Dim x1={140} y1={36} x2={140} y2={44} label="" />
          <text x="124" y="32" fontSize="7" fill={S.dim} stroke="none" fontFamily="JetBrains Mono Variable">Ø60 h6</text>
        </>)}
        {kind === 'plate' && (<>
          <rect x="34" y="28" width="132" height="80" rx="2" />
          {[[50, 42], [150, 42], [50, 94], [150, 94]].map(([x, y]) => <circle key={x + '-' + y} cx={x} cy={y} r="6" />)}
          <rect x="84" y="54" width="32" height="28" stroke={S.hidden} strokeDasharray="3 2" />
          <Dim x1={34} y1={120} x2={166} y2={120} label="600" />
          <Dim x1={22} y1={28} x2={22} y2={108} label="400" />
          <text x="102" y="20" fontSize="7" fill={S.center} stroke="none" textAnchor="middle" fontFamily="JetBrains Mono Variable">4× Ø26 · t=25</text>
        </>)}
        {kind === 'frame' && (<>
          <rect x="30" y="30" width="140" height="78" />
          <rect x="40" y="40" width="120" height="58" stroke={S.hidden} strokeDasharray="3 2" />
          <path d="M30 30 l10 10 M170 30 l-10 10 M30 108 l10 -10 M170 108 l-10 -10" />
          <circle cx="72" cy="69" r="4" /><circle cx="128" cy="69" r="4" />
          <Dim x1={72} y1={120} x2={128} y2={120} label="400±1" />
          <text x="100" y="22" fontSize="7" fill={S.center} stroke="none" textAnchor="middle" fontFamily="JetBrains Mono Variable">UNP120 · WELD a5</text>
        </>)}
      </g>
    </svg>
  )
}
