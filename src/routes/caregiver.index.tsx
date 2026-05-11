import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Pencil, BarChart3, Bell, Phone, Settings as SettingsIcon, LogOut } from "lucide-react";

export const Route = createFileRoute("/caregiver/")({
  component: CaregiverHome,
});

const items = [
  { to: "/caregiver/qr/new" as const, icon: Plus, label: "Generar nuevo QR", color: "bg-primary text-primary-foreground" },
  { to: "/caregiver/qr" as const, icon: Pencil, label: "Editar QR existente", color: "bg-secondary text-secondary-foreground" },
  { to: "/caregiver/stats" as const, icon: BarChart3, label: "Estadísticas", color: "bg-secondary text-secondary-foreground" },
  { to: "/caregiver/reminders" as const, icon: Bell, label: "Configurar recordatorios", color: "bg-secondary text-secondary-foreground" },
  { to: "/caregiver/contact" as const, icon: Phone, label: "Contacto de emergencia", color: "bg-secondary text-secondary-foreground" },
  { to: "/caregiver/settings" as const, icon: SettingsIcon, label: "Configuración de la app", color: "bg-secondary text-secondary-foreground" },
];

function CaregiverHome() {
  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">Modo cuidador</h1>
          <p className="text-muted-foreground">Configura la experiencia del paciente</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-secondary text-secondary-foreground"
        >
          <LogOut className="size-4" /> Salir
        </Link>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map(({ to, icon: Icon, label, color }) => (
          <Link
            key={to}
            to={to}
            className={`rounded-3xl p-6 flex items-center gap-4 shadow-md active:scale-[0.98] transition ${color}`}
          >
            <Icon className="size-10" />
            <span className="text-xl font-bold">{label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
