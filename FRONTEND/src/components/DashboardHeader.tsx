import udsmLogo from "@/assets/images/udsm-logo.jpg"

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = "Risk Management Dashboard" }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <img src={udsmLogo} alt="UDSM Logo" className="h-16 w-auto" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </div>
  );
} 