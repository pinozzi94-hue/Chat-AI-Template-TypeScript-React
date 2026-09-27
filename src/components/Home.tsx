import { CheckIcon, CloseIcon } from "./Icons";
import { PromptBar } from "./PromptBar";

interface HomeProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (text: string, attachment?: string) => void;
}

const STATUS = [
  { label: "Modello", value: "Nessuno" },
  { label: "Risposte", value: "Spente" },
  { label: "Streaming", value: "Disattivato" },
  { label: "Memoria", value: "Solo locale" },
];

const QUICK_PROMPTS = [
  "Scrivi una mail di ringraziamento per un collega",
  "Spiegami cosa sono gli WebSocket",
  "Riassumi questo articolo in cinque punti",
];

const WORKS = [
  "Interfaccia e layout",
  "Allegati e modelli di testo",
  "Cronologia in locale",
  "Accesso dimostrativo",
];

const BLOCKED = [
  "Generazione delle risposte",
  "Streaming parola per parola",
  "Modelli linguistici",
  "Ricerca sul web",
];

export function Home({ value, onValueChange, onSubmit }: HomeProps) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="animate-aurora pointer-events-none absolute left-1/2 top-[-160px] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.28),rgba(2,132,199,0.10),transparent_72%)] blur-[70px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-celest/40 to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-[880px] flex-1 flex-col justify-center px-5 py-12 sm:px-8">
        <div className="animate-rise flex items-center gap-3">
          <span className="h-px w-10 bg-celest/70" />
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-celest">
            Interfaccia ricostruita da zero
          </span>
        </div>

        <h1
          className="animate-rise mt-5 text-[38px] font-medium leading-[1.02] tracking-[-0.035em] text-ink sm:text-[56px]"
          style={{ animationDelay: "70ms" }}
        >
          Bianco, nero
          <br />
          e <span className="text-celest">celestino</span>.
        </h1>

        <p
          className="animate-rise mt-6 max-w-[560px] text-[15px] leading-7 text-ink-muted"
          style={{ animationDelay: "130ms" }}
        >
          AI Chat è stato riscritto da zero: una sola tinta d&apos;accento, tipografia netta,
          nessun gradiente inutile. Il motore di risposte è disattivato — puoi scrivere,
          allegare file e salvare le chat, ma nessuna risposta viene generata.
        </p>

        <dl
          className="animate-rise mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4"
          style={{ animationDelay: "190ms" }}
        >
          {STATUS.map(({ label, value: text }) => (
            <div key={label} className="bg-canvas px-4 py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
                {label}
              </dt>
              <dd className="mt-1.5 text-[13.5px] text-ink">{text}</dd>
            </div>
          ))}
        </dl>

        <div className="animate-rise mt-8 w-full" style={{ animationDelay: "250ms" }}>
          <PromptBar value={value} onValueChange={onValueChange} onSubmit={onSubmit} />
        </div>

        <div
          className="animate-rise mt-4 flex flex-wrap items-center gap-2"
          style={{ animationDelay: "300ms" }}
        >
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onValueChange(prompt)}
              className="rounded-full border border-white/12 px-3.5 py-1.5 text-left text-[12.5px] text-ink-muted transition-colors hover:border-celest/45 hover:bg-celest/[0.06] hover:text-ink"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div
          className="animate-rise mt-10 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2"
          style={{ animationDelay: "350ms" }}
        >
          <Panel title="Funziona" tone="on" items={WORKS} />
          <Panel title="Non funziona" tone="off" items={BLOCKED} />
        </div>

        <p
          className="animate-rise mt-8 text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/25"
          style={{ animationDelay: "400ms" }}
        >
          Nessun dato lascia il dispositivo
        </p>
      </div>
    </div>
  );
}

function Panel({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "on" | "off";
}) {
  return (
    <div className="bg-canvas px-4 py-4">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
        <span
          className={`h-1.5 w-1.5 rounded-full ${tone === "on" ? "bg-celest" : "bg-white/30"}`}
        />
        {title}
      </p>
      <ul className="mt-3.5 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-[13.5px] text-ink-muted">
            {tone === "on" ? (
              <CheckIcon className="h-3.5 w-3.5 shrink-0 text-celest" />
            ) : (
              <CloseIcon className="h-3 w-3 shrink-0 text-white/25" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
