// Abre app/dashboard/layout.tsx y comprueba que la estructura se vea así:
import SidebarNav from "@/components/SidebarNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Tu componente de barra lateral corregido al estilo AdminLTE */}
      <SidebarNav />

      {/* EL ENVOLTORIO MAESTRO DE NAVEGACIÓN RESPONSIVA */}
      <div className="admin-content-wrapper">
        {children}
      </div>
    </div>
  );
}
