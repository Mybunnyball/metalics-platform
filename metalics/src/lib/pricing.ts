/**
 * موتور قیمت‌گذاری آنی (شبیه‌سازی‌شده)
 * قیمت = متریال + ساخت/ماشین‌کاری + بازرسی کیفی + بسته‌بندی و حمل + کارمزد پلتفرم + مالیات بر ارزش افزوده
 * اعداد نمایشی هستند و فقط برای ارائه طراحی شده‌اند.
 */
import { MATERIALS, PROCESSES, QC_TIERS, FINISHES } from '@/data/catalog'

export type QuoteInput = {
  process: string
  material: string
  thickness: number // mm
  quantity: number
  tolerance: 'standard' | 'fine' | 'precision'
  finish: string
  qc: string
  fai: boolean
  certs: string[]
  rush: boolean
  city: string
  areaM2: number // مساحت گسترده تقریبی هر قطعه
  cutLengthM: number
  holes: number
  bends: number
}

const VAT = 0.1
const PLATFORM_MARGIN = 0.12
const DENSITY_FACTOR = 7.85 // kg per m² per mm برای فولاد

export const CITY_DISTANCE: Record<string, number> = {
  تهران: 430, اصفهان: 0, مشهد: 1210, تبریز: 1050, شیراز: 480, اهواز: 690, کرمان: 650, سیرجان: 560, بندرعباس: 1010, اراک: 300,
}

export function priceQuote(q: QuoteInput) {
  const mat = MATERIALS.find((m) => m.id === q.material) ?? MATERIALS[0]
  const proc = PROCESSES.find((p) => p.id === q.process) ?? PROCESSES[0]
  const qc = QC_TIERS.find((t) => t.id === q.qc) ?? QC_TIERS[0]
  const fin = FINISHES.find((f) => f.id === q.finish) ?? FINISHES[0]

  const weightKg = q.areaM2 * q.thickness * DENSITY_FACTOR * mat.densityRatio
  const material = weightKg * mat.pricePerKg * q.quantity * 1.12 // ۱۲٪ پرت ورق

  const tolF = q.tolerance === 'precision' ? 1.55 : q.tolerance === 'fine' ? 1.2 : 1
  const thickF = 1 + Math.max(0, q.thickness - 6) * 0.06
  const perPart = (q.cutLengthM * proc.ratePerM * thickF + q.holes * 9000 + q.bends * 14000 + proc.setupPerPart) * tolF * mat.machinability
  const volumeDiscount = q.quantity >= 500 ? 0.72 : q.quantity >= 100 ? 0.82 : q.quantity >= 20 ? 0.92 : 1
  const fabrication = (perPart * q.quantity * volumeDiscount + proc.setupFixed) * (q.rush ? 1.35 : 1)

  const finishing = fin.pricePerM2 * q.areaM2 * q.quantity
  const inspection = qc.base + (q.fai ? 4_500_000 : 0) + q.certs.length * 1_200_000
  const km = CITY_DISTANCE[q.city] ?? 500
  const totalWeight = weightKg * q.quantity
  const logistics = Math.max(1_800_000, km * 5200 + totalWeight * 900)

  const subtotal = material + fabrication + finishing + inspection + logistics
  const platform = subtotal * PLATFORM_MARGIN
  const vat = (subtotal + platform) * VAT
  const total = subtotal + platform + vat
  const leadDays = Math.ceil(proc.baseDays + Math.log10(q.quantity + 1) * 3 + (q.fai ? 4 : 0) + (q.qc === 'advanced' ? 3 : 0) - (q.rush ? 3 : 0))

  return {
    weightKg, totalWeight,
    lines: [
      { key: 'material', label: `متریال (${mat.name})`, value: material },
      { key: 'fabrication', label: `ساخت — ${proc.name}`, value: fabrication },
      { key: 'finishing', label: `پوشش — ${fin.name}`, value: finishing },
      { key: 'inspection', label: `بازرسی کیفی — ${qc.name}`, value: inspection },
      { key: 'logistics', label: 'بسته‌بندی و حمل تا مقصد (DAP)', value: logistics },
      { key: 'platform', label: 'خدمات متالیکس (تضمین، اسکرو، داوری)', value: platform },
      { key: 'vat', label: 'مالیات بر ارزش افزوده ۱۰٪', value: vat },
    ],
    subtotal, total, unit: total / q.quantity, leadDays, km,
  }
}

/** مهلت شناور استعلام: بین ۶ تا ۷۲ ساعت بر اساس پیچیدگی */
export function biddingWindowHours(q: Pick<QuoteInput, 'quantity' | 'holes' | 'bends' | 'tolerance' | 'process'>) {
  let h = 6 + Math.log2(q.quantity + 1) * 3 + q.bends * 0.6 + q.holes * 0.15
  if (q.tolerance === 'precision') h += 12
  if (q.process === 'assembly' || q.process === 'structure') h += 18
  return Math.min(72, Math.round(h))
}
