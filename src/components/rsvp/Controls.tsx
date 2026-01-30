import React from 'react';

interface ControlsProps {
    isPlaying: boolean;
    onTogglePlay: () => void;
    wpm: number;
    onWpmChange: (wpm: number) => void;
}

export function Controls({ isPlaying, onTogglePlay, wpm, onWpmChange }: ControlsProps) {
    return (
        <div className="flex items-center justify-between">
            <button
                onClick={onTogglePlay}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-foreground text-background hover:scale-105 transition-transform shadow-lg"
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
                    onChange={(e) => onWpmChange(Number(e.target.value))}
                    className="w-48 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                />
            </div>
        </div>
    );
}
