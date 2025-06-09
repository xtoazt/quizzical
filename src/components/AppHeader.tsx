
"use client";
import { BookOpenText, LayoutDashboard, MessageSquareText, CheckSquare, Sparkles, Settings } from 'lucide-react';
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
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

// RootLayout is now responsible for applying the theme from localStorage.
// AppHeader just sets the theme value in localStorage.

export function AppHeader() {
  const [theme, setTheme] = useLocalStorage<string>('theme', 'system');

  // This useEffect is to ensure that if the theme is changed programmatically 
  // or by another component, this component's state reflects it.
  // The actual application of the theme to the DOM is handled by RootLayout.
  useEffect(() => {
    // No direct DOM manipulation here. RootLayout handles it.
    // This effect could be used if AppHeader needed to react to theme changes
    // for its own internal styling, but it doesn't currently.
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme); // This updates localStorage and triggers RootLayout's effect
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
