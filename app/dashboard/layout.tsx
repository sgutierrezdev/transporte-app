import SidebarNav from "@/components/SidebarNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dash-shell">
      <SidebarNav />
      <div className="dash-main">{children}</div>
    </div>
  );
}
