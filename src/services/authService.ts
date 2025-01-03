import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { UserModel } from '../models/userModel';
import { AuthError } from '../types/errors';

class AuthService {
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private readonly SALT_ROUNDS = 10;
    private userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
    }

    public async signup(userData: { email: string; password: string; name: string }): Promise<User> {
        const existingUser = await this.userModel.findByEmail(userData.email);
        if (existingUser) {
            throw new AuthError('Email already exists', 400);
        }

        const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);
        const user = await this.userModel.create({
            ...userData,
            password: hashedPassword,
            _id: undefined
        });

        return user;
    }

    public async login(email: string, password: string): Promise<{ token: string; user: any }> {
        try {
            console.log('Login attempt for:', email); // Debug log
            const user = await this.userModel.findByEmail(email);
            
            if (!user) {
                console.log('User not found:', email); // Debug log
                throw new AuthError('Invalid credentials', 401);
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            console.log('Password valid:', isValidPassword); // Debug log

            if (!isValidPassword) {
                throw new AuthError('Invalid credentials', 401);
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                this.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            };
        } catch (error) {
            console.error('Login error:', error); // Debug log
            throw error;
        }
    }
}

export default AuthService;