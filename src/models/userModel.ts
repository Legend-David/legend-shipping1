import { User } from '../types/User';

// In-memory storage instead of mongoose
export class UserModel {
  private users: User[] = [];

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async findOne(query: Partial<User>): Promise<User | undefined> {
    return this.users.find(user => 
      Object.entries(query).every(([key, value]) => user[key as keyof User] === value)
    );
  }
}

