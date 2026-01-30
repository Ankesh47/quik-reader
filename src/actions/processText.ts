'use server';

import { splitTextIntoWords } from '@/lib/rsvp-utils';

export async function processText(_: { words: string[]; error: string | null } | null, formData: FormData) {
    const text = formData.get('text');
    if (!text || typeof text !== 'string') {
        return { words: [], error: 'No text provided' };
    }

    const words = splitTextIntoWords(text);

    if (words.length === 0) {
        return { words: [], error: 'No words found' };
    }

    return { words, error: null };
}
