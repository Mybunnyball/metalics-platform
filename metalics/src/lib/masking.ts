/**
 * موتور ماسک اطلاعات تماس (Anti-Disintermediation)
 * هرگونه شماره تماس، ایمیل، وب‌سایت، آیدی شبکه اجتماعی یا کد اقتصادی در پیام‌ها با ستاره جایگزین می‌شود.
 */
const toLatin = (s: string) => s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))

const RULES: { name: string; re: RegExp }[] = [
  { name: 'ایمیل', re: /[\w.+-]+@[\w-]+\.[\w.]+/gi },
  { name: 'وب‌سایت', re: /\b(?:https?:\/\/|www\.)\S+|\b[\w-]+\.(?:ir|com|net|org|co)\b/gi },
  { name: 'شبکه اجتماعی', re: /@[a-z0-9_.]{3,}|(?:تلگرام|واتساپ|ایتا|بله|روبیکا|اینستا(?:گرام)?)\s*[:：]?\s*\S*/gi },
  { name: 'شماره تماس', re: /(?:\+?98|0)?\s?9\d{2}[\s-]?\d{3}[\s-]?\d{4}|0\d{2,3}[\s-]?\d{7,8}|\b\d{8,}\b/g },
]

export type MaskResult = { text: string; hits: string[] }

export function maskContacts(input: string): MaskResult {
  let text = toLatin(input)
  const hits: string[] = []
  for (const { name, re } of RULES) {
    text = text.replace(re, (m) => {
      hits.push(name)
      return '٭'.repeat(Math.min(Math.max(m.length, 4), 12))
    })
  }
  return { text: hits.length ? text : input, hits: [...new Set(hits)] }
}
