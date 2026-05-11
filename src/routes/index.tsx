import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { speak } from "@/lib/speech";
import { User, Settings as SettingsIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acompaña — Asistente cognitivo" },
      { name: "description", content: "Asistente cálido para personas con demencia y sus cuidadores. Reconoce objetos, guía paso a paso y envía ayuda." },
      { property: "og:title", content: "Acompaña — Asistente cognitivo" },
      { property: "og:description", content: "Una app sencilla para mantener la autonomía en el día a día." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  useEffect(() => {
    const t = setTimeout(() => speak("Bienvenido. ¿Eres el paciente o el cuidador?"), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-10 bg-background">
      <header className="text-center">
        <h1 className="text-huge text-foreground">Acompaña</h1>
        <p className="text-2xl text-muted-foreground mt-2">Tu asistente diario</p>
      </header>

      <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
        <Link
          to="/patient"
          className="btn-patient-xl bg-primary text-primary-foreground"
        >
          <User className="size-20" />
          <span>PACIENTE</span>
          <span className="text-base font-medium opacity-80">Tocar para empezar</span>
        </Link>
        <Link
          to="/caregiver/pin"
          className="btn-patient-xl bg-secondary text-secondary-foreground"
        >
          <SettingsIcon className="size-20" />
          <span>CUIDADOR</span>
          <span className="text-base font-medium opacity-70">Requiere PIN</span>
        </Link>
      </div>

      <footer className="text-sm text-muted-foreground mt-6 text-center max-w-md">
        Privado y local. La cámara y los datos no salen del dispositivo.
      </footer>
    </main>
  );
}
