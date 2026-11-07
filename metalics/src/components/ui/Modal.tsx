import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/format'

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-steel-950/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog" aria-modal="true" aria-label={title}
            className={cn('panel-raised relative max-h-[92vh] w-full overflow-y-auto rounded-b-none sm:rounded-panel', wide ? 'sm:max-w-3xl' : 'sm:max-w-lg')}
            initial={{ y: 40, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-steel-700 bg-steel-800/95 px-5 py-3.5 backdrop-blur">
              <h3 className="text-[15px] font-semibold">{title}</h3>
              <button onClick={onClose} className="rounded-lg p-1.5 text-steel-300 hover:bg-steel-700 hover:text-white" aria-label="بستن"><X size={18} /></button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
