import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

interface MainLayoutProps {
  children: React.ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  const cookieStore = await cookies();
  const isSidebarOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        {/* Acá debería ir el header para compartirlo, pero en este caso lo utilizaremos solo en el CalendarPage */}
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
