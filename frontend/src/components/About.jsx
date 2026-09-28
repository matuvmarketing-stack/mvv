import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ABOUT_IMAGE } from "@/data/products";
import Reveal from "./Reveal";

const STATS = [
  { value: "02", label: "Piezas icónicas" },
  { value: "420", label: "GSM máximos" },
  { value: "XS—XXL", label: "Rango de tallas" },
];

const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section id="nosotros" className="border-t border-white/10 py-24 sm:py-32" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div ref={ref} className="relative overflow-hidden border border-white/10">
            <motion.img
              src={ABOUT_IMAGE}
              alt="Taller RH11 — control de calidad del tejido"
              style={{ y }}
              className="aspect-[4/3] w-full scale-[1.15] object-cover"
            />
            <span className="absolute bottom-0 left-0 bg-accent px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white">
              Taller — control de calidad
            </span>
            <span className="absolute -top-px -left-px h-6 w-6 border-l-2 border-t-2 border-accent" aria-hidden="true" />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-red-500/90">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              Sobre nosotros
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white">
              Nacidos de la exigencia
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-8 text-sm leading-relaxed text-zinc-300 sm:text-base">
              RH11 nace de una idea simple: no necesitas veinte prendas. Necesitas dos que aguanten todo. Una
              camiseta y una sudadera, diseñadas al detalle, sin temporadas y sin ruido.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Cada patrón se desarrolla internamente y se produce en talleres que conocemos por su nombre. Medimos
              cada costura, cada gramaje y cada caída antes de que una prenda lleve nuestro nombre.
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
              Nuestro nombre es nuestro estándar.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 grid grid-cols-3 gap-px border border-white/10 bg-white/10">
              {STATS.map((s) => (
                <div key={s.label} className="bg-obsidian p-5 sm:p-6">
                  <p className="font-mono text-xl font-bold text-white sm:text-2xl">{s.value}</p>
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>
            <blockquote className="mt-10 border-l-2 border-accent pl-6 font-display text-xl font-bold uppercase tracking-tight text-zinc-200 sm:text-2xl">
              «Menos armario.
              <br />
              Mejor armario.»
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;
