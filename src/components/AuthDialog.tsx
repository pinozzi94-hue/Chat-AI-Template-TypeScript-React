import { useState } from "react";
import type { FormEvent } from "react";
import { useEscapeKey } from "../lib/hooks";
import type { Session } from "../lib/types";
import { CloseIcon } from "./Icons";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onSignIn: (session: Session) => void;
}

const EMAIL = /^\S+@\S+\.\S+$/;

export function AuthDialog({ open, onClose, onSignIn }: AuthDialogProps) {
  const [email, setEmail] = useState("");
  useEscapeKey(onClose, open);

  if (!open) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL.test(value)) return;
    onSignIn({
      email: value,
      name: value
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase()),
    });
  };

  return (
    <div
      className="animate-pop fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[420px] rounded-2xl border border-white/12 bg-surface p-6 shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-celest">
              Account locale
            </p>
            <h2 id="auth-title" className="mt-2 text-[24px] font-medium tracking-[-0.02em] text-ink">
              Accedi ad AI Chat
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="-mr-1.5 -mt-1 flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-white/[0.07] hover:text-ink"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-[14px] leading-6 text-ink-muted">
          L&apos;accesso è dimostrativo: serve solo a mostrare come viene salvata
          l&apos;attività in questo browser.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-white/12 bg-white text-[14px] font-medium text-black transition-colors hover:bg-celest"
          >
            <span className="text-[16px] font-semibold text-black">G</span>
            Continua con Google
          </button>

          <div className="flex items-center gap-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/25">
            <span className="h-px flex-1 bg-white/10" />
            oppure
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nome@esempio.it"
              aria-label="Indirizzo email"
              autoComplete="email"
              className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 text-[14px] text-ink outline-none transition-colors placeholder:text-white/30 focus:border-celest/60 focus:bg-celest/[0.04]"
            />
            <button
              type="submit"
              disabled={!EMAIL.test(email.trim())}
              className="h-11 w-full rounded-xl bg-celest text-[14px] font-medium text-black transition-colors hover:bg-celest-soft disabled:cursor-not-allowed disabled:bg-white/[0.07] disabled:text-white/30"
            >
              Continua
            </button>
          </form>
        </div>

        <p className="hairline-t mt-6 pt-4 font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-white/25">
          Nessun dato lascia il dispositivo
        </p>
      </div>
    </div>
  );
}
