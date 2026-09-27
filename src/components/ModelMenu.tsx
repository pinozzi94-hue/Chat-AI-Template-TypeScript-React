import { useState } from "react";
import { useClickOutside } from "../lib/hooks";
import { MODELS } from "../lib/types";
import { ChevronDownIcon } from "./Icons";

/**
 * Il motore non è collegato: il menu elenca i modelli previsti ma nessuno è
 * selezionabile, quindi non mantiene stato di selezione.
 */
export function ModelMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);
  const current = MODELS[0];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-9 items-center gap-1 rounded-lg px-2.5 text-[12.5px] text-ink-muted transition-colors hover:bg-white/[0.07] hover:text-ink"
      >
        {current.name}
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-white/35 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Modelli disponibili"
          className="animate-pop absolute bottom-full right-0 z-30 mb-2 w-64 overflow-hidden rounded-xl border border-white/12 bg-elevated p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
        >
          <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
            Nessuna risposta generata
          </p>
          {MODELS.map((model) => (
            <div
              key={model.id}
              role="option"
              aria-selected={model.available}
              aria-disabled={!model.available}
              className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2"
            >
              <span className="min-w-0">
                <span
                  className={`block text-[13.5px] ${model.available ? "text-ink" : "text-white/35"}`}
                >
                  {model.name}
                </span>
                <span className="block text-[11.5px] text-white/30">{model.hint}</span>
              </span>
              <span
                className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${
                  model.available
                    ? "border-celest/40 text-celest"
                    : "border-white/10 text-white/25"
                }`}
              >
                {model.available ? "Attivo" : "Non attivo"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
