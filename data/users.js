const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const DB_PATH = path.join(__dirname, 'users.json');

// Initialize empty users file if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }));
}

const users = {
    getAll: () => {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data).users;
    },

    findByEmail: (email) => {
        const users = users.getAll();
        return users.find(user => user.email === email);
    },

    create: async (userData) => {
        const users = users.getAll();
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const newUser = {
            id: Date.now().toString(),
            email: userData.email,
            password: hashedPassword,
            createdAt: new Date()
        };

        users.push(newUser);
        fs.writeFileSync(DB_PATH, JSON.stringify({ users }, null, 2));
        
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    },

    update: (id, userData) => {
        const users = users.getAll();
        const index = users.findIndex(user => user.id === id);
        
        if (index === -1) return null;
        
        users[index] = { ...users[index], ...userData };
        fs.writeFileSync(DB_PATH, JSON.stringify({ users }, null, 2));
        
        const { password, ...userWithoutPassword } = users[index];
        return userWithoutPassword;
    },

    delete: (id) => {
        const users = users.getAll();
        const filteredUsers = users.filter(user => user.id !== id);
        fs.writeFileSync(DB_PATH, JSON.stringify({ users: filteredUsers }, null, 2));
    }
};



module.exports = users;