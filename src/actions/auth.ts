'use server';

import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function register(_: { error?: string } | null, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
        return { error: 'Username and password are required' };
    }

    try {
        await connectDB();
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return { error: 'Username already taken' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        const token = await signToken({ userId: user._id, username: user.username, role: user.role });

        (await cookies()).set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/'
        });

    } catch (err) {
        console.error('Registration error:', err);
        return { error: 'Failed to create account' };
    }

    redirect('/dashboard');
}

export async function login(_: { error?: string } | null, formData: FormData) {
    // const start = Date.now();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
        // const dbStart = Date.now();
        await connectDB();
        // console.log(`[Perf] DB Connect: ${Date.now() - dbStart}ms`);

        // const userStart = Date.now();
        const user = await User.findOne({ username });
        // console.log(`[Perf] User Fetch: ${Date.now() - userStart}ms`);

        if (!user || !user.password) {
            return { error: 'Invalid credentials' };
        }

        // const hashStart = Date.now();
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log(`[Perf] Bcrypt Compare: ${Date.now() - hashStart}ms`);

        if (!isMatch) {
            return { error: 'Invalid credentials' };
        }

        // const tokenStart = Date.now();
        const token = await signToken({ userId: user._id, username: user.username, role: user.role });
        // console.log(`[Perf] Token Sign: ${Date.now() - tokenStart}ms`);

        (await cookies()).set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/'
        });

        // console.log(`[Perf] Total Login: ${Date.now() - start}ms`);

    } catch (err) {
        console.error('Login error:', err);
        return { error: 'Login failed' };
    }

    redirect('/dashboard');
}

export async function logout() {
    (await cookies()).delete('token');
    redirect('/login');
}
