export const PATIENTS = [
  { id: "1", name: "María Pérez" },
  { id: "2", name: "Juan Rodríguez" },
  { id: "3", name: "Carlos Sánchez" },
  { id: "4", name: "Ana Martínez" },
  { id: "5", name: "Pedro López" },
];

export const OFFICES = [
  { id: "1", name: "Consultorio Principal" },
  { id: "2", name: "Sede Norte" },
];

export const SERVICES = [
  { id: "1", name: "Consulta" },
  { id: "2", name: "Limpieza Dental" },
  { id: "3", name: "Control" },
  { id: "4", name: "Reunión" },
];

export const TIMES = Array.from({ length: 24 }).flatMap((_, h) =>
  ["00", "30"].map((m) => `${h.toString().padStart(2, "0")}:${m}`)
);
