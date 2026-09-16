import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TemplateProvider } from './context/TemplateContext';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TemplateEditor from './pages/TemplateEditor';
import CommunityHub from './pages/CommunityHub';
import './index.css';

// Protected Route untuk User
function UserRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'user') {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Protected Route untuk Admin
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Stream View (untuk Browser Source OBS - public access dengan clean URL)
function StreamView({ userId, templateId }) {
  return (
    <div className="stream-view">
      <h1>Stream View: {userId} / {templateId}</h1>
      <p>Jadwal akan ditampilkan di sini dalam format yang optimal untuk OBS</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/community" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/community" element={<CommunityHub />} />
      
      <Route 
        path="/user/dashboard" 
        element={
          <UserRoute>
            <UserDashboard />
          </UserRoute>
        } 
      />
      <Route 
        path="/editor/:templateId" 
        element={
          <UserRoute>
            <TemplateEditor />
          </UserRoute>
        } 
      />
      <Route 
        path="/preview/:templateId" 
        element={
          <UserRoute>
            <div>Preview Page (Coming Soon)</div>
          </UserRoute>
        } 
      />
      
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      
      <Route 
        path="/stream/:userId/:templateId" 
        element={
          <StreamView 
            userId={window.location.pathname.split('/')[2]} 
            templateId={window.location.pathname.split('/')[3]} 
          />
        } 
      />
      
      <Route path="*" element={<div>Halaman tidak ditemukan</div>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TemplateProvider>
          <AppRoutes />
        </TemplateProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
