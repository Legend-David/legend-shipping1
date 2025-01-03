import express, { Request, Response, Router } from 'express';
import { AuthError } from '../types/errors';
import AuthService from '../services/authService';

const router = Router();
const authService = new AuthService();

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const user = await authService.signup(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof AuthError) {
            res.status(error.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email); // Debug log
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        console.error('Login error:', error); // Debug log
        if (error instanceof AuthError) {
            res.status(error.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Login failed' });
        }
    }
});

export default router;
