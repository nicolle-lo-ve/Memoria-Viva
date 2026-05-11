import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storage, type QRItem } from "@/lib/storage";
import { ArrowLeft, Plus } from "lucide-react";

export const Route = createFileRoute("/caregiver/qr/")({
  component: QRList,
});

function QRList() {
  const [items, setItems] = useState<QRItem[]>([]);
  useEffect(() => setItems(storage.getQRs()), []);

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <Link to="/caregiver" className="inline-flex items-center gap-2 mb-4"><ArrowLeft /> Volver</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold">QR creados</h1>
        <Link to="/caregiver/qr/new" className="inline-flex items-center gap-2 rounded-2xl bg-primary text-primary-foreground px-4 py-3 font-semibold">
          <Plus /> Nuevo
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-lg">Aún no has creado ningún QR.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((q) => (
            <li key={q.id}>
              <Link
                to="/caregiver/qr/$id"
                params={{ id: q.id }}
                className="flex items-center justify-between rounded-2xl bg-card p-4 shadow"
              >
                <div>
                  <div className="text-xl font-bold">{q.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {q.steps.length} pasos · {new Date(q.createdAt).toLocaleDateString("es-ES")}
                  </div>
                </div>
                <span className="text-primary font-semibold">Editar →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
