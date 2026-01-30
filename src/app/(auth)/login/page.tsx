'use client';

import { useActionState } from 'react';
import { login } from '@/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, { error: '' });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-muted/30 p-8 rounded-2xl border border-border shadow-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Login to Focal</h1>

                <form action={formAction} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full p-2 rounded bg-background border border-border"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full p-2 rounded bg-background border border-border"
                        />
                    </div>

                    {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-2 bg-foreground text-background py-2 rounded font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Don't have an account? <Link href="/register" className="text-foreground underline">Register</Link>
                </p>
            </div>
        </div>
    );
}
