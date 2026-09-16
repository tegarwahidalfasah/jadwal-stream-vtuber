// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, act, cleanup } from '@testing-library/react';

import AuthProvider from '../context/AuthProvider';
import TemplateProvider from '../context/TemplateProvider';
import { useAuth } from '../hooks/useAuth';
import { useTemplate } from '../hooks/useTemplate';

function probe(hook) {
  let captured;
  function Probe() {
    captured = hook();
    return null;
  }
  return { Probe, get: () => captured };
}

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

describe('TemplateProvider — persistensi localStorage', () => {
  it('memuat kembali template user pada render pertama (bukan setelah effect)', () => {
    localStorage.setItem(
      'vtuber_templates',
      JSON.stringify([{ id: 'user-template-1', name: 'Classic VTuber', config: {} }])
    );
    const { Probe, get } = probe(useTemplate);
    render(
      <TemplateProvider>
        <Probe />
      </TemplateProvider>
    );
    expect(get().userTemplates).toHaveLength(1);
  });

  it('memuat kembali jadwal yang sudah disimpan', () => {
    localStorage.setItem(
      'vtuber_schedules',
      JSON.stringify([
        {
          id: 'schedule-1',
          templateId: 'user-template-1',
          entries: [{ id: 'e1', day: 1, time: '19:00', title: 'Stream!' }],
          timezone: 'Asia/Jakarta',
        },
      ])
    );
    const { Probe, get } = probe(useTemplate);
    render(
      <TemplateProvider>
        <Probe />
      </TemplateProvider>
    );
    expect(get().schedules).toHaveLength(1);
    expect(get().schedules[0].entries[0].title).toBe('Stream!');
  });

  it('tidak crash bila localStorage berisi JSON rusak', () => {
    localStorage.setItem('vtuber_templates', '{bukan json');
    localStorage.setItem('vtuber_schedules', '[[[');
    const { Probe, get } = probe(useTemplate);
    render(
      <TemplateProvider>
        <Probe />
      </TemplateProvider>
    );
    expect(get().userTemplates).toEqual([]);
    expect(get().schedules).toEqual([]);
  });

  it('saveSchedule lalu mount ulang tetap mengembalikan jadwal', () => {
    const first = probe(useTemplate);
    let api;
    render(
      <TemplateProvider>
        <first.Probe />
      </TemplateProvider>
    );
    act(() => {
      api = first.get().saveSchedule('tpl-1', {
        entries: [{ id: 'e1', day: 2, time: '20:00', title: 'Karaoke' }],
      });
    });
    expect(api.success).toBe(true);

    cleanup();
    const second = probe(useTemplate);
    render(
      <TemplateProvider>
        <second.Probe />
      </TemplateProvider>
    );
    expect(second.get().schedules).toHaveLength(1);
    expect(second.get().schedules[0].entries[0].title).toBe('Karaoke');
  });
});

describe('AuthProvider — restore sesi', () => {
  it('mengembalikan sesi dari localStorage saat mount', () => {
    localStorage.setItem(
      'vtuber_user',
      JSON.stringify({ id: 'user-9', email: 'x@y.com', role: 'admin', name: 'x' })
    );
    const { Probe, get } = probe(useAuth);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    expect(get().isAuthenticated).toBe(true);
    expect(get().user.email).toBe('x@y.com');
  });

  it('tidak terautentikasi bila belum pernah login', () => {
    const { Probe, get } = probe(useAuth);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    expect(get().isAuthenticated).toBe(false);
    expect(get().user).toBeNull();
  });

  it('login lalu logout membersihkan localStorage', () => {
    const { Probe, get } = probe(useAuth);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    act(() => get().login('me@mail.com', 'rahasia', 'user'));
    expect(get().isAuthenticated).toBe(true);
    expect(localStorage.getItem('vtuber_user')).toBeTruthy();

    act(() => get().logout());
    expect(get().isAuthenticated).toBe(false);
    expect(localStorage.getItem('vtuber_user')).toBeNull();
  });
});
