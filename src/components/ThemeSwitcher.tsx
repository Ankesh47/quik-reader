'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'sepia';

export function ThemeSwitcher() {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('theme-light', 'theme-dark', 'theme-sepia');
        root.classList.add(`theme-${theme}`);

        // Also update data-theme for generic tailwind dark mode if needed
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    // Prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div className="absolute top-4 right-4 flex gap-2 bg-muted/50 p-1 rounded-full backdrop-blur-sm z-50">
            {(['light', 'dark', 'sepia'] as Theme[]).map((t) => (
                <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-8 h-8 rounded-full border border-border transition-all ${theme === t ? 'ring-2 ring-accent scale-110 z-10' : 'opacity-70 hover:opacity-100'
                        }`}
                    style={{
                        backgroundColor: t === 'light' ? '#fff' : t === 'dark' ? '#000' : '#f4ecd8',
                        color: t === 'light' ? '#000' : t === 'dark' ? '#fff' : '#5b4636'
                    }}
                    aria-label={`Switch to ${t} theme`}
                >
                    {t === 'light' && '☀'}
                    {t === 'dark' && '☾'}
                    {t === 'sepia' && '☕'}
                </button>
            ))}
        </div>
    );
}
