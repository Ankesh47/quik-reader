'use client';

import { useState } from 'react';
import { TextInput } from '@/components/TextInput';
import { Reader } from '@/components/Reader';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function Home() {
  const [words, setWords] = useState<string[]>([]);
  const [mode, setMode] = useState<'input' | 'reading'>('input');

  const handleWordsProcessed = (newWords: string[]) => {
    setWords(newWords);
    setMode('reading');
  };

  const handleBack = () => {
    setMode('input');
    // Optional: clear words if you want, or keep them for re-reading
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300">
      <ThemeSwitcher />
      <header className="absolute top-4 left-4">
        <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">Focal.</h1>
      </header>

      {mode === 'input' ? (
        <TextInput onWordsProcessed={handleWordsProcessed} />
      ) : (
        <Reader words={words} onBack={handleBack} />
      )}
    </main>
  );
}
