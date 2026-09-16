// Helper format tampilan. Dipisah dari exportService agar komponen ringan
// (mis. StreamPage untuk OBS) tidak ikut memuat html2canvas.

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Indeks hari mengikuti <select> di editor: 0 = Minggu ... 6 = Sabtu.
export function getDayName(dayIndex) {
  return DAYS[Number(dayIndex)] ?? '';
}

export function formatDate(dateString, locale = 'id-ID') {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Urutkan jadwal: hari lalu jam, supaya tampilannya konsisten di kanvas.
export function sortScheduleEntries(entries = []) {
  return [...entries].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return String(a.time).localeCompare(String(b.time));
  });
}
