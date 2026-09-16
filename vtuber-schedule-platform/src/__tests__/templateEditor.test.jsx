// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import AuthProvider from '../context/AuthProvider';
import TemplateProvider from '../context/TemplateProvider';
import TemplateEditor from '../pages/TemplateEditor';

const TEMPLATE_ID = 'user-template-111';

function mountEditor(config) {
  localStorage.setItem(
    'vtuber_user',
    JSON.stringify({ id: 'user-1', email: 'a@b.com', role: 'user', name: 'a' })
  );
  localStorage.setItem(
    'vtuber_templates',
    JSON.stringify([
      {
        id: TEMPLATE_ID,
        name: 'Classic VTuber',
        masterTemplateId: 'template-1',
        lockedElements: ['canvas-ratio'],
        customizableElements: ['colors'],
        config,
      },
    ])
  );

  return render(
    <MemoryRouter initialEntries={[`/editor/${TEMPLATE_ID}`]}>
      <AuthProvider>
        <TemplateProvider>
          <Routes>
            <Route path="/editor/:templateId" element={<TemplateEditor />} />
          </Routes>
        </TemplateProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

const pickers = () => [...document.querySelectorAll('input[type="color"]')].map((p) => p.value);
const storedConfig = () => JSON.parse(localStorage.getItem('vtuber_templates'))[0].config;

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

describe('TemplateEditor — konfigurasi tersimpan', () => {
  it('menampilkan kembali warna yang sudah disimpan user setelah reload', () => {
    mountEditor({ backgroundColor: '#ff0000', accentColor: '#123456', textColor: '#abcdef' });
    expect(pickers()).toEqual(['#ff0000', '#123456', '#abcdef']);
  });

  it('menerapkan warna tersimpan ke kanvas preview', () => {
    mountEditor({ backgroundColor: '#ff0000' });
    const canvas = document.getElementById('preview-canvas');
    expect(canvas).not.toBeNull();
    expect(canvas.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('mengubah satu warna tidak menghapus warna lain', async () => {
    mountEditor({ backgroundColor: '#ff0000', accentColor: '#123456', textColor: '#abcdef' });

    const bg = document.querySelectorAll('input[type="color"]')[0];
    await act(async () => {
      fireEvent.change(bg, { target: { value: '#00ff00' } });
    });

    expect(storedConfig()).toMatchObject({
      backgroundColor: '#00ff00',
      accentColor: '#123456',
      textColor: '#abcdef',
    });
    // UI ikut ter-update karena config diturunkan dari context.
    expect(pickers()[0]).toBe('#00ff00');
  });

  it('menampilkan pesan yang jelas bila template tidak ada', () => {
    localStorage.setItem(
      'vtuber_user',
      JSON.stringify({ id: 'user-1', email: 'a@b.com', role: 'user', name: 'a' })
    );
    localStorage.setItem('vtuber_templates', JSON.stringify([]));
    render(
      <MemoryRouter initialEntries={['/editor/tidak-ada']}>
        <AuthProvider>
          <TemplateProvider>
            <Routes>
              <Route path="/editor/:templateId" element={<TemplateEditor />} />
            </Routes>
          </TemplateProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Template tidak ditemukan')).toBeTruthy();
  });
});
