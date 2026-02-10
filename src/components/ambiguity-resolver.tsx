import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VoiceParsingResult } from "@/lib/voice-parser";
import { AppointmentFormValues } from "@/schemas/appointment.schema";
import { AlertCircle, Clock, Sunrise, Sunset } from "lucide-react";
import { useState } from "react";

interface AmbiguityResolverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: VoiceParsingResult | null;
  onResolve: (resolvedValues: Partial<AppointmentFormValues>) => void;
  onConfirm?: (resolvedValues: Partial<AppointmentFormValues>) => void;
}

export function AmbiguityResolver({
  open,
  onOpenChange,
  results,
  onResolve,
  onConfirm,
}: AmbiguityResolverProps) {
  const [resolvedTime, setResolvedTime] = useState<string | null>(null);

  if (!results) return null;

  const { values, rawTranscript } = results;

  const handleSelectMeridiem = (isPM: boolean) => {
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = (values.time || "00:00").split(":").map(Number);
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    setResolvedTime(time);
    onResolve({ ...values, time });
  };

  const handleConfirm = () => {
    if (resolvedTime) {
      onConfirm?.({ ...values, time: resolvedTime });
      onOpenChange(false);
    } else if (onConfirm) {
      onConfirm(values);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-106.25 p-0 overflow-hidden border-none shadow-2xl bg-background">
        <div className="p-6 space-y-4">
          <AlertDialogHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="bg-primary/10 p-2 rounded-full">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <AlertDialogDescription className="text-[10px] uppercase tracking-wider font-bold text-primary/60">
                Comando de voz detectado
              </AlertDialogDescription>
              <AlertDialogTitle className="text-lg font-semibold italic text-primary">
                {`"${rawTranscript}"`}
              </AlertDialogTitle>
            </div>
          </AlertDialogHeader>

          {/* Alerta de hora */}
          <Alert className="bg-amber-50 border border-amber-200">
            <AlertCircle className="size-5 text-amber-500!" />
            <AlertTitle className="text-sm font-bold text-amber-800">
              Se requiere aclaración
            </AlertTitle>
            <AlertDescription className="text-xs text-amber-700">
              El sistema detectó {`"${values.time?.split(":")[0]}"`} como la
              hora, pero no se especificó si es por la mañana o por la tarde.
            </AlertDescription>
          </Alert>

          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Paciente
              </p>
              <p className="text-sm font-medium text-slate-700">
                {values.patientId ? "Identificado" : "— Por definir —"}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Fecha
              </p>
              <p className="text-sm font-medium text-slate-700 capitalize">
                {values.date
                  ? format(values.date, "EEEE d MMM yyyy", { locale: es })
                  : "—"}
              </p>
            </div>
          </div> */}
          <div className="space-y-3 pt-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 text-center">
              Selecciona la hora correcta
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* Botón de mañana */}
              <button
                type="button"
                onClick={() => handleSelectMeridiem(false)}
                className={cn(
                  "group p-4 rounded-2xl border-2 transition-all text-center space-y-2 cursor-pointer",
                  resolvedTime && parseInt(resolvedTime.split(":")[0]) < 12
                    ? "bg-primary/10 border-primary shadow-inner"
                    : "bg-white border-transparent shadow-sm hover:border-primary/30"
                )}
              >
                <Sunrise
                  className={cn(
                    "w-6 h-6 mx-auto transition-colors",
                    resolvedTime && parseInt(resolvedTime.split(":")[0]) < 12
                      ? "text-primary"
                      : "text-slate-400"
                  )}
                />
                <div>
                  <p className="text-xl font-bold text-slate-700">
                    {values.time} AM
                  </p>
                  <p className="text-[10px] text-slate-400">Mañana</p>
                </div>
              </button>

              {/* Botón de noche */}
              <button
                type="button"
                onClick={() => handleSelectMeridiem(true)}
                className={cn(
                  "group p-4 rounded-2xl border-2 transition-all text-center space-y-2 cursor-pointer",
                  resolvedTime && parseInt(resolvedTime.split(":")[0]) >= 12
                    ? "bg-primary/10 border-primary shadow-inner"
                    : "bg-white border-transparent shadow-sm hover:border-primary/30"
                )}
              >
                <Sunset
                  className={cn(
                    "w-6 h-6 mx-auto transition-colors",
                    resolvedTime && parseInt(resolvedTime.split(":")[0]) >= 12
                      ? "text-primary"
                      : "text-slate-400"
                  )}
                />
                <div>
                  <p className="text-xl font-bold text-slate-700">
                    {values.time} PM
                  </p>
                  <p className="text-[10px] text-slate-400">Noche</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 flex items-center justify-between border-t gap-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar y editar manual
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!resolvedTime}
            className={cn(
              "flex-1",
              resolvedTime
                ? "bg-primary shadow-lg shadow-primary/20"
                : "bg-slate-100 text-slate-400 shadow-none"
            )}
          >
            Confirmar hora
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
