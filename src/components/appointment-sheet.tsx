"use client";

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
import { Input } from "@/components/ui/input";
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
import { CalendarIcon, Plus, X } from "lucide-react";

import { OFFICES, PATIENTS, SERVICES, TIMES } from "@/lib/constants";

interface AppointmentSheetProps {
  onSuccess?: (values: AppointmentFormValues) => void;
  className?: string;
}

export function AppointmentSheet({
  onSuccess,
  className,
}: AppointmentSheetProps) {
  const { form, handleSubmit, isLoading } = useAppointmentForm({
    onSubmit: (values) => {
      console.log("Cita creada:", values);
      appointmentStorage.saveAppointment(values);
      onSuccess?.(values);

      form.reset();
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={className}>
          Agendar Cita
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-125 flex flex-col h-full p-0 gap-0">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Agendar nueva cita</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Paciente */}
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>
                        Paciente <span className="text-destructive">*</span>
                      </FormLabel>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
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

              <div className="grid grid-cols-2 gap-4">
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
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </FormControl>
                      <span className="text-sm text-muted-foreground font-medium">
                        min
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 pt-2">
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 flex items-center gap-1 text-xs"
                >
                  Añadir notas internas <Plus className="size-3.5" />
                </Button>

                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 flex items-center gap-1 text-xs"
                >
                  Añadir Motivo de consulta <Plus className="size-3.5" />
                </Button>
              </div>
            </div>

            <SheetFooter className="border-t pt-4 mt-auto">
              <div className="flex w-full gap-3">
                <SheetClose asChild>
                  <Button type="button" variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                </SheetClose>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Agendando..." : "Agendar cita"}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
