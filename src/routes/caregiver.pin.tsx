import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/caregiver/pin")({
  component: PinScreen,
});

function PinScreen() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    setIsSetup(!storage.getPin());
  }, []);

  const press = (d: string) => {
    setError("");
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => submit(next), 150);
    }
  };

  const submit = (value: string) => {
    if (isSetup) {
      storage.setPin(value);
      navigate({ to: "/caregiver" });
      return;
    }
    if (storage.getPin() === value) navigate({ to: "/caregiver" });
    else {
      setError("PIN incorrecto");
      setPin("");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <Link to="/" className="absolute top-5 left-5 inline-flex items-center gap-2 text-lg font-semibold">
        <ArrowLeft /> Volver
      </Link>

      <h1 className="text-4xl font-extrabold mb-2">{isSetup ? "Crea tu PIN" : "Introduce tu PIN"}</h1>
      <p className="text-muted-foreground mb-8">
        {isSetup ? "Será necesario para acceder a la configuración." : "4 dígitos."}
      </p>

      <div className="flex gap-3 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`size-6 rounded-full border-2 ${pin.length > i ? "bg-primary border-primary" : "border-muted-foreground"}`}
          />
        ))}
      </div>

      {error && <p className="text-destructive font-semibold mb-4">{error}</p>}

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => press(String(n))}
            className="aspect-square rounded-3xl bg-card text-3xl font-bold shadow active:scale-95"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPin("")}
          className="aspect-square rounded-3xl bg-secondary text-lg font-semibold active:scale-95"
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={() => press("0")}
          className="aspect-square rounded-3xl bg-card text-3xl font-bold shadow active:scale-95"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => setPin((p) => p.slice(0, -1))}
          className="aspect-square rounded-3xl bg-secondary text-lg font-semibold active:scale-95"
        >
          ←
        </button>
      </div>
    </main>
  );
}
