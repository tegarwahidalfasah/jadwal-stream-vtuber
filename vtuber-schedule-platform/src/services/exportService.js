import html2canvas from 'html2canvas';

// Service untuk export canvas ke PNG
export const exportToPNG = async (elementId, filename = 'schedule.png') => {
  try {
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
      canvas = await html2canvas(element, {
        width: 1920,
        height: 1080,
        scale: 1,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
    } finally {
      element.style.transform = previousTransform;
    }

    // Convert ke blob dan download
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve({ success: false, error: 'Gagal membuat blob' });
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        resolve({ success: true, blob });
      }, 'image/png', 1.0);
    });
  } catch (error) {
    console.error('Export PNG error:', error);
    return { success: false, error: error.message };
  }
};

// Generate browser source URL untuk OBS
export const generateBrowserSourceURL = (userId, templateId, baseUrl = window.location.origin) => {
  const cleanUrl = `${baseUrl}/stream/${userId}/${templateId}?clean=true`;
  return cleanUrl;
};

// Konversi waktu antar timezone
export const convertTimezone = (timeString, fromTimezone, toTimezone) => {
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    // Simulasi konversi timezone (di production gunakan library seperti date-fns-tz)
    const targetDate = new Date(date.toLocaleString('en-US', { timeZone: toTimezone }));
    
    return {
      original: timeString,
      converted: targetDate.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      fromTimezone,
      toTimezone
    };
  } catch (error) {
    console.error('Timezone conversion error:', error);
    return { original: timeString, converted: timeString, error: error.message };
  }
};

// Format tanggal untuk display
export const formatDate = (dateString, locale = 'id-ID') => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format hari dalam seminggu
export const getDayName = (dayIndex) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[dayIndex] || '';
};

// Validasi konfigurasi template
export const validateTemplateConfig = (config, constraints) => {
  const errors = [];
  
  if (constraints.lockedElements?.includes('canvas-ratio')) {
    // Pastikan aspect ratio tetap 16:9
    if (config.width && config.height) {
      const ratio = config.width / config.height;
      if (Math.abs(ratio - 1.777) > 0.01) {
        errors.push('Aspect ratio harus 16:9');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
