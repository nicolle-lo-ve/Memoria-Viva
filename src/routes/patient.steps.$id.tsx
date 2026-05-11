import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { speak, stopSpeak } from "@/lib/speech";
import { HelpButton } from "@/components/patient/HelpButton";
import { ArrowLeft, ArrowRight, Home, Volume2 } from "lucide-react";

export const Route = createFileRoute("/patient/steps/$id")({
  component: Steps,
});

function Steps() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qr = storage.getQRs().find((q) => q.id === id);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => () => stopSpeak(), []);

  useEffect(() => {
    if (!qr) return;
    const step = qr.steps[idx];
    if (!step) return;
    if (step.audio) {
      const a = new Audio(step.audio);
      a.play().catch(() => speak(step.text));
    } else {
      speak(`${idx === 0 ? "Primero, " : "Ahora, "}${step.text}`);
    }
  }, [idx, qr]);

  if (!qr) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
          <p className="text-huge mb-4">No encontré esto</p>
          <Link to="/patient" className="btn-patient bg-primary text-primary-foreground">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const total = qr.steps.length;
  const step = qr.steps[idx];

  if (done) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
        <div className="text-[8rem] mb-4">🎉</div>
        <h1 className="text-giant text-success">¡MUY BIEN!</h1>
        <p className="text-2xl mt-4 text-muted-foreground">Has completado todos los pasos.</p>
        <Link to="/patient" className="btn-patient bg-primary text-primary-foreground mt-10">
          <Home className="size-8" /> Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <HelpButton />
      <header className="p-6 text-center border-b">
        <h1 className="text-huge uppercase tracking-wide">{qr.name}</h1>
        <p className="text-xl text-muted-foreground mt-1">
          Paso {idx + 1} de {total}
        </p>
      </header>

      <section className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl rounded-[2rem] bg-success/15 border-4 border-success p-10 text-center shadow-xl">
          <div className="text-[7rem] leading-none mb-4">{step.pictogram || "✨"}</div>
          <div className="text-giant text-foreground">{idx + 1}</div>
          <p className="text-huge mt-4">{step.text}</p>
        </div>
      </section>

      <nav className="p-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          disabled={idx === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          className="btn-patient bg-secondary text-secondary-foreground disabled:opacity-40"
        >
          <ArrowLeft className="size-10" /> Anterior
        </button>
        <button
          type="button"
          onClick={() => {
            if (idx + 1 >= total) setDone(true);
            else setIdx((i) => i + 1);
          }}
          className="btn-patient bg-primary text-primary-foreground"
        >
          Siguiente <ArrowRight className="size-10" />
        </button>
      </nav>

      <div className="px-6 pb-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => speak(step.text)}
          className="btn-patient bg-warning text-warning-foreground"
        >
          <Volume2 className="size-9" /> Leer
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/patient" })}
          className="btn-patient bg-card text-card-foreground border-2 border-border"
        >
          <Home className="size-9" /> Salir
        </button>
      </div>
    </main>
  );
}
