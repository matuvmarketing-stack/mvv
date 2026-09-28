import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Minus, Plus, Ruler, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getProduct, otherProduct, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import SizeGuideModal from "@/components/SizeGuideModal";
import Reveal from "@/components/Reveal";

export default function ProductPage() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const { addItem } = useCart();
  const [size, setSize] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [guideOpen, setGuideOpen] = useState(false);
  const [openAcc, setOpenAcc] = useState("materiales");
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    setSize("");
    setColorIdx(0);
    setQty(1);
    setActiveImg(0);
    setZoom(false);
  }, [slug]);

  if (!product) return <Navigate to="/" replace />;
  const other = otherProduct(slug);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  const handleAdd = () => {
    if (!size) {
      toast.error("Selecciona una talla para continuar");
      setShakeKey((k) => k + 1);
      return;
    }
    addItem({
      slug: product.slug,
      name: product.shortName,
      price: product.price,
      size,
      color: product.colors[colorIdx].name,
      qty,
      image: product.images[0],
    });
  };

  const accordion = [
    {
      id: "materiales",
      title: "Materiales y cuidados",
      rows: [
        ["Composición", product.specs.composicion],
        ["Gramaje", product.specs.gramaje],
        ["Origen", product.specs.origen],
        ["Cuidados", product.specs.lavado],
      ],
    },
    {
      id: "envio",
      title: "Envío y devoluciones",
      rows: [
        ["Envío", "24/48h en península. Gratuito a partir de 70€."],
        ["Devoluciones", "30 días desde la entrega, prenda sin usar."],
        ["Packaging", "Negro mate compostable, precinto numerado."],
      ],
    },
  ];

  return (
    <main className="pt-16 sm:pt-20" data-testid="product-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          <p data-testid="product-breadcrumb">
            <Link to="/" className="transition-colors hover:text-white">
              Inicio
            </Link>
            <span className="mx-2 text-zinc-700">/</span>
            {product.category}
          </p>
          <span className="text-zinc-700">RH11 — {product.badge}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div
              className="relative aspect-[3/4] cursor-zoom-in overflow-hidden border border-white/10 bg-panel"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={onMove}
              onClick={() => setZoom((z) => !z)}
              data-testid="product-gallery-main"
            >
              <img
                src={product.images[activeImg]}
                alt={`${product.name} — vista ${activeImg + 1}`}
                style={{ transformOrigin: origin }}
                className={`h-full w-full object-cover transition-transform duration-300 ease-out ${
                  zoom ? "scale-[1.8]" : "scale-100"
                }`}
              />
              {!zoom && (
                <span className="pointer-events-none absolute bottom-4 right-4 border border-white/15 bg-obsidian/70 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-300 backdrop-blur">
                  Ampliar +
                </span>
              )}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3" data-testid="product-gallery-thumbs">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  data-testid={`gallery-thumb-${i}`}
                  onClick={() => {
                    setActiveImg(i);
                    setZoom(false);
                  }}
                  className={`aspect-[3/4] overflow-hidden border transition-all duration-300 ${
                    activeImg === i ? "border-white opacity-100" : "border-white/10 opacity-50 hover:opacity-80"
                  }`}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500/90">{product.badge}</p>
            <h1 className="mt-3 font-display text-3xl font-black uppercase tracking-tighter text-white sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 font-mono text-2xl font-bold text-white">
              {formatPrice(product.price)}
              <span className="ml-2 text-[10px] font-normal tracking-[0.2em] text-zinc-500">IVA INCLUIDO</span>
            </p>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-400">{product.short_description}</p>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Talla {size && <span className="text-white">— {size}</span>}
                </p>
                <button
                  data-testid="open-size-guide-button"
                  onClick={() => setGuideOpen(true)}
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  <Ruler size={13} /> Guía de tallas
                </button>
              </div>
              <motion.div
                key={shakeKey}
                animate={shakeKey ? { x: [0, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-6 gap-2"
                data-testid="size-selector"
              >
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    data-testid={`size-select-${s}`}
                    onClick={() => setSize(s)}
                    className={`h-11 border font-mono text-xs transition-all duration-200 ${
                      size === s
                        ? "border-white bg-white font-bold text-obsidian"
                        : "border-white/15 text-zinc-300 hover:border-white hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            </div>

            <div className="mt-7">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                Color <span className="text-white">— {product.colors[colorIdx].name}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    data-testid={`color-select-${i}`}
                    onClick={() => setColorIdx(i)}
                    aria-label={c.name}
                    className={`h-9 w-9 border-2 transition-all duration-200 ${
                      colorIdx === i ? "border-white scale-110" : "border-white/20 hover:border-white/50"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center border border-white/15" data-testid="qty-selector">
                <button
                  data-testid="qty-minus"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3.5 text-zinc-400 transition-colors hover:text-white"
                  aria-label="Reducir cantidad"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-mono text-sm font-bold text-white" data-testid="qty-value">
                  {qty}
                </span>
                <button
                  data-testid="qty-plus"
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  className="px-4 py-3.5 text-zinc-400 transition-colors hover:text-white"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                data-testid="add-to-cart-button"
                onClick={handleAdd}
                className="h-[52px] flex-1 bg-accent font-display text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-accent-hover"
              >
                {size ? `Añadir al carrito — ${formatPrice(product.price * qty)}` : "Selecciona talla"}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
              <span className="flex items-center gap-2">
                <Truck size={13} /> Envío 24/48h
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={13} /> Devolución 30 días
              </span>
            </div>

            <div className="mt-10 border-t border-white/10">
              {accordion.map((section) => (
                <div key={section.id} className="border-b border-white/10">
                  <button
                    data-testid={`accordion-${section.id}`}
                    onClick={() => setOpenAcc(openAcc === section.id ? "" : section.id)}
                    className="flex w-full items-center justify-between py-4 text-left"
                  >
                    <span className="font-display text-sm font-bold uppercase tracking-tight text-white">
                      {section.title}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-zinc-500 transition-transform duration-300 ${
                        openAcc === section.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openAcc === section.id && (
                    <div className="pb-5" data-testid={`accordion-content-${section.id}`}>
                      {section.rows.map(([label, value]) => (
                        <div key={label} className="grid grid-cols-[110px_1fr] gap-4 py-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500 pt-0.5">
                            {label}
                          </span>
                          <span className="text-sm text-zinc-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="font-display text-2xl font-black uppercase tracking-tighter text-white">Detalles</h2>
            <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-base">{product.full_description}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="bg-obsidian p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500">{key}</p>
                  <p className="mt-2 text-sm text-zinc-200">{value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <section className="border-t border-white/10 py-16 sm:py-24" data-testid="cross-sell-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-6">
              <h2 className="font-display text-2xl font-black uppercase tracking-tighter text-white sm:text-4xl">
                Completa el uniforme
              </h2>
              <Link
                to={`/producto/${other.slug}`}
                className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400 transition-colors hover:text-white sm:flex"
              >
                Ver {other.category} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="max-w-md">
              <ProductCard product={other} index={1} testid={`cross-sell-card-${other.category.toLowerCase()}`} />
            </div>
          </Reveal>
        </div>
      </section>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </main>
  );
}
