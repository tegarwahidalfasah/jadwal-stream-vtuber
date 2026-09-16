import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTemplate } from '../context/TemplateContext';
import { Layout, Palette, Calendar, Download, LogOut, User } from 'lucide-react';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { userTemplates, getMasterTemplates, cloneTemplate } = useTemplate();
  const [activeTab, setActiveTab] = useState('gallery');
  const masterTemplates = getMasterTemplates();

  const handleCloneTemplate = (templateId) => {
    const result = cloneTemplate(templateId, user.id);
    if (result.success) {
      alert(`Template "${result.template.name}" berhasil ditambahkan ke workspace Anda!`);
    } else {
      alert('Gagal mengkloning template: ' + result.error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🎬 Dashboard VTuber</h1>
          <p>Selamat datang, {user?.name}!</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <User size={20} />
            <span>{user?.email}</span>
            <span className="role-badge">{user?.role}</span>
          </div>
          <button onClick={logout} className="logout-btn">
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <Layout size={18} />
          Galeri Template
        </button>
        <button 
          className={`nav-btn ${activeTab === 'workspace' ? 'active' : ''}`}
          onClick={() => setActiveTab('workspace')}
        >
          <Palette size={18} />
          Workspace Saya
        </button>
        <button 
          className={`nav-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Calendar size={18} />
          Jadwal Stream
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'gallery' && (
          <section className="template-gallery">
            <h2>Pilih Template</h2>
            <p className="section-desc">Pilih template dari galeri untuk dikloning ke workspace Anda</p>
            
            <div className="template-grid">
              {masterTemplates.map(template => (
                <div key={template.id} className="template-card">
                  <div className="template-thumbnail">
                    <div 
                      className="thumbnail-preview"
                      style={{ backgroundColor: template.defaultConfig.backgroundColor }}
                    >
                      <span className="template-name">{template.name}</span>
                    </div>
                  </div>
                  <div className="template-info">
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                    <div className="template-meta">
                      <span>📐 {template.aspectRatio}</span>
                      <span>🎨 {template.customizableElements.length} opsi kustomisasi</span>
                    </div>
                    <button 
                      className="clone-btn"
                      onClick={() => handleCloneTemplate(template.id)}
                    >
                      Gunakan Template Ini
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'workspace' && (
          <section className="workspace-section">
            <h2>Workspace Saya</h2>
            <p className="section-desc">Template yang sudah Anda kloning dan siap dikustomisasi</p>
            
            {userTemplates.length === 0 ? (
              <div className="empty-state">
                <Palette size={48} />
                <p>Belum ada template di workspace</p>
                <button onClick={() => setActiveTab('gallery')}>
                  Pilih Template dari Galeri
                </button>
              </div>
            ) : (
              <div className="workspace-grid">
                {userTemplates.map(template => (
                  <div key={template.id} className="workspace-card">
                    <div className="workspace-header">
                      <h3>{template.name}</h3>
                      <span className="modified-badge">
                        Terakhir diubah: {new Date(template.modifiedAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <div className="workspace-actions">
                      <a href={`/editor/${template.id}`} className="action-btn primary">
                        <Palette size={16} />
                        Edit
                      </a>
                      <a href={`/preview/${template.id}`} className="action-btn">
                        <Download size={16} />
                        Preview
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'schedule' && (
          <section className="schedule-section">
            <h2>Jadwal Stream</h2>
            <p className="section-desc">Kelola jadwal streaming Anda</p>
            <div className="empty-state">
              <Calendar size={48} />
              <p>Pilih template dari workspace untuk mulai membuat jadwal</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
