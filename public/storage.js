import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import firebaseConfig from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
  const dataString = localStorage.getItem(key);
  if (dataString) {
    return JSON.parse(dataString);
  } else {
    return null;
  }
}

const storage = {
    // Save auth token
    setToken(token) {
        localStorage.setItem('authToken', token);
    },

    // Get auth token
    getToken() {
        return localStorage.getItem('authToken');
    },

    // Remove token on logout
    clearToken() {
        localStorage.removeItem('authToken');
    },

    // Save user data
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Get user data
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Clear user data
    clearUser() {
        localStorage.removeItem('user');
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!this.getToken();
    }
};

// Export for use in other scripts
window.storage = storage;

export { saveData, loadData };

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const resetForm = document.getElementById('resetForm');
const toggleFormBtn = document.getElementById('toggleForm');
const loginContainer = document.getElementById('loginContainer');
const signupContainer = document.getElementById('signupContainer');
const resetContainer = document.getElementById('resetContainer');
const statusMessage = document.getElementById('statusMessage');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');
const backToLoginBtn = document.getElementById('backToLogin');

// Toggle between forms
toggleFormBtn.addEventListener('click', () => {
    const isLoginVisible = loginContainer.style.display !== 'none';
    loginContainer.style.display = isLoginVisible ? 'none' : 'block';
    signupContainer.style.display = isLoginVisible ? 'block' : 'none';
    resetContainer.style.display = 'none';
    toggleFormBtn.textContent = isLoginVisible ? 'Switch to Login' : 'Switch to Signup';
});

// Show reset password form
resetPasswordBtn.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'none';
    resetContainer.style.display = 'block';
    toggleFormBtn.style.display = 'none';
});

// Back to login from reset form
backToLoginBtn.addEventListener('click', () => {
    loginContainer.style.display = 'block';
    resetContainer.style.display = 'none';
    toggleFormBtn.style.display = 'block';
});

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showStatus('Login successful!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showStatus(error.message, 'error');
    }
});

// Handle signup form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        showStatus('Account created successfully!', 'success');
    } catch (error) {
        console.error('Signup error:', error);
        showStatus(error.message, 'error');
    }
});

// Handle reset password form submission
resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    
    try {
        await sendPasswordResetEmail(auth, email);
        
        // Record reset attempt in database
        const resetRef = ref(db, 'passwordResets/' + Date.now());
        await set(resetRef, {
            email: email,
            timestamp: new Date().toISOString(),
            status: 'sent'
        });

        showStatus('Password reset link sent! Check your email', 'success');
        
        setTimeout(() => {
            backToLoginBtn.click();
        }, 2000);

    } catch (error) {
        console.error('Reset error:', error);
        showStatus(error.message, 'error');
        
        // Record failed attempt
        const resetRef = ref(db, 'passwordResets/' + Date.now());
        await set(resetRef, {
            email: email,
            timestamp: new Date().toISOString(),
            status: 'failed',
            error: error.message
        });
    }
});

// Status message helper function
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.style.display = 'block';
    statusMessage.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    statusMessage.style.color = 'white';
    
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

// Google login handler
document.getElementById('googleLoginBtn').addEventListener('click', async () => {
    try {
        // Add your Google login logic here
        showStatus('Google login successful!', 'success');
    } catch (error) {
        showStatus(error.message, 'error');
    }
});