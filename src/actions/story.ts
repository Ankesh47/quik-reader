'use server';

import { connectDB } from '@/lib/db';
import Story from '@/models/Story';

export async function getAllStories() {
    try {
        await connectDB();
        const stories = await Story.find({}).sort({ createdAt: -1 }); // Newest first
        return stories.map(story => ({
            _id: story._id.toString(),
            title: story.title,
            level: story.level,
            difficulty: story.difficulty,
            contentLength: story.content.split(' ').length
        }));
    } catch (error) {
        console.error('Fetch all stories error:', error);
        return [];
    }
}

export async function getStoryById(id: string) {
    try {
        await connectDB();
        const story = await Story.findById(id);
        if (!story) return null;
        return {
            title: story.title,
            content: story.content,
            level: story.level,
            difficulty: story.difficulty
        };
    } catch (error) {
        return null;
    }
}

export async function createStory(prevState: any, formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const difficulty = formData.get('difficulty') as string;
    // Map difficulty to level for now, or add input
    const level = difficulty === 'Beginner' ? 1 : difficulty === 'Intermediate' ? 2 : 3;

    try {
        await connectDB();
        await Story.create({
            title,
            content,
            difficulty,
            level
        });
    } catch (e) {
        return { error: 'Failed to create story' };
    }

    // Using redirect inside try/catch with Next.js actions behaves oddly sometimes if it throws NEXT_REDIRECT, 
    // but in newer Next.js it's fine or we do it after.
    // Let's return success and let client redirect or use redirect here.
    const { redirect } = await import('next/navigation');
    redirect('/admin');
}

export async function deleteStory(id: string) {
    try {
        await connectDB();
        await Story.findByIdAndDelete(id);
        const { revalidatePath } = await import('next/cache');
        revalidatePath('/admin');
        revalidatePath('/dashboard');
    } catch (e) {
        console.error(e);
    }
}
