import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HERO_IMAGE } from "@/data/products";

const BASE_DELAY = 1.7;

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden" data-testid="hero-section">
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Atleta con la colección RH11"
          className="h-full w-full object-cover object-top"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" aria-hidden="true" />

      {["top-24 left-5", "top-24 right-5", "bottom-16 left-5", "bottom-16 right-5"].map((pos) => (
        <span key={pos} className={`absolute ${pos} font-mono text-sm text-white/25 select-none`} aria-hidden="true">
          +
        </span>
      ))}

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
