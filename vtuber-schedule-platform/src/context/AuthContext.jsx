import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem('vtuber_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to restore session:', e);
    return null;
  }
}

export function AuthProvider({ children }) {
  // Lazy initializer: restore sesi pada render pertama, tanpa efek samping
  // di dalam useState(() => {...}) yang dijalankan ganda oleh StrictMode.
  const [user, setUser] = useState(readStoredUser);
  const [isAuthenticated, setIsAuthenticated] = useState(() => user !== null);

  // Simulasi login - nanti akan diganti dengan API call
  const login = (email, password, role) => {
    // Mock authentication - di production ini akan call backend
    if (email && password) {
      const mockUser = {
        id: 'user-' + Date.now(),
        email,
        role: role || 'user', // 'admin' atau 'user'
        name: email.split('@')[0],
        storageQuota: 100 * 1024 * 1024, // 100MB default
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan dalam AuthProvider');
  }
  return context;
}
