import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, UserPlus, X } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(email, password, role);
    
    if (result.success) {
      // Redirect berdasarkan role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎬 VTuber Schedule Platform</h1>
          <p>Masuk untuk mengelola jadwal stream Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@contoh.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label>Tipe Akun</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${role === 'user' ? 'active' : ''}`}
                onClick={() => setRole('user')}
              >
                <UserPlus size={20} />
                <span>VTuber (User)</span>
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setRole('admin')}
              >
                <LogIn size={20} />
                <span>Super Admin</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <X size={16} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="submit-btn">
            Masuk
          </button>
        </form>

        <div className="login-footer">
          <p className="demo-hint">
            💡 Demo: Gunakan email dan password apa saja untuk login
          </p>
        </div>
      </div>
    </div>
  );
}
