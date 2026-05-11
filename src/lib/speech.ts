import { storage } from "./storage";

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  cachedVoice =
    voices.find((v) => v.lang.startsWith("es") && /female|mujer|paulina|monica|helena/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith("es")) ||
    voices[0] ||
    null;
  return cachedVoice;
}

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.lang = "es-ES";
    u.rate = 0.95;
    u.pitch = 1.05;
    u.volume = storage.getSettings().voiceVolume;
    window.speechSynthesis.speak(u);
  } catch {
    /* noop */
  }
}

export function stopSpeak() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
