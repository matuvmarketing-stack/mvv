import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { X, Minus, Plus, Trash2, ArrowLeft, Check, ShoppingBag, Lock } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { scrollToId } from "@/lib/lenis";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const EMPTY_FORM = { nombre: "", email: "", telefono: "", direccion: "", ciudad: "", codigo_postal: "" };

const Field = ({ label, name, value, onChange, error, half, placeholder }) => (
  <div className={half ? "col-span-1" : "col-span-2"}>
    <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500">{label}</label>
    <input
      data-testid={`checkout-input-${name}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border bg-obsidian px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-accent ${
        error ? "border-accent" : "border-white/15"
      }`}
    />
    {error && <p className="mt-1 font-mono text-[9px] text-red-500/90">{error}</p>}
  </div>
);

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal, shipping, total, freeShippingThreshold, clear } =
    useCart();
  const [step, setStep] = useState("cart");
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) setStep("cart");
  }, [isOpen]);

  const handleClose = () => {
    closeCart();
    if (step === "done") {
      setConfirmation(null);
      setForm(EMPTY_FORM);
      setErrors({});
    }
  };

  const goProducts = () => {
    handleClose();
    if (location.pathname !== "/") navigate("/", { state: { scrollTo: "productos" } });
    else setTimeout(() => scrollToId("productos"), 50);
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Introduce tu nombre";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email no válido";
    if (!form.direccion.trim()) e.direccion = "Introduce tu dirección";
    if (!form.ciudad.trim()) e.ciudad = "Introduce tu ciudad";
    if (!form.codigo_postal.trim()) e.codigo_postal = "Introduce el código postal";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitOrder = async () => {
    if (!validate()) return;
    setSending(true);
    try {
      const payload = {
        customer: {
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          telefono: form.telefono.trim(),
          direccion: form.direccion.trim(),
          ciudad: form.ciudad.trim(),
          codigo_postal: form.codigo_postal.trim(),
        },
        items: items.map((i) => ({ slug: i.slug, size: i.size, color: i.color, qty: i.qty })),
      };
      const { data } = await axios.post(`${API}/orders`, payload);
      setConfirmation(data);
      clear();
      setStep("done");
    } catch (err) {
      toast.error(err.response?.data?.detail || "No se pudo registrar el pedido");
    } finally {
      setSending(false);
    }
  };

  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div data-testid="cart-drawer">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-[105] bg-black/75 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[110] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-300">
                {step === "form" ? "Finalizar pedido" : step === "done" ? "Pedido confirmado" : `Carrito (${items.reduce((a, i) => a + i.qty, 0)})`}
              </p>
              <button
                data-testid="cart-close-button"
                onClick={handleClose}
                className="p-1 text-zinc-400 transition-colors hover:text-white"
                aria-label="Cerrar carrito"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {step === "cart" && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-1 flex-col overflow-hidden"
                >
                  {items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                      <ShoppingBag size={40} strokeWidth={1} className="text-zinc-700" />
                      <p className="font-display text-lg font-bold uppercase tracking-tight text-white">
                        Tu carrito está vacío
                      </p>
                      <p className="text-sm text-zinc-500">Dos piezas te esperan. No dejes pasar la edición.</p>
                      <button
                        data-testid="cart-empty-cta"
                        onClick={goProducts}
                        className="mt-2 border border-white/20 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white transition-colors hover:border-accent hover:bg-accent"
                      >
                        Ver productos
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto px-6 py-4">
                        <div className="mb-4">
                          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                            {remaining > 0
                              ? `Te faltan ${formatPrice(remaining)} para el envío gratuito`
                              : "Envío gratuito aplicado"}
                          </p>
                          <div className="mt-2 h-1 w-full bg-white/10">
                            <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                        {items.map((item) => (
                          <div
                            key={item.key}
                            data-testid="cart-item"
                            className="flex gap-4 border-b border-white/5 py-4 last:border-0"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="aspect-[4/5] w-20 shrink-0 border border-white/10 object-cover"
                            />
                            <div className="flex flex-1 flex-col">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-display text-sm font-bold uppercase tracking-tight text-white">
                                    {item.name}
                                  </p>
                                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                                    Talla {item.size} · {item.color}
                                  </p>
                                </div>
                                <button
                                  data-testid="cart-remove-item"
                                  onClick={() => removeItem(item.key)}
                                  className="p-1 text-zinc-600 transition-colors hover:text-accent"
                                  aria-label="Eliminar del carrito"
                                >
                                  <Trash2 size={15} strokeWidth={1.5} />
                                </button>
                              </div>
                              <div className="mt-auto flex items-center justify-between pt-3">
                                <div className="flex items-center border border-white/15">
                                  <button
                                    data-testid="cart-item-qty-minus"
                                    onClick={() => updateQty(item.key, -1)}
                                    className="px-2.5 py-1.5 text-zinc-400 transition-colors hover:text-white"
                                    aria-label="Reducir cantidad"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="w-8 text-center font-mono text-xs text-white" data-testid="cart-item-qty">
                                    {item.qty}
                                  </span>
                                  <button
                                    data-testid="cart-item-qty-plus"
                                    onClick={() => updateQty(item.key, 1)}
                                    className="px-2.5 py-1.5 text-zinc-400 transition-colors hover:text-white"
                                    aria-label="Aumentar cantidad"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                                <p className="font-mono text-sm font-bold text-white">
                                  {formatPrice(item.price * item.qty)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/10 px-6 py-5">
                        <div className="space-y-1.5 font-mono text-xs">
                          <div className="flex justify-between text-zinc-400">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-zinc-400">
                            <span>Envío</span>
                            <span>{shipping === 0 ? "GRATIS" : formatPrice(shipping)}</span>
                          </div>
                          <div className="flex justify-between border-t border-white/10 pt-2.5 text-base font-bold text-white">
                            <span>Total</span>
                            <span data-testid="cart-total">{formatPrice(total)}</span>
                          </div>
                        </div>
                        <button
                          data-testid="cart-checkout-button"
                          onClick={() => setStep("form")}
                          className="mt-4 h-13 w-full bg-accent py-3.5 font-display text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-accent-hover"
                        >
                          Tramitar pedido
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {step === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 overflow-y-auto px-6 py-5"
                >
                  <button
                    data-testid="checkout-back-button"
                    onClick={() => setStep("cart")}
                    className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400 transition-colors hover:text-white"
                  >
                    <ArrowLeft size={13} /> Volver al carrito
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Nombre *" name="nombre" value={form.nombre} onChange={set("nombre")} error={errors.nombre} />
                    <Field label="Email *" name="email" value={form.email} onChange={set("email")} error={errors.email} half placeholder="tu@email.com" />
                    <Field label="Teléfono" name="telefono" value={form.telefono} onChange={set("telefono")} half />
                    <Field label="Dirección *" name="direccion" value={form.direccion} onChange={set("direccion")} error={errors.direccion} />
                    <Field label="Ciudad *" name="ciudad" value={form.ciudad} onChange={set("ciudad")} error={errors.ciudad} half />
                    <Field label="Código postal *" name="codigo_postal" value={form.codigo_postal} onChange={set("codigo_postal")} error={errors.codigo_postal} half />
                  </div>
                  <div className="mt-6 space-y-1.5 border-t border-white/10 pt-4 font-mono text-xs text-zinc-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span>{shipping === 0 ? "GRATIS" : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-white">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  <button
                    data-testid="order-submit-button"
                    onClick={submitOrder}
                    disabled={sending}
                    className="mt-5 flex h-14 w-full items-center justify-center gap-3 bg-accent font-display text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
                  >
                    <Lock size={14} />
                    {sending ? "Procesando…" : `Confirmar pedido — ${formatPrice(total)}`}
                  </button>
                  <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                    Pago contra entrega · Sin pasarela
                  </p>
                </motion.div>
              )}

              {step === "done" && confirmation && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center"
                  data-testid="order-confirmation"
                >
                  <span className="flex h-16 w-16 items-center justify-center border border-accent bg-accent/10">
                    <Check size={28} className="text-accent" />
                  </span>
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-white">
                    Pedido confirmado
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-400">
                    Referencia
                  </p>
                  <p className="border border-white/15 bg-obsidian px-5 py-2.5 font-mono text-sm font-bold tracking-[0.2em] text-white" data-testid="order-confirm-ref">
                    {confirmation.referencia}
                  </p>
                  <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
                    Tu pedido queda registrado. Total{" "}
                    <span className="font-mono font-bold text-white">{formatPrice(confirmation.total)}</span>. Te
                    contactaremos para coordinar la entrega.
                  </p>
                  <button
                    data-testid="order-continue-button"
                    onClick={handleClose}
                    className="mt-2 border border-white/20 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white transition-colors hover:border-accent hover:bg-accent"
                  >
                    Seguir comprando
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
