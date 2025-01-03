import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/User';
import { AuthError } from '../types/errors';
import { userModel } from '../models/User';

interface JwtPayloadWithUser {
    id: string;
    email: string;
}

export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'your-default-secret-key',
    expiresIn: '24h'
};

export const generateToken = (user: User): string => {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_CONFIG.secret,
        { expiresIn: JWT_CONFIG.expiresIn }
    );
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new AuthError('No authentication token provided', 401);
        }

        const decoded = jwt.verify(token, JWT_CONFIG.secret) as JwtPayloadWithUser;
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            throw new AuthError('User not found', 404);
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
        } else if (error instanceof AuthError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

async function getUserByEmail(email: string): Promise<User | null> {
    const dbUser = await userModel.findOne({ email });
    if (!dbUser) return null;
    return {
        _id: dbUser._id,
        id: dbUser.id,
        email: dbUser.email,
        password: dbUser.password,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
        name: dbUser.name
    };
}

export default {
    generateToken,
    verifyToken,
    getUserByEmail
};