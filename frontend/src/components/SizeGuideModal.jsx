import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { SIZE_GUIDE } from "@/data/products";

const SizeGuideModal = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[130] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-h-[85vh] w-full max-w-2xl overflow-auto border border-white/10 bg-panel p-6 sm:p-8"
          data-testid="size-guide-modal"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500/90">RH11 — Fit system</p>
              <h3 className="mt-2 font-display text-2xl font-black uppercase tracking-tight text-white">
                Guía de tallas
              </h3>
              <p className="mt-2 text-xs text-zinc-500">
                Medidas de la prenda en centímetros, tomadas en plano.
              </p>
            </div>
            <button
              data-testid="size-guide-close-button"
              onClick={onClose}
              className="p-1 text-zinc-400 transition-colors hover:text-white"
              aria-label="Cerrar guía de tallas"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <table className="mt-6 w-full border-collapse text-left" data-testid="size-guide-table">
            <thead>
              <tr className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                <th className="border-b border-white/10 py-3 pr-3 font-medium">Talla</th>
                <th className="border-b border-white/10 py-3 pr-3 font-medium">Pecho</th>
                <th className="border-b border-white/10 py-3 pr-3 font-medium">Largo</th>
                <th className="border-b border-white/10 py-3 pr-3 font-medium">Manga</th>
                <th className="hidden border-b border-white/10 py-3 font-medium sm:table-cell">Recomendado</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-zinc-300">
              {SIZE_GUIDE.map((row) => (
                <tr key={row.size} className="transition-colors hover:bg-white/5">
                  <td className="border-b border-white/5 py-3 pr-3 font-bold text-white">{row.size}</td>
                  <td className="border-b border-white/5 py-3 pr-3">{row.chest}</td>
                  <td className="border-b border-white/5 py-3 pr-3">{row.length}</td>
                  <td className="border-b border-white/5 py-3 pr-3">{row.sleeve}</td>
                  <td className="hidden border-b border-white/5 py-3 text-zinc-500 sm:table-cell">{row.recommended}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SizeGuideModal;
