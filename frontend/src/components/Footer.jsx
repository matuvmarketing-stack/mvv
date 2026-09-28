import { Instagram, Twitter, Youtube } from "lucide-react";
import Logo from "./Logo";
import { scrollToId } from "@/lib/lenis";

const NAV_LINKS = [
  { label: "Inicio", target: "top" },
  { label: "Camiseta", to: "/producto/camiseta-rh11-tactical-tee" },
  { label: "Sudadera", to: "/producto/sudadera-rh11-heavyweight" },
  { label: "Sobre nosotros", target: "nosotros" },
  { label: "Contacto", target: "contacto" },
];

const LEGAL_LINKS = ["Guía de tallas", "Envíos 24/48h", "Devoluciones 30 días", "Términos", "Privacidad"];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070707]" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Logo size="text-3xl" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
              Viste tu límite. Dos piezas, cero distracciones, toda la exigencia.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Red social RH11"
                  className="flex h-10 w-10 items-center justify-center border border-white/15 text-zinc-400 transition-colors duration-300 hover:border-accent hover:text-white"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Navegación</p>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      if (link.to) window.location.assign(link.to);
                      else if (link.target === "top") scrollToId("hero-section");
                      else scrollToId(link.target);
                    }}
                    className="text-sm text-zinc-300 transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Ayuda</p>
            <ul className="mt-5 space-y-3">
              {LEGAL_LINKS.map((label) => (
                <li key={label}>
                  <span className="cursor-pointer text-sm text-zinc-300 transition-colors duration-300 hover:text-white">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 overflow-hidden" aria-hidden="true">
        <p className="text-outline-faint -mb-[0.16em] text-center font-display text-[26vw] font-black leading-none tracking-tighter select-none">
          RH11
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-2 py-6 font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 RH11. Todos los derechos reservados.</span>
          <span>Viste tu límite</span>
        </div>
      </div>
    </footer>
  );
}
