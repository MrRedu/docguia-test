"use client";

import {
  appointmentSchema,
  type AppointmentFormValues,
} from "@/schemas/appointment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

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
      date: undefined as unknown as Date,
      time: "",
      serviceIds: [],
      duration: 30,
      internalNotes: "",
      reason: "",
      ...defaultValues,
    } as AppointmentFormValues,
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
  });

  return {
    form: form as unknown as UseFormReturn<AppointmentFormValues>,
    handleSubmit,
    isLoading: form.formState.isSubmitting,
  };
}
