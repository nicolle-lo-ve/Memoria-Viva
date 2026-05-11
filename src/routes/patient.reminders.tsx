import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storage, type ReminderItem } from "@/lib/storage";
import { speak } from "@/lib/speech";
import { Home, Volume2, Check } from "lucide-react";
import { HelpButton } from "@/components/patient/HelpButton";

export const Route = createFileRoute("/patient/reminders")({
  component: Reminders,
});

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function Reminders() {
  const [items, setItems] = useState<ReminderItem[]>([]);

  useEffect(() => {
    // Reset diario
    const today = todayStr();
    const list = storage.getReminders().map((r) => (r.doneDate !== today ? { ...r, done: false } : r));
    storage.setReminders(list);
    setItems(list);
  }, []);

  const toggle = (id: string) => {
    const today = todayStr();
    const next = items.map((r) =>
      r.id === id ? { ...r, done: !r.done, doneDate: !r.done ? today : undefined } : r
    );
    storage.setReminders(next);
    setItems(next);
    const it = next.find((r) => r.id === id);
    if (it?.done) speak("Completado");
  };

  const readAll = () => {
    if (!items.length) return speak("No hay recordatorios para hoy");
    speak(items.map((r) => `A las ${r.time}, ${r.text}`).join(". "));
  };

  return (
    <main className="min-h-screen p-6 bg-background pb-32">
      <HelpButton />
      <header className="mb-6">
        <h1 className="text-huge">Recordatorios</h1>
        <p className="text-xl text-muted-foreground capitalize">
          {new Date().toLocaleDateString("es-ES", { weekday: "long" })}
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-2xl text-muted-foreground text-center mt-20">
          Aún no hay recordatorios. Pídele a tu cuidador que los configure.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => toggle(r.id)}
                className={`w-full flex items-center gap-5 rounded-3xl p-6 shadow-md text-left transition ${
                  r.done ? "bg-success/20 line-through" : "bg-card"
                }`}
              >
                <div
                  className={`size-20 rounded-2xl border-4 flex items-center justify-center text-4xl ${
                    r.done ? "border-success bg-success text-success-foreground" : "border-foreground/40"
                  }`}
                >
                  {r.done ? <Check className="size-12" /> : ""}
                </div>
                <div className="text-6xl">{r.pictogram}</div>
                <div className="flex-1">
                  <div className="text-3xl font-extrabold">{r.text}</div>
                  <div className="text-xl text-muted-foreground tabular-nums">{r.time}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="fixed bottom-0 inset-x-0 p-4 bg-background/95 border-t grid grid-cols-2 gap-3">
        <button onClick={readAll} className="btn-patient bg-warning text-warning-foreground">
          <Volume2 className="size-8" /> Leer todo
        </button>
        <Link to="/patient" className="btn-patient bg-primary text-primary-foreground">
          <Home className="size-8" /> Cámara
        </Link>
      </div>
    </main>
  );
}
