'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl bg-foreground/5 border border-foreground/10 animate-pulse" />;
  }

  return (
    <button
      id="theme-toggle"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="w-9 h-9 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center hover:bg-foreground/10 hover:border-emerald-500/40 transition-all group"
    >
      {theme === 'dark'
        ? <Sun className="w-[18px] h-[18px] text-foreground/50 group-hover:text-emerald-400 transition-colors" />
        : <Moon className="w-[18px] h-[18px] text-foreground/50 group-hover:text-emerald-600 transition-colors" />
      }
    </button>
  );
}
