import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { createId } from '../utils/id';
import { readStored } from '../utils/storage';

export default function AuthProvider({ children }) {
  // Lazy initializer: restore sesi pada render pertama, tanpa efek samping
  // di dalam useState(() => {...}) yang dijalankan ganda oleh StrictMode.
  const [user, setUser] = useState(() => readStored('vtuber_user', null));
  const [isAuthenticated, setIsAuthenticated] = useState(() => user !== null);

  // Simulasi login - nanti akan diganti dengan API call
  const login = (email, password, role) => {
    // Mock authentication - di production ini akan call backend
    if (email && password) {
      const mockUser = {
        id: createId('user'),
        email,
        role: role || 'user', // 'admin' atau 'user'
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('vtuber_user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, error: 'Email dan password diperlukan' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vtuber_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

