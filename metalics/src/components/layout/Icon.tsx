import {
  LayoutDashboard, Plus, Package, Scale, MessagesSquare, Gavel, Inbox, Factory, Wallet, Gauge, ClipboardCheck, ScanSearch,
  Activity, ShieldCheck, Eye, KeyRound, ScrollText, Zap, Flame, CornerDownLeft, Cog, Sparkles, Building2, Wrench, Circle,
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'

const MAP: Record<string, ComponentType<LucideProps>> = {
  LayoutDashboard, Plus, Package, Scale, MessagesSquare, Gavel, Inbox, Factory, Wallet, Gauge, ClipboardCheck, ScanSearch,
  Activity, ShieldCheck, Eye, KeyRound, ScrollText, Zap, Flame, CornerDownLeft, Cog, Sparkles, Building2, Wrench,
}

/** آیکن با نام رشته‌ای (برای منوهای داده‌محور) */
export function Icon({ name, ...p }: { name: string } & LucideProps) {
  const C = MAP[name] ?? Circle
  return <C {...p} />
}
