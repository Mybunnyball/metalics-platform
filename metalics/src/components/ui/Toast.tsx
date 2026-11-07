import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type T = { id: number; text: string; tone: 'ok' | 'info' | 'warn' }
const Ctx = createContext<(text: string, tone?: T['tone']) => void>(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<T[]>([])
  const push = useCallback((text: string, tone: T['tone'] = 'ok') => {
    const id = Date.now() + Math.random()
    setItems((s) => [...s, { id, text, tone }])
    setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 3800)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 left-4 z-[100] flex flex-col gap-2" aria-live="polite">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="panel-raised pointer-events-auto flex max-w-sm items-start gap-2.5 px-4 py-3 text-sm">
              {t.tone === 'ok' ? <CheckCircle2 className="mt-0.5 shrink-0 text-ok" size={18} /> : t.tone === 'warn' ? <AlertTriangle className="mt-0.5 shrink-0 text-warn" size={18} /> : <Info className="mt-0.5 shrink-0 text-cut" size={18} />}
              <span>{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}
