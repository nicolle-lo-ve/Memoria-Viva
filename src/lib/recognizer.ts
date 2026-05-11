// Carga dinámica de MobileNet — solo cuando se necesita.
let modelPromise: Promise<unknown> | null = null;

const TRANSLATIONS: Record<string, string> = {
  teapot: "tetera",
  cup: "taza",
  "coffee mug": "taza de café",
  "water bottle": "botella de agua",
  microwave: "microondas",
  "wall clock": "reloj",
  "digital clock": "reloj digital",
  remote: "control remoto",
  "remote control": "control remoto",
  banana: "plátano",
  apple: "manzana",
  orange: "naranja",
  spoon: "cuchara",
  plate: "plato",
  bowl: "tazón",
  "cellular telephone": "teléfono",
  "cell phone": "teléfono",
  laptop: "computadora",
  notebook: "cuaderno",
  pencil: "lápiz",
  pen: "bolígrafo",
  book: "libro",
  chair: "silla",
  "dining table": "mesa",
  refrigerator: "refrigerador",
  oven: "horno",
  toaster: "tostadora",
  sink: "lavabo",
  "tv": "televisor",
  "television": "televisor",
  keyboard: "teclado",
  mouse: "ratón",
  shoe: "zapato",
  hat: "sombrero",
  umbrella: "paraguas",
  bed: "cama",
  toilet: "inodoro",
  scissors: "tijeras",
  "hair drier": "secador de pelo",
  toothbrush: "cepillo de dientes",
};

export function translate(label: string): string {
  const k = label.toLowerCase().split(",")[0].trim();
  if (TRANSLATIONS[k]) return TRANSLATIONS[k];
  // intenta primer sinónimo
  for (const part of label.toLowerCase().split(",")) {
    const p = part.trim();
    if (TRANSLATIONS[p]) return TRANSLATIONS[p];
  }
  return k;
}

export async function loadModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      const tf = await import("@tensorflow/tfjs");
      await tf.ready();
      const mn = await import("@tensorflow-models/mobilenet");
      return mn.load({ version: 2, alpha: 1.0 });
    })();
  }
  return modelPromise as Promise<{
    classify: (
      img: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
    ) => Promise<{ className: string; probability: number }[]>;
  }>;
}
