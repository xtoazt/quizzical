
import { AppHeader } from "@/components/AppHeader";
import { DashboardDisplay } from "@/components/DashboardDisplay";

export default function HomePage() {
  // This page will now effectively be the Dashboard.
  // The Quiz Setup functionality has been moved to /create-quiz
  return (
    <>
      <AppHeader />
      <main className="flex-grow flex flex-col items-center py-8 px-4 bg-muted/30">
        <DashboardDisplay />
      </main>
    </>
  );
}

    