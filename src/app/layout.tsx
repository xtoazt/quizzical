
"use client";

import { useEffect, useState } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { UserNamePromptDialog } from '@/components/UserNamePromptDialog';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Helper function to apply theme
function applyThemeToDocument(themeValue: string | null) {
  if (typeof window === 'undefined') return; // Ensure this only runs client-side
  const root = window.document.documentElement;
  const baseThemes = ['theme-blue', 'theme-purple', 'theme-green', 'theme-mocha', 'theme-mono-light', 'theme-mono-dark'];
  root.classList.remove(...baseThemes, 'dark');

  if (!themeValue || themeValue === 'system') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
      root.classList.add('dark');
      root.classList.add('theme-blue'); // Default system dark
    } else {
      root.classList.add('theme-blue'); // Default system light
    }
  } else {
    if (themeValue.includes('dark ')) { // e.g., "dark theme-blue"
      root.classList.add('dark');
      const baseThemeName = themeValue.split(' ')[1]; // "theme-blue"
      if (baseThemes.includes(baseThemeName)) {
        root.classList.add(baseThemeName);
      }
    } else if (baseThemes.includes(themeValue)) { // e.g., "theme-mono-dark" or "theme-purple"
      if (themeValue.includes('mono-dark')) { // Special case for standalone dark theme
          root.classList.add('dark');
      }
      root.classList.add(themeValue);
    } else {
        root.classList.add('theme-blue'); // Fallback
    }
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);
  const [theme] = useLocalStorage<string>('theme', 'system'); // Removed setThemeInStorage as it's not directly used here for setting
  const [userName, setUserName] = useLocalStorage<string | null>('quizzicalai_userName', null);
  const [isNamePromptOpen, setIsNamePromptOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      applyThemeToDocument(theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (mounted && !userName) {
      setIsNamePromptOpen(true);
    }
  }, [mounted, userName]);

  // Removed the redundant storage listener for 'theme' and 'quizzicalai_userName'
  // as useLocalStorage now handles its own cross-tab/window synchronization.
  

  const handleNameSave = (name: string) => {
    setUserName(name);
    setIsNamePromptOpen(false);
  };

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <title>QuizzicalAI</title>
        <meta name="description" content="AI Powered Quiz Generator and Tutor" />
        {/* Favicon link would go here, e.g., <link rel="icon" href="/favicon.ico" /> */}
        {/* For now, I will not add a placeholder favicon as I cannot generate image files */}
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        {children}
        <Toaster />
        {mounted && (
            <UserNamePromptDialog
                isOpen={isNamePromptOpen}
                onClose={() => setIsNamePromptOpen(false)}
                onSave={handleNameSave}
            />
        )}
      </body>
    </html>
  );
}
