import React, { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { initLenis, destroyLenis, scrollTop, scrollToId } from "@/lib/lenis";
import Logo from "@/components/Logo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ChatWidget from "@/components/ChatWidget";
import Home from "@/pages/Home";
import ProductPage from "@/pages/ProductPage";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-obsidian text-white flex items-center justify-center p-8">
          <div className="text-center">
            <Logo />
            <p className="mt-6 text-sm text-zinc-400">Algo ha ido mal. Recarga la página.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const IntroCurtain = () => (
  <motion.div
    className="fixed inset-0 z-[200] bg-obsidian flex flex-col items-center justify-center"
    exit={{ y: "-100%" }}
    transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
    data-testid="intro-curtain"
  >
    <div className="flex overflow-hidden">
      {["R", "H", "1", "1"].map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
          className={`font-display text-6xl sm:text-7xl font-black tracking-tighter ${i > 1 ? "text-accent" : "text-white"}`}
        >
          {ch}
        </motion.span>
      ))}
    </div>
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-5 h-px w-40 origin-center bg-accent"
    />
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mt-4 font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-500"
    >
      Viste tu límite
    </motion.p>
  </motion.div>
);

const ScrollManager = () => {
  const { pathname, state } = useLocation();
  useEffect(() => {
    if (state && state.scrollTo) {
      const t = setTimeout(() => scrollToId(state.scrollTo), 450);
      return () => clearTimeout(t);
    }
    scrollTop(true);
  }, [pathname]);
  return null;
};

function Shell() {
  return (
    <div className="relative">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:slug" element={<ProductPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default function App() {
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    initLenis();
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      setIntro(false);
      document.body.style.overflow = "";
    }, 1600);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      destroyLenis();
    };
  }, []);

  return (
    <ErrorBoundary>
      <CartProvider>
        <BrowserRouter>
          <AnimatePresence>{intro && <IntroCurtain key="intro" />}</AnimatePresence>
          <ScrollManager />
          <Shell />
          <div className="grain" aria-hidden="true" />
          <ChatWidget />
          <Toaster
            position="bottom-left"
            toastOptions={{
              style: {
                background: "#121212",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#ffffff",
                borderRadius: "2px",
              },
            }}
          />
        </BrowserRouter>
      </CartProvider>
    </ErrorBoundary>
  );
}
