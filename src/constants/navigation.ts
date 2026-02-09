import { NavSection } from "@/types/navigation";
import {
  Bell,
  Calendar,
  CreditCard,
  DollarSign,
  Gift,
  Home,
  MapPin,
  Puzzle,
  Users,
} from "lucide-react";

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      {
        title: "Inicio",
        href: "/",
        icon: Home,
      },
      {
        title: "Calendario",
        href: "/calendario",
        icon: Calendar,
        isActive: true,
      },
      {
        title: "Pacientes",
        href: "/pacientes",
        icon: Users,
      },
      {
        title: "Cobros",
        href: "/cobros",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Gestión",
    items: [
      {
        title: "Recordatorios",
        href: "/recordatorios",
        icon: Bell,
      },
      {
        title: "Referidos",
        href: "/referidos",
        icon: Gift,
      },
    ],
  },
  {
    title: "Configuración",
    items: [
      {
        title: "Consultorios",
        href: "/consultorios",
        icon: MapPin,
      },
      {
        title: "Servicios",
        href: "/servicios",
        icon: DollarSign,
      },
      {
        title: "Plantillas",
        href: "/plantillas",
        icon: Puzzle,
      },
    ],
  },
];
