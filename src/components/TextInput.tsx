'use client';

import { useActionState, useEffect } from 'react';
import { processText } from '@/actions/processText';

interface TextInputProps {
    onWordsProcessed: (words: string[]) => void;
}

const initialState = {
    words: [] as string[],
    error: null as string | null
};

export function TextInput({ onWordsProcessed }: TextInputProps) {
    const [state, formAction, isPending] = useActionState(processText, initialState);

    useEffect(() => {
        if (state.words && state.words.length > 0) {
            onWordsProcessed(state.words);
        }
    }, [state.words, onWordsProcessed]);

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <form action={formAction} className="flex flex-col gap-4">
                <textarea
                    name="text" // matches FormData.get('text') in Server Action
                    placeholder="Paste your text here to start speed reading..."
                    className="w-full h-48 p-4 rounded-lg bg-muted text-foreground border border-muted-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent resize-none transition-all"
                    required
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2 bg-foreground text-background font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                        {isPending ? 'Processing...' : 'Start Reading'}
                    </button>
                </div>
                {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
            </form>
        </div>
    );
}
