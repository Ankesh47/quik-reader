import { getAllStories } from '@/actions/story';
import { deleteStory } from '@/actions/story';
import Link from 'next/link';
import { logout } from '@/actions/auth';

export default async function AdminPage() {
    const stories = await getAllStories();

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-red-600">Admin Panel</h1>
                    <p className="text-muted-foreground">Manage library content</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/dashboard" className="px-4 py-2 border border-border rounded-md hover:bg-muted transition">
                        Wait, Go Back
                    </Link>
                    <form action={logout}>
                        <button className="px-4 py-2 border border-border rounded-md hover:bg-muted transition">
                            Logout
                        </button>
                    </form>
                </div>
            </header>

            <div className="flex justify-end mb-6">
                <Link href="/admin/add" className="bg-foreground text-background px-6 py-2 rounded-lg font-medium hover:opacity-90">
                    + Add New Story
                </Link>
            </div>

            <div className="bg-muted/10 rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-medium">Title</th>
                            <th className="p-4 font-medium">Difficulty</th>
                            <th className="p-4 font-medium">Words</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stories.map(story => (
                            <tr key={story._id} className="border-b border-border last:border-0 hover:bg-muted/20">
                                <td className="p-4">{story.title}</td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${story.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                                        story.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {story.difficulty}
                                    </span>
                                </td>
                                <td className="p-4 text-muted-foreground">{story.contentLength}</td>
                                <td className="p-4 text-right">
                                    <form action={deleteStory.bind(null, story._id)}>
                                        <button className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {stories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">No stories yet. Add one!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
