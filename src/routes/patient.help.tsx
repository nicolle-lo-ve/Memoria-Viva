import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { speak } from "@/lib/speech";
import { Phone, X } from "lucide-react";

export const Route = createFileRoute("/patient/help")({
  component: Help,
});

function Help() {
  const contact = storage.getContact();
  const navigate = useNavigate();
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    speak("¿Necesitas ayuda?");
    const stats = storage.getStats();
    stats.helpRequests += 1;
    storage.setStats(stats);
  }, []);

  const call = () => {
    if (!contact.phone) {
      speak("Aún no hay un contacto configurado. Pídele al cuidador que lo añada.");
      return;
    }
    setCalling(true);
    speak(`Llamando a ${contact.name || "tu familiar"}`);
    window.location.href = `tel:${contact.phone}`;
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-emergency text-emergency-foreground text-center gap-10">
      <h1 className="text-giant">¿Necesitas ayuda?</h1>

      {calling ? (
        <p className="text-huge">Llamando a {contact.name || "tu familiar"}…</p>
      ) : (
        <>
          <button
            type="button"
            onClick={call}
            className="btn-patient-xl bg-card text-card-foreground w-full max-w-xl"
          >
            <Phone className="size-24" />
            <span>LLAMAR A {contact.name?.toUpperCase() || "MI FAMILIA"}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/patient" })}
            className="btn-patient bg-card/20 text-emergency-foreground border-2 border-emergency-foreground/40"
          >
            <X className="size-8" /> Cancelar
          </button>
        </>
      )}
    </main>
  );
}
