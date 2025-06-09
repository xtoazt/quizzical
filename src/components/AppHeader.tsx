
"use client";
import { BookOpenText, LayoutDashboard, MessageSquareText, CheckSquare, Sparkles, Palette, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalStorage } from '@/hooks/useLocalStorage'; // Assuming you have this hook
import { useEffect } from 'react';

// Helper function to apply theme (can be moved to a util if used elsewhere)
function applyUpdatedTheme(theme: string) {
  const root = window.document.documentElement;
  const themes = ['theme-blue', 'theme-purple', 'theme-green', 'theme-mocha', 'theme-mono-light', 'theme-mono-dark'];
  root.classList.remove(...themes, 'dark');

  if (theme === 'system') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
      root.classList.add('dark');
      root.classList.add('theme-blue'); // Default dark theme
    } else {
      root.classList.add('theme-blue'); // Default light theme
    }
  } else {
    root.classList.add(theme);
    // Check if the selected theme is a dark variant and apply .dark class
    // This logic assumes dark themes contain "dark" in their name or are handled by their CSS
    if (theme === 'theme-mono-dark' || theme === 'dark.theme-blue' || theme === 'dark.theme-purple' || theme === 'dark.theme-green' || theme === 'dark.theme-mocha' ) {
        // The specific theme class already implies dark mode through its CSS definition (e.g. .dark.theme-x or .theme-mono-dark)
        // but we also need the global .dark for other shadcn/tailwind dark mode styles to work
        root.classList.add('dark');
    }
     // Ensure specific dark themes like theme-mono-dark apply the .dark class
    if (theme.startsWith('theme-mono-dark') || theme.endsWith('-dark')) { // A more generic check
      if (!root.classList.contains('dark')) {
        root.classList.add('dark');
      }
    }
  }
}


export function AppHeader() {
  const [theme, setTheme] = useLocalStorage<string>('theme', 'system');

  useEffect(() => {
    applyUpdatedTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <BookOpenText className="h-7 w-7" />
          <h1 className="text-2xl font-headline font-semibold">
            QuizzicalAI
          </h1>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/">
              <LayoutDashboard className="mr-2" />
              Dashboard
            </Link>
          </Button>
           <Button variant="ghost" asChild size="sm">
            <Link href="/create-quiz">
              <Sparkles className="mr-2" />
              Create Quiz
            </Link>
          </Button>
          <Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/study">
              <MessageSquareText className="mr-2" />
              Study Zone
            </Link>
          </Button>
          <Button variant="ghost" asChild size="sm" className="hidden md:inline-flex">
            <Link href="/solver">
              <CheckSquare className="mr-2" />
              Solver
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleThemeChange('system')}>System</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('theme-blue')}>Blue (Light)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('dark theme-blue')}>Blue (Dark)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('theme-purple')}>Purple (Light)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('dark theme-purple')}>Purple (Dark)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('theme-green')}>Green (Light)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('dark theme-green')}>Green (Dark)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('theme-mocha')}>Mocha (Light)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('dark theme-mocha')}>Mocha (Dark)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('theme-mono-light')}>Monochrome (Light)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('theme-mono-dark')}>Monochrome (Dark)</DropdownMenuItem>
               <DropdownMenuSeparator className="sm:hidden" />
                 <DropdownMenuItem asChild className="sm:hidden">
                    <Link href="/">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild className="sm:hidden">
                     <Link href="/study">
                        <MessageSquareText className="mr-2 h-4 w-4" /> Study Zone
                    </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild className="md:hidden">
                     <Link href="/solver">
                        <CheckSquare className="mr-2 h-4 w-4" /> Solver
                    </Link>
                 </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}

    