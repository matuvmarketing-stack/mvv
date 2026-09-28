import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { HERO_IMAGE } from "@/data/products";
import { scrollToId } from "@/lib/lenis";

const EASE = [0.22, 1, 0.36, 1];
const BASE_DELAY = 1.7;

const MaskedLine = ({ children, delay }) => (
  <div className="overflow-hidden">
    <motion.span
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className="block"
    >
      {children}
    </motion.span>
  </div>
);

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden" data-testid="hero-section">
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Atleta con la colección RH11"
          className="h-full w-full object-cover object-top"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-obsidian/50" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/85 via-obsidian/20 to-transparent" aria-hidden="true" />

      {["top-24 left-5", "top-24 right-5", "bottom-16 left-5", "bottom-16 right-5"].map((pos) => (
        <span key={pos} className={`absolute ${pos} font-mono text-sm text-white/25 select-none`} aria-hidden="true">
          +
        </span>
      ))}

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: BASE_DELAY - 0.3, duration: 0.6 }}
          className="mb-5 sm:mb-7 flex items-center gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-red-500/90"
        >
          <span className="h-1.5 w-1.5 bg-accent animate-pulse" aria-hidden="true" />
          Colección 01 — Edición limitada
        </motion.p>

        <h1 className="font-display font-black uppercase tracking-tighter leading-[0.88] text-[clamp(3.4rem,10vw,8.5rem)] text-white">
          <MaskedLine delay={BASE_DELAY}>Viste tu</MaskedLine>
          <MaskedLine delay={BASE_DELAY + 0.12}>
            <span className="text-white">límite</span>
            <span className="text-accent">.</span>
          </MaskedLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BASE_DELAY + 0.45, duration: 0.7, ease: EASE }}
          className="mt-6 sm:mt-8 max-w-md text-sm sm:text-base text-zinc-400 leading-relaxed"
        >
          Ingeniería textil para alto rendimiento y estética urbana sobria.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: BASE_DELAY + 0.55, duration: 0.7 }}
          className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500"
        >
          Algodón denso 420 GSM · Costuras reforzadas · Corte boxy atlético
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BASE_DELAY + 0.7, duration: 0.7, ease: EASE }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <button
            data-testid="hero-buy-now-button"
            onClick={() => scrollToId("productos")}
            className="group inline-flex h-14 items-center justify-center gap-3 bg-accent px-8 font-display text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-accent-hover"
          >
            Comprar ahora
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
          <button
            data-testid="hero-secondary-button"
            onClick={() => scrollToId("nosotros")}
            className="inline-flex h-14 items-center justify-center gap-3 border border-white/20 px-8 font-display text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:border-white hover:bg-white/5"
          >
            Descubrir RH11
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: BASE_DELAY + 0.9, duration: 0.8 }}
        className="absolute bottom-0 inset-x-0 z-10 border-t border-white/10 bg-obsidian/60 backdrop-blur"
        data-testid="hero-telemetry"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-zinc-400">
          <span>01 / 02 artículos</span>
          <span className="hidden sm:block">Fabricado en la península</span>
          <span className="flex items-center gap-2">
            Envío 24/48h
            <ArrowDown size={11} className="animate-bounce" />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
