import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTemplate } from '../context/TemplateContext';
import { Layout, Plus, Edit, Trash2, LogOut, User, Palette } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getMasterTemplates } = useTemplate();
  const [activeTab, setActiveTab] = useState('templates');
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);

  const masterTemplates = getMasterTemplates();

  const handleCreateTemplate = (e) => {
    e.preventDefault();
    // Di production, ini akan mengirim data ke backend
    alert('Fitur upload template baru akan diimplementasikan dengan backend API');
    setShowNewTemplateForm(false);
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <div className="header-left">
          <h1>⚙️ Super Admin Dashboard</h1>
          <p>Kelola Master Template dan pengguna</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <User size={20} />
            <span>{user?.email}</span>
            <span className="role-badge admin">admin</span>
          </div>
          <button onClick={logout} className="logout-btn">
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <button 
          className={`nav-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <Layout size={18} />
          Master Templates
        </button>
        <button 
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <User size={18} />
          Manajemen Pengguna
        </button>
        <button 
          className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊
          Analytics
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'templates' && (
          <section className="templates-management">
            <div className="section-header">
              <h2>Galeri Master Template</h2>
              <button 
                className="create-btn"
                onClick={() => setShowNewTemplateForm(true)}
              >
                <Plus size={18} />
                Upload Template Baru
              </button>
            </div>

            <div className="admin-template-grid">
              {masterTemplates.map(template => (
                <div key={template.id} className="admin-template-card">
                  <div 
                    className="card-preview"
                    style={{ backgroundColor: template.defaultConfig.backgroundColor }}
                  >
                    <span>{template.name}</span>
                  </div>
                  <div className="card-details">
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                    <div className="card-meta">
                      <span>📐 {template.aspectRatio}</span>
                      <span>🔒 {template.lockedElements.length} locked</span>
                      <span>🎨 {template.customizableElements.length} customizable</span>
                    </div>
                    <div className="card-actions">
                      <button className="action-btn-sm">
                        <Edit size={14} />
                        Edit
                      </button>
                      <button className="action-btn-sm danger">
                        <Trash2 size={14} />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'users' && (
          <section className="users-management">
            <h2>Manajemen Pengguna</h2>
            <p className="section-desc">Monitor pengguna yang terdaftar (fitur demo)</p>
            
            <div className="empty-state">
              <User size={48} />
              <p>Daftar pengguna akan muncul di sini saat ada yang mendaftar</p>
              <p className="hint">Data akan disimpan di database pada implementasi production</p>
            </div>
          </section>
        )}

        {activeTab === 'analytics' && (
          <section className="analytics-section">
            <h2>Analytics Platform</h2>
            <p className="section-desc">Statistik penggunaan platform</p>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Pengguna</h3>
                <div className="stat-value">0</div>
                <p className="stat-change">Belum ada data</p>
              </div>
              <div className="stat-card">
                <h3>Template Aktif</h3>
                <div className="stat-value">{masterTemplates.length}</div>
                <p className="stat-change">Master templates tersedia</p>
              </div>
              <div className="stat-card">
                <h3>Export Hari Ini</h3>
                <div className="stat-value">0</div>
                <p className="stat-change">PNG exports</p>
              </div>
              <div className="stat-card">
                <h3>Browser Source Active</h3>
                <div className="stat-value">0</div>
                <p className="stat-change">Live streams</p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Modal Upload Template Baru */}
      {showNewTemplateForm && (
        <div className="modal-overlay" onClick={() => setShowNewTemplateForm(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h3>Upload Master Template Baru</h3>
            <form onSubmit={handleCreateTemplate}>
              <div className="form-group">
                <label>Nama Template</label>
                <input type="text" placeholder="Contoh: Summer Vibes" required />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea placeholder="Deskripsi template..." rows="3" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Background Color</label>
                  <input type="color" defaultValue="#1a1a2e" />
                </div>
                <div className="form-group">
                  <label>Accent Color</label>
                  <input type="color" defaultValue="#e94560" />
                </div>
              </div>
              <div className="form-group">
                <label>Font Family</label>
                <select>
                  <option value="Inter">Inter</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Orbitron">Orbitron</option>
                  <option value="Quicksand">Quicksand</option>
                </select>
              </div>
              <div className="form-group">
                <label>Locked Elements</label>
                <div className="checkbox-group">
                  <label><input type="checkbox" defaultChecked /> Aspect Ratio (16:9)</label>
                  <label><input type="checkbox" defaultChecked /> Export Resolution (1920x1080)</label>
                  <label><input type="checkbox" /> Font Size</label>
                  <label><input type="checkbox" /> Layout Grid</label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowNewTemplateForm(false)}>
                  Batal
                </button>
                <button type="submit" className="primary">
                  <Palette size={16} />
                  Publish Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
