// Wrapper tipado para localStorage. Todo es local — sin red.
export interface QRStep {
  text: string;
  pictogram: string;
  audio?: string; // base64 data url
}
export interface QRItem {
  id: string;
  name: string;
  steps: QRStep[];
  createdAt: number;
  scanCount: number;
}
export interface ReminderItem {
  id: string;
  text: string;
  time: string; // "08:00"
  pictogram: string;
  done?: boolean;
  doneDate?: string; // YYYY-MM-DD
}
export interface ContactInfo {
  name: string;
  phone: string;
}
export interface Settings {
  fontScale: number; // 100 / 125 / 150
  highContrast: boolean;
  voiceVolume: number; // 0-1
  language: "es" | "qu";
}
export interface Stats {
  helpRequests: number;
  scans: Record<string, number>;
  lastUsed?: number;
}

const KEYS = {
  qrs: "ca:qrs",
  reminders: "ca:reminders",
  contact: "ca:contact",
  settings: "ca:settings",
  stats: "ca:stats",
  pin: "ca:pin",
} as const;

function safe<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
}

export const storage = {
  getQRs: () => safe<QRItem[]>(KEYS.qrs, []),
  setQRs: (v: QRItem[]) => write(KEYS.qrs, v),
  getReminders: () => safe<ReminderItem[]>(KEYS.reminders, []),
  setReminders: (v: ReminderItem[]) => write(KEYS.reminders, v),
  getContact: () => safe<ContactInfo>(KEYS.contact, { name: "", phone: "" }),
  setContact: (v: ContactInfo) => write(KEYS.contact, v),
  getSettings: () =>
    safe<Settings>(KEYS.settings, {
      fontScale: 125,
      highContrast: false,
      voiceVolume: 1,
      language: "es",
    }),
  setSettings: (v: Settings) => write(KEYS.settings, v),
  getStats: () => safe<Stats>(KEYS.stats, { helpRequests: 0, scans: {} }),
  setStats: (v: Stats) => write(KEYS.stats, v),
  getPin: () => safe<string>(KEYS.pin, ""),
  setPin: (v: string) => write(KEYS.pin, v),
};

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
