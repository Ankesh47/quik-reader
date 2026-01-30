import { getStoryById } from '@/actions/story';
import { notFound } from 'next/navigation';
import ReadingSession from '@/components/ReadingSession';

export default async function StoryPracticePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const story = await getStoryById(resolvedParams.id);

    if (!story) {
        notFound();
    }

    return (
        <ReadingSession
            initialContent={story.content}
            title={story.title}
        />
    );
}
