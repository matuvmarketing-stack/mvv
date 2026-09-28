import { Layers, Ruler, PenTool, Truck } from "lucide-react";
import Reveal from "./Reveal";

const PILLARS = [
  {
    icon: Layers,
    metric: "420 & 240 GSM",
    title: "Calidad del tejido",
    desc: "Algodón peinado orgánico de alto gramaje con tratamiento antipilling.",
  },
  {
    icon: Ruler,
    metric: "Drop shoulder boxy",
    title: "Corte y ajuste",
    desc: "Patronaje atlético estudiado: amplitud en hombro, caída limpia en el cuerpo.",
  },
  {
    icon: PenTool,
    metric: "I+D independiente",
    title: "Diseño propio",
    desc: "Cero plantillas. Cada patrón se dibuja, prueba y corrige internamente.",
  },
  {
    icon: Truck,
    metric: "Trazabilidad total",
    title: "Envío rápido 24/48h",
    desc: "Packaging negro mate compostable con precinto de seguridad numerado.",
  },
];

const Values = () => (
  <section id="valores" className="py-24 sm:py-32" data-testid="values-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal>
        <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-red-500/90">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          Ingeniería & disciplina
        </p>
        <h2 className="mb-12 font-display text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white sm:mb-16">
          Cuatro pilares innegociables
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.title}
              data-testid={`value-pillar-${i + 1}`}
              className="group relative bg-obsidian p-8 transition-colors duration-300 hover:bg-panel"
            >
              <span className="absolute right-6 top-6 font-mono text-xs text-zinc-600">0{i + 1}</span>
              <pillar.icon
                size={26}
                strokeWidth={1.5}
                className="text-accent transition-transform duration-300 group-hover:-translate-y-1"
              />
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-red-500/90">{pillar.metric}</p>
              <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-tight text-white">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

export default Values;
