import express from 'express';
import path from 'path';
import { db } from './config/database';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Routes
app.use('/auth', authRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
    const httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, '../certs/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../certs/cert.pem'))
    };
    https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`Secure server running on https://localhost:${PORT}`);
    });
} else {
    app.listen(PORT, () => {
        console.log(`Development server running on http://localhost:${PORT}`);
    });
}
export default app;