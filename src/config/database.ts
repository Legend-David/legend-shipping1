import fs from 'fs';
import path from 'path';
import { User } from '../types';

const DB_PATH = path.join(__dirname, '../../data/users.json');

// Initialize database file
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }));
}

export const db = {
    getUsers: (): User[] => {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data).users;
    },

    saveUser: (user: User): void => {
        const users = db.getUsers();
        users.push(user);
        fs.writeFileSync(DB_PATH, JSON.stringify({ users }, null, 2));
    },

    findUserByEmail: (email: string): User | undefined => {
        const users = db.getUsers();
        return users.find(user => user.email === email);
    },

    updateUser: (id: string, userData: Partial<User>): User | null => {
        const users = db.getUsers();
        const index = users.findIndex(user => user.id === id);
        if (index === -1) return null;
        
        users[index] = { ...users[index], ...userData };
        fs.writeFileSync(DB_PATH, JSON.stringify({ users }, null, 2));
        return users[index];
    }
};