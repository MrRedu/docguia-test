# DocGuía - Calendario con Creación de Citas por Voz

Este proyecto es una prueba técnica para DocGuía que consiste en construir un módulo de calendario con la funcionalidad de crear citas mediante comandos de voz.

## 🎯 Objetivo del Challenge

1. **Emular el UI** del calendario existente de DocGuía
2. Permitir **crear citas por voz**, transformando lo dictado en datos estructurados
3. Mostrar las citas creadas reflejadas en el calendario

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes UI**: Shadcn/ui (tema slate/púrpura)
- **Formularios**: React Hook Form + Zod
- **Linting**: ESLint + Prettier
- **Package Manager**: npm

## 📁 Estructura del Proyecto

```
src/
├── app/              # App Router de Next.js
├── components/
│   ├── ui/          # Componentes de Shadcn/ui
│   └── ...          # Componentes custom
├── hooks/           # Custom hooks (incluye lógica de formularios)
├── schemas/         # Schemas de validación con Zod
├── types/           # Definiciones de TypeScript
├── lib/             # Utilidades y helpers
│   └── cookies/     # Manejo de cookies (sidebar state)
└── constants/       # Constantes de la aplicación
```

## 🚀 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint

# Format con Prettier
npm run format
```

## 📝 Decisiones de UX

### Manejo de Ambigüedades en Creación por Voz

_[Pendiente de implementar]_

- **"A las 7"** (am/pm): Se asumirá horario laboral (7 AM si es antes de 12 PM del día actual, 7 PM si es después)
- **"Mañana en la tarde"**: Se solicitará hora específica con sugerencias
- **Duración no especificada**: 30 minutos por defecto
- **Follow-up questions**: Modal de confirmación con campos editables antes de guardar

### Calendario

_[Evaluando opciones]_

Opciones consideradas:

1. FullCalendar.io - Vista semanal completa
2. React Big Calendar - Más liviano
3. Custom Component - Control total del diseño

## 🎨 UI/UX

### Componentes Principales

- **Sidebar**: Navegación con estado persistente (cookie)
  - Header con logo
  - Navegación con iconos
  - Footer con user dropdown
- **Sheet**: Modal lateral para crear citas
- **Calendario**: Vista semanal con slots de tiempo
- **Formulario de Citas**: Con validación y preview antes de guardar

## 🔮 Mejoras Futuras

- [ ] Detección de conflictos de horario
- [ ] Edición de citas por voz
- [ ] Draft mode para transcripciones
- [ ] Soporte de formatos locales ("pasado mañana", "tardecita")
- [ ] Tests unitarios y E2E

## 📚 Recursos

- [Notion - Interview Test](https://www.notion.so/Interview-Test-3028a66068d880c2ac80d8cf4cfe8104)
- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)

---

Desarrollado para DocGuía - Prueba Técnica 2026
