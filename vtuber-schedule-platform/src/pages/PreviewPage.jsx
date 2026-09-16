import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTemplate } from '../hooks/useTemplate';
import { useAuth } from '../hooks/useAuth';
import { exportToPNG } from '../services/exportService';
import ScheduleCanvas from '../components/ScheduleCanvas';
import { useToast } from '../hooks/useToast';
import { Download, Pencil } from 'lucide-react';

/**
 * Pratinjau ukuran penuh (1920x1080 tanpa skala) — persis seperti hasil export
 * dan seperti yang akan dilihat OBS.
 */
export default function PreviewPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserTemplate, schedules } = useTemplate();
  const toast = useToast();

  const template = getUserTemplate(templateId);
  const schedule = schedules.find((s) => s.templateId === templateId);

  if (!template) {
    return (
      <div className="error-page">
        <h2>Template tidak ditemukan</h2>
        <button onClick={() => navigate('/user/dashboard')}>Kembali ke Dashboard</button>
      </div>
    );
  }

  const handleExport = async () => {
    const result = await exportToPNG('preview-canvas', `schedule-${template.name}.png`);
    if (result.success) {
      toast.notify('Gambar berhasil diunduh');
    } else {
      toast.notify('Gagal export: ' + result.error, 'error');
    }
  };

  return (
    <div className="preview-page">
      {toast.element}
      <header className="preview-toolbar">
        <Link to={`/editor/${templateId}`} className="action-btn">
          <Pencil size={16} />
          Edit template
        </Link>
        <h1>{template.name} — Pratinjau 1920×1080</h1>
        <button onClick={handleExport} className="action-btn primary">
          <Download size={16} />
          Export PNG
        </button>
      </header>

      <div className="preview-stage">
        <ScheduleCanvas
          config={template.config}
          entries={schedule?.entries ?? []}
          streamerName={user?.name}
          emptyText="Belum ada jadwal untuk template ini"
          fullSize
        />
      </div>
    </div>
  );
}
