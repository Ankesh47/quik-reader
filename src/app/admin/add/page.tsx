'use client';

import { useActionState } from 'react';
import { createStory } from '@/actions/story';
import Link from 'next/link';

export default function AddStoryPage() {
    const [state, formAction, isPending] = useActionState(createStory, { error: '' });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-muted/30 p-8 rounded-2xl border border-border shadow-sm">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Add New Story</h1>
                    <Link href="/admin" className="text-sm text-muted-foreground hover:underline">Cancel</Link>
                </div>

                <form action={formAction} className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Title</label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="w-full p-2 rounded bg-background border border-border"
                                placeholder="The Great Gatsby"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Difficulty</label>
                            <select
                                name="difficulty"
                                className="w-full p-2 rounded bg-background border border-border"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Content</label>
                        <textarea
                            name="content"
                            required
                            rows={10}
                            className="w-full p-2 rounded bg-background border border-border resize-none font-mono text-sm"
                            placeholder="Paste the story text here..."
                        />
                    </div>

                    {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-foreground text-background py-3 rounded font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        {isPending ? 'Saving...' : 'Create Story'}
                    </button>
                </form>
            </div>
        </div>
    );
}
