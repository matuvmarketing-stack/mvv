import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";
import { scrollTop, scrollToId } from "@/lib/lenis";

const NAV = [
  { label: "Inicio", target: "top" },
  { label: "Camiseta", to: "/producto/camiseta-rh11-tactical-tee" },
  { label: "Sudadera", to: "/producto/sudadera-rh11-heavyweight" },
  { label: "Nosotros", target: "nosotros" },
  { label: "Contacto", target: "contacto" },
];

export default function Header() {
  const { count, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (item) => {
    setMobileOpen(false);
    if (item.to) {
      navigate(item.to);
      return;
    }
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: item.target } });
    } else if (item.target === "top") {
      scrollTop(false);
    } else {
      scrollToId(item.target);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-obsidian/85 backdrop-blur-xl border-b border-white/10"
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link to="/" onClick={(e) => { e.preventDefault(); handleNav(NAV[0]); }} aria-label="RH11 — Inicio">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <button
              key={item.label}
              data-testid={`nav-link-${item.label.toLowerCase()}`}
              onClick={() => handleNav(item)}
              className="group relative font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-300"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            data-testid="cart-toggle-button"
            onClick={openCart}
            className="relative p-2 text-zinc-300 hover:text-white transition-colors duration-300"
            aria-label="Abrir carrito"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span
                data-testid="cart-badge-count"
                className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center bg-accent px-1 font-mono text-[9px] font-bold text-white"
              >
                {count}
              </span>
            )}
          </button>
          <button
            className="md:hidden p-2 text-zinc-300 hover:text-white transition-colors"
            data-testid="mobile-menu-button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menú"
          >
            {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-obsidian/95 backdrop-blur-xl"
            data-testid="mobile-menu"
          >
            <div className="px-6 py-4 flex flex-col">
              {NAV.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNav(item)}
                  className="py-3.5 text-left font-display text-lg font-bold uppercase tracking-tight text-zinc-200 border-b border-white/5 last:border-0"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
