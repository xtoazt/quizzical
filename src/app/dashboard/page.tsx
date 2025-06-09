
// This file can be removed or repurposed.
// The main dashboard content is now served from src/app/page.tsx
// For now, let's make it redirect to the home page (which is the dashboard)
// to avoid confusion if users have old bookmarks.

import { redirect } from 'next/navigation';

export default function DashboardPage() {
  redirect('/');
  // Or, if you want to keep this route but show the same content:
  // import { AppHeader } from "@/components/AppHeader";
  // import { DashboardDisplay } from "@/components/DashboardDisplay";
  // return (
  //   <>
  //     <AppHeader />
  //     <main className="flex-grow flex flex-col items-center py-8 px-4 bg-muted/30">
  //       <DashboardDisplay />
  //     </main>
  //   </>
  // );
}

    