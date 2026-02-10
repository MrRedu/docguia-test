import { AppointmentSheet } from "@/components/appointment-sheet";
import { CalendarView } from "@/components/calendar-view";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CircleQuestionMark, Sparkles } from "lucide-react";

export default function CalendarioPage() {
  return (
    <div className="flex flex-col h-svh overflow-hidden">
      <header className="flex h-14 items-center px-4 gap-4 border-b bg-white shadow-sm shrink-0">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Calendario</h1>

          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <CircleQuestionMark className="size-3.5 text-primary/80" />
                <p className="text-sm text-primary/80 hidden md:block">
                  ¿Cómo funciona el agendamiento por voz?
                </p>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-3">
                <h4 className="font-bold flex items-center gap-2 text-primary">
                  <Sparkles className="size-4" /> Comandos de Voz
                </h4>
                <p className="text-sm text-slate-500">
                  Haz clic en el micrófono para empezar a grabar. El sistema
                  detecta automáticamente pacientes, fechas, horas, servicios y
                  consultorios.
                </p>
                <blockquote className="text-xs bg-slate-50 p-2 rounded border border-slate-100 italic">
                  Crea una cita mañana a las 3pm con María Pérez en el
                  consultorio principal.
                </blockquote>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <AppointmentSheet />
        </div>
      </header>

      {/* Calendario */}
      <CalendarView />
    </div>
  );
}
