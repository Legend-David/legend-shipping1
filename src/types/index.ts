import { Request } from 'express';

export interface User {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
}

export interface AuthRequest extends Request {
    body: {
        email: string;
        password: string;
    }
}

export * from './User';