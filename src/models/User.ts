import bcrypt from 'bcrypt';

export interface User {
    _id: any;
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export class UserModelImplementation implements UserModel {
    private users: User[] = [];

    async findOne(query: { email: string }): Promise<User | null> {
        const user = this.users.find(u => u.email === query.email);
        return user || null;
    }

    async create(data: { email: string; password: string; name: string }): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const newUser: User = {
            id: Date.now().toString(),
            email: data.email,
            password: hashedPassword,
            name: data.name,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.users.push(newUser);
        return newUser;
    }
}

export interface UserModel {
    findOne(query: { email: string }): Promise<User | null>;
    create(data: { email: string; password: string; name: string }): Promise<User>;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: Omit<User, 'password'>;
    token?: string;
}

const response: AuthResponse = {
    success: true,
    message: "Login successful",
    user: {
        id: "a",
        email: "user@example.com",
        name: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    token: "jwt-token-here"
};

// Export instance
export const userModel = new UserModelImplementation();
