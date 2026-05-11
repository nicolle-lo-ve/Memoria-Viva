import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { ArrowLeft, Save } from "lucide-react";

export const Route = createFileRoute("/caregiver/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const c = storage.getContact();
    setName(c.name);
    setPhone(c.phone);
  }, []);

  const save = () => {
    storage.setContact({ name: name.trim(), phone: phone.trim() });
    navigate({ to: "/caregiver" });
  };

  return (
    <main className="min-h-screen p-6 max-w-xl mx-auto">
      <Link to="/caregiver" className="inline-flex items-center gap-2 mb-4"><ArrowLeft /> Volver</Link>
      <h1 className="text-3xl font-extrabold mb-6">Contacto de emergencia</h1>

      <label className="block font-bold mb-1">Nombre</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="María, hija"
        className="w-full rounded-2xl border-2 border-border p-3 bg-card mb-4"
      />

      <label className="block font-bold mb-1">Teléfono</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+51 999 999 999"
        type="tel"
        className="w-full rounded-2xl border-2 border-border p-3 bg-card mb-6"
      />

      <button onClick={save} className="w-full rounded-2xl bg-primary text-primary-foreground py-4 text-xl font-extrabold inline-flex items-center justify-center gap-2">
        <Save /> Guardar
      </button>
    </main>
  );
}
