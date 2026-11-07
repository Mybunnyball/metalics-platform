/**
 * امتیاز تأمین‌کننده (طبق Master Blueprint بخش ۱۱)
 * Score = w1·S_quality + w2·S_delivery + w3·S_price + w4·S_capacity − P_risk
 */
export const DEFAULT_WEIGHTS = { quality: 0.3, delivery: 0.25, price: 0.2, capacity: 0.25 }
export type ScoreParts = { quality: number; delivery: number; price: number; capacity: number; risk: number }
export function supplierScore(s: ScoreParts, w = DEFAULT_WEIGHTS) {
  const v = w.quality * s.quality + w.delivery * s.delivery + w.price * s.price + w.capacity * s.capacity - s.risk
  return Math.max(0, Math.min(100, Math.round(v)))
}
