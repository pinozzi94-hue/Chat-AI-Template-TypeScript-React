export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  text: string;
  attachment?: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Session {
  name: string;
  email: string;
}

export interface ModelOption {
  id: string;
  name: string;
  hint: string;
  available: boolean;
}

/** Nessun modello è collegato: l'elenco descrive solo ciò che sarà disponibile. */
export const MODELS: ModelOption[] = [
  { id: "none", name: "Nessun modello", hint: "Motore non collegato", available: false },
  { id: "flash-lite", name: "Flash-Lite", hint: "In arrivo", available: false },
  { id: "pro", name: "Pro", hint: "In arrivo", available: false },
  { id: "ultra", name: "Ultra", hint: "In arrivo", available: false },
];
