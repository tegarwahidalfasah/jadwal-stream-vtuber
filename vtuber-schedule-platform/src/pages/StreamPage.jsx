import { useParams } from 'react-router-dom';
import { useTemplate } from '../hooks/useTemplate';
import ScheduleCanvas from '../components/ScheduleCanvas';

/**
 * Halaman tujuan Browser Source OBS: `/stream/:userId/:templateId`.
 * Dirender tanpa chrome apa pun dan pada ukuran penuh 1920x1080.
 *
 * Catatan penting: data masih berasal dari localStorage, jadi halaman ini
 * hanya menampilkan jadwal bila dibuka di browser yang sama dengan editor.
 * OBS memakai profil CEF terpisah dengan localStorage sendiri, sehingga
 * integrasi lintas perangkat baru bisa jalan setelah ada backend API.
 */
export default function StreamPage() {
  const { userId, templateId } = useParams();
  const { getUserTemplate, schedules } = useTemplate();

  const template = getUserTemplate(templateId);
  const schedule = schedules.find((s) => s.templateId === templateId);

  if (!template) {
    return (
      <div className="stream-view stream-unavailable">
        <h2>Jadwal belum tersedia</h2>
        <p>
          Template <code>{templateId}</code> untuk pengguna <code>{userId}</code> tidak ditemukan
          di penyimpanan browser ini.
        </p>
        <p className="hint">
          Halaman ini membaca data dari localStorage. Buka di browser yang sama dengan editor,
          atau tunggu integrasi backend agar URL bisa dipakai langsung dari OBS.
        </p>
      </div>
    );
  }

  return (
    <ScheduleCanvas
      config={template.config}
      entries={schedule?.entries ?? []}
      emptyText="Belum ada jadwal"
      fullSize
    />
  );
}
