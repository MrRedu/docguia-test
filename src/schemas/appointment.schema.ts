import { z } from "zod";

export const appointmentSchema = z.object({
  patientId: z.string().min(1, "El paciente es requerido"),
  officeId: z.string().min(1, "El consultorio es requerido"),
  date: z.date({ message: "La fecha es requerida" }),
  time: z.string().min(1, "La hora es requerida"),
  serviceIds: z.array(z.string()).min(1, "Seleccione al menos un servicio"),
  duration: z.number().min(5, "La duración mínima es 5 min").default(30),
  internalNotes: z.string().optional(),
  reason: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
