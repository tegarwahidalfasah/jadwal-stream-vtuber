// Penjaga regresi: setiap className yang dipakai di JSX harus punya aturan CSS.
// Sebelumnya 129 class dipakai dan 0 yang punya CSS (index.css masih CSS
// bawaan template Vite), sehingga seluruh UI tampil tanpa styling.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..');

function jsxFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : jsxFiles(full);
    return entry.name.endsWith('.jsx') ? [full] : [];
  });
}

function usedClasses() {
  const classes = new Set();
  for (const file of jsxFiles(SRC)) {
    const code = readFileSync(file, 'utf8');
    for (const m of code.matchAll(/className="([^"]+)"/g)) {
      m[1].split(/\s+/).filter(Boolean).forEach((c) => classes.add(c));
    }
    // className={`foo ${cond ? 'bar' : ''}`} — ambil token statisnya saja
    for (const m of code.matchAll(/className=\{`([^`]*)`\}/g)) {
      m[1]
        .replace(/\$\{[^}]*\}/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .forEach((c) => classes.add(c));
    }
  }
  return [...classes].sort();
}

describe('Cakupan CSS', () => {
  const css = readFileSync(join(SRC, 'index.css'), 'utf8');
  const classes = usedClasses();
  const missing = classes.filter((c) => !new RegExp(`\\.${c}(?![\\w-])`).test(css));

  it('menemukan class yang dipakai di JSX', () => {
    expect(classes.length).toBeGreaterThan(100);
  });

  it(`setiap class punya aturan CSS (total ${classes.length} class)`, () => {
    expect(missing).toEqual([]);
  });
});
