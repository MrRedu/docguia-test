"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appointmentStorage, CalendarEvent } from "@/lib/storage";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";

export function CalendarView() {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentView, setCurrentView] = useState("timeGridWeek");

  // Usar inicializador lento para evitar set-state-in-effect y manejar SSR
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (typeof window !== "undefined") {
      return appointmentStorage.getEvents();
    }
    return [];
  });

  useEffect(() => {
    const handleUpdate = () => {
      setEvents(appointmentStorage.getEvents());
    };

    window.addEventListener("appointments-updated", handleUpdate);

    // Sincronizar UI del calendario
    const timer = setTimeout(() => {
      if (calendarRef.current) {
        const api = calendarRef.current.getApi();
        setCurrentTitle(api.view.title);
        setCurrentView(api.view.type);
      }
    }, 0);

    return () => {
      window.removeEventListener("appointments-updated", handleUpdate);
      clearTimeout(timer);
    };
  }, []);

  const handlePrev = () => {
    if (!calendarRef.current) return;
    const api = calendarRef.current.getApi();
    api.prev();
    setCurrentTitle(api.view.title);
  };

  const handleNext = () => {
    if (!calendarRef.current) return;
    const api = calendarRef.current.getApi();
    api.next();
    setCurrentTitle(api.view.title);
  };

  const handleToday = () => {
    if (!calendarRef.current) return;
    const api = calendarRef.current.getApi();
    api.today();
    setCurrentTitle(api.view.title);
  };

  const handleViewChange = (view: string) => {
    if (!calendarRef.current) return;
    const api = calendarRef.current.getApi();
    api.changeView(view);
    setCurrentView(view);
    setCurrentTitle(api.view.title);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Calendar Header / Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-4 bg-background border-b">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="font-medium"
          >
            Hoy
          </Button>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handlePrev}
              className="rounded-r-none border-r-0 h-9 w-9 border"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex h-9 items-center justify-center border-y px-4 text-sm font-medium min-w-35">
              {currentTitle}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleNext}
              className="rounded-l-none border-l-0 h-9 w-9 border"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center rounded-full border bg-muted/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange("timeGridWeek")}
            className="h-7 px-3 text-xs font-medium data-[active=true]:bg-white data-[active=true]:border data-[active=true]:text-primary transition-all rounded-full"
            data-active={currentView === "timeGridWeek"}
          >
            Semana
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange("timeGridDay")}
            className="h-7 px-3 text-xs font-medium data-[active=true]:bg-white data-[active=true]:border data-[active=true]:text-primary transition-all rounded-full"
            data-active={currentView === "timeGridDay"}
          >
            Día
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange("listWeek")}
            className="h-7 px-3 text-xs font-medium data-[active=true]:bg-white data-[active=true]:border data-[active=true]:text-primary transition-all rounded-full"
            data-active={currentView === "listWeek"}
          >
            Lista
          </Button>
        </div>

        {/* View Switcher & Filters */}
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <SelectValue placeholder="Todos los consultorios" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los consultorios</SelectItem>
              <SelectItem value="1">Consultorio Principal</SelectItem>
              <SelectItem value="2">Sede Norte</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="min-w-200">
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            initialView="timeGridWeek"
            headerToolbar={false}
            events={events}
            locale="es"
            firstDay={0}
            slotMinTime="00:00:00"
            slotMaxTime="23:59:59"
            allDaySlot={false}
            nowIndicator={true}
            slotDuration="01:00:00"
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: false,
              meridiem: "short",
              hour12: true,
            }}
            dayHeaderFormat={{
              weekday: "short",
              day: "numeric",
              omitCommas: true,
            }}
            eventContent={(eventInfo) => {
              const start = eventInfo.event.start;
              const end = eventInfo.event.end;
              const timeFormat = new Intl.DateTimeFormat("es", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });
              const timeRange = `${timeFormat.format(start!).toLowerCase()} - ${timeFormat.format(end!).toLowerCase()}`;

              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex flex-col bg-secondary h-full justify-center p-1 overflow-hidden text-primary rounded border border-l-3 border-primary cursor-pointer">
                      <p className="font-semibold text-xs">
                        {eventInfo.event.title}
                      </p>
                      <p className="text-[10px] opacity-70">{timeRange}</p>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <PopoverHeader className="border-b pb-2 mb-2">
                      <PopoverTitle>{eventInfo.event.title}</PopoverTitle>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <span className="capitalize">
                          {eventInfo.event.start?.toLocaleDateString("es", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                        <span>•</span>
                        <span>{timeRange}</span>
                      </div>
                    </PopoverHeader>
                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">
                          Consultorio:
                        </div>
                        <div>
                          {eventInfo.event.extendedProps.officeId === "1"
                            ? "Consultorio Principal"
                            : "Sede Norte"}
                        </div>
                        <div className="text-muted-foreground">Servicios:</div>
                        <div className="flex flex-wrap gap-1">
                          {eventInfo.event.extendedProps.serviceIds?.map(
                            (id: string) => (
                              <span
                                key={id}
                                className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-[9px]"
                              >
                                {id === "1"
                                  ? "Consulta"
                                  : id === "2"
                                    ? "Limpieza"
                                    : "Control"}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      {eventInfo.event.extendedProps.internalNotes && (
                        <div className="pt-2 border-t">
                          <div className="text-muted-foreground mb-1">
                            Notas internas:
                          </div>
                          <p className="bg-muted p-2 rounded italic text-slate-600">
                            {eventInfo.event.extendedProps.internalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }}
            // Days
            dayHeaderClassNames="h-10! bg-muted [&>div]:h-full [&>div]:flex [&>div]:items-center [&>div]:justify-center"
            // Hours
            slotLabelClassNames="h-16! bg-muted text-sm px-4!"
            // Table height
            height="auto"
            stickyHeaderDates={true}
          />
        </div>
      </div>
    </div>
  );
}
