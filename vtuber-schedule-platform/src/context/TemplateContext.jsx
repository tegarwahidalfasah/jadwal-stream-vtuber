import { createContext, useContext, useState, useEffect } from 'react';

const TemplateContext = createContext(null);

// Master Templates - ini akan datang dari database di production
const MASTER_TEMPLATES = [
  {
    id: 'template-1',
    name: 'Classic VTuber',
    description: 'Template klasik dengan layout bersih',
    thumbnail: '/templates/classic.png',
    aspectRatio: '16:9',
    resolution: { width: 1920, height: 1080 },
    lockedElements: ['canvas-ratio', 'export-resolution'],
    customizableElements: ['colors', 'fonts', 'character-position', 'background'],
    defaultConfig: {
      backgroundColor: '#1a1a2e',
      accentColor: '#e94560',
      textColor: '#ffffff',
      fontFamily: 'Inter',
      characterPosition: { x: 1600, y: 800, scale: 0.6 },
      backgroundPattern: 'gradient'
    }
  },
  {
    id: 'template-2',
    name: 'Neon Cyberpunk',
    description: 'Gaya neon futuristik untuk stream malam',
    thumbnail: '/templates/cyberpunk.png',
    aspectRatio: '16:9',
    resolution: { width: 1920, height: 1080 },
    lockedElements: ['canvas-ratio', 'export-resolution'],
    customizableElements: ['colors', 'fonts', 'character-position', 'neon-intensity'],
    defaultConfig: {
      backgroundColor: '#0d0d0d',
      accentColor: '#00ff88',
      secondaryAccent: '#ff00ff',
      textColor: '#00ff88',
      fontFamily: 'Orbitron',
      characterPosition: { x: 1700, y: 850, scale: 0.5 },
      neonIntensity: 0.8
    }
  },
  {
    id: 'template-3',
    name: 'Soft Pastel',
    description: 'Warna pastel lembut untuk aesthetic yang cute',
    thumbnail: '/templates/pastel.png',
    aspectRatio: '16:9',
    resolution: { width: 1920, height: 1080 },
    lockedElements: ['canvas-ratio', 'export-resolution'],
    customizableElements: ['colors', 'fonts', 'character-position', 'decoration'],
    defaultConfig: {
      backgroundColor: '#ffe6f0',
      accentColor: '#ffb3c6',
      textColor: '#5d5d5d',
      fontFamily: 'Quicksand',
      characterPosition: { x: 1500, y: 750, scale: 0.65 },
      decoration: 'stars'
    }
  }
];

export function TemplateProvider({ children }) {
  const [userTemplates, setUserTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [schedules, setSchedules] = useState([]);

  // Load user templates dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vtuber_templates');
    if (saved) {
      try {
        setUserTemplates(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load templates:', e);
      }
    }
  }, []);

  // Clone template dari master ke workspace user
  const cloneTemplate = (templateId, userId) => {
    const masterTemplate = MASTER_TEMPLATES.find(t => t.id === templateId);
    if (!masterTemplate) {
      return { success: false, error: 'Template tidak ditemukan' };
    }

    const clonedTemplate = {
      ...masterTemplate,
      id: `user-template-${Date.now()}`,
      masterTemplateId: templateId,
      ownerId: userId,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      config: { ...masterTemplate.defaultConfig },
      isCloned: true
    };

    const updated = [...userTemplates, clonedTemplate];
    setUserTemplates(updated);
    localStorage.setItem('vtuber_templates', JSON.stringify(updated));
    
    return { success: true, template: clonedTemplate };
  };

  // Update konfigurasi template user
  const updateTemplateConfig = (templateId, newConfig) => {
    const index = userTemplates.findIndex(t => t.id === templateId);
    if (index === -1) {
      return { success: false, error: 'Template tidak ditemukan' };
    }

    const updated = [...userTemplates];
    updated[index] = {
      ...updated[index],
      config: { ...updated[index].config, ...newConfig },
      modifiedAt: new Date().toISOString()
    };

    setUserTemplates(updated);
    localStorage.setItem('vtuber_templates', JSON.stringify(updated));
    
    return { success: true, template: updated[index] };
  };

  // Simpan jadwal untuk template
  const saveSchedule = (templateId, scheduleData) => {
    const newSchedule = {
      id: `schedule-${Date.now()}`,
      templateId,
      entries: scheduleData.entries || [],
      timezone: scheduleData.timezone || 'Asia/Jakarta',
      updatedAt: new Date().toISOString()
    };

    const updated = [...schedules.filter(s => s.templateId !== templateId), newSchedule];
    setSchedules(updated);
    localStorage.setItem('vtuber_schedules', JSON.stringify(updated));

    return { success: true, schedule: newSchedule };
  };

  // Dapatkan master templates (public gallery)
  const getMasterTemplates = () => MASTER_TEMPLATES;

  // Dapatkan template user by ID
  const getUserTemplate = (templateId) => {
    return userTemplates.find(t => t.id === templateId);
  };

  // Hapus template user
  const deleteTemplate = (templateId) => {
    const updated = userTemplates.filter(t => t.id !== templateId);
    setUserTemplates(updated);
    localStorage.setItem('vtuber_templates', JSON.stringify(updated));
    return { success: true };
  };

  return (
    <TemplateContext.Provider value={{
      userTemplates,
      currentTemplate,
      schedules,
      cloneTemplate,
      updateTemplateConfig,
      saveSchedule,
      getMasterTemplates,
      getUserTemplate,
      deleteTemplate,
      setCurrentTemplate
    }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate harus digunakan dalam TemplateProvider');
  }
  return context;
}
