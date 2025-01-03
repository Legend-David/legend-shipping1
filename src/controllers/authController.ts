import { Request, Response } from 'express';
import { User } from '../types';

export class AuthController {
    private userModel;

    constructor(userModel: any) {
        this.userModel = userModel;
    }

    async signup(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const newUser = await this.userModel.create({ email, password });
            return res.status(201).json({ message: 'User created successfully', user: newUser });
        } catch (error) {
            return res.status(500).json({ message: 'Error signing up', error });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const user = await this.userModel.findOne({ email });
            if (!user || user.password !== password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            return res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
            return res.status(500).json({ message: 'Error logging in', error });
        }
    }
}

export default AuthController;