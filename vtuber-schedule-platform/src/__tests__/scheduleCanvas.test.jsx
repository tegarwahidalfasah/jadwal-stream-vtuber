// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';

import TemplateProvider from '../context/TemplateProvider';
import { useTemplate } from '../hooks/useTemplate';
import ScheduleCanvas from '../components/ScheduleCanvas';
import { getDayName, sortScheduleEntries, formatDate } from '../utils/format';
import { createId } from '../utils/id';

const ENTRIES = [
  { id: 'e3', day: 5, time: '20:00', title: 'Valorant' },
  { id: 'e1', day: 1, time: '19:00', title: 'Minecraft' },
  { id: 'e2', day: 1, time: '09:30', title: 'Pagi Ceria' },
];

// Probe untuk membaca nilai context dari luar render.
function probe(hook) {
  let captured;
  function Probe() {
    captured = hook();
    return null;
  }
  return { Probe, get: () => captured };
}

function mountWithProvider(hook) {
  const { Probe, get } = probe(hook);
  render(
    <TemplateProvider>
      <Probe />
    </TemplateProvider>
  );
  return get;
}

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

describe('ScheduleCanvas', () => {
  it('merender judul, nama streamer, dan seluruh jadwal', () => {
    render(<ScheduleCanvas config={{}} entries={ENTRIES} streamerName="Sora Wirya" />);
    expect(screen.getByText('Jadwal Stream')).toBeTruthy();
    expect(screen.getByText('Sora Wirya')).toBeTruthy();
    expect(screen.getByText('Valorant')).toBeTruthy();
    expect(screen.getByText('Minecraft')).toBeTruthy();
  });

  it('menampilkan nama hari, bukan angka indeks', () => {
    render(<ScheduleCanvas config={{}} entries={[ENTRIES[1]]} />);
    expect(screen.getByText('Senin')).toBeTruthy();
    expect(screen.queryByText('Hari 1')).toBeNull();
  });

  it('mengurutkan jadwal berdasarkan hari lalu jam', () => {
    render(<ScheduleCanvas config={{}} entries={ENTRIES} />);
    const titles = [...document.querySelectorAll('.title-text')].map((el) => el.textContent);
    expect(titles).toEqual(['Pagi Ceria', 'Minecraft', 'Valorant']);
  });

  it('menerapkan warna dari config, dan fallback bila kosong', () => {
    render(<ScheduleCanvas config={{ backgroundColor: '#123456' }} entries={[]} />);
    const canvas = document.getElementById('preview-canvas');
    expect(canvas.style.backgroundColor).toBe('rgb(18, 52, 86)');

    cleanup();
    render(<ScheduleCanvas config={{}} entries={[]} />);
    expect(document.getElementById('preview-canvas').style.backgroundColor).toBe(
      'rgb(26, 26, 46)'
    );
  });

  it('menampilkan pesan kosong bila belum ada jadwal', () => {
    render(<ScheduleCanvas config={{}} entries={[]} emptyText="Kosong dulu" />);
    expect(screen.getByText('Kosong dulu')).toBeTruthy();
  });

  it('memakai id kanvas khusus bila diminta', () => {
    render(<ScheduleCanvas config={{}} entries={[]} canvasId="obs-canvas" />);
    expect(document.getElementById('obs-canvas')).not.toBeNull();
  });
});

describe('TemplateProvider — master template', () => {
  const mount = () => mountWithProvider(useTemplate);

  it('menyediakan master template bawaan', () => {
    const get = mount();
    expect(get().getMasterTemplates().length).toBe(3);
  });

  it('admin bisa menambah master template dan tetap ada setelah reload', () => {
    const get = mount();
    act(() => {
      get().addMasterTemplate({
        name: 'Summer Vibes',
        description: 'Ceria',
        defaultConfig: { backgroundColor: '#fffbe6' },
      });
    });
    expect(get().getMasterTemplates()).toHaveLength(4);
    expect(get().getMasterTemplates()[3].lockedElements).toContain('canvas-ratio');

    cleanup();
    const get2 = mount();
    expect(get2().getMasterTemplates().map((t) => t.name)).toContain('Summer Vibes');
  });

  it('admin bisa menghapus master template', () => {
    const get = mount();
    const first = get().getMasterTemplates()[0];
    act(() => get().deleteMasterTemplate(first.id));
    expect(get().getMasterTemplates()).toHaveLength(2);
    expect(get().getMasterTemplates().find((t) => t.id === first.id)).toBeUndefined();
  });

  it('master template baru bisa dikloning ke workspace user', () => {
    const get = mount();
    let created;
    act(() => {
      created = get().addMasterTemplate({
        name: 'Custom',
        description: 'd',
        defaultConfig: { backgroundColor: '#000000' },
      });
    });
    act(() => get().cloneTemplate(created.template.id, 'user-1'));
    expect(get().userTemplates).toHaveLength(1);
    expect(get().userTemplates[0].config.backgroundColor).toBe('#000000');
  });
});

describe('utils', () => {
  it('getDayName memetakan indeks ke nama hari Indonesia', () => {
    expect([0, 1, 6].map(getDayName)).toEqual(['Minggu', 'Senin', 'Sabtu']);
    expect(getDayName(99)).toBe('');
    expect(getDayName('3')).toBe('Rabu');
  });

  it('sortScheduleEntries tidak memutasi array asal', () => {
    const original = [...ENTRIES];
    const sorted = sortScheduleEntries(original);
    expect(original).toEqual(ENTRIES);
    expect(sorted.map((e) => e.id)).toEqual(['e2', 'e1', 'e3']);
  });

  it('formatDate mengembalikan string kosong untuk tanggal tidak valid', () => {
    expect(formatDate('bukan-tanggal')).toBe('');
    expect(formatDate('2026-08-17T00:00:00Z')).not.toBe('');
  });

  it('createId menghasilkan ID unik meski dipanggil beruntun', () => {
    const ids = Array.from({ length: 2000 }, () => createId('entry'));
    expect(new Set(ids).size).toBe(2000);
    expect(ids[0]).toMatch(/^entry-/);
  });
});
