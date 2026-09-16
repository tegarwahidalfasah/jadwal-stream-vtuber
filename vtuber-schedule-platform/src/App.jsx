import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
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

// Editor dipasang dengan key={templateId} agar berpindah template me-remount
// komponen, sehingga state lokal (daftar jadwal) selalu segar per template.
function EditorRoute() {
  const { templateId } = useParams();
  return (
    <UserRoute>
      <TemplateEditor key={templateId} />
    </UserRoute>
  );
}

// Stream View (untuk Browser Source OBS - public access dengan clean URL)
function StreamView() {
  // useParams() ikut ter-update saat navigasi client-side;
  // window.location.pathname.split() tidak.
  const { userId, templateId } = useParams();
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
      <Route path="/editor/:templateId" element={<EditorRoute />} />
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
        element={<StreamView />} 
      />
      
      <Route 
        path="*" 
        element={
          <div className="error-page">
            <h2>Halaman tidak ditemukan</h2>
          </div>
        } 
      />
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
