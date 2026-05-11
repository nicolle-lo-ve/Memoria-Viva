import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { speak } from "@/lib/speech";
import { useClock, formatTime, formatDate } from "@/hooks/useClock";
import { HelpButton } from "@/components/patient/HelpButton";
import { Camera, Bell } from "lucide-react";
import { storage } from "@/lib/storage";

export const Route = createFileRoute("/patient/")({
  component: PatientHome,
});

function PatientHome() {
  const navigate = useNavigate();
  const now = useClock();

  useEffect(() => {
    storage.setStats({ ...storage.getStats(), lastUsed: Date.now() });
    const t = setTimeout(
      () => speak("Hola, apunta con la cámara a cualquier cosa que no reconozcas"),
      500
    );
    return () => clearTimeout(t);
  }, []);

  return (
    <main
      className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-background"
      onClick={() => navigate({ to: "/patient/recognize" })}
    >
      <div className="absolute top-5 left-5 text-left">
        <div className="text-5xl font-extrabold tabular-nums">{formatTime(now)}</div>
        <div className="text-lg text-muted-foreground capitalize">{formatDate(now)}</div>
      </div>

      <HelpButton />

      <button
        type="button"
        className="btn-patient-xl bg-primary text-primary-foreground w-full max-w-xl mt-16"
      >
        <Camera className="size-24" />
        <span className="text-3xl">Apunta a lo que</span>
        <span className="text-4xl">no reconozcas</span>
      </button>

      <Link
        to="/patient/reminders"
        onClick={(e) => e.stopPropagation()}
        className="btn-patient bg-secondary text-secondary-foreground mt-8"
      >
        <Bell className="size-10" />
        Recordatorios
      </Link>

      <p className="text-muted-foreground text-lg mt-10 text-center">
        Toca cualquier parte de la pantalla para abrir la cámara
      </p>
    </main>
  );
}
