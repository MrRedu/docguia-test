import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <TooltipProvider>
      <>{children}</>
    </TooltipProvider>
  );
};
