
import { BookOpenText, LayoutDashboard, MessageSquareText, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <BookOpenText className="h-7 w-7" />
          <h1 className="text-2xl font-headline font-semibold">
            QuizzicalAI
          </h1>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild size="sm">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/study">
              <MessageSquareText className="mr-2" />
              Study Zone
            </Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/solver">
              <CheckSquare className="mr-2" />
              Solver
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
