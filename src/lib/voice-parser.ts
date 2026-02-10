import { AppointmentFormValues } from "@/schemas/appointment.schema";
import { addDays, nextDay, startOfToday } from "date-fns";
import { OFFICES, PATIENTS, SERVICES } from "./constants";

export interface VoiceParsingResult {
  values: Partial<AppointmentFormValues>;
  ambiguities: string[];
  isComplete: boolean;
  rawTranscript: string;
}

export const voiceParser = {
  parse: (transcript: string): VoiceParsingResult => {
    let text = transcript.toLowerCase();

    // 0. Pre-procesar números escritos
    const numberMap: Record<string, string> = {
      una: "1",
      uno: "1",
      dos: "2",
      tres: "3",
      cuatro: "4",
      cinco: "5",
      seis: "6",
      siete: "7",
      ocho: "8",
      nueve: "9",
      diez: "10",
      once: "11",
      hoce: "11",
      doce: "12",
      trece: "13",
      catorce: "14",
      quince: "15",
      dieciseis: "16",
      diecisiete: "17",
      dieciocho: "18",
      diecinueve: "19",
      veinte: "20",
      veintiuno: "21",
      veintidos: "22",
      veintitres: "23",
      media: "30",
      cuarto: "15",
    };

    // Reemplazar palabras de números completas por dígitos
    Object.entries(numberMap).forEach(([word, digit]) => {
      // Regex con límites de palabra para evitar reemplazos parciales
      text = text.replace(new RegExp(`\\b${word}\\b`, "gi"), digit);
    });

    const result: Partial<AppointmentFormValues> = {};
    const ambiguities: string[] = [];

    // 1. Extraer Paciente
    const patient = PATIENTS.find((p) => text.includes(p.name.toLowerCase()));
    if (patient) {
      result.patientId = patient.id;
    } else {
      const simpleMatch = PATIENTS.find((p) => {
        const firstName = p.name.split(" ")[0].toLowerCase();
        // Regex to match firstName as a whole word to avoid "ana" matching "mañana"
        const nameRegex = new RegExp(`\\b${firstName}\\b`, "i");
        return nameRegex.test(text);
      });
      if (simpleMatch) {
        result.patientId = simpleMatch.id;
      }
    }

    // 2. Extraer Servicio
    const service = SERVICES.find((s) => text.includes(s.name.toLowerCase()));
    if (service) {
      result.serviceIds = [service.id];
    }

    // 3. Extraer Consultorio
    const office = OFFICES.find((o) => text.includes(o.name.toLowerCase()));
    if (office) {
      result.officeId = office.id;
    } else if (text.includes("norte")) {
      result.officeId = "2";
    } else if (text.includes("principal")) {
      result.officeId = "1";
    }

    // 4. Extraer Duración
    const durationMatch = text.match(/(\d+)\s*(minutos?|min|h|horas?)/);
    if (durationMatch) {
      let value = parseInt(durationMatch[1]);
      const unit = durationMatch[2];
      if (unit.startsWith("h")) {
        value = value * 60;
      }
      result.duration = value;
    } else if (text.includes("una hora")) {
      result.duration = 60;
    } else if (text.includes("media hora")) {
      result.duration = 30;
    }

    // 5. Extraer Fecha (Solo si se menciona explícitamente)
    let targetDate: Date | undefined;
    if (text.includes("mañana")) {
      targetDate = addDays(startOfToday(), 1);
    } else if (text.includes("pasado mañana")) {
      targetDate = addDays(startOfToday(), 2);
    } else if (text.includes("hoy")) {
      targetDate = startOfToday();
    } else {
      const days: Record<string, number> = {
        lunes: 1,
        martes: 2,
        miércoles: 3,
        jueves: 4,
        viernes: 5,
        sábado: 6,
        domingo: 0,
      };
      for (const [dayName, dayIndex] of Object.entries(days)) {
        if (text.includes(dayName)) {
          targetDate = nextDay(
            startOfToday(),
            dayIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6
          );
          break;
        }
      }

      const monthMatch = text.match(
        /(\d+)\s*de\s*(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/
      );
      if (monthMatch) {
        const day = parseInt(monthMatch[1]);
        const months: Record<string, number> = {
          enero: 0,
          febrero: 1,
          marzo: 2,
          abril: 3,
          mayo: 4,
          junio: 5,
          julio: 6,
          agosto: 7,
          septiembre: 8,
          octubre: 9,
          noviembre: 10,
          diciembre: 11,
        };
        const month = months[monthMatch[2]];
        const currentYear = new Date().getFullYear();
        targetDate = new Date(currentYear, month, day);
      }
    }
    if (targetDate) result.date = targetDate;

    // 6. Extraer Hora (Improved Regex)
    // Matches:
    // 1. "a las X[:XX] [am/pm]"
    // 2. "X:XX [am/pm]"
    // 3. "X [am/pm]"
    // 4. Standalone number "X" if in valid range (1-12) and not part of a date/duration context
    const timeRegex =
      /(?:a\s+las?|alas)\s+(\d{1,2})(?::(\d{2}))?(?:\s*(am|pm|p\.m\.|a\.m\.|de\s+la\s+(?:tarde|mañana|noche)))?|(\d{1,2}):(\d{2})(?:\s*(am|pm|p\.m\.|a\.m\.|de\s+la\s+(?:tarde|mañana|noche)))?|(\d{1,2})\s*(am|pm|p\.m\.|a\.m\.|de\s+la\s+(?:tarde|mañana|noche))/i;

    let timeMatch = text.match(timeRegex);

    // Falback: Si no hay match explícito, buscar un número "suelto" entre 1 y 12
    // que NO sea una fecha (día X) ni duración (X minutos)
    if (!timeMatch) {
      // Buscar números del 1 al 12
      const standaloneTimeRegex = /\b([1-9]|1[0-2])\b/;
      const potentialMatch = text.match(standaloneTimeRegex);

      if (potentialMatch) {
        // Verificar que NO esté precedido por indicadores de fecha o duración
        const index = potentialMatch.index || 0;
        const precedingText = text.substring(Math.max(0, index - 15), index);
        const followingText = text.substring(
          index + potentialMatch[0].length,
          index + potentialMatch[0].length + 10
        );

        const isDayOfMonth = /(el|dia|día|de)\s*$/.test(precedingText);
        const isDuration = /^\s*(min|h|hora)/.test(followingText);
        const isYear = /^\s*(de\s*20\d{2})/.test(followingText);

        if (!isDayOfMonth && !isDuration && !isYear) {
          // Simular match compatible con el regex principal: grupo 7 (hora) y grupo 8 (meridiano=undefined)
          // Indices en match array: 0:full, 1-3: a las.., 4-6: X:XX.., 7-8: X am/pm
          // Creamos un array fake con indices correctos
          const fakeMatch = [] as unknown as RegExpMatchArray;
          fakeMatch[0] = potentialMatch[0];
          fakeMatch[7] = potentialMatch[1]; // Hora
          timeMatch = fakeMatch;
        }
      }
    }

    if (timeMatch) {
      // Group structures:
      // 1-3: "a las X[:XX] [meridiem]"
      // 4-6: "X:XX [meridiem]"
      // 7-8: "X [meridiem]" (Also used by standalone fallback)

      let hours = parseInt(timeMatch[1] || timeMatch[4] || timeMatch[7]);
      const minutes = parseInt(timeMatch[2] || timeMatch[5] || "0");
      const meridiem = (
        timeMatch[3] ||
        timeMatch[6] ||
        timeMatch[8] ||
        ""
      ).toLowerCase();
      // Handle "a la una" case logic if needed, but regex catches "1"

      if (meridiem) {
        if (
          (meridiem.includes("pm") ||
            meridiem.includes("tarde") ||
            meridiem.includes("noche")) &&
          hours < 12
        ) {
          hours += 12;
        }
        if (
          (meridiem.includes("am") || meridiem.includes("mañana")) &&
          hours === 12
        ) {
          hours = 0;
        }
        result.time = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
      } else {
        // No meridiem found
        // If hour is > 12, it's unambiguous (13:00)
        // If < 12, it's ambiguous
        result.time = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;

        if (hours >= 1 && hours <= 12) {
          ambiguities.push("time_meridiem");
        }
      }
    }

    // 7. Validar si está completo
    const isComplete = !!(
      result.patientId &&
      result.date &&
      result.time &&
      result.officeId &&
      result.duration &&
      !ambiguities.length
    );

    return {
      values: result,
      ambiguities,
      isComplete,
      rawTranscript: transcript,
    };
  },
};
