import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";

export function HelpButton() {
  return (
    <Link
      to="/patient/help"
      className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-full bg-emergency text-emergency-foreground px-6 py-4 shadow-2xl ring-4 ring-emergency/30 active:scale-95 transition"
      aria-label="Pedir ayuda"
    >
      <Phone className="size-8" />
      <span className="text-2xl font-extrabold">AYUDA</span>
    </Link>
  );
}
