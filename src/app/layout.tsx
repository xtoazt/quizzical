
"use client"; // Required for useEffect and localStorage access

import { useEffect, useState } from 'react';
import type { Metadata } from 'next'; // Metadata can still be used but might be static
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Static metadata for now, as dynamic metadata from client component is complex
// export const metadata: Metadata = {
// title: 'QuizzicalAI',
// description: 'AI Powered Quiz Generator and Tutor',
// };

// Helper function to apply theme
function applyTheme(theme: string) {
  const root = window.document.documentElement;
  root.classList.remove('theme-blue', 'theme-purple', 'theme-green', 'theme-mocha', 'theme-mono-light', 'theme-mono-dark', 'dark');
  
  if (theme === 'system') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
      root.classList.add('dark'); // Apply general dark mode
      // Optionally, apply a default dark theme like 'theme-blue' or 'theme-mono-dark'
      root.classList.add('theme-blue'); // Default to blue for system dark
    } else {
      root.classList.add('theme-blue'); // Default to blue for system light
    }
  } else if (theme.includes('dark')) {
    root.classList.add('dark');
    root.classList.add(theme);
  } else {
    root.classList.add(theme);
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') || 'system';
    applyTheme(storedTheme);
  }, []);


  // This effect listens to localStorage changes from other tabs/windows for theme
  useEffect(() => {
    if (!mounted) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme' && event.newValue) {
        applyTheme(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [mounted]);
  
  if (!mounted) {
      // To prevent FOUC (Flash of Unstyled Content) or theme flicker,
      // you might return null or a basic loading skeleton until theme is applied.
      // However, for simplicity, we'll render children, but theme might briefly flicker.
      // A script in <head> is the most robust way to prevent flicker, but harder with app router's server components.
  }

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <title>QuizzicalAI</title>
        <meta name="description" content="AI Powered Quiz Generator and Tutor" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

    