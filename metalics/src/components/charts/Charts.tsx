import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, ComposedChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { fa } from '@/lib/format'

const axis = { stroke: '#4A5F75', fontSize: 11, fontFamily: 'Vazirmatn Variable', tickLine: false, axisLine: false }
const tip = { contentStyle: { background: '#1F2C39', border: '1px solid #334558', borderRadius: 10, fontFamily: 'Vazirmatn Variable', fontSize: 12, direction: 'rtl' as const }, labelStyle: { color: '#BCC8D4' } }

/** نمودارها داخل کانتینر LTR رسم می‌شوند تا محور زمان از راست به چپ وارونه نشود؛ برچسب‌ها فارسی هستند */
export function SpendArea({ data }: { data: { m: string; v: number }[] }) {
  return (
    <div className="h-56 ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
          <defs><linearGradient id="spend" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0A23B" stopOpacity={0.45} /><stop offset="1" stopColor="#F0A23B" stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid stroke="#263544" vertical={false} />
          <XAxis dataKey="m" {...axis} reversed />
          <YAxis {...axis} orientation="right" tickFormatter={(v) => fa(v)} />
          <Tooltip {...tip} formatter={(v: number) => [`${fa(v)} میلیون تومان`, 'خرید']} />
          <Area type="monotone" dataKey="v" stroke="#F0A23B" strokeWidth={2} fill="url(#spend)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function GmvChart({ data }: { data: { m: string; gmv: number; orders: number }[] }) {
  return (
    <div className="h-72 ltr">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs><linearGradient id="gmv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5BB8EA" stopOpacity={0.9} /><stop offset="1" stopColor="#2E86BA" stopOpacity={0.35} /></linearGradient></defs>
          <CartesianGrid stroke="#263544" vertical={false} />
          <XAxis dataKey="m" {...axis} reversed />
          <YAxis yAxisId="g" {...axis} orientation="right" tickFormatter={(v) => fa(v)} />
          <YAxis yAxisId="o" {...axis} orientation="left" tickFormatter={(v) => fa(v)} />
          <Tooltip {...tip} formatter={(v: number, n: string) => (n === 'gmv' ? [`${fa(v)} میلیارد تومان`, 'ارزش معاملات'] : [fa(v), 'تعداد سفارش'])} />
          <Legend formatter={(v) => (v === 'gmv' ? 'ارزش معاملات (میلیارد تومان)' : 'تعداد سفارش')} wrapperStyle={{ fontFamily: 'Vazirmatn Variable', fontSize: 12, color: '#93A3B5' }} />
          <Bar yAxisId="g" dataKey="gmv" fill="url(#gmv)" radius={[6, 6, 0, 0]} barSize={26} />
          <Line yAxisId="o" dataKey="orders" stroke="#F0A23B" strokeWidth={2} dot={{ r: 3, fill: '#F0A23B' }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BidRadar({ data, keys }: { data: Record<string, string | number>[]; keys: { k: string; c: string }[] }) {
  return (
    <div className="h-72 ltr">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#334558" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: '#93A3B5', fontSize: 11, fontFamily: 'Vazirmatn Variable' }} />
          {keys.map((x) => <Radar key={x.k} name={x.k} dataKey={x.k} stroke={x.c} fill={x.c} fillOpacity={0.12} strokeWidth={2} />)}
          <Legend wrapperStyle={{ fontFamily: 'Vazirmatn Variable', fontSize: 12 }} />
          <Tooltip {...tip} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MiniBars({ data }: { data: { m: string; v: number }[] }) {
  return (
    <div className="h-40 ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="m" {...axis} reversed />
          <Tooltip {...tip} formatter={(v: number) => [`${fa(v)} میلیون تومان`, 'تسویه']} />
          <Bar dataKey="v" fill="#3FCF8E" radius={[5, 5, 0, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
