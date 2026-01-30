'use client';

import React, { useState } from 'react';
import { useRSVP } from '@/hooks/useRSVP';
import { WordDisplay } from '@/components/rsvp/WordDisplay';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { TextInput } from '@/components/TextInput';
import { Controls } from '@/components/rsvp/Controls';
import { ProgressBar } from '@/components/rsvp/ProgressBar';
import Link from 'next/link';

interface ReadingSessionProps {
    initialContent: string;
    title: string;
}

export default function ReadingSession({ initialContent, title }: ReadingSessionProps) {
    const [content, setContent] = useState<string>(initialContent);
    const [mode, setMode] = useState<'input' | 'reading'>(initialContent ? 'reading' : 'input');

    // RSVP State
    const [wpm, setWpm] = useState(300);
    const [isPlaying, setIsPlaying] = useState(false);

    // Engine
    const { currentWord, progress, isFinished, restart } = useRSVP({
        content: content,
        wpm,
        isPlaying
    });

    React.useEffect(() => {
        if (isFinished) setIsPlaying(false);
    }, [isFinished]);

    const handleInput = (words: string[]) => {
        setContent(words.join(' '));
        setMode('reading');
    };

    const togglePlay = () => {
        if (isFinished) {
            restart();
            setIsPlaying(true);
        } else {
            setIsPlaying(p => !p);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
            <ThemeSwitcher />

            <div className="absolute top-4 left-4 flex gap-4 items-center">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                    ← Back to Library
                </Link>
                <div className="h-4 w-[1px] bg-border"></div>
                <h1 className="font-bold">{title}</h1>
            </div>

            {mode === 'input' ? (
                <div className="w-full max-w-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-center">Paste Your Text</h2>
                    <TextInput onWordsProcessed={handleInput} />
                </div>
            ) : (
                <div className="w-full max-w-4xl flex flex-col gap-12">
                    <div className="bg-muted/30 rounded-2xl p-12 shadow-sm border border-border min-h-[300px] flex flex-col justify-center items-center relative">
                        <WordDisplay word={currentWord} />
                        {isFinished && (
                            <div className="absolute bottom-4 text-center text-muted-foreground animate-pulse">
                                Finished! Press Play to restart.
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
                        <ProgressBar progress={progress} />
                        <Controls
                            isPlaying={isPlaying}
                            onTogglePlay={togglePlay}
                            wpm={wpm}
                            onWpmChange={setWpm}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
