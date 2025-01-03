import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../types/User';
import { UserModel } from '../models/userModel';
import { AuthError as CustomAuthError } from '../types/errors';
import { generateToken, verifyToken } from '../config/jwt';

// Custom error class for authentication errors
class AuthError extends Error {
    status: number;
    
    constructor(message: string, status: number) {
        super(message);
        this.name = 'AuthError';
        this.status = status;
    }
}

// Type declarations
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

declare module 'express-session' {
    interface SessionData {
        userId: string;
        email: string;
        isAuthenticated: boolean;
    }
}

// Auth service
export class AuthService {
    private readonly userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
    }

    public async signup(userData: { email: string; password: string; name: string }): Promise<User> {
        try {
            const existingUser = await this.userModel.findByEmail(userData.email);
            if (existingUser) {
                throw new AuthError('Email already exists', 400);
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await this.userModel.create({
                ...userData,
                password: hashedPassword
            });

            return user;
        } catch (error) {
            if (error instanceof AuthError) {
                throw error;
            }
            throw new AuthError('Error creating user', 500);
        }
    }

    public async login(email: string, password: string): Promise<{ user: Omit<User, 'password'>, token: string }> {
        try {
            const user = await this.userModel.findByEmail(email);
            if (!user) {
                throw new AuthError('Invalid credentials', 401);
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new AuthError('Invalid credentials', 401);
            }

            const token = generateToken(user);
            const { password: _, ...userWithoutPassword } = user;

            return { user: userWithoutPassword, token };
        } catch (error) {
            if (error instanceof AuthError) {
                throw error;
            }
            throw new AuthError('Login failed', 500);
        }
    }

    public authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await verifyToken(req, res, next);
        } catch (error) {
            if (error instanceof AuthError) {
                res.status(error.status).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Authentication failed' });
            }
        }
    };
}

export const authService = new AuthService();

export default authService;
