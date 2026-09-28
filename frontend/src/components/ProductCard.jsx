import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/data/products";

const ProductCard = ({ product, index, testid }) => (
  <Link
    to={`/producto/${product.slug}`}
    data-testid={testid}
    className="group relative block bg-panel border border-white/10 hover:border-white/25 transition-colors duration-500 overflow-hidden"
  >
    <div className="relative aspect-[4/5] overflow-hidden">
      <img
        src={product.images[0]}
        alt={product.name}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.09),transparent_65%)]"
        aria-hidden="true"
      />
      <span className="absolute top-4 left-4 border border-white/15 bg-obsidian/70 backdrop-blur px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-300">
        {product.badge}
      </span>
      <span className="absolute top-4 right-4 font-mono text-xs text-white/30">0{index + 1}</span>
    </div>

    <div className="p-6 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            {product.category} · {product.colors.length} colores
          </p>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white">
            {product.shortName}
          </h3>
        </div>
        <p className="font-mono text-xl sm:text-2xl font-bold text-white">{formatPrice(product.price)}</p>
      </div>

      <div className="mt-6 flex items-center justify-between border border-white/15 px-5 py-3.5 transition-colors duration-300 group-hover:bg-accent group-hover:border-accent">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white">Ver producto</span>
        <ArrowRight size={16} className="text-white transition-transform duration-300 group-hover:translate-x-1.5" />
      </div>
    </div>
  </Link>
);

export default ProductCard;
