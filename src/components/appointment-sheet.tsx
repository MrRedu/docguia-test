"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppointmentForm } from "@/hooks/use-appointment-form";
import { appointmentStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { AppointmentFormValues } from "@/schemas/appointment.schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  Pause,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AmbiguityResolver } from "@/components/ambiguity-resolver";
import { VoicePromo } from "@/components/voice-promo";
import { VoiceWave } from "@/components/voice-wave";
import { useCalendarSpeech } from "@/hooks/use-calendar-speech";
import { OFFICES, PATIENTS, SERVICES, TIMES } from "@/lib/constants";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface AppointmentSheetProps {
  onSuccess?: (values: AppointmentFormValues) => void;
  className?: string;
}

export function AppointmentSheet({
  onSuccess,
  className,
}: AppointmentSheetProps) {
  const [open, setOpen] = useState(false);
  const [ambiguityOpen, setAmbiguityOpen] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  const { isListening, transcript, results, startListening, stopListening } =
    useCalendarSpeech();

  const { form, handleSubmit, isLoading } = useAppointmentForm({
    onSubmit: (values) => {
      // Validar disponibilidad
      const isAvailable = appointmentStorage.checkAvailability(
        values.date,
        values.time,
        values.duration
      );

      if (!isAvailable) {
        setConflictError(
          `El horario ${values.time} ya está ocupado. Por favor selecciona otra hora.`
        );
        return;
      }
      setConflictError(null);

      // console.log("Cita creada:", values);

      appointmentStorage.saveAppointment(values);
      onSuccess?.(values);
      form.reset();
      setOpen(false);
      stopListening();
    },
  });

  // Sincronizar resultados de voz con el formulario
  useEffect(() => {
    if (results?.values) {
      const { values, ambiguities } = results;

      // Actualizar campos identificados
      // Actualizar campos identificados
      if (values.patientId)
        form.setValue("patientId", values.patientId, { shouldValidate: true });
      if (values.serviceIds)
        form.setValue("serviceIds", values.serviceIds, {
          shouldValidate: true,
        });
      if (values.officeId)
        form.setValue("officeId", values.officeId, { shouldValidate: true });
      if (values.date)
        form.setValue("date", values.date, { shouldValidate: true });
      if (values.time && !ambiguities.includes("time_meridiem")) {
        form.setValue("time", values.time, { shouldValidate: true });
      }
      if (values.duration)
        form.setValue("duration", values.duration, { shouldValidate: true });

      // Si hay ambigüedad de meridiano y terminamos de escuchar, abrir resolvedor
      if (!isListening && ambiguities.includes("time_meridiem")) {
        // Usar un pequeño delay para asegurar que el estado de escucha se procese
        setTimeout(() => setAmbiguityOpen(true), 100);
      }
    }
  }, [results, isListening, form]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      setOpen(true);
      startListening();
    }
  };

  const handleAmbiguityResolve = (
    resolvedValues: Partial<AppointmentFormValues>
  ) => {
    if (resolvedValues.time)
      form.setValue("time", resolvedValues.time, { shouldValidate: true });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className={className}>
          Agendar Cita
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        showCloseButton={false}
        className="w-full sm:max-w-125 flex flex-col h-full p-0 gap-0"
      >
        <SheetHeader className="border-b pb-4 px-6 flex-row items-center justify-between space-y-0">
          <SheetTitle>Agendar nueva cita</SheetTitle>
        </SheetHeader>

        <AmbiguityResolver
          open={ambiguityOpen}
          onOpenChange={setAmbiguityOpen}
          results={results}
          onResolve={handleAmbiguityResolve}
          onConfirm={(resolvedValues) => {
            if (resolvedValues.time)
              form.setValue("time", resolvedValues.time, {
                shouldValidate: true,
              });
            // handleSubmit();
          }}
        />

        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {conflictError && (
                <Alert
                  variant="destructive"
                  className="animate-in fade-in slide-in-from-top-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Conflicto de horario</AlertTitle>
                  <AlertDescription>{conflictError}</AlertDescription>
                </Alert>
              )}
              {/* Panel de Voz (Imagen 3) */}
              {/* Voice Promo when not listening */}
              {!isListening && <VoicePromo onClick={handleVoiceToggle} />}

              {/* Panel de Voz (Imagen 3) */}
              {isListening && (
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 space-y-4 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                        Escuchando...
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={stopListening}
                      size="icon"
                      title="Detener grabación"
                      className="rounded-full bg-red-100/50 hover:bg-red-100 transition-all border border-red-200"
                    >
                      <Pause className="h-3.5 w-3.5 text-red-600 fill-red-600" />
                    </Button>
                  </div>

                  <VoiceWave isListening={isListening} />

                  <div className="text-center px-4">
                    <p className="text-sm font-semibold italic text-primary/80 leading-relaxed">
                      &quot;{transcript || "Empieza a hablar para agendar..."}
                      &quot;
                    </p>
                  </div>
                </div>
              )}

              {/* Paciente */}
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center gap-2">
                        Paciente <span className="text-destructive">*</span>
                        {results?.values.patientId === field.value &&
                          transcript && (
                            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                          )}
                      </FormLabel>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={(e) => {
                          // Para que no haga nada
                          e.preventDefault();
                          // Aquí va la lógica para añadir un paciente
                        }}
                      >
                        Añadir paciente +
                      </Button>
                    </div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Buscar paciente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PATIENTS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Consultorio */}
              <FormField
                control={form.control}
                name="officeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Consultorio <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un consultorio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {OFFICES.map((o) => (
                          <SelectItem key={o.id} value={o.id}>
                            {o.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 items-start gap-4">
                {/* Fecha */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Fecha <span className="text-destructive">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 overflow-hidden flex items-center justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span className="text-muted-foreground">
                                  Selecciona una fecha
                                </span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Hora */}
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Hora <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Hora" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper">
                          {TIMES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Servicios */}
              <FormField
                control={form.control}
                name="serviceIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Servicios <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(val) => {
                        if (!field.value.includes(val)) {
                          field.onChange([...field.value, val]);
                        }
                      }}
                      value=""
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar servicios..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper">
                        {SERVICES.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((id) => {
                        const service = SERVICES.find((s) => s.id === id);
                        if (!service) return null;
                        return (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-2 py-1 flex items-center gap-1"
                          >
                            {service.name}
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  field.value.filter((i: string) => i !== id)
                                )
                              }
                              className="hover:text-primary/70 cursor-pointer p-0.5"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duración */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración de la cita</FormLabel>
                    <FormControl>
                      {/* <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        className="w-full"
                      /> */}

                      <InputGroup>
                        <InputGroupInput
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                        <InputGroupAddon align="inline-end">
                          <span className="text-sm text-muted-foreground font-medium">
                            min
                          </span>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 pt-2">
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 flex items-center gap-1 text-xs"
                  onClick={(e) => {
                    // Para que no haga nada
                    e.preventDefault();
                  }}
                >
                  Añadir notas internas <Plus className="size-3.5" />
                </Button>

                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 flex items-center gap-1 text-xs"
                  onClick={(e) => {
                    // Para que no haga nada
                    e.preventDefault();
                  }}
                >
                  Añadir Motivo de consulta <Plus className="size-3.5" />
                </Button>
              </div>
            </div>

            <SheetFooter className="border-t pt-4 mt-auto">
              <div className="flex w-full gap-3">
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      form.reset();
                      setConflictError(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </SheetClose>
                <Button type="submit" className="flex-2" disabled={isLoading}>
                  {isLoading ? "Agendando..." : "Agendar cita"}
                  <CheckCircle className="size-4" />
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
