# DocGuía - Calendario con Creación de Citas por Voz

Este proyecto es una prueba técnica para DocGuía que consiste en construir un módulo de calendario con la funcionalidad de crear citas mediante comandos de voz.

## 🔗 Demo y Repositorio

- **URL Pública**: [docguia.vercel.app](https://docguia.vercel.app/)
- **Repositorio**: [Link al repositorio](https://github.com/MrRedu/docguia-test)

## 🎯 Objetivo del Challenge

Construir un mini-módulo de calendario que:

1. **Emule el UI** del calendario mostrado en las capturas (look & feel, jerarquía, spacing, componentes clave).
2. Permita **crear citas por voz**, transformando lo dictado en datos estructurados (fecha, hora, paciente/cliente, motivo, duración, notas, etc.).
3. Muestre la cita creada reflejada en el calendario.

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes UI**: Shadcn/ui (Radix UI) + Lucide Icons
- **Formularios**: React Hook Form + Zod
- **Manejo de Fechas**: date-fns
- **Reconocimiento de Voz**: Web Speech API (Nativa del navegador)

## 💡 Decisiones de UX/UI

### 1. Experiencia "Voice-First" pero con control

La interacción de voz fue diseñada para ser una ayuda rápida, no una "caja negra".

- **Feedback Visual**: Implementamos el componente `VoiceWave` que reacciona al estado de "escuchando", dando feedback inmediato al usuario.
- **Transcripción en Tiempo Real**: El usuario ve lo que el sistema está entendiendo mientras habla.
- **Edición Manual**: Si la voz falla, todos los campos se pueden corregir manualmente antes de guardar.

### 2. Manejo de Ambigüedades (AmbiguityResolver)

Uno de los mayores retos de la voz es la falta de precisión.

- **Caso AM/PM**: Si el usuario dice "a las 7", el sistema detecta la hora pero marca una ambigüedad (`time_meridiem`). Al dejar de hablar, se lanza el modal `AmbiguityResolver` permitiendo al usuario elegir rápidamente si se refería a la mañana o la noche con un solo clic.
- **Fechas Relativas**: El parser entiende "mañana", "pasado mañana", "hoy", "el lunes", etc., convirtiéndolos automáticamente a fechas concretas.

### 3. Emulación Visual

Se ha replicado fielmente el diseño original utilizando:

- **Sidebar persistente**: Navegación clara y jerarquía visual.

## ⚙️ Decisiones Técnicas

### Arquitectura "Client-Side" para Voz

Se optó por usar la **Web Speech API** nativa del navegador en lugar de una API externa (como Whisper) por:

- **Latencia Cero**: Feedback instantáneo al usuario.
- **Privacidad**: El audio no sale del dispositivo.
- **Costo**: Gratuito y sin necesidad de gestionar keys de API para la prueba.

### Parsing (Reglas + Keywords)

El `voiceParser` (`src/lib/voice-parser.ts`) utiliza una estrategia determinista basada en:

1. **Extracción de Entidades**: Búsqueda de pacientes y servicios conocidos en el texto.
2. **Regex para Tiempos**: Expresiones regulares robustas para capturar horas en múltiples formatos ("7pm", "a las 7", "7:30").
3. **Mapeo de Lenguaje Natural**: Conversión de "media hora" a `30`, "mañana" a valid dates, etc.

Esta aproximación es más predecible y rápida que usar un LLM para tareas simples de estructuración.

### Persistencia Local

Dado que no se requería backend real:

- Se implementó `appointmentStorage` (`src/lib/storage.ts`) usando `localStorage`.
- Se usa un patrón de eventos (`window.dispatchEvent`) para sincronizar el estado entre el formulario de creación y la vista del calendario sin necesidad de un contexto global complejo.

## ✅ Funcionalidades Implementadas

- [x] Vista de Calendario Semanal
- [x] Creación de Citas (Formulario Slide-over)
- [x] **Input de Voz** con transcripción en vivo
- [x] Parsing inteligente de:
  - Pacientes (mencionar nombre)
  - Servicios (mencionar tipo de consulta)
  - Fechas (relativas y absolutas)
  - Horas y Duración
- [x] **Resolución de Conflictos**: El sistema valida si el horario ya está ocupado antes de guardar.
- [x] **Manejo de Ambigüedad**: UI dedicada para aclarar AM/PM.

## 🚀 Cómo correr el proyecto

```bash
# Instalar dependencias
npm install

# Correr servidor de desarrollo
npm run dev

# Abrir en navegador
http://localhost:3000
```

## 🔮 Conclusiones y Futuro

El sistema actual cumple con ser funcional y robusto para los casos de uso definidos. Para llevarlo a producción, los siguientes pasos serían:

1. **Integración con LLM**: Para entender frases más complejas como "mueve la cita del viernes para hoy", un LLM pequeño sería ideal.
2. **Backend Real**: Migrar `localStorage` a una base de datos (PostgreSQL/Supabase).
3. **Tests E2E**: Añadir Cypress/Playwright para probar el flujo de voz (mockeando la API de speech).

### Componentes Principales

- **Sidebar**: Navegación con estado persistente (cookie)
  - Header con logo
  - Navegación con iconos
  - Footer con user dropdown
- **Sheet**: Modal lateral para crear citas
- **Calendario**: Vista semanal con slots de tiempo
- **Formulario de Citas**: Con validación y preview antes de guardar

## 📚 Recursos

- [Notion - Interview Test](https://www.notion.so/Interview-Test-3028a66068d880c2ac80d8cf4cfe8104)

---

Desarrollado para la prueba técnica de **DocGuía** - 2026
