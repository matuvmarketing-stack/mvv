import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const WELCOME =
  "Hola, soy el asistente de RH11. Pregúntame por las prendas y materiales, o dime tu altura y peso y te recomiendo tu talla exacta.";
const QUICK_PROMPTS = [
  "¿Qué talla me corresponde?",
  "Diferencias entre la sudadera y la camiseta",
  "¿Cómo es el envío y las devoluciones?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [session] = useState(() => {
    let sid = localStorage.getItem("rh11_chat_session");
    if (!sid) {
      sid = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
      localStorage.setItem("rh11_chat_session", sid);
    }
    return sid;
  });
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    axios
      .get(`${API}/assistant/history/${session}`)
      .then(({ data }) => setMessages(data))
      .catch(() => setMessages([]));
  }, [open, session]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: msg }, { role: "assistant", text: "" }]);
    setStreaming(true);
    try {
      const res = await fetch(`${API}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: session, message: msg }),
      });
      if (!res.ok || !res.body) throw new Error("bad response");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop();
        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          try {
            const ev = JSON.parse(part.slice(6));
            if (ev.type === "delta") {
              full += ev.content;
              setMessages((m) => {
                const c = [...m];
                c[c.length - 1] = { ...c[c.length - 1], text: full };
                return c;
              });
            } else if (ev.type === "error") {
              setMessages((m) => {
                const c = [...m];
                c[c.length - 1] = {
                  ...c[c.length - 1],
                  text: ev.detail || "El asistente no está disponible.",
                  error: true,
                };
                return c;
              });
            }
          } catch {}
        }
      }
      setMessages((m) => {
        const c = [...m];
        if (!c[c.length - 1].text) {
          c[c.length - 1] = {
            ...c[c.length - 1],
            text: "No he podido responder. Inténtalo de nuevo.",
            error: true,
          };
        }
        return c;
      });
    } catch {
      setMessages((m) => {
        const c = [...m];
        c[c.length - 1] = {
          ...c[c.length - 1],
          text: "Sin conexión con el asistente. Inténtalo de nuevo.",
          error: true,
        };
        return c;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {!open && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.4, duration: 0.4 }}
          whileTap={{ scale: 0.92 }}
          data-testid="chat-launcher-button"
          onClick={() => setOpen(true)}
          aria-label="Abrir asistente IA"
          className="fixed bottom-5 right-5 z-[125] flex h-14 w-14 items-center justify-center bg-accent text-white shadow-[0_8px_30px_rgba(142,13,26,0.45)] transition-colors duration-300 hover:bg-accent-hover"
        >
          <MessageCircle size={22} strokeWidth={1.75} />
          <span className="absolute -right-1 -top-1 flex h-4 items-center border border-obsidian bg-white px-1 font-mono text-[8px] font-bold tracking-widest text-obsidian">
            IA
          </span>
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            data-testid="chat-panel"
            className="fixed bottom-4 right-4 z-[125] flex h-[min(70vh,560px)] w-[calc(100vw-2rem)] flex-col border border-white/10 bg-ink sm:w-[380px]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center bg-accent/15">
                  <MessageCircle size={15} className="text-accent" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-tight text-white">
                    Asistente RH11
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                    En línea · Claude
                  </p>
                </div>
              </div>
              <button
                data-testid="chat-close-button"
                onClick={() => setOpen(false)}
                className="p-1 text-zinc-400 transition-colors hover:text-white"
                aria-label="Cerrar asistente"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-testid="chat-messages">
              {messages.length === 0 && (
                <>
                  <Bubble role="assistant" text={WELCOME} />
                  <div className="flex flex-col gap-2 pt-1">
                    {QUICK_PROMPTS.map((q, i) => (
                      <button
                        key={i}
                        data-testid={`chat-quick-prompt-${i}`}
                        onClick={() => send(q)}
                        disabled={streaming}
                        className="border border-white/15 px-3.5 py-2.5 text-left text-xs text-zinc-300 transition-colors duration-200 hover:border-accent hover:text-white disabled:opacity-50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {messages.map((m, i) => (
                <Bubble
                  key={i}
                  role={m.role}
                  text={m.text}
                  error={m.error}
                  pending={m.role === "assistant" && !m.text && streaming && i === messages.length - 1}
                />
              ))}
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="flex gap-2">
                <input
                  data-testid="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Escribe tu pregunta…"
                  className="h-11 flex-1 border border-white/15 bg-obsidian px-3.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-accent"
                />
                <button
                  data-testid="chat-send-button"
                  onClick={() => send()}
                  disabled={streaming || !input.trim()}
                  aria-label="Enviar mensaje"
                  className="flex h-11 w-11 items-center justify-center bg-accent text-white transition-colors duration-200 hover:bg-accent-hover disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="mt-2 text-center font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-600">
                IA generativa · Puede cometer errores · Verifica la guía de tallas
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const renderText = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-white">
        {p.slice(2, -2)}
      </strong>
    ) : (
      p
    )
  );

const Bubble = ({ role, text, error, pending }) => {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`} data-testid={`chat-message-${role}`}>
      {pending ? (
        <div className="flex gap-1.5 border border-white/10 bg-panel px-4 py-3.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-pulse bg-zinc-500"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      ) : (
        <p
          className={`max-w-[85%] whitespace-pre-wrap px-3.5 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-accent text-white"
              : `border bg-panel text-zinc-200 ${error ? "border-accent/60" : "border-white/10"}`
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
};
