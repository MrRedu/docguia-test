import { AppointmentSheet } from "@/components/appointment-sheet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CircleQuestionMark } from "lucide-react";

export default function CalendarioPage() {
  return (
    <div className="space-y-4">
      {/* TODO: Refactor header, it should be in main-layout.tsx */}
      <header className="flex h-14 items-center px-4 gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Calendario</h1>

          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <CircleQuestionMark className="size-3.5 text-primary/80" />
                <p className="text-sm text-primary/80">¿Cómo funciona?</p>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="flex w-64 flex-col gap-0.5">
              {`* Explicación *`}
            </HoverCardContent>
          </HoverCard>
        </div>

        <AppointmentSheet className="ml-auto" />
      </header>

      {/* Placeholder para el calendario */}
      <div className="flex h-150 items-center justify-center rounded-lg border-2 border-dashed bg-slate-50/50">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Calendario
          </p>
          <p className="text-sm text-muted-foreground">
            Componente pendiente de implementar
          </p>
        </div>
      </div>
    </div>
  );
}
