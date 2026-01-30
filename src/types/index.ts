export interface Story {
    _id: string;
    title: string;
    content: string;
    level: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    contentLength?: number;
    createdAt?: string;
}

export interface User {
    _id: string;
    username: string;
    role: 'user' | 'admin';
}

export interface AuthSession {
    userId: string;
    username: string;
    role: 'user' | 'admin';
    iat?: number;
    exp?: number;
}

export interface ServerActionResponse {
    error?: string;
    success?: boolean;
}
