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

  checkAvailability: (
    date: Date,
    time: string,
    duration: number,
    excludeId?: string
  ): boolean => {
    const events = appointmentStorage.getEvents();
    const [hours, minutes] = time.split(":").map(Number);

    // Create start and end time for the potential new appointment
    const newStart = new Date(date);
    newStart.setHours(hours, minutes, 0, 0);
    const newEnd = addMinutes(newStart, duration);

    // Check for overlaps with existing events
    return !events.some((event) => {
      if (excludeId && event.id === excludeId) return false;

      const existingStart = new Date(event.start);
      const existingEnd = new Date(event.end);

      // Overlap condition:
      // (StartA <= EndB) and (EndA >= StartB)
      // Actually strictly talking, overlap is usually StartA < EndB && EndA > StartB
      return newStart < existingEnd && newEnd > existingStart;
    });
  },
};
