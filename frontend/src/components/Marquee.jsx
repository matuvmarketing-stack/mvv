const ITEMS = [
  "RH11 — Viste tu límite",
  "Tejido 420 GSM heavyweight",
  "Corte boxy atlético",
  "Zero distracciones",
  "Costuras blindadas",
  "Edición limitada",
];

const Marquee = () => (
  <div className="border-y border-white/10 bg-ink py-5 overflow-hidden" data-testid="marquee">
    <div className="flex w-max animate-marquee">
      {[0, 1].map((dup) => (
        <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
          {ITEMS.map((text, i) => (
            <span key={i} className="flex items-center">
              <span
                className={`whitespace-nowrap px-8 font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight ${
                  i % 2 ? "text-outline" : "text-white"
                }`}
              >
                {text}
              </span>
              <span className="h-2 w-2 rotate-45 bg-accent" aria-hidden="true" />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Marquee;
