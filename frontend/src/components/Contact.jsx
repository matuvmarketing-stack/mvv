import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Reveal from "./Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const EMPTY = { nombre: "", email: "", asunto: "", mensaje: "" };

const Field = ({ label, name, value, onChange, type = "text", textarea }) => (
  <div>
    <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500">{label}</label>
    {textarea ? (
      <textarea
        rows={4}
        data-testid={`contact-input-${name}`}
        value={value}
        onChange={onChange}
        className="w-full resize-none border border-white/15 bg-obsidian px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-accent"
      />
    ) : (
      <input
        type={type}
        data-testid={`contact-input-${name}`}
        value={value}
        onChange={onChange}
        className="w-full border border-white/15 bg-obsidian px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-accent"
      />
    )}
  </div>
);

const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim()) {
      toast.error("Completa nombre, email y mensaje");
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API}/contact`, { ...form, asunto: form.asunto.trim() || "Consulta web" });
      toast.success("Mensaje enviado. Te responderemos en 24-48h.");
      setForm(EMPTY);
    } catch {
      toast.error("No se pudo enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="border-t border-white/10 py-24 sm:py-32" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-red-500/90">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              Contacto
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white">
              Hablemos.
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-400">
              ¿Dudas con tu talla, tu pedido o una colaboración? Escríbenos y te respondemos en menos de 48 horas.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 space-y-px border border-white/10 bg-white/10">
              {[
                ["Soporte", "soporte@rh11.eu"],
                ["Prensa", "prensa@rh11.eu"],
                ["Horario", "Lunes a viernes · 9:00 — 18:00"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between bg-obsidian px-5 py-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">{label}</span>
                  <span className="font-mono text-xs text-zinc-200">{value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form
            onSubmit={submit}
            className="space-y-5 border border-white/10 bg-panel p-6 sm:p-8"
            data-testid="contact-form"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nombre *" name="nombre" value={form.nombre} onChange={set("nombre")} />
              <Field label="Email *" name="email" type="email" value={form.email} onChange={set("email")} />
            </div>
            <Field label="Asunto" name="asunto" value={form.asunto} onChange={set("asunto")} />
            <Field label="Mensaje *" name="mensaje" textarea value={form.mensaje} onChange={set("mensaje")} />
            <button
              type="submit"
              disabled={sending}
              data-testid="contact-submit-button"
              className="h-14 w-full bg-accent font-display text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-accent-hover disabled:opacity-60"
            >
              {sending ? "Enviando…" : "Enviar mensaje"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
