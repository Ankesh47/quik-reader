import { getAllStories } from '@/actions/story';
import Link from 'next/link';
import { logout } from '@/actions/auth';
import { getSession } from '@/lib/auth';

export default async function DashboardPage() {
    const stories = await getAllStories();
    const session = await getSession();
    const isAdmin = (session as any)?.role === 'admin';

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Focal Library</h1>
                    <p className="text-muted-foreground">Welcome back, {(session as any)?.username}!</p>
                </div>
                <div className="flex gap-4">
                    {isAdmin && (
                        <Link href="/admin" className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 transition">
                            Admin Panel
                        </Link>
                    )}
                    <form action={logout}>
                        <button className="px-4 py-2 border border-border rounded-md hover:bg-muted transition">
                            Logout
                        </button>
                    </form>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Paste & Practice Card */}
                <Link href="/practice/free" className="group relative bg-muted/20 border border-border rounded-xl p-6 hover:border-accent hover:bg-muted/30 transition-all flex flex-col justify-center items-center text-center min-h-[200px] border-dashed">
                    <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">✍️</span>
                    <h2 className="text-xl font-bold mb-2">My Own Text</h2>
                    <p className="text-sm text-muted-foreground">Paste any content to practice instantly.</p>
                </Link>

                {/* Story Cards */}
                {stories.map(story => (
                    <Link key={story._id} href={`/practice/${story._id}`} className="group bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-accent transition-all flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${story.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                    story.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                }`}>
                                {story.difficulty}
                            </span>
                            <span className="text-xs text-muted-foreground">~{story.contentLength} words</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{story.title}</h2>
                        <div className="mt-auto pt-4 flex justify-between items-center text-sm text-muted-foreground">
                            <span>Level {story.level}</span>
                            <span className="group-hover:translate-x-1 transition-transform">Read →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
