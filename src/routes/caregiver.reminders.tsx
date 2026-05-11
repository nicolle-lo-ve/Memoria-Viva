import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storage, uid, type ReminderItem } from "@/lib/storage";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

export const Route = createFileRoute("/caregiver/reminders")({
  component: CaregiverReminders,
});

const PICTOS = ["💊", "🌿", "☎️", "🍽️", "💧", "🛏️", "👋", "🌞"];

function CaregiverReminders() {
  const [items, setItems] = useState<ReminderItem[]>([]);
  const navigate = useNavigate();
  useEffect(() => setItems(storage.getReminders()), []);

  const add = () =>
    setItems((s) => [...s, { id: uid(), text: "", time: "08:00", pictogram: "💊" }]);

  const upd = (i: number, p: Partial<ReminderItem>) =>
    setItems((s) => s.map((it, idx) => (idx === i ? { ...it, ...p } : it)));

  const save = () => {
    storage.setReminders(items.filter((i) => i.text.trim()));
    navigate({ to: "/caregiver" });
  };

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto pb-32">
      <Link to="/caregiver" className="inline-flex items-center gap-2 mb-4"><ArrowLeft /> Volver</Link>
      <h1 className="text-3xl font-extrabold mb-6">Recordatorios</h1>

      <ul className="space-y-3">
        {items.map((r, i) => (
          <li key={r.id} className="rounded-2xl bg-card p-3 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={r.time}
                onChange={(e) => upd(i, { time: e.target.value })}
                className="rounded-xl border border-border p-2 bg-background tabular-nums"
              />
              <input
                value={r.text}
                onChange={(e) => upd(i, { text: e.target.value })}
                placeholder="Tomar pastillas"
                className="flex-1 rounded-xl border border-border p-2 bg-background"
              />
              <button onClick={() => setItems((s) => s.filter((_, idx) => idx !== i))} className="p-2 text-destructive">
                <Trash2 />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PICTOS.map((p) => (
                <button
                  key={p}
                  onClick={() => upd(i, { pictogram: p })}
                  className={`size-10 rounded-xl text-xl ${r.pictogram === p ? "bg-primary/20 ring-2 ring-primary" : "bg-secondary"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <button onClick={add} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 font-semibold">
        <Plus /> Añadir recordatorio
      </button>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-background/95 border-t">
        <div className="max-w-3xl mx-auto">
          <button onClick={save} className="w-full rounded-2xl bg-primary text-primary-foreground py-4 text-xl font-extrabold inline-flex items-center justify-center gap-2">
            <Save /> Guardar y enviar al paciente
          </button>
        </div>
      </div>
    </main>
  );
}
