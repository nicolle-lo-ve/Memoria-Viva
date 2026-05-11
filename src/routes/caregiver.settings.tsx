import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storage, type Settings } from "@/lib/storage";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";

export const Route = createFileRoute("/caregiver/settings")({
  component: SettingsPage,
});

const DEFAULT: Settings = { fontScale: 125, highContrast: false, voiceVolume: 1, language: "es" };

function SettingsPage() {
  const [s, setS] = useState<Settings>(DEFAULT);
  const navigate = useNavigate();

  useEffect(() => setS(storage.getSettings()), []);

  useEffect(() => {
    document.documentElement.style.setProperty("--patient-font-scale", `${s.fontScale}%`);
    document.documentElement.classList.toggle("dark", false);
  }, [s.fontScale]);

  const save = () => {
    storage.setSettings(s);
    document.documentElement.style.setProperty("--patient-font-scale", `${s.fontScale}%`);
    navigate({ to: "/caregiver" });
  };

  return (
    <main className="min-h-screen p-6 max-w-xl mx-auto">
      <Link to="/caregiver" className="inline-flex items-center gap-2 mb-4"><ArrowLeft /> Volver</Link>
      <h1 className="text-3xl font-extrabold mb-6">Configuración</h1>

      <section className="space-y-6">
        <div>
          <label className="block font-bold mb-2">Tamaño de letra</label>
          <div className="grid grid-cols-3 gap-2">
            {[100, 125, 150].map((v) => (
              <button
                key={v}
                onClick={() => setS({ ...s, fontScale: v })}
                className={`rounded-2xl py-3 font-semibold ${s.fontScale === v ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
              >
                {v === 100 ? "Normal" : v === 125 ? "Grande" : "Gigante"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-card p-4">
          <span className="font-bold">Alto contraste</span>
          <button
            onClick={() => setS({ ...s, highContrast: !s.highContrast })}
            className={`w-14 h-8 rounded-full p-1 transition ${s.highContrast ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`size-6 bg-card rounded-full transition ${s.highContrast ? "translate-x-6" : ""}`} />
          </button>
        </div>

        <div>
          <label className="block font-bold mb-2">Volumen de voz: {Math.round(s.voiceVolume * 100)}%</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={s.voiceVolume}
            onChange={(e) => setS({ ...s, voiceVolume: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-bold mb-2">Idioma</label>
          <select
            value={s.language}
            onChange={(e) => setS({ ...s, language: e.target.value as "es" | "qu" })}
            className="w-full rounded-2xl border-2 border-border p-3 bg-card"
          >
            <option value="es">Español</option>
            <option value="qu">Quechua (próximamente)</option>
          </select>
        </div>

        <div className="rounded-2xl bg-success/15 border-2 border-success p-4 text-sm">
          🔒 Todo el procesamiento ocurre en este dispositivo. Sin Internet, sin nube.
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 mt-8">
        <button
          onClick={() => setS(DEFAULT)}
          className="rounded-2xl bg-secondary py-4 font-extrabold inline-flex items-center justify-center gap-2"
        >
          <RotateCcw /> Restaurar
        </button>
        <button
          onClick={save}
          className="rounded-2xl bg-primary text-primary-foreground py-4 font-extrabold inline-flex items-center justify-center gap-2"
        >
          <Save /> Guardar
        </button>
      </div>
    </main>
  );
}
