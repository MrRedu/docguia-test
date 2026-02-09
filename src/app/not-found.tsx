import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-svh flex-col items-center justify-center space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          404
        </h1>
        <h2 className="text-xl font-semibold text-muted-foreground">
          Página no encontrada
        </h2>
      </div>
      <p className="max-w-100 text-center text-muted-foreground">
        Parece que te has perdido en el sistema. No te preocupes, lo más
        importante es tu agenda. ¡Regresemos al calendario!
      </p>
      <Button asChild variant="default" className="mt-4">
        <Link href="/calendario">
          <MoveLeft className="mr-2 h-4 w-4" />
          Volver al Calendario
        </Link>
      </Button>
    </div>
  );
}
