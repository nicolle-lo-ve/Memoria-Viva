import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { storage, uid, type QRStep } from "@/lib/storage";
import { useCamera } from "@/hooks/useCamera";
import { loadModel, translate } from "@/lib/recognizer";
import QRCode from "qrcode";
import { ArrowLeft, Plus, Trash2, Mic, Square, Camera, Save } from "lucide-react";

export const Route = createFileRoute("/caregiver/qr/new")({
  component: NewQR,
});

const PICTOGRAMS = ["💧", "🔥", "🎵", "👋", "💊", "🌿", "☎️", "🍽️", "🛏️", "🚰", "⚡", "✨"];

function NewQR() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"scan" | "manual">("manual");
  const [name, setName] = useState("");
  const [steps, setSteps] = useState<QRStep[]>([{ text: "", pictogram: "✨" }]);

  // scan
  const { videoRef, ready } = useCamera(mode === "scan");
  const [scanning, setScanning] = useState(false);

  const suggest = async () => {
    if (!videoRef.current) return;
    setScanning(true);
    try {
      const model = await loadModel();
      const preds = await model.classify(videoRef.current);
      if (preds[0]) setName(translate(preds[0].className));
    } catch (e) {
      console.error(e);
    } finally {
      setScanning(false);
    }
  };

  const updateStep = (i: number, patch: Partial<QRStep>) => {
    setSteps((s) => s.map((st, idx) => (idx === i ? { ...st, ...patch } : st)));
  };

  const save = async () => {
    if (!name.trim() || steps.every((s) => !s.text.trim())) return;
    const item = {
      id: uid(),
      name: name.trim(),
      steps: steps.filter((s) => s.text.trim()),
      createdAt: Date.now(),
      scanCount: 0,
    };
    storage.setQRs([...storage.getQRs(), item]);
    navigate({ to: "/caregiver/qr/$id", params: { id: item.id } });
  };

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto pb-32">
      <button onClick={() => navigate({ to: "/caregiver" })} className="inline-flex items-center gap-2 mb-4">
        <ArrowLeft /> Volver
      </button>

      <h1 className="text-3xl font-extrabold mb-2">Nuevo objeto / instrucción</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 rounded-2xl p-3 font-semibold ${mode === "manual" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
        >
          Crear desde cero
        </button>
        <button
          onClick={() => setMode("scan")}
          className={`flex-1 rounded-2xl p-3 font-semibold ${mode === "scan" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
        >
          Escanear objeto
        </button>
      </div>

      {mode === "scan" && (
        <div className="rounded-3xl overflow-hidden bg-black aspect-video relative mb-4">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          <button
            type="button"
            onClick={suggest}
            disabled={!ready || scanning}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-card text-card-foreground rounded-full px-5 py-3 font-bold inline-flex items-center gap-2 shadow"
          >
            <Camera className="size-5" />
            {scanning ? "Identificando…" : "Identificar"}
          </button>
        </div>
      )}

      <label className="block mb-2 font-bold">Nombre del objeto</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej. Microondas"
        className="w-full rounded-2xl border-2 border-border p-4 text-lg mb-6 bg-card"
      />

      <h2 className="text-2xl font-extrabold mb-3">Pasos</h2>
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <StepEditor
            key={i}
            index={i}
            step={s}
            onChange={(p) => updateStep(i, p)}
            onRemove={() => setSteps((arr) => arr.filter((_, idx) => idx !== i))}
          />
        ))}
      </ol>

      <button
        onClick={() => setSteps((s) => [...s, { text: "", pictogram: "✨" }])}
        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 font-semibold"
      >
        <Plus className="size-5" /> Añadir paso
      </button>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-background/95 border-t">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={save}
            className="w-full rounded-2xl bg-primary text-primary-foreground py-4 text-xl font-extrabold inline-flex items-center justify-center gap-2"
          >
            <Save /> Guardar y generar QR
          </button>
        </div>
      </div>
    </main>
  );
}

function StepEditor({
  index,
  step,
  onChange,
  onRemove,
}: {
  index: number;
  step: QRStep;
  onChange: (p: Partial<QRStep>) => void;
  onRemove: () => void;
}) {
  const [recording, setRecording] = useState(false);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunks.current = [];
      rec.ondataavailable = (e) => chunks.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => onChange({ audio: reader.result as string });
        reader.readAsDataURL(blob);
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
      setTimeout(() => stopRec(), 5000);
    } catch (e) {
      console.error(e);
    }
  };
  const stopRec = () => {
    recRef.current?.stop();
    setRecording(false);
  };

  return (
    <li className="rounded-3xl border-2 border-border p-4 bg-card space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-3xl font-extrabold w-10">{index + 1}.</span>
        <input
          value={step.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Describe el paso"
          className="flex-1 rounded-xl border border-border p-3 bg-background"
        />
        <button onClick={onRemove} className="p-2 text-destructive">
          <Trash2 />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {PICTOGRAMS.map((p) => (
          <button
            key={p}
            onClick={() => onChange({ pictogram: p })}
            className={`size-12 rounded-xl text-2xl ${step.pictogram === p ? "bg-primary/20 ring-2 ring-primary" : "bg-secondary"}`}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {recording ? (
          <button onClick={stopRec} className="inline-flex items-center gap-2 rounded-xl bg-destructive text-destructive-foreground px-4 py-2 font-semibold">
            <Square className="size-4" /> Detener
          </button>
        ) : (
          <button onClick={startRec} className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 font-semibold">
            <Mic className="size-4" /> Grabar voz (5s)
          </button>
        )}
        {step.audio && <span className="text-sm text-success font-semibold">✓ Audio grabado</span>}
      </div>
    </li>
  );
}

export async function generateQRDataUrl(id: string) {
  return QRCode.toDataURL(id, { width: 512, margin: 2 });
}
