
import { AppHeader } from "@/components/AppHeader";
import { DashboardDisplay } from "@/components/DashboardDisplay";

export default function DashboardPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-grow flex flex-col items-center py-8 px-4 bg-muted/30">
        <DashboardDisplay />
      </main>
    </>
  );
}
