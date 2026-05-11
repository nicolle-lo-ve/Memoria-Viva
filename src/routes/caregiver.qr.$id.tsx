import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { storage, type QRItem } from "@/lib/storage";
import { ArrowLeft, Download, Share2, Trash2, Save } from "lucide-react";

export const Route = createFileRoute("/caregiver/qr/$id")({
  component: EditQR,
});

function EditQR() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<QRItem | null>(null);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const all = storage.getQRs();
    const found = all.find((q) => q.id === id) || null;
    setItem(found);
    if (found) QRCode.toDataURL(found.id, { width: 512, margin: 2 }).then(setQrUrl);
  }, [id]);

  if (!item) {
    return (
      <main className="min-h-screen p-6">
        <Link to="/caregiver/qr" className="inline-flex items-center gap-2"><ArrowLeft /> Volver</Link>
        <p className="mt-6 text-muted-foreground">No encontrado.</p>
      </main>
    );
  }

  const save = () => {
    const list = storage.getQRs().map((q) => (q.id === id ? item : q));
    storage.setQRs(list);
    navigate({ to: "/caregiver/qr" });
  };

  const remove = () => {
    if (!confirm("¿Eliminar este QR?")) return;
    storage.setQRs(storage.getQRs().filter((q) => q.id !== id));
    navigate({ to: "/caregiver/qr" });
  };

  const share = async () => {
    if (!qrUrl) return;
    try {
      const blob = await (await fetch(qrUrl)).blob();
      const file = new File([blob], `${item.name}.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: item.name });
        return;
      }
    } catch {
      /* fallback to download */
    }
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `${item.name}.png`;
    a.click();
  };

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto pb-32">
      <Link to="/caregiver/qr" className="inline-flex items-center gap-2 mb-4"><ArrowLeft /> Volver</Link>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-card p-6 shadow text-center">
          {qrUrl && <img src={qrUrl} alt="QR" className="w-full max-w-xs mx-auto" />}
          <p className="mt-4 text-xl font-bold">{item.name}</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button onClick={share} className="rounded-xl bg-primary text-primary-foreground py-3 font-semibold inline-flex items-center justify-center gap-2">
              <Share2 className="size-4" /> Compartir
            </button>
            <button onClick={share} className="rounded-xl bg-secondary py-3 font-semibold inline-flex items-center justify-center gap-2">
              <Download className="size-4" /> Descargar
            </button>
          </div>
        </div>

        <div>
          <label className="block font-bold mb-1">Nombre</label>
          <input
            value={item.name}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            className="w-full rounded-2xl border-2 border-border p-3 bg-card mb-4"
          />

          <h2 className="font-extrabold text-xl mb-2">Pasos</h2>
          <ol className="space-y-2">
            {item.steps.map((s, i) => (
              <li key={i} className="rounded-2xl bg-card p-3 flex gap-2 items-center">
                <span className="font-extrabold w-6">{i + 1}.</span>
                <span className="text-2xl">{s.pictogram}</span>
                <input
                  value={s.text}
                  onChange={(e) => {
                    const steps = [...item.steps];
                    steps[i] = { ...s, text: e.target.value };
                    setItem({ ...item, steps });
                  }}
                  className="flex-1 rounded-xl border border-border p-2 bg-background"
                />
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-background/95 border-t">
        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-3">
          <button onClick={remove} className="rounded-2xl bg-destructive text-destructive-foreground py-4 font-extrabold inline-flex items-center justify-center gap-2">
            <Trash2 /> Eliminar
          </button>
          <button onClick={save} className="rounded-2xl bg-primary text-primary-foreground py-4 font-extrabold inline-flex items-center justify-center gap-2">
            <Save /> Guardar
          </button>
        </div>
      </div>
    </main>
  );
}
