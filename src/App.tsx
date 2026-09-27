import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthDialog } from "./components/AuthDialog";
import { Chat } from "./components/Chat";
import { Home } from "./components/Home";
import { MenuIcon } from "./components/Icons";
import { Sidebar } from "./components/Sidebar";
import { useIsDesktop } from "./lib/hooks";
import type { Conversation, Message, Session } from "./lib/types";
import { createId } from "./lib/utils";

const STORAGE_KEY = "ai-chat:v1";

interface Store {
  conversations: Conversation[];
  session: Session | null;
}

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { conversations: [], session: null };
    const parsed = JSON.parse(raw) as Partial<Store>;
    // Il motore è disattivato: le risposte salvate da versioni precedenti non hanno
    // più senso, quindi conserviamo solo ciò che ha scritto l'utente.
    const conversations = (parsed.conversations ?? [])
      .map((conversation) => ({
        ...conversation,
        messages: (conversation.messages ?? []).filter(
          (message) =>
            message.role === "user" && (message.text.length > 0 || message.attachment),
        ),
      }))
      .filter((conversation) => conversation.messages.length > 0);
    return { conversations, session: parsed.session ?? null };
  } catch {
    return { conversations: [], session: null };
  }
}

export default function App() {
  const [store, setStore] = useState<Store>(loadStore);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const { conversations, session } = store;
  const active = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) ?? null,
    [conversations, activeId],
  );
  const sidebarVisible = isDesktop ? !sidebarCollapsed : mobileOpen;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }, 200);
    return () => window.clearTimeout(timer);
  }, [store]);

  // Nessuna risposta generata: il messaggio dell'utente resta l'ultimo atto.
  const submit = useCallback(
    (text: string, attachment?: string) => {
      const body = text.trim();
      if (!body && !attachment) return;

      const conversationId = activeId ?? createId();
      const now = Date.now();
      const userMessage: Message = {
        id: createId(),
        role: "user",
        text: body,
        attachment,
        createdAt: now,
      };

      setStore((current) => {
        const exists = current.conversations.some(
          (conversation) => conversation.id === conversationId,
        );
        const conversations = exists
          ? current.conversations.map((conversation) =>
              conversation.id === conversationId
                ? {
                    ...conversation,
                    messages: [...conversation.messages, userMessage],
                    updatedAt: now,
                  }
                : conversation,
            )
          : [
              {
                id: conversationId,
                title: body.slice(0, 48) || "Nuova chat",
                messages: [userMessage],
                createdAt: now,
                updatedAt: now,
              },
              ...current.conversations,
            ];
        return { ...current, conversations };
      });

      setDraft("");
      setActiveId(conversationId);
    },
    [activeId],
  );

  const startNewChat = () => {
    setActiveId(null);
    setDraft("");
    setMobileOpen(false);
  };

  const selectConversation = (id: string) => {
    setActiveId(id);
    setDraft("");
    setMobileOpen(false);
  };

  const deleteConversation = (id: string) => {
    setStore((current) => ({
      ...current,
      conversations: current.conversations.filter((conversation) => conversation.id !== id),
    }));
    if (id === activeId) startNewChat();
  };

  const signIn = (next: Session) => {
    setStore((current) => ({ ...current, session: next }));
    setAuthOpen(false);
  };

  const signOut = () => {
    setStore((current) => ({ ...current, session: null }));
    startNewChat();
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-canvas text-ink">
      {sidebarVisible && (
        <Sidebar
          open
          isDesktop={isDesktop}
          session={session}
          conversations={conversations}
          activeId={activeId}
          onDismiss={() => (isDesktop ? setSidebarCollapsed(true) : setMobileOpen(false))}
          onNewChat={startNewChat}
          onSelect={selectConversation}
          onDelete={deleteConversation}
          onSignIn={() => setAuthOpen(true)}
          onSignOut={signOut}
        />
      )}

      <main className="relative flex min-w-0 flex-1 flex-col">
        <header className="hairline-b relative z-20 flex h-14 shrink-0 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {!sidebarVisible && (
              <button
                type="button"
                onClick={() => (isDesktop ? setSidebarCollapsed(false) : setMobileOpen(true))}
                aria-label="Apri navigazione"
                title="Apri navigazione"
                className="-ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            )}

            <p className="flex min-w-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
              <span className="hidden sm:inline">AI Chat</span>
              <span className="hidden text-white/20 sm:inline">/</span>
              <span className="truncate text-white/70">
                {active ? active.title : "Nuova chat"}
              </span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-celest/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-celest sm:inline-flex">
              <span className="animate-blink h-1.5 w-1.5 rounded-full bg-celest" />
              Risposte disattivate
            </span>

            {session ? (
              <button
                type="button"
                onClick={signOut}
                title={session.email}
                className="flex h-9 items-center gap-2 rounded-full border border-white/12 pl-1 pr-3 text-[13px] text-ink transition-colors hover:border-white/25 hover:bg-white/[0.04]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-black">
                  {session.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-[140px] truncate sm:block">{session.name}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="h-9 rounded-full bg-white px-[18px] text-[13.5px] font-medium text-black transition-transform duration-150 hover:bg-celest active:scale-[0.98]"
              >
                Accedi
              </button>
            )}
          </div>
        </header>

        {active ? (
          <Chat
            messages={active.messages}
            value={draft}
            onValueChange={setDraft}
            onSubmit={submit}
          />
        ) : (
          <Home value={draft} onValueChange={setDraft} onSubmit={submit} />
        )}
      </main>

      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} onSignIn={signIn} />
    </div>
  );
}
