export class AuthError extends Error {
    constructor(
        public message: string,
        public status: number = 401,
        public code?: string
    ) {
        super(message);
        this.name = 'AuthError';
        Object.setPrototypeOf(this, AuthError.prototype);
    }

    public toJSON() {
        return {
            error: {
                name: this.name,
                message: this.message,
                status: this.status,
                code: this.code
            }
        };
    }
}

