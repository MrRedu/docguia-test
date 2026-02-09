"use client";

import {
  appointmentSchema,
  type AppointmentFormValues,
} from "@/schemas/appointment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface UseAppointmentFormProps {
  onSubmit: (values: AppointmentFormValues) => void;
  defaultValues?: Partial<AppointmentFormValues>;
}

export function useAppointmentForm({
  onSubmit,
  defaultValues,
}: UseAppointmentFormProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      officeId: "",
      date: undefined,
      time: "",
      serviceIds: [],
      duration: 30,
      internalNotes: "",
      reason: "",
      ...defaultValues,
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
  });

  return {
    form,
    handleSubmit,
    isLoading: form.formState.isSubmitting,
  };
}
