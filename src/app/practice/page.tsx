'use client';

import React, { useState, useEffect } from 'react';
import { useRSVP } from '@/hooks/useRSVP';
import { WordDisplay } from '@/components/rsvp/WordDisplay';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { fetchStory } from '@/actions/getStory';

const DEFAULT_CONTENT = `
Welcome to Focal. 
The database seems empty or unreachable, so here is some default text to practice with.
Speed reading is a skill that allows you to absorb information faster. 
Focus on the red character in the center of the screen.
Toggle the theme to find what is comfortable for your eyes.
`;

export default function PracticePage() {
    const [wpm, setWpm] = useState(300);
    const [isPlaying, setIsPlaying] = useState(false);
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState<string>('Loading Story...');
    const [error, setError] = useState<string | null>(null);

    // Fetch story on mount
    useEffect(() => {
        async function loadStory() {
            try {
                setLoading(true);
                // Defaulting to level 1 for now
                const result = await fetchStory(1);

                if (result.error) {
                    // If error (e.g. no DB conn), fallback to dummy
                    console.warn(result.error);
                    setError(result.error);
                    setContent(DEFAULT_CONTENT.replace(/\n/g, ' ')); // Clean up newlines for smoother reading
                    setTitle('Practice Mode (Offline)');
                } else if (result.content) {
                    setContent(result.content.replace(/\n/g, ' '));
                    setTitle(result.title || 'Untitled Story');
                }
            } catch (err) {
                console.error(err);
                setContent(DEFAULT_CONTENT.replace(/\n/g, ' ')); // Clean up newlines for smoother reading
                setTitle('Error Loading Story');
            } finally {
                setLoading(false);
            }
        }
        loadStory();
    }, []);

    // Hook controls the engine
    const { currentWord, progress, isFinished, restart } = useRSVP({
        content: content,
        wpm,
        isPlaying
    });

    // Auto-pause when finished
    useEffect(() => {
        if (isFinished) setIsPlaying(false);
    }, [isFinished]);

    const togglePlay = () => {
        if (isFinished) {
            restart();
            setIsPlaying(true);
        } else {
            setIsPlaying(p => !p);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-8 w-64 bg-muted rounded"></div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300 p-8">
            <ThemeSwitcher />

            {/* Header */}
            <header className="absolute top-4 left-4">
                <h1 className="text-2xl font-bold tracking-tighter">Focal Practice</h1>
                <p className="text-sm text-muted-foreground">{title}</p>
            </header>

            <div className="w-full max-w-4xl flex flex-col gap-12">

                {/* The Stage */}
                <div className="bg-muted/30 rounded-2xl p-12 shadow-sm border border-border min-h-[300px] flex flex-col justify-center items-center relative">
                    <WordDisplay word={currentWord} />

                    {isFinished && (
                        <div className="absolute bottom-4 text-center text-muted-foreground animate-pulse">
                            Finished! Press Play to restart.
                        </div>
                    )}

                    {error && (
                        <div className="absolute top-4 text-xs text-amber-500">
                            Using offline text.
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent transition-all duration-200 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between">

                        {/* Play/Pause Button */}
                        <button
                            onClick={togglePlay}
                            className="w-16 h-16 flex items-center justify-center rounded-full bg-foreground text-background hover:scale-105 transition-transform cursor-pointer shadow-lg"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <div className="flex gap-1">
                                    <span className="block w-1.5 h-5 bg-background rounded-sm" />
                                    <span className="block w-1.5 h-5 bg-background rounded-sm" />
                                </div>
                            ) : (
                                <span className="block w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-background border-b-[10px] border-b-transparent ml-1" />
                            )}
                        </button>

                        {/* WPM Slider */}
                        <div className="flex flex-col items-end gap-2">
                            <span className="text-3xl font-bold font-mono tracking-tight">
                                {wpm} <span className="text-sm font-sans text-muted-foreground font-medium">WPM</span>
                            </span>
                            <input
                                type="range"
                                min="200"
                                max="1000"
                                step="10"
                                value={wpm}
                                onChange={(e) => setWpm(Number(e.target.value))}
                                className="w-48 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
