import { AppointmentSheet } from "@/components/appointment-sheet";
import { CalendarView } from "@/components/calendar-view";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CircleQuestionMark } from "lucide-react";

export default function CalendarioPage() {
  return (
    <div className="flex flex-col h-svh overflow-hidden">
      {/* TODO: Refactor header, it should be in main-layout.tsx */}
      <header className="flex h-14 items-center px-4 gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Calendario</h1>

          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <CircleQuestionMark className="size-3.5 text-primary/80" />
                <p className="text-sm text-primary/80 hidden md:block">
                  ¿Cómo funciona?
                </p>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="flex w-64 flex-col gap-0.5">
              {`* Explicación *`}
            </HoverCardContent>
          </HoverCard>
        </div>

        <AppointmentSheet className="ml-auto" />
      </header>

      {/* Calendario */}
      <CalendarView />
    </div>
  );
}
