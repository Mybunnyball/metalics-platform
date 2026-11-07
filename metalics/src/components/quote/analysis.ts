import type { PartKind } from '@/components/ui/PartDrawing'

/** نتیجه تحلیل نقشه (در نسخه ارائه شبیه‌سازی می‌شود؛ در نسخه تولید از سرویس CAD/AI می‌آید) */
export type Analysis = {
  fileName: string; ext: string; kind: PartKind; real: boolean
  dims: [number, number, number] // mm
  thickness: number | null // null یعنی در نقشه مشخص نشده
  areaM2: number; cutLengthM: number; holes: number; bends: number
  triangles?: number; volumeCm3?: number
  titleBlockRemoved: string; layers: string[]
}

export const SAMPLE: Record<PartKind, Omit<Analysis, 'fileName' | 'ext' | 'real' | 'titleBlockRemoved' | 'layers'>> = {
  bracket: { kind: 'bracket', dims: [240, 160, 120], thickness: null, areaM2: 0.072, cutLengthM: 1.24, holes: 3, bends: 1 },
  flange: { kind: 'flange', dims: [240, 240, 32], thickness: 32, areaM2: 0.045, cutLengthM: 1.32, holes: 9, bends: 0 },
  plate: { kind: 'plate', dims: [600, 400, 25], thickness: 25, areaM2: 0.24, cutLengthM: 2.6, holes: 5, bends: 0 },
  shaft: { kind: 'shaft', dims: [620, 124, 124], thickness: 124, areaM2: 0.06, cutLengthM: 0.9, holes: 2, bends: 0 },
  frame: { kind: 'frame', dims: [1200, 700, 120], thickness: 8, areaM2: 0.42, cutLengthM: 6.1, holes: 4, bends: 0 },
}

export function guessKind(name: string): PartKind {
  const n = name.toLowerCase()
  if (/flange|فلنج/.test(n)) return 'flange'
  if (/shaft|شفت|axle|pin/.test(n)) return 'shaft'
  if (/plate|صفحه|base/.test(n)) return 'plate'
  if (/frame|قاب|chassis|شاسی/.test(n)) return 'frame'
  return 'bracket'
}

export const PIPELINE = [
  'رمزنگاری و بارگذاری امن فایل',
  'تشخیص نوع فایل، لایه‌ها و واحد اندازه‌گیری',
  'استخراج ابعاد، سوراخ‌ها، خطوط خم و طول مسیر برش',
  'خواندن جدول مشخصات و یادداشت‌های فنی نقشه',
  'حذف نام کارفرما و درج واترمارک اختصاصی',
]
