import { useEffect, useRef } from "react";
import type { Message } from "../lib/types";
import { formatClock } from "../lib/utils";
import { PaperclipIcon, PowerIcon } from "./Icons";
import { PromptBar } from "./PromptBar";

interface ChatProps {
  messages: Message[];
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (text: string, attachment?: string) => void;
}

export function Chat({ messages, value, onValueChange, onSubmit }: ChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pt-8 sm:px-6"
      >
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8 pb-6">
          {messages.map((message) => (
            <UserMessage key={message.id} message={message} />
          ))}
          <EngineOffline />
        </div>
      </div>

      <div className="hairline-t shrink-0 bg-canvas/85 px-4 pb-5 pt-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto w-full max-w-[680px]">
          <PromptBar
            value={value}
            onValueChange={onValueChange}
            onSubmit={onSubmit}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="animate-rise flex flex-col items-end gap-2">
      {message.attachment && (
        <span className="flex items-center gap-2 rounded-lg border border-celest/30 bg-celest/[0.07] py-1.5 pl-3 pr-4 text-[12.5px] text-ink">
          <PaperclipIcon className="h-4 w-4 shrink-0 text-celest" />
          <span className="max-w-[240px] truncate">{message.attachment}</span>
        </span>
      )}
      {message.text && (
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-[6px] bg-white px-4 py-2.5 text-[15px] leading-6 text-black">
          {message.text}
        </div>
      )}
      <time className="pr-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/25">
        {formatClock(message.createdAt)}
      </time>
    </div>
  );
}

function EngineOffline() {
  return (
    <div className="animate-rise flex gap-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-celest/30 bg-celest/[0.08] text-celest">
        <PowerIcon className="h-[18px] w-[18px]" />
      </span>

      <div className="min-w-0 flex-1 rounded-xl border border-celest/20 bg-celest/[0.04] px-4 py-3.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-celest">
          Motore non collegato
        </p>
        <p className="mt-2 text-[14.5px] leading-6 text-ink">
          Il tuo messaggio è stato salvato, ma AI Chat non genera risposte.
        </p>
        <p className="mt-1.5 text-[13px] leading-6 text-ink-muted">
          Nessun modello è connesso: invio, allegati e cronologia funzionano, la risposta no.
        </p>
      </div>
    </div>
  );
}
