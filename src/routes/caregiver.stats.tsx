import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storage, type Stats } from "@/lib/storage";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/caregiver/stats")({
  component: StatsPage,
});

function StatsPage() {
  const [stats, setStats] = useState<Stats>({ helpRequests: 0, scans: {} });
  useEffect(() => setStats(storage.getStats()), []);

  const top = Object.entries(stats.scans).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = top[0]?.[1] || 1;

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <Link to="/caregiver" className="inline-flex items-center gap-2 mb-4"><ArrowLeft /> Volver</Link>
      <h1 className="text-3xl font-extrabold mb-6">Estadísticas</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-3xl bg-card p-6 shadow">
          <div className="text-sm uppercase text-muted-foreground">Veces que pidió ayuda</div>
          <div className="text-6xl font-extrabold mt-2">{stats.helpRequests}</div>
        </div>
        <div className="rounded-3xl bg-card p-6 shadow">
          <div className="text-sm uppercase text-muted-foreground">Última vez que usó la app</div>
          <div className="text-2xl font-bold mt-2">
            {stats.lastUsed ? new Date(stats.lastUsed).toLocaleString("es-ES") : "—"}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-3">Objetos más escaneados</h2>
      {top.length === 0 ? (
        <p className="text-muted-foreground">Aún no hay datos.</p>
      ) : (
        <ul className="space-y-2">
          {top.map(([name, count]) => (
            <li key={name} className="rounded-2xl bg-card p-3">
              <div className="flex justify-between mb-1">
                <span className="font-semibold capitalize">{name}</span>
                <span className="text-muted-foreground">{count}</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
