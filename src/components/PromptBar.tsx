import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useClickOutside } from "../lib/hooks";
import { cn } from "../lib/utils";
import { AppsIcon, CloseIcon, PaperclipIcon, PlusIcon, SendIcon } from "./Icons";
import { ModelMenu } from "./ModelMenu";

interface PromptBarProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (text: string, attachment?: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export function PromptBar({
  value,
  onValueChange,
  onSubmit,
  className,
  autoFocus = false,
}: PromptBarProps) {
  const [attachment, setAttachment] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const menuRef = useClickOutside<HTMLDivElement>(() => setMenuOpen(false), menuOpen);

  const send = () => {
    const text = value.trim();
    if (!text && !attachment) return;
    onSubmit(text, attachment ?? undefined);
    setAttachment(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  const handleInput = () => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, 168)}px`;
  };

  const hasContent = value.trim().length > 0 || attachment !== null;

  return (
    <div className={cn("w-full", className)}>
      {attachment && (
        <div className="animate-pop mb-2 flex w-fit items-center gap-2 rounded-lg border border-celest/30 bg-celest/[0.07] py-1.5 pl-3 pr-1.5 text-[12.5px] text-ink">
          <PaperclipIcon className="h-4 w-4 shrink-0 text-celest" />
          <span className="max-w-[220px] truncate">{attachment}</span>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            aria-label="Rimuovi allegato"
            className="flex h-6 w-6 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-white/10 hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="rounded-[20px] border border-white/12 bg-surface/90 p-2 backdrop-blur-md transition-all duration-200 hover:border-white/20 focus-within:border-celest/45 focus-within:shadow-[0_0_0_4px_rgba(56,189,248,0.08)]">
        <div className="flex min-h-11 items-end gap-1">
          <div ref={menuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Aggiungi contenuto"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-white/[0.07] hover:text-ink"
            >
              <PlusIcon className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="animate-pop absolute bottom-full left-0 z-30 mb-2 w-60 overflow-hidden rounded-xl border border-white/12 bg-elevated p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
                <button
                  type="button"
                  onClick={() => {
                    fileRef.current?.click();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] text-ink transition-colors hover:bg-white/[0.06]"
                >
                  <PaperclipIcon className="h-[18px] w-[18px] text-celest" />
                  Carica file
                </button>
                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] text-white/30"
                >
                  <AppsIcon className="h-[18px] w-[18px]" />
                  Usa le app
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-white/25">
                    presto
                  </span>
                </button>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setAttachment(file.name);
                event.target.value = "";
              }}
            />
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            rows={1}
            autoFocus={autoFocus}
            onChange={(event) => {
              onValueChange(event.target.value);
              handleInput();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Chiedi ad AI Chat…"
            aria-label="Chiedi ad AI Chat"
            className="max-h-42 min-h-9 w-full resize-none bg-transparent px-1 py-2 text-[15px] leading-6 text-ink outline-none placeholder:text-white/30"
          />

          <div className="flex shrink-0 items-center gap-1">
            <ModelMenu />

            <button
              type="button"
              onClick={send}
              disabled={!hasContent}
              aria-label="Invia messaggio"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-celest text-black transition-all duration-150 hover:bg-celest-soft active:scale-95 disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-white/25"
            >
              <SendIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        <p className="hairline-t mt-2 flex items-center gap-2 px-2 pb-0.5 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/25">
          <span className="h-1 w-1 rounded-full bg-celest/70" />
          Nessun modello collegato
          <span className="text-white/15">/</span>
          Invio salvato in locale
        </p>
      </div>
    </div>
  );
}
