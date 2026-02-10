import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";

interface VoicePromoProps {
  onClick: () => void;
  className?: string;
}

const EXAMPLES = [
  `"Mañana a las 10am con Juan"`,
  `"Cita para el viernes a las 4"`,
];

export function VoicePromo({ onClick, className }: VoicePromoProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "border-2 border-dashed border-primary/20 rounded-xl py-4 px-2 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-primary/5 transition-all group bg-background relative overflow-hidden",
        className
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />

      <div className="flex items-center gap-4">
        <div className="relative z-10 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm ring-4 ring-primary/5">
          <Mic className="h-4 w-4 text-primary" />
        </div>

        <div className="relative text-start z-10 max-w-70">
          <h3 className="text-lg font-bold text-primary tracking-tight ">
            Pulsa para dictar tu cita
          </h3>
          <p className="text-xs text-muted-foreground">
            Usa tu voz para rellenar el formulario rápidamente.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-1 w-full pt-2">
        <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
          Prueba a decir:
        </span>
        <div className="flex flex-col gap-2 w-full max-w-65">
          {EXAMPLES.map((example) => (
            <div
              key={example}
              className="bg-background border rounded-full px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm w-fit mx-auto group-hover:scale-101 transition-transform duration-300"
            >
              {example}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
