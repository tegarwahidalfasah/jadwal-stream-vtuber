import { BrowserRouter, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import TemplateProvider from './context/TemplateProvider';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TemplateEditor from './pages/TemplateEditor';
import PreviewPage from './pages/PreviewPage';
import StreamPage from './pages/StreamPage';
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

// Editor dan Preview dipasang dengan key={templateId} agar berpindah template
// me-remount komponen, sehingga state lokal selalu segar per template.
function EditorRoute() {
  const { templateId } = useParams();
  return (
    <UserRoute>
      <TemplateEditor key={templateId} />
    </UserRoute>
  );
}

function PreviewRoute() {
  const { templateId } = useParams();
  return (
    <UserRoute>
      <PreviewPage key={templateId} />
    </UserRoute>
  );
}

function NotFound() {
  return (
    <div className="error-page">
      <h2>Halaman tidak ditemukan</h2>
      <Link to="/community" className="action-btn primary">
        Kembali ke Community Hub
      </Link>
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
      <Route path="/preview/:templateId" element={<PreviewRoute />} />
      
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      
      {/* Public — dipakai sebagai Browser Source OBS */}
      <Route path="/stream/:userId/:templateId" element={<StreamPage />} />
      
      <Route path="*" element={<NotFound />} />
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
