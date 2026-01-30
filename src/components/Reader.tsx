'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { getOptimalRecognitionPoint } from '@/lib/rsvp-utils';

interface ReaderProps {
    words: string[];
    onBack: () => void;
}

export function Reader({ words, onBack }: ReaderProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [wpm, setWpm] = useState(300);
    const [fontSize, setFontSize] = useState(4); // rem


    // Derived state for current word
    const currentWord = words[currentIndex] || '';
    const orpIndex = getOptimalRecognitionPoint(currentWord);

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();

        const renderLoop = (time: number) => {
            if (!isPlaying) return;

            const msPerWord = 60000 / wpm;
            const deltaTime = time - lastTime;

            if (deltaTime >= msPerWord) {
                setCurrentIndex(prev => {
                    if (prev >= words.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
                lastTime = time;
            }

            animationFrameId = requestAnimationFrame(renderLoop);
        };

        if (isPlaying) {
            lastTime = performance.now(); // Reset time on play start to avoid jump
            animationFrameId = requestAnimationFrame(renderLoop);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, wpm, words.length]);


    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Explicit type
        setWpm(Number(e.target.value));
    };

    // Split word for ORP display
    const leftPart = currentWord.slice(0, orpIndex);
    const centerChar = currentWord[orpIndex];
    const rightPart = currentWord.slice(orpIndex + 1);

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full max-w-4xl mx-auto p-4">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="absolute top-8 left-8 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
                ← Back
            </button>

            {/* Reader Display */}
            <div
                className="relative flex items-baseline justify-center font-mono mb-12 h-40 select-none w-full"
                style={{ fontSize: `${fontSize}rem` }}
            >
                {/* Guides for focus (optional, maybe add later) */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-muted-foreground/10 -translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-baseline">
                    <span className="text-right w-[1ch]">{/* Spacer for alignment if needed, or stick to flex */}</span>
                    <span className="text-foreground">{leftPart}</span>
                    <span className="text-accent font-bold" style={{ transform: 'scale(1.1)' }}>{centerChar}</span>
                    <span className="text-foreground">{rightPart}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-md flex flex-col gap-6">
                {/* Progress Bar */}
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent transition-all duration-100 ease-linear"
                        style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        onClick={togglePlay}
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-foreground text-background hover:scale-105 transition-transform cursor-pointer"
                    >
                        {isPlaying ? (
                            <span className="block w-4 h-4 bg-background rounded-sm" />
                        ) : (
                            <span className="block w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-background border-b-[10px] border-b-transparent ml-1" />
                        )}
                    </button>

                    <div className="flex flex-col items-end gap-2">
                        {/* WPM Control */}
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-xl font-bold font-mono">{wpm} <span className="text-xs font-sans text-muted-foreground">WPM</span></span>
                            <input
                                type="range"
                                min="200"
                                max="1000"
                                step="50"
                                value={wpm}
                                onChange={handleSliderChange}
                                className="w-32 accent-foreground cursor-pointer h-2"
                            />
                        </div>
                        {/* Font Size Control */}
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-bold font-mono">Size</span>
                            <input
                                type="range"
                                min="2"
                                max="8"
                                step="0.5"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                                className="w-32 accent-foreground cursor-pointer h-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="text-center text-muted-foreground font-mono text-sm">
                    Word {currentIndex + 1} / {words.length}
                </div>
            </div>
        </div>
    );
}
