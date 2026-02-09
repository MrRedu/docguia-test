import { AppointmentFormValues } from "@/schemas/appointment.schema";
import { addMinutes } from "date-fns";
import { PATIENTS } from "./constants";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: AppointmentFormValues & {
    patientName: string;
  };
}

const STORAGE_KEY = "docguia_appointments";

export const appointmentStorage = {
  getEvents: (): CalendarEvent[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveAppointment: (values: AppointmentFormValues): CalendarEvent => {
    const events = appointmentStorage.getEvents();

    // Calcular fechas
    const [hours, minutes] = values.time.split(":").map(Number);
    const startDate = new Date(values.date);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = addMinutes(startDate, values.duration);

    const patient = PATIENTS.find((p) => p.id === values.patientId);
    const patientName = patient ? patient.name : "Paciente Desconocido";

    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: patientName,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      extendedProps: {
        ...values,
        patientName,
      },
    };

    const updatedEvents = [...events, newEvent];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));

    // Disparar evento para que otros componentes se enteren
    window.dispatchEvent(new Event("appointments-updated"));

    return newEvent;
  },

  deleteAppointment: (id: string) => {
    const events = appointmentStorage.getEvents();
    const filtered = events.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("appointments-updated"));
  },
};
