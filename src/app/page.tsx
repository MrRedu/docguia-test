import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Bienvenido a DocGuía</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Sistema de calendario para especialistas de salud
        </p>
        <Button asChild className="mt-8" size="lg">
          <Link href="/calendario">
            <Calendar className="mr-2 h-5 w-5" />
            Ir al Calendario
          </Link>
        </Button>
      </div>
    </div>
  );
}
