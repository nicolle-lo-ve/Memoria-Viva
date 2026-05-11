import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { loadModel, translate } from "@/lib/recognizer";
import { speak, stopSpeak } from "@/lib/speech";
import { storage } from "@/lib/storage";
import { HelpButton } from "@/components/patient/HelpButton";
import { ArrowLeft, Loader2 } from "lucide-react";
import jsQR from "jsqr";

export const Route = createFileRoute("/patient/recognize")({
  component: Recognize,
});

function Recognize() {
  const { videoRef, error, ready } = useCamera(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [askedFor, setAskedFor] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let raf = 0;
    let stopped = false;
    let lastClassify = 0;
    let model: Awaited<ReturnType<typeof loadModel>> | null = null;

    (async () => {
      try {
        model = await loadModel();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();

    const tick = async () => {
      if (stopped) return;
      const v = videoRef.current;
      const c = canvasRef.current;
      if (v && c && v.readyState >= 2) {
        const ctx = c.getContext("2d");
        if (ctx) {
          c.width = v.videoWidth;
          c.height = v.videoHeight;
          ctx.drawImage(v, 0, 0, c.width, c.height);

          // 1) intenta QR
          try {
            const img = ctx.getImageData(0, 0, c.width, c.height);
            const code = jsQR(img.data, img.width, img.height);
            if (code?.data) {
              const qrs = storage.getQRs();
              const found = qrs.find((q) => q.id === code.data || q.name === code.data);
              if (found) {
                stopped = true;
                stopSpeak();
                navigate({ to: "/patient/steps/$id", params: { id: found.id } });
                return;
              }
            }
          } catch {
            /* noop */
          }

          // 2) clasifica con MobileNet cada 1.2s
          if (model && performance.now() - lastClassify > 1200) {
            lastClassify = performance.now();
            try {
              const preds = await model.classify(v);
              if (preds[0] && preds[0].probability > 0.3) {
                const name = translate(preds[0].className);
                setLabel(name);
                if (askedFor !== name) {
                  setAskedFor(name);
                  speak(`Esto es una ${name}. ¿Quieres saber cómo usarla?`);
                  const stats = storage.getStats();
                  stats.scans[name] = (stats.scans[name] || 0) + 1;
                  storage.setStats(stats);
                }
              }
            } catch {
              /* noop */
            }
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stopSpeak();
    };
  }, [videoRef, navigate, askedFor]);

  const matched = label
    ? storage.getQRs().find((q) => q.name.toLowerCase() === label.toLowerCase())
    : null;

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />

      <Link
        to="/patient"
        className="absolute top-5 left-5 z-50 inline-flex items-center gap-2 rounded-full bg-card/90 text-foreground px-5 py-3 shadow-lg active:scale-95"
      >
        <ArrowLeft className="size-7" />
        <span className="text-xl font-bold">Volver</span>
      </Link>
      <HelpButton />

      {(loading || !ready) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 bg-black/60">
          <Loader2 className="size-20 animate-spin" />
          <p className="text-3xl font-bold">Reconociendo…</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-card text-card-foreground">
          <div>
            <p className="text-3xl font-bold mb-4">No puedo abrir la cámara</p>
            <p className="text-xl text-muted-foreground">Concede permiso de cámara para continuar.</p>
          </div>
        </div>
      )}

      {label && (
        <div className="absolute inset-x-0 top-1/4 flex justify-center pointer-events-none">
          <div className="bg-card/95 text-card-foreground rounded-3xl px-10 py-6 shadow-2xl ring-4 ring-success/60">
            <p className="text-giant uppercase tracking-wide">{label}</p>
          </div>
        </div>
      )}

      {label && (
        <div className="absolute inset-x-0 bottom-0 p-6 flex gap-4 bg-gradient-to-t from-black/80 to-transparent">
          <button
            type="button"
            onClick={() => {
              if (matched) {
                navigate({ to: "/patient/steps/$id", params: { id: matched.id } });
              } else {
                speak("Aún no tengo instrucciones para esto. Pídele ayuda a tu cuidador.");
              }
            }}
            className="btn-patient flex-1 bg-success text-success-foreground"
          >
            ✓ SÍ
          </button>
          <button
            type="button"
            onClick={() => {
              setLabel(null);
              setAskedFor(null);
              stopSpeak();
            }}
            className="btn-patient flex-1 bg-emergency text-emergency-foreground"
          >
            ✕ NO
          </button>
        </div>
      )}
    </main>
  );
}
