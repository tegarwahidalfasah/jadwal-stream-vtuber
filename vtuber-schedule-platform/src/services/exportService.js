export const EXPORT_WIDTH = 1920;
export const EXPORT_HEIGHT = 1080;

// Service untuk export canvas ke PNG
export const exportToPNG = async (elementId, filename = 'schedule.png') => {
  const element = document.getElementById(elementId);
  if (!element) {
    return { success: false, error: 'Element tidak ditemukan' };
  }

  // Kanvas preview diskalakan lewat CSS transform agar muat di layar.
  // transform harus dilepas sementara, kalau tidak html2canvas menangkap
  // versi yang sudah dikecilkan sehingga PNG 1920x1080 hasilnya kosong.
  const previousTransform = element.style.transform;
  element.style.transform = 'none';

  let canvas;
  try {
    // html2canvas diimpor dinamis: ~200 kB yang hanya dibutuhkan saat user
    // menekan Export, jadi tidak ikut membebani bundle awal.
    const { default: html2canvas } = await import('html2canvas');
    canvas = await html2canvas(element, {
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      scale: 1,
      backgroundColor: null,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });
  } catch (error) {
    console.error('Export PNG error:', error);
    return { success: false, error: error.message };
  } finally {
    element.style.transform = previousTransform;
  }

  try {
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/png', 1.0)
    );
    if (!blob) {
      return { success: false, error: 'Gagal membuat blob' };
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, blob };
  } catch (error) {
    console.error('Export PNG error:', error);
    return { success: false, error: error.message };
  }
};

// Generate browser source URL untuk OBS
export const generateBrowserSourceURL = (
  userId,
  templateId,
  baseUrl = window.location.origin
) => `${baseUrl}/stream/${userId}/${templateId}?clean=true`;
