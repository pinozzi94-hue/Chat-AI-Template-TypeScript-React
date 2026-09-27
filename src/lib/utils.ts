export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function createId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function bucketLabel(ts: number): string {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const day = 86_400_000;
  if (ts >= startOfToday) return "Oggi";
  if (ts >= startOfToday - day) return "Ieri";
  if (ts >= startOfToday - 7 * day) return "Ultimi 7 giorni";
  return "Conversazioni precedenti";
}
