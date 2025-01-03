export interface User {
    _id: any;
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
}

export interface UserModel {
    findOne(query: { email: string }): Promise<User | null>;
    create(data: { email: string; password: string }): Promise<User>;
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
        name: "John Doe"
        // note: password field is omitted
        ,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    token: "jwt-token-here"
};
