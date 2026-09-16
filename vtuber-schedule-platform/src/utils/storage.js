// Pembacaan localStorage yang aman: JSON rusak tidak boleh membuat app crash.
export function readStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Gagal membaca ${key} dari localStorage:`, e);
    return fallback;
  }
}
