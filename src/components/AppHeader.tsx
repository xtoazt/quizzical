import { BookOpenText } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <BookOpenText className="h-7 w-7" />
          <h1 className="text-2xl font-headline font-semibold">
            QuizzicalAI
          </h1>
        </Link>
        {/* Navigation items can be added here if needed */}
      </div>
    </header>
  );
}
