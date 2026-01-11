import { User } from '../types';

// STORAGE KEYS
const DB_KEY = 'latteboxd_db_v1';
const SESSION_KEY = 'latteboxd_session';

interface DBState {
  users: Array<User & { password: string }>; // In a real app, never store plain passwords!
}

// Initial State
const getDB = (): DBState => {
  const stored = localStorage.getItem(DB_KEY);
  if (!stored) {
    const initial: DBState = { users: [] };
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const saveDB = (state: DBState) => {
  localStorage.setItem(DB_KEY, JSON.stringify(state));
};

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomColor = () => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const AuthService = {
  signup: async (username: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const db = getDB();
    
    // Check if user exists
    if (db.users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error("Username already taken");
    }

    const newUser: User & { password: string } = {
      id: generateId(),
      username,
      password, // In a real app, hash this!
      avatarColor: getRandomColor(),
      dateJoined: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDB(db);

    // Remove password before returning to "client"
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  login: async (username: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const db = getDB();
    const user = db.users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  setSession: (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};