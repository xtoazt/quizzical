
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
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

// Helper function to apply theme
function applyUpdatedTheme(themeValue: string) {
  const root = window.document.documentElement;
  // Define all base theme names that are applied as classes
  const baseThemes = ['theme-blue', 'theme-purple', 'theme-green', 'theme-mocha', 'theme-mono-light', 'theme-mono-dark'];
  // Remove all base themes and the main 'dark' class to start fresh
  root.classList.remove(...baseThemes, 'dark');

  if (themeValue === 'system') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
      root.classList.add('dark');
      root.classList.add('theme-blue'); // Default system dark theme base
    } else {
      root.classList.add('theme-blue'); // Default system light theme base
    }
  } else {
    // themeValue could be "theme-purple" (light), "dark theme-blue" (dark), or "theme-mono-dark" (dark by itself)
    
    if (themeValue.includes('dark')) { // True for "dark theme-blue" and "theme-mono-dark"
      root.classList.add('dark'); // Apply the global .dark class
      
      // Extract the base theme name.
      // For "dark theme-blue", themeName becomes "theme-blue".
      // For "theme-mono-dark", themeName remains "theme-mono-dark" (as replace does nothing).
      const themeName = themeValue.replace('dark ', ''); 
      if (baseThemes.includes(themeName)) { // Ensure it's a known base theme
        root.classList.add(themeName);
      }
    } else { 
      // This is for light themes like "theme-blue", "theme-purple", "theme-mono-light"
      if (baseThemes.includes(themeValue)) { // Ensure it's a known base theme
         root.classList.add(themeValue);
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
