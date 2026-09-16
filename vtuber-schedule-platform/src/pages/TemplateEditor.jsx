import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTemplate } from '../context/TemplateContext';
import { useAuth } from '../context/AuthContext';
import { exportToPNG, generateBrowserSourceURL } from '../services/exportService';
import { 
  Save, Download, Upload, Type, Palette, Image as ImageIcon, 
  MonitorPlay, Link as LinkIcon, Check, X 
} from 'lucide-react';

export default function TemplateEditor() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserTemplate, updateTemplateConfig, saveSchedule } = useTemplate();
  
  const template = getUserTemplate(templateId);
  const [config, setConfig] = useState(template?.config || {});
  const [scheduleEntries, setScheduleEntries] = useState([]);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [browserSourceUrl, setBrowserSourceUrl] = useState('');

  if (!template) {
    return (
      <div className="error-page">
        <h2>Template tidak ditemukan</h2>
        <button onClick={() => navigate('/user/dashboard')}>Kembali ke Dashboard</button>
      </div>
    );
  }

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    updateTemplateConfig(templateId, newConfig);
  };

  const handleCharacterPositionChange = (axis, value) => {
    const newPos = { 
      ...config.characterPosition, 
      [axis]: parseFloat(value) 
    };
    handleConfigChange('characterPosition', newPos);
  };

  const handleScaleChange = (value) => {
    const newPos = { 
      ...config.characterPosition, 
      scale: parseFloat(value) 
    };
    handleConfigChange('characterPosition', newPos);
  };

  const addScheduleEntry = () => {
    const newEntry = {
      id: `entry-${Date.now()}`,
      day: 1, // Senin
      time: '19:00',
      title: '',
      description: ''
    };
    setScheduleEntries([...scheduleEntries, newEntry]);
  };

  const updateScheduleEntry = (entryId, field, value) => {
    const updated = scheduleEntries.map(entry => 
      entry.id === entryId ? { ...entry, [field]: value } : entry
    );
    setScheduleEntries(updated);
  };

  const removeScheduleEntry = (entryId) => {
    setScheduleEntries(scheduleEntries.filter(e => e.id !== entryId));
  };

  const handleSaveSchedule = () => {
    const result = saveSchedule(templateId, { entries: scheduleEntries });
    if (result.success) {
      alert('Jadwal berhasil disimpan!');
    }
  };

  const handleExportPNG = async () => {
    const result = await exportToPNG('preview-canvas', `schedule-${template.name}.png`);
    if (result.success) {
      alert('Gambar berhasil diunduh!');
    } else {
      alert('Gagal export: ' + result.error);
    }
  };

  const handleGenerateBrowserSource = () => {
    const url = generateBrowserSourceURL(user.id, templateId);
    setBrowserSourceUrl(url);
    setShowExportOptions(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('URL disalin ke clipboard!');
  };

  return (
    <div className="editor-container">
      <header className="editor-header">
        <div className="header-left">
          <button onClick={() => navigate('/user/dashboard')} className="back-btn">
            ← Kembali
          </button>
          <h1>{template.name} - Editor</h1>
        </div>
        <div className="header-actions">
          <button onClick={handleSaveSchedule} className="action-btn">
            <Save size={18} />
            Simpan Jadwal
          </button>
          <button onClick={handleExportPNG} className="action-btn primary">
            <Download size={18} />
            Export PNG
          </button>
          <button onClick={handleGenerateBrowserSource} className="action-btn">
            <MonitorPlay size={18} />
            Browser Source
          </button>
        </div>
      </header>

      <div className="editor-layout">
        {/* Sidebar Kustomisasi */}
        <aside className="editor-sidebar">
          <div className="sidebar-section">
            <h3><Palette size={18} /> Warna</h3>
            <div className="control-group">
              <label>Background</label>
              <input
                type="color"
                value={config.backgroundColor || '#1a1a2e'}
                onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
              />
              <span>{config.backgroundColor || '#1a1a2e'}</span>
            </div>
            <div className="control-group">
              <label>Accent Color</label>
              <input
                type="color"
                value={config.accentColor || '#e94560'}
                onChange={(e) => handleConfigChange('accentColor', e.target.value)}
              />
              <span>{config.accentColor || '#e94560'}</span>
            </div>
            <div className="control-group">
              <label>Teks</label>
              <input
                type="color"
                value={config.textColor || '#ffffff'}
                onChange={(e) => handleConfigChange('textColor', e.target.value)}
              />
              <span>{config.textColor || '#ffffff'}</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3><Type size={18} /> Font</h3>
            <div className="control-group">
              <select
                value={config.fontFamily || 'Inter'}
                onChange={(e) => handleConfigChange('fontFamily', e.target.value)}
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Orbitron">Orbitron</option>
                <option value="Quicksand">Quicksand</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>
          </div>

          <div className="sidebar-section">
            <h3><ImageIcon size={18} /> Karakter</h3>
            <div className="control-group">
              <label>Upload Asset Karakter</label>
              <input type="file" accept="image/*" className="file-input" />
              <p className="hint">PNG dengan transparansi direkomendasikan</p>
            </div>
            <div className="control-group">
              <label>Posisi X</label>
              <input
                type="range"
                min="0"
                max="1920"
                value={config.characterPosition?.x || 1600}
                onChange={(e) => handleCharacterPositionChange('x', e.target.value)}
              />
              <span>{config.characterPosition?.x || 1600}px</span>
            </div>
            <div className="control-group">
              <label>Posisi Y</label>
              <input
                type="range"
                min="0"
                max="1080"
                value={config.characterPosition?.y || 800}
                onChange={(e) => handleCharacterPositionChange('y', e.target.value)}
              />
              <span>{config.characterPosition?.y || 800}px</span>
            </div>
            <div className="control-group">
              <label>Skala</label>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.1"
                value={config.characterPosition?.scale || 0.6}
                onChange={(e) => handleScaleChange(e.target.value)}
              />
              <span>{(config.characterPosition?.scale || 0.6) * 100}%</span>
            </div>
          </div>
        </aside>

        {/* Canvas Preview */}
        <main className="editor-main">
          <div className="preview-area">
            <div 
              id="preview-canvas"
              className="schedule-canvas"
              style={{
                backgroundColor: config.backgroundColor,
                color: config.textColor,
                fontFamily: config.fontFamily
              }}
            >
              <div className="canvas-header">
                <h2>Jadwal Stream</h2>
                <p>{user?.name}</p>
              </div>
              
              <div className="canvas-schedule">
                {scheduleEntries.length === 0 ? (
                  <p className="empty-canvas">Tambahkan jadwal dari sidebar</p>
                ) : (
                  scheduleEntries.map((entry, idx) => (
                    <div key={entry.id} className="schedule-row">
                      <span className="day-badge">Hari {entry.day}</span>
                      <span className="time-badge">{entry.time}</span>
                      <span className="title-text">{entry.title || 'Judul stream'}</span>
                    </div>
                  ))
                )}
              </div>

              <div 
                className="canvas-character-placeholder"
                style={{
                  position: 'absolute',
                  left: config.characterPosition?.x || 1600,
                  top: config.characterPosition?.y || 800,
                  transform: `scale(${config.characterPosition?.scale || 0.6})`,
                  transformOrigin: 'bottom right'
                }}
              >
                [Karakter VTuber]
              </div>
            </div>
          </div>
        </main>

        {/* Panel Jadwal */}
        <aside className="schedule-panel">
          <h3><Check size={18} /> Daftar Jadwal</h3>
          <button onClick={addScheduleEntry} className="add-entry-btn">
            + Tambah Entry
          </button>
          
          <div className="entries-list">
            {scheduleEntries.map((entry, idx) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <span>Entry #{idx + 1}</span>
                  <button onClick={() => removeScheduleEntry(entry.id)} className="remove-btn">
                    <X size={14} />
                  </button>
                </div>
                <div className="entry-fields">
                  <select
                    value={entry.day}
                    onChange={(e) => updateScheduleEntry(entry.id, 'day', parseInt(e.target.value))}
                  >
                    <option value={1}>Senin</option>
                    <option value={2}>Selasa</option>
                    <option value={3}>Rabu</option>
                    <option value={4}>Kamis</option>
                    <option value={5}>Jumat</option>
                    <option value={6}>Sabtu</option>
                    <option value={0}>Minggu</option>
                  </select>
                  <input
                    type="time"
                    value={entry.time}
                    onChange={(e) => updateScheduleEntry(entry.id, 'time', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Judul stream"
                    value={entry.title}
                    onChange={(e) => updateScheduleEntry(entry.id, 'title', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Deskripsi (opsional)"
                    value={entry.description}
                    onChange={(e) => updateScheduleEntry(entry.id, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Modal Browser Source */}
      {showExportOptions && browserSourceUrl && (
        <div className="modal-overlay" onClick={() => setShowExportOptions(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Browser Source untuk OBS</h3>
            <p>Salin URL ini dan tambahkan sebagai Browser Source di OBS:</p>
            <div className="url-display">
              <code>{browserSourceUrl}</code>
              <button onClick={() => copyToClipboard(browserSourceUrl)}>
                Salin
              </button>
            </div>
            <div className="obs-instructions">
              <h4>Cara menambahkan di OBS:</h4>
              <ol>
                <li>Buka OBS Studio</li>
                <li>Klik + di Sources panel</li>
                <li>Pilih "Browser"</li>
                <li>Paste URL di kolom "URL"</li>
                <li>Set Width: 1920, Height: 1080</li>
                <li>Klik OK</li>
              </ol>
            </div>
            <button onClick={() => setShowExportOptions(false)} className="close-modal">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
