import { useState, useEffect, useRef, useMemo } from 'react';

interface UseRSVPProps {
    content: string;
    wpm: number;
    isPlaying: boolean;
}

interface UseRSVPReturn {
    currentWord: string;
    progress: number; // 0 to 100
    isFinished: boolean;
    restart: () => void;
}

export function useRSVP({ content, wpm, isPlaying }: UseRSVPProps): UseRSVPReturn {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Split content into words only when content changes
    const words = useMemo(() => {
        return content.trim().split(/\s+/).filter(w => w.length > 0);
    }, [content]);

    // Refs for timing to avoid re-renders
    // We need to store the accumulator of time to handle frame deltas accurately
    const lastFrameTimeRef = useRef<number>(0);
    const animationFrameRef = useRef<number>(0);

    useEffect(() => {
        // If empty content, do nothing
        if (words.length === 0) return;

        // Reset if content changes? 
        // The prompt implies content is static for a session, but if it changes we likely want to reset.
        // Ideally we'd have a separate 'reset' trigger, but for now let's reset if words length changes drastically or just rely on manual restart.
        // Actually, watching `words` in dependency array of effect will re-setup the loop, ensuring we use fresh words.
    }, [words]);

    useEffect(() => {
        if (!isPlaying || isFinished || words.length === 0) {
            cancelAnimationFrame(animationFrameRef.current);
            lastFrameTimeRef.current = 0; // Reset last time so next play starts fresh
            return;
        }

        const animate = (time: number) => {
            if (lastFrameTimeRef.current === 0) {
                lastFrameTimeRef.current = time;
            }

            const deltaTime = time - lastFrameTimeRef.current;
            const msPerWord = 60000 / wpm;

            if (deltaTime >= msPerWord) {
                // Enough time passed for at least one word
                // In case of lag, we could skip words, but for reading it's better to show every word 
                // even if it means slowing down. So we just advance by 1.
                // OR we can advance by Math.floor(deltaTime / msPerWord) for "catch up" logic, 
                // but that's bad for reading. Strict 1 word advance is safer for comprehension.

                setCurrentIndex((prev) => {
                    if (prev >= words.length - 1) {
                        setIsFinished(true);
                        return prev;
                    }
                    return prev + 1;
                });

                // Reset accumulator. 
                // We subtract msPerWord to keep the "extra" time for the next frame (preserves strict WPM average)
                // rather than resetting to 'time', which would drift slower.
                // However, if we only advance 1 word, we should only subtract 1 * msPerWord.
                lastFrameTimeRef.current += msPerWord;

                // Safety: if we are WAY behind (e.g. tab backgrounded), jump to current time to avoid fast-forwarding
                if (time - lastFrameTimeRef.current > 1000) {
                    lastFrameTimeRef.current = time;
                }
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isPlaying, isFinished, wpm, words.length]);

    const restart = () => {
        setCurrentIndex(0);
        setIsFinished(false);
        lastFrameTimeRef.current = 0;
    };

    const currentWord = words[currentIndex] || '';
    const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;

    return {
        currentWord,
        progress,
        isFinished,
        restart
    };
}
