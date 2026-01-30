export interface ProcessedWord {
    leftPart: string;
    highlight: string;
    rightPart: string;
    index: number;
}

/**
 * Calculates the Optimal Recognition Point (ORP) index based on word length.
 * 
 * Logic:
 * - Length 0-1: Index 0
 * - Length 2-5: Index 1 (2nd letter)
 * - Length 6-9: Index 2 (3rd letter)
 * - Length 10-13: Index 3 (4th letter)
 * - Length > 13: Index 4 (5th letter)
 */
export function getORPIndex(length: number): number {
    if (length <= 1) return 0;
    if (length <= 5) return 1;
    if (length <= 9) return 2;
    if (length <= 13) return 3;
    return 4;
}

/**
 * Processes a word to split it into parts for RSVP display around the ORP.
 * 
 * @param word - The word to process. CAUTION: Expects a single word, not a sentence.
 * @returns ProcessedWord object with left, highlight, and right parts.
 */
export function processWord(word: string): ProcessedWord {
    // Edge Case: Empty string or null/undefined (though strict types verify string)
    if (!word) {
        return { leftPart: '', highlight: '', rightPart: '', index: 0 };
    }

    const length = word.length;
    const index = getORPIndex(length);

    // Safety check: Ensure index is within bounds (logic guarantees this, but good for robustness)
    const safeIndex = Math.min(index, length - 1);

    const leftPart = word.slice(0, safeIndex);
    const highlight = word[safeIndex];
    const rightPart = word.slice(safeIndex + 1);

    return {
        leftPart,
        highlight,
        rightPart,
        index: safeIndex
    };
}

// -----------------------------------------------------------------------------
// TESTS (Copy-paste into a .test.ts file or run via Vitest)
// -----------------------------------------------------------------------------
/*
import { describe, it, expect } from 'vitest';
import { processWord } from './rsvp-engine';

describe('processWord', () => {
    it('handles empty strings', () => {
        expect(processWord('')).toEqual({ leftPart: '', highlight: '', rightPart: '', index: 0 });
    });

    it('handles single characters (Length 1 -> Index 0)', () => {
        expect(processWord('a')).toEqual({ leftPart: '', highlight: 'a', rightPart: '', index: 0 });
    });

    it('handles short words (Length 2-5 -> Index 1)', () => {
        // "is" (len 2) -> i 's'
        expect(processWord('is')).toEqual({ leftPart: 'i', highlight: 's', rightPart: '', index: 1 });
        // "hello" (len 5) -> h 'e' llo
        expect(processWord('hello')).toEqual({ leftPart: 'h', highlight: 'e', rightPart: 'llo', index: 1 });
    });

    it('handles medium words (Length 6-9 -> Index 2)', () => {
        // "coding" (len 6) -> co 'd' ing
        expect(processWord('coding')).toEqual({ leftPart: 'co', highlight: 'd', rightPart: 'ing', index: 2 });
        // "wonderful" (len 9) -> wo 'n' derful
        expect(processWord('wonderful')).toEqual({ leftPart: 'wo', highlight: 'n', rightPart: 'derful', index: 2 });
    });

    it('handles long words (Length 10-13 -> Index 3)', () => {
        // "javascript" (len 10) -> jav 'a' script
        expect(processWord('javascript')).toEqual({ leftPart: 'jav', highlight: 'a', rightPart: 'script', index: 3 });
    });

    it('handles extra long words (Length > 13 -> Index 4)', () => {
        // "internationalization" (len 20) -> inte 'r' nationalization
        expect(processWord('internationalization')).toEqual({ leftPart: 'inte', highlight: 'r', rightPart: 'nationalization', index: 4 });
    });

    it('handles words with punctuation', () => {
        // "hello." (len 6) -> he 'l' lo.  (Index 2)
        expect(processWord('hello.')).toEqual({ leftPart: 'he', highlight: 'l', rightPart: 'lo.', index: 2 });
    });
});
*/
