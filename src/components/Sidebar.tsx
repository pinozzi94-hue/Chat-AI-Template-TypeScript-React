import { useMemo } from "react";
import type { Conversation, Session } from "../lib/types";
import { bucketLabel, cn } from "../lib/utils";
import {
  ArrowUpRightIcon,
  BoltIcon,
  CloseIcon,
  DownloadIcon,
  GearIcon,
  HistoryIcon,
  PanelIcon,
  PowerIcon,
  SchoolIcon,
  SparkleSmallIcon,
  TagIcon,
  TrashIcon,
} from "./Icons";

interface SidebarProps {
  open: boolean;
  isDesktop: boolean;
  session: Session | null;
  conversations: Conversation[];
  activeId: string | null;
  onDismiss: () => void;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

const INFO_LINKS = [
  { label: "Informazioni su AI Chat", Icon: ArrowUpRightIcon },
  { label: "Scarica l'app AI Chat", Icon: DownloadIcon },
  { label: "Prezzi", Icon: TagIcon },
  { label: "Per lo studente", Icon: SchoolIcon },
];

export function Sidebar({
  open,
  isDesktop,
  session,
  conversations,
  activeId,
  onDismiss,
  onNewChat,
  onSelect,
  onDelete,
  onSignIn,
  onSignOut,
}: SidebarProps) {
  const groups = useMemo(() => {
    const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
    const map = new Map<string, Conversation[]>();
    for (const conversation of sorted) {
      const label = bucketLabel(conversation.updatedAt);
      const list = map.get(label) ?? [];
      list.push(conversation);
      map.set(label, list);
    }
    return [...map.entries()];
  }, [conversations]);

  const hasHistory = session !== null && groups.length > 0;

  return (
    <>
      <div
        onClick={onDismiss}
        aria-hidden
        className={cn(
          "fixed inset-0 z-30 bg-black/70 backdrop-blur-[2px] transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[272px] shrink-0 flex-col border-r border-white/10 bg-surface",
          "transition-transform duration-300 ease-out md:relative md:z-auto md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="hairline-b flex h-14 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-celest/30 bg-celest/10 text-celest">
              <SparkleSmallIcon className="h-4 w-4" />
            </span>
            <span className="text-[15px] font-medium tracking-[0.02em] text-ink">
              AI&nbsp;Chat
            </span>
            <span className="rounded border border-white/12 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
              v1.0
            </span>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            aria-label={isDesktop ? "Comprimi navigazione" : "Chiudi menu"}
            title={isDesktop ? "Comprimi navigazione" : "Chiudi menu"}
            className="-mr-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
          >
            {isDesktop ? <PanelIcon className="h-[18px] w-[18px]" /> : <CloseIcon className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex flex-col gap-2 px-3 py-4">
          <button
            type="button"
            onClick={onNewChat}
            className="group flex items-center gap-2.5 rounded-xl border border-white/12 bg-white/[0.02] px-3 py-2.5 text-left text-[13px] text-ink transition-colors hover:border-celest/45 hover:bg-celest/[0.06]"
          >
            <BoltIcon className="h-[18px] w-[18px] text-celest" />
            Nuova chat
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-white/25 transition-colors group-hover:text-celest/70">
              ⌘K
            </span>
          </button>

          {!session && (
            <button
              type="button"
              onClick={onSignIn}
              className="flex items-start gap-2.5 rounded-xl border border-celest/25 bg-celest/[0.05] px-3 py-2.5 text-left transition-colors hover:border-celest/50 hover:bg-celest/[0.09]"
            >
              <HistoryIcon className="mt-px h-[18px] w-[18px] shrink-0 text-celest" />
              <span className="min-w-0">
                <span className="block text-[12.5px] text-ink">
                  Accedi per salvare l&apos;attività
                </span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-celest/70">
                  Account locale
                </span>
              </span>
            </button>
          )}
        </div>

        {hasHistory ? (
          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-2">
            {groups.map(([label, items]) => (
              <div key={label} className="mb-3">
                <p className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
                  {label}
                </p>
                <div className="flex flex-col gap-px">
                  {items.map((conversation) => {
                    const isActive = conversation.id === activeId;
                    return (
                      <div key={conversation.id} className="group relative">
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-celest" />
                        )}
                        <button
                          type="button"
                          onClick={() => onSelect(conversation.id)}
                          title={conversation.title}
                          className={cn(
                            "block w-full truncate rounded-lg py-2 pl-3 pr-9 text-left text-[13px] transition-colors",
                            isActive
                              ? "bg-white/[0.07] text-ink"
                              : "text-ink-muted hover:bg-white/[0.04] hover:text-ink",
                          )}
                        >
                          {conversation.title}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(conversation.id)}
                          aria-label={`Elimina ${conversation.title}`}
                          className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-ink-muted opacity-0 transition-all hover:bg-white/10 hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="hairline-t shrink-0 px-3 pb-3 pt-3">
          <div className="mb-2 flex flex-col">
            {INFO_LINKS.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                onClick={(event) => event.preventDefault()}
                className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12.5px] text-ink-muted transition-colors hover:bg-white/[0.04] hover:text-ink"
              >
                <Icon className="h-[15px] w-[15px] text-white/35 transition-colors group-hover:text-celest" />
                {label}
              </a>
            ))}
          </div>

          {session ? (
            <div className="mt-1 flex items-center gap-2.5 rounded-xl border border-white/10 px-2.5 py-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-black">
                {session.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] text-ink">{session.name}</span>
                <span className="block truncate text-[11px] text-ink-muted">{session.email}</span>
              </span>
              <button
                type="button"
                onClick={onSignOut}
                aria-label="Esci"
                title="Esci"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-white/10 hover:text-ink"
              >
                <PowerIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="flex w-full items-center gap-2.5 rounded-xl border border-white/12 px-3 py-2 text-left text-[12.5px] text-ink-muted transition-colors hover:border-white/25 hover:bg-white/[0.04] hover:text-ink"
            >
              <GearIcon className="h-[15px] w-[15px]" />
              Accedi
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
