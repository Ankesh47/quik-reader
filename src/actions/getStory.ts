'use server';

import { connectDB } from '@/lib/db';
import Story from '@/models/Story';

interface FetchStoryResult {
    title?: string;
    content?: string;
    level?: number;
    difficulty?: string;
    error?: string;
}

export async function fetchStory(level: number = 1): Promise<FetchStoryResult> {
    try {
        await connectDB();

        // Find a random story matching the level
        // In a real app we might want more complex logic (not read before, etc.)
        // For now, simple random sample using aggregate
        const stories = await Story.aggregate([
            { $match: { level: level } },
            { $sample: { size: 1 } }
        ]);

        if (!stories || stories.length === 0) {
            // Fallback if no stories found for this level
            return { error: 'No stories found for this level.' };
        }

        const story = stories[0];

        // Identify serialized fields to ensure we return plain objects
        return {
            title: story.title,
            content: story.content,
            level: story.level,
            difficulty: story.difficulty,
        };

    } catch (error) {
        console.error('Error fetching story:', error);
        return { error: 'Failed to fetch story.' };
    }
}
