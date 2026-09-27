# AI Chat — Documentazione tecnica

Documento di riferimento per chi deve mantenere questo progetto.
Copre architettura, design system, gestione dello stato, lo stato del motore AI
(attualmente **disattivato**), script di build, deploy e CI.

---

## 1. Panoramica

AI Chat è un'interfaccia di chat in **React 19 + TypeScript + Vite + Tailwind CSS v4**,
costruita su un unico principio: **solo bianco, nero e celestino**.

Il motore di generazione delle risposte **non è collegato e non lo simula**.
L'app conserva in locale ciò che l'utente scrive, mostra esplicitamente che
nessuna risposta verrà prodotta e non simula uno streaming che non esiste.
È una scelta deliberata: un'interfaccia che mente sul proprio stato è peggio
di un'interfaccia che lo dichiara.

| Proprietà | Valore |
| --- | --- |
| Tipo | App web SPA, nessun router, nessun backend |
| Persistenza | `localStorage` (nessun server) |
| Lingua UI | Italiano |
| Tema | Solo (dark), nero assoluto |
| Deploy | Output statico in `dist/` |

---

## 2. Stack

| Pacchetto | Versione | Ruolo |
| --- | --- | --- |
| `react` / `react-dom` | 19.3 | UI, render |
| `vite` | 8.3 | Bundler e dev server |
| `typescript` | 7.0 | Tipizzazione (`strict`) |
| `tailwindcss` + `@tailwindcss/vite` | 4.3 | Stile (utility-first, motore V4) |
| `@vitejs/plugin-react` | 6.1 | Fast Refresh, JSX automatico |
| `bun` | 1.4 | Package manager e runtime dei comandi |

Dipendenze runtime: **solo React**. Nessuna libreria UI esterna, nessun
client HTTP, nessun router: tutto ciò che serve è in `src/` ed è scritto a mano.

---

## 3. Struttura del progetto

```
.
├── index.html               entry HTML, favicon SVG inline, lang="it"
├── vite.config.ts           plugin react + tailwind, host 0.0.0.0, hmr disabilitato
├── tsconfig.json            solution file (rinvia a .app e .node)
├── tsconfig.app.json        strict, noUnusedLocals/Parameters, noEmit
├── tsconfig.node.json       config per i file di build (vite.config.ts)
├── .github/workflows/ci.yml typecheck + build su push/PR verso main
└── src/
    ├── main.tsx             createRoot + StrictMode + import di index.css
    ├── App.tsx              shell, stato globale, persistenza, submit
    ├── index.css            design system: @theme, keyframes, utility
    ├── components/
    │   ├── Sidebar.tsx      navigazione, cronologia, account
    │   ├── Home.tsx         schermata iniziale (hero, stato, prompt bar)
    │   ├── Chat.tsx         transcript + composer in fondo
    │   ├── PromptBar.tsx    campo di composizione, allegati, invio
    │   ├── ModelMenu.tsx    elenco modelli (nessuno attivo)
    │   ├── AuthDialog.tsx   accesso dimostrativo
    │   └── Icons.tsx        set di SVG inline, nessuna dipendenza esterna
    └── lib/
        ├── types.ts         Message, Conversation, Session, MODELS
        ├── utils.ts         cn, createId, formatClock, bucketLabel
        └── hooks.ts         useIsDesktop, useClickOutside, useEscapeKey
```

Circa 1.570 righe di sorgente. Nessun file supera le ~240 righe.

---

## 4. Design system

Tutto il sistema visivo vive in **`src/index.css`**. Non esiste un tema
separato né una configurazione Tailwind classica: Tailwind v4 legge i token
dal blocco `@theme`.

### 4.1 Palette

```css
--color-canvas:      #000000   /* fondo app */
--color-surface:     #0a0a0b   /* sidebar, dialog, prompt bar */
--color-elevated:    #141417   /* menu dropdown */
--color-ink:         #ffffff   /* testo primario */
--color-ink-muted:   #8f8f96   /* grigio neutro, senza tinta blu */
--color-celest:      #38bdf8   /* accento */
--color-celest-soft: #7dd3fc   /* accento in hover */
--color-celest-deep: #075985   /* accento in profondità */
```

**Regola d'uso del colore.** Il nero e il bianco portano la struttura, il
celestino è un accento e segna solo tre cose: stato attivo, focus e bordi
interattivi. Non esistono altri colori nel progetto — nessun verde di conferma,
nessun rosso di errore, nessun viola.

Gli unici valori "colorati" ammessi sono gli opacità di bianco
(`white/4`, `white/8`, `white/12`, …), usati per hairline e superfici.

> Nota: i grigi sono **neutri** (`#8f8f96`), non blu-tinted. Un grigio
> leggermente azzurro read("vecchio blu") e sporca la palette.

### 4.2 Tipografia

Due famiglie, entrambe di sistema (zero webfont, zero richieste di rete):

```css
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, …
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, …
```

Il **mono** non è decorativo: marca le micro-label in maiuscolo con tracking
ampio (`text-[10px] uppercase tracking-[0.18em]`). È il segnale visivo che
distingue "metadati di sistema" dal contenuto utente.

### 4.3 Animazioni

| Token | Keyframe | Uso |
| --- | --- | --- |
| `animate-aurora` | `aurora` | alone celestino pulsante dietro l'hero |
| `animate-drift` | `drift` | scorrimento verticale del reticolo |
| `animate-rise` | `rise` | entrata di titoli, blocchi, messaggi |
| `animate-pop` | `pop` | menu, chip allegato, dialog |
| `animate-blink` | `blink` | pallino di stato pulsante |
| `animate-scan` | `scan` | (riserva) barra di avanzamento |

**Attenzione:** le animazioni stanno dentro `@theme`, **non** dentro
`@layer utilities`. Se una `@keyframes` o una `--animate-*` finiscono in
`@layer utilities`, le varianti tipo `after:animate-blink` non vengono
generate dal compilatore.

### 4.4 Utility custom

Definite in `@layer utilities` in `src/index.css`:

- `.no-scrollbar` — nasconde la scrollbar mantenendo lo scroll.
- `.grid-field` — reticolo di 64px con `mask-image` radiale: la griglia
  sfuma verso i bordi invece di tagliarsi di netto.
- `.hairline` / `.hairline-t` / `.hairline-b` — bordi da 1px realizzati con
  `box-shadow: inset`, che non influenzano il layout (a differenza di
  `border`, che aggiunge 2px e sposta il contenuto).
- `.hairline-celest`, `.glow-celest` — varianti accentuate.

### 4.5 Regole Tailwind v4 da rispettare

1. **Niente classi inesistenti**: `px-4.5` non esiste. Per valori arbitrari
   usare le parentesi quadre: `px-[18px]`.
2. Gli **opacity modifier** funzionano con i colori del tema:
   `text-celest`, `border-celest/25`, `bg-celest/[0.06]`.
3. Le classi usate solo dentro stringhe con template literal devono comparire
   **letteralmente** nel sorgente, altrimenti il purge le elimina.
4. Il colore di fondo e gli spinner del browser si impostano con
   `color-scheme: dark` su `html`.

---

## 5. Stato e flusso dati

Lo stato vive tutto in **`App.tsx`** (nessuna libreria di state management).

```ts
const [store, setStore] = useState<Store>(loadStore);  // conversazioni + sessione
const [activeId, setActiveId] = useState<string | null>(null);
const [draft, setDraft] = useState("");
const [authOpen, setAuthOpen] = useState(false);
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const [mobileOpen, setMobileOpen] = useState(false);
const isDesktop = useIsDesktop();
```

### 5.1 Persistenza

- Chiave: **`ai-chat:v1`**
- Formato: `{ conversations: Conversation[]; session: Session | null }`
- Scrittura con **debounce di 200 ms** in un `useEffect` dipendente da `store`;
  il timer viene pulito a ogni cambio, quindi non si accorciano scritture.
- `JSON.stringify` dentro un `try/catch`: un `localStorage` pieno o
  corrotto non deve far cadere l'app.

### 5.2 `loadStore()` e migrazione dati

`loadStore` è usato come **lazy initializer** di `useState` (si crea una sola
volta). Oltre a fare il parse, **filtra i dati**: tiene solo i messaggi con
`role === "user"` e scarta le conversazioni rimaste vuote.

È una migrazione pensata per lo stato attuale del prodotto: le risposte
salvate dalle versioni precedenti non hanno più significato (non c'è più un
motore che le genera), quindi non vengono mostrate.

### 5.3 `submit()` — l'unico punto di scrittura

```ts
const submit = useCallback((text, attachment) => {
  // 1. validazione: testo o allegato, almeno uno
  // 2. crea o riusa la conversazione (activeId ?? createId())
  // 3. append del messaggio utente, titolo derivato dal testo (max 48 char)
  // 4. pulisce la draft e imposta activeId
}, [activeId]);
```

**Non viene creato alcun messaggio `assistant`.** Questo è il punto in cui il
vecchio codice inseriva un `pendingReply` vuoto e avviava lo streaming.

### 5.4 Modelli dati (`src/lib/types.ts`)

```ts
Message      { id, role: "user" | "assistant", text, attachment?, createdAt }
Conversation { id, title, messages[], createdAt, updatedAt }
Session      { name, email }
ModelOption  { id, name, hint, available }
```

`MODELS` contiene **quattro voci, tutte `available: false`**: `Nessun modello`
(quella selezionata di default) più `Flash-Lite`, `Pro` e `Ultra`. Non è un
elenco funzionante: è l'elenco di ciò che sarà disponibile, reso esplicito
nella UI.

### 5.5 Utilità (`src/lib/utils.ts`)

- `cn(...)` — concatena classi condizionali (`false`/`null`/`undefined`
  vengono scartati). Non è un clone di `clsx`: il progetto non ha bisogno di
  gestire array o oggetti.
- `createId()` — id breve e non soggetti a collisione
  (`Date.now().toString(36)` + 6 caratteri casuali).
- `formatClock(ts)` — orario `it-IT` a 24h, usato sotto ogni messaggio.
- `bucketLabel(ts)` — raggruppa le chat in *Oggi / Ieri / Ultimi 7 giorni /
  Conversazioni precedenti*, calcolando l'inizio della giornata locale.

### 5.6 Hook (`src/lib/hooks.ts`)

- `useIsDesktop(query)` — sottoscrizione a una media query via
  `addEventListener("change")`; distingue layout desktop e mobile.
- `useClickOutside(handler, active)` — `mousedown` + `touchstart`; il
  callback è tenuto in un `ref` per non ricreare i listener a ogni render.
- `useEscapeKey(handler, active)` — chiude dialog e menu con `Escape`.

---

## 6. Lo stato del motore AI

### 6.1 Cosa è stato rimosso

| Elemento | Dove era | Stato |
| --- | --- | --- |
| Motore di risposte demo | `src/lib/replies.ts` (143 righe, regole regex) | **eliminato** |
| Stato di streaming | `StreamState`, `stream` in `App.tsx` | **eliminato** |
| Callback `onDelta` / `onStreamEnd` | `App.tsx` → `Chat.tsx` | **eliminato** |
| Effetto typewriter (`setTimeout` a 16 ms) | `Chat.tsx` | **eliminato** |
| Cursore lampeggiante / pallini "sto scrivendo" | `Chat.tsx` | **eliminati** |
| Microfono con registrazione simulata | `PromptBar.tsx` | **eliminato** |
| Selettore di modello funzionante | `ModelMenu.tsx` | **diventato statico** |
| "Usa le app" | `PromptBar.tsx` | **disabilitato, etichettato "presto"** |

### 6.2 Cosa resta attivo

- Composizione e invio del messaggio (Invio / `Enter`).
- Allegati: il nome del file viene letto e mostrato, non viene caricato.
- Cronologia in `localStorage`, con raggruppamento per data ed eliminazione.
- Accesso dimostrativo: nome derivato dall'email, mai inviato a un server.
- Cambio modello **non selezionabile**, con etichetta "Non attivo".

### 6.3 Come si dichiara all'utente

Il producto comunica lo stato in tre punti coerenti fra loro:

1. **Home** — striscia di stato: `Modello: Nessuno`, `Risposte: Spente`,
   `Streaming: Disattivato`, `Memoria: Solo locale`; più il pannello
   *Funziona / Non funziona*.
2. **Prompt bar** — riga mono sotto il campo:
   `Nessun modello collegato / Invio salvato in locale`.
3. **Chat** — card celestina in coda al transcript:
   *Motore non collegato — il tuo messaggio è stato salvato, ma AI Chat non
   genera risposte.*

### 6.4 Come riattivare un modello reale

Se in futuro si collega un backend, il punto d'innesto è **uno solo**:
`submit()` in `src/App.tsx`, che oggi termina con l'inserimento del messaggio
utente. Serve:

1. una chiave API **mai nel frontend** — va letta in un ambiente server
   (variabile d'ambiente) e chiamata da un endpoint;
2. uno stato di risposta in `App.tsx` (`idle | pending | streaming | error`)
   che `Chat.tsx` riceve come prop per mostrare il testo in arrivo e un
   eventuale pulsante di interruzione;
3. in `types.ts`, `MODELS` va aggiornato con `available: true` per i modelli
   realmente disponibili: `ModelMenu` e `ModelOption.available` sono già
   predisposti per accendere le voci senza riscriverne il markup;
4. in `Chat.tsx`, `EngineOffline` va sostituito dal rendering del messaggio
   assistant.

Nessun'altra parte dell'app richiede modifiche: l'invio, la persistenza, la
sidebar e la cronologia funzionano già con più messaggi.

---

## 7. Componenti

### `App.tsx` — shell
Layout a due colonne: sidebar opzionale + `main`. La sidebar ha due
dichiarazioni di visibilità: `isDesktop ? !sidebarCollapsed : mobileOpen`.
L'intestazione (`h-14`, hairline inferiore) contiene il menu (quando la
sidebar è chiusa), il percorso `AI Chat / <titolo>` in mono, il badge
*Risposte disattivate* e l'accesso. Sotto: `Home` quando non c'è una
conversazione attiva, altrimenti `Chat`.

### `Sidebar.tsx` — navigazione
- Wordmark con marchio celestino e chip `v1.0`.
- **Nuova chat**: bordo hairline che diventa celestino in hover.
- **Callout d'accesso** quando non c'è sessione (bordo celestino, misura
  `Accedi per salvare l'attività`).
- **Cronologia** (solo con sessione): gruppi per data, barra celestina da 2px
  sull'elemento attivo, pulsante elimina che compare all'hover/focus.
- **Piedi**: link informativi e blocco account (avatar bianco, email, esci).
- Su mobile: overlay con `backdrop-blur` e slide-in da 300 ms.

### `Home.tsx` — schermata iniziale
Sfondo (reticolo mascherato alone celestino animato), eyebrow con lineetta
celestina, titolo "Bianco, nero e celestino.", descrizione, striscia di stato a
4 celle, `PromptBar`, chip che precompilano il campo, pannello
*Funziona / Non funziona*, nota finale sulla privacy locale.

### `Chat.tsx` — conversazione
Transcript a `max-w-[720px]` con scroll automatico in fondo; i messaggi
utente sono **bolle bianche con testo nero** (contrasto invertito rispetto al
resto della UI), con bordo celestino se c'è un allegato. Segue sempre
`EngineOffline`. In basso, ancorato con hairline e sfondo sfocato, il
composer a `max-w-[680px]`.

### `PromptBar.tsx` — composizione
Contenitore arrotondato (20px) con hairline che si illumina al focus
(bordo celestino + alone). Contiene: menu allegati (file abilitato, app
disabilitato), textarea che cresce fino a 168px, `ModelMenu`, pulsante invio
celestino. `Enter` invia, `Shift+Enter` va a capo.

### `ModelMenu.tsx` — modelli
Nessuno stato di selezione: mostra la voce corrente e un popover in cui ogni
modello è etichettato *Non attivo*. Il componente ha zero prop.

### `AuthDialog.tsx` — accesso
Dimostrativo e dichiarato tale. L'email viene validata con
`/^\S+@\S+\.\S+$/`; il nome è derivato dall'email
(`mario.rossi@…` → `Mario Rossi`). Chiude su `Escape` e click fuori.
Nessuna richiesta di rete.

### `Icons.tsx` — icone
SVG inline con un unico wrapper `icon(props)` che applica `viewBox`,
`stroke`, `aria-hidden` e `focusable: false`. Nessuna dipendenza esterna.
Icone aggiunte nel redesign: `BoltIcon`, `PowerIcon`, `ArrowUpRightIcon`.

---

## 8. Accessibilità e responsive

- Ogni controllo icon-only ha `aria-label` e `title`.
- `ModelMenu` usa `role="listbox"` / `role="option"` con `aria-selected` e
  `aria-disabled`.
- `AuthDialog` ha `role="dialog"`, `aria-modal`, `aria-labelledby`.
- Focus visibile **globale**: `*:focus-visible` disegna un outline celestino di
  2px con offset 2px. Non serve ricordarselo nei singoli componenti.
- Il menu allegati disabilita il pulsante con `disabled` invece di colorarlo
  diversamente: è leggibile anche senza distinguere i colori.
- Breakpoint unico a 768px (`useIsDesktop`): sotto, la sidebar diventa
  overlay a tutto schermo.
- `prefers-reduced-motion` **non** è gestito: è una lacuna nota.

---

## 9. Performance

Nessuna misura di benchmark, ma le scelte che contano:

- `bundle` JS ~250 kB (76 kB gzip), CSS ~36 kB (7 kB gzip).
- Nessuna richiesta di rete a runtime, nessun webfont, nessuna immagine.
- `React.StrictMode` attivo in `main.tsx` (in sviluppo segnala gli abusi di
  hook e gli aggiornamenti doppi; in produzione non costa nulla).
- I listener di `useClickOutside`/`useEscapeKey` sono stabili tra i render
  (callback tenuto in `ref`), quindi non vengono riassegnati a ogni keystroke.
- Il `backdrop-filter` è limitato a few elementi (sidebar mobile, dialog,
  composer in chat): su device lenti è la scelta più costosa del progetto.

---

## 10. Script, build e deploy

| Comando | Effetto |
| --- | --- |
| `bun install` | installa le dipendenze |
| `bun run dev` | server di sviluppo su `0.0.0.0` (HMR disabilitato) |
| `bun run typecheck` | `tsc -b --noEmit` |
| `bun run build` | `tsc -b && vite build` → `dist/` |
| `bun run preview` | serve staticamente `dist/` |

Comandi di deploy configurati sulla piattaforma:

- **install**: `bun install`
- **build**: `vite build` — deve solo produrre `dist/` e uscire, non avviare
  nessun server
- **dev**: `bun run dev` sulla porta gestita dalla piattaforma

> `vite.config.ts` fissa `server.host = "0.0.0.0"` e `server.hmr = false`:
> la piattaforma gestisce dev server e reload. Non riattivare l'HMR.

Prima di ogni deploy: `freebuff-deploy check` (riporta i comandi che verranno
eseguiti e gli eventuali problemi senza consumare una build).

---

## 11. CI

`.github/workflows/ci.yml` — su `push` e `pull_request` verso `main`:

1. `actions/checkout@v7`
2. `oven-sh/setup-bun@v2` (Bun latest)
3. `bun install --frozen-lockfile`
4. `bun run typecheck`
5. `bun run build`

Il lockfile è vincolato: **modificare le dipendenze senza aggiornare
`bun.lock` rompe la CI**.

---

## 12. Verifiche eseguite

- `bun tsc -b --noEmit` — pulito (config strict, `noUnusedLocals`,
  `noUnusedParameters`).
- **Harness di rendering temporaneo** (`happy-dom` + `act`): 26 controlli su 26,
  zero errori React. Verificati: contenuto dell'hero, striscia di stato,
  inserimento di un messaggio e invio con `Enter`, assenza di qualsiasi testo
  generato, una sola bolla utente, menu modelli con voci *Non attivo*,
  apertura del dialog d'accesso, pulsante invio disabilitato a campo vuoto.
  Lo script e la dipendenza sono stati **rimossi dopo l'uso**: non devono
  finire in `package.json` perché appesantiscono l'installazione.
- **CSS compilato** ispezionato per verificare che le classi celestino siano
  generate, incluse le varianti `hover:` e `focus-within:` con opacità
  arbitrarie.
- CI: build reale con artefatti `dist/` (~36 kB CSS, ~250 kB JS).
- `freebuff-deploy check` → `deployable: true`.

**Lacuna nota:** la verifica end-to-end con uno screenshot reale non è stata
possibile in questo ambiente (Chrome headless non si avvia per librerie di
sistema mancanti, e l'immagine del container non è modificabile). Il rendering
è stato validato a livello DOM, non visivo.

---

## 13. Limiti noti

1. **Nessun backend**: tutto in `localStorage`, quindi la cronologia è legata
   al singolo browser e si perde cancellando i dati del sito.
2. **Allegati non caricati**: viene mostrato solo il nome del file.
3. **Accesso fittizio**: nessuna verifica dell'identità, nome derivato
   dall'email.
4. **`prefers-reduced-motion` non gestito**.
5. **Nessun test suite permanente**: la verifica eseguita è stata one-off.
6. **`verify a schermo` non automatizzata** (vedi sezione 12).
