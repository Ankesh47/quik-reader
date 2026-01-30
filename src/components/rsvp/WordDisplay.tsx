import React, { useMemo } from 'react';
import { processWord } from '@/lib/rsvp-engine';

interface WordDisplayProps {
    word: string;
}

export function WordDisplay({ word }: WordDisplayProps) {
    // Memoize the processed word to avoid recalculation on re-renders if the word hasn't changed
    const { leftPart, highlight, rightPart } = useMemo(() => processWord(word), [word]);

    return (
        <div className="flex flex-col items-center justify-center p-4">
            {/* Fixed height container to prevent layout shift */}
            <div className="relative flex items-center justify-center h-32 w-full max-w-3xl overflow-hidden pointer-events-none select-none">

                {/* Alignment Container */}
                <div className="flex items-baseline font-mono text-5xl md:text-7xl leading-none">

                    {/* Left Part: Flex justify-end to push text against the center */}
                    <span className="flex justify-end w-[50vw] text-right text-foreground">
                        {leftPart}
                    </span>

                    {/* Highlight: Fixed width character centered */}
                    <span className="flex justify-center w-[1ch] text-red-500 font-bold shrink-0">
                        {highlight}
                    </span>

                    {/* Right Part: Flex justify-start to push text away from center */}
                    <span className="flex justify-start w-[50vw] text-left text-foreground">
                        {rightPart}
                    </span>

                </div>

                {/* Optional: Visual Guide (Vertical Line) - can be toggled later */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-300/20 -translate-x-1/2" />
                <div className="absolute top-0 bottom-0 left-1/2 w-[0.1rem] bg-red-500/10 -translate-x-1/2" />


            </div>
        </div>
    );
}
