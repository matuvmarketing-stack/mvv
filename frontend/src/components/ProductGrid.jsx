import Reveal from "./Reveal";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";

const ProductGrid = () => (
  <section id="productos" className="py-24 sm:py-32" data-testid="products-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal>
        <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-red-500/90">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          La colección — 02 piezas
        </p>
        <div className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white">
            Dos piezas.
            <br />
            Cero ruido.
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
            No lanzamos temporadas. Diseñamos prendas para durar y las perfeccionamos en silencio.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {products.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.12}>
            <ProductCard product={p} index={i} testid={`product-card-${p.category.toLowerCase()}`} />
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default ProductGrid;
