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

// Hanya token yang bentuknya sah sebagai nama class CSS.
const CLASS_NAME = /^[A-Za-z][A-Za-z0-9_-]*$/;

function addClasses(classes, text) {
  for (const token of text.split(/\s+/)) {
    if (CLASS_NAME.test(token)) classes.add(token);
  }
}

function usedClasses() {
  const classes = new Set();
  for (const file of jsxFiles(SRC)) {
    const code = readFileSync(file, 'utf8');

    // className="foo bar"
    for (const m of code.matchAll(/className="([^"]+)"/g)) {
      addClasses(classes, m[1]);
    }

    // className={`foo ${cond ? 'bar' : ''}`}
    for (const m of code.matchAll(/className=\{`([^`]*)`\}/g)) {
      const raw = m[1];
      // token statis; token yang memuat interpolasi dilewati karena nilai
      // akhirnya baru diketahui saat runtime (mis. `toast-${tone}`)
      for (const token of raw.split(/\s+/)) {
        if (!token.includes('${')) addClasses(classes, token);
      }
      // string literal di dalam interpolasi. Hanya cabang hasil ternary yang
      // diambil: pada `${activeTab === 'gallery' ? 'active' : ''}`, yang
      // merupakan class adalah 'active' — 'gallery' hanya nilai pembanding.
      for (const expr of raw.matchAll(/\$\{[^}]*\}/g)) {
        const questionMark = expr[0].lastIndexOf('?');
        if (questionMark === -1) continue;
        for (const str of expr[0].slice(questionMark).matchAll(/'([^']*)'|"([^"]*)"/g)) {
          addClasses(classes, str[1] ?? str[2] ?? '');
        }
      }
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
