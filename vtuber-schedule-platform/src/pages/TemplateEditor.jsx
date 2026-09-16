import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTemplate } from '../hooks/useTemplate';
import { useAuth } from '../hooks/useAuth';
import { exportToPNG, generateBrowserSourceURL } from '../services/exportService';
import ScheduleCanvas from '../components/ScheduleCanvas';
import { CANVAS_DEFAULTS } from '../utils/canvasDefaults';
import { useToast } from '../hooks/useToast';
import { createId } from '../utils/id';
import { getDayName } from '../utils/format';
import { 
  Save, Download, Type, Palette, Image as ImageIcon, 
  MonitorPlay, Check, X 
} from 'lucide-react';

export default function TemplateEditor() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserTemplate, updateTemplateConfig, saveSchedule, schedules } = useTemplate();
  const toast = useToast();
  
  const template = getUserTemplate(templateId);
  // Config diambil langsung dari context (single source of truth). Menyimpannya
  // di useState(template?.config || {}) membuat config terkunci ke {} bila
  // template belum tersedia saat render pertama — kustomisasi user lalu hilang.
  const config = template?.config || {};
  const position = { ...CANVAS_DEFAULTS.characterPosition, ...config.characterPosition };
  const storedSchedule = schedules.find((s) => s.templateId === templateId);
  // TemplateContext memuat localStorage secara sinkron (lazy initializer), jadi
  // jadwal tersimpan sudah tersedia pada render pertama. App.jsx memasang
  // key={templateId} sehingga pindah template me-remount dan state ini segar lagi.
  const [scheduleEntries, setScheduleEntries] = useState(() => storedSchedule?.entries ?? []);
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
    // updateTemplateConfig sudah melakukan merge, jadi cukup kirim field yang berubah.
    updateTemplateConfig(templateId, { [key]: value });
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
      id: createId('entry'),
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
      toast.notify('Jadwal berhasil disimpan');
    } else {
      toast.notify(result.error || 'Gagal menyimpan jadwal', 'error');
    }
  };

  const handleExportPNG = async () => {
    const result = await exportToPNG('preview-canvas', `schedule-${template.name}.png`);
    if (result.success) {
      toast.notify('Gambar berhasil diunduh');
    } else {
      toast.notify('Gagal export: ' + result.error, 'error');
    }
  };

  const handleGenerateBrowserSource = () => {
    const url = generateBrowserSourceURL(user.id, templateId);
    setBrowserSourceUrl(url);
    setShowExportOptions(true);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.notify('URL disalin ke clipboard');
    } catch {
      // Clipboard API butuh konteks aman (https) dan izin pengguna.
      toast.notify('Browser menolak akses clipboard — salin manual URL-nya', 'error');
    }
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
                value={config.backgroundColor || CANVAS_DEFAULTS.backgroundColor}
                onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
              />
              <span>{config.backgroundColor || CANVAS_DEFAULTS.backgroundColor}</span>
            </div>
            <div className="control-group">
              <label>Accent Color</label>
              <input
                type="color"
                value={config.accentColor || CANVAS_DEFAULTS.accentColor}
                onChange={(e) => handleConfigChange('accentColor', e.target.value)}
              />
              <span>{config.accentColor || CANVAS_DEFAULTS.accentColor}</span>
            </div>
            <div className="control-group">
              <label>Teks</label>
              <input
                type="color"
                value={config.textColor || CANVAS_DEFAULTS.textColor}
                onChange={(e) => handleConfigChange('textColor', e.target.value)}
              />
              <span>{config.textColor || CANVAS_DEFAULTS.textColor}</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3><Type size={18} /> Font</h3>
            <div className="control-group">
              <select
                value={config.fontFamily || CANVAS_DEFAULTS.fontFamily}
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
                value={position.x}
                onChange={(e) => handleCharacterPositionChange('x', e.target.value)}
              />
              <span>{position.x}px</span>
            </div>
            <div className="control-group">
              <label>Posisi Y</label>
              <input
                type="range"
                min="0"
                max="1080"
                value={position.y}
                onChange={(e) => handleCharacterPositionChange('y', e.target.value)}
              />
              <span>{position.y}px</span>
            </div>
            <div className="control-group">
              <label>Skala</label>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.1"
                value={position.scale}
                onChange={(e) => handleScaleChange(e.target.value)}
              />
              <span>{(position.scale) * 100}%</span>
            </div>
          </div>
        </aside>

        {/* Canvas Preview */}
        <main className="editor-main">
          <ScheduleCanvas
            config={config}
            entries={scheduleEntries}
            streamerName={user?.name}
            emptyText="Tambahkan jadwal dari sidebar"
          />
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
                    {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                      <option key={d} value={d}>{getDayName(d)}</option>
                    ))}
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

      {toast.element}
    </div>
  );
}
