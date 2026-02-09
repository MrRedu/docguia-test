"use client";

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
import { cn } from "@/lib/utils";
import { AppointmentFormValues } from "@/schemas/appointment.schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";

// Mock data
const PATIENTS = [
  { id: "1", name: "María Pérez" },
  { id: "2", name: "Juan Rodríguez" },
  { id: "3", name: "Carlos Sánchez" },
];

const OFFICES = [
  { id: "1", name: "Consultorio Principal" },
  { id: "2", name: "Sede Norte" },
];

const TIMES = Array.from({ length: 24 }).flatMap((_, h) =>
  ["00", "30"].map((m) => `${h.toString().padStart(2, "0")}:${m}`)
);

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
      <SheetContent className="sm:max-w-125 overflow-y-auto">
        <SheetHeader className="border-b">
          <SheetTitle>Agendar nueva cita</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6 pt-6 px-4 h-full">
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-white",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
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
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Hora" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                  <FormLabel>Servicios</FormLabel>
                  <Select
                    onValueChange={(val) =>
                      field.onChange([...field.value, val])
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar servicios..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Consulta General</SelectItem>
                      <SelectItem value="2">Limpieza Dental</SelectItem>
                      <SelectItem value="3">Control</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((id) => (
                      <div
                        key={id}
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {id === "1"
                          ? "Consulta General"
                          : id === "2"
                            ? "Limpieza Dental"
                            : "Control"}
                        <button
                          type="button"
                          onClick={() =>
                            field.onChange(field.value.filter((i) => i !== id))
                          }
                          className="hover:text-primary/70"
                        >
                          ×
                        </button>
                      </div>
                    ))}
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

            <SheetFooter className="border-t pt-6 w-full gap-3 mt-auto">
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
