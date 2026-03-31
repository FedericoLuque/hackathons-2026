import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');

describe('archivos CSS', () => {
  const cssFiles = ['css/styles.css', 'css/hackathon-detail.css'];

  for (const file of cssFiles) {
    it(`${file} existe y no esta vacio`, () => {
      const fullPath = resolve(root, file);
      expect(existsSync(fullPath), `${file} no existe`).toBe(true);
      const content = readFileSync(fullPath, 'utf-8');
      expect(content.trim().length, `${file} esta vacio`).toBeGreaterThan(0);
    });
  }

  it('styles.css tiene mas de 1000 lineas (design system completo)', () => {
    const content = readFileSync(resolve(root, 'css/styles.css'), 'utf-8');
    const lines = content.split('\n').length;
    expect(lines).toBeGreaterThan(1000);
  });
});

describe('directorio de fonts', () => {
  it('assets/fonts/ existe', () => {
    expect(existsSync(resolve(root, 'assets/fonts'))).toBe(true);
  });

  it('contiene archivos de fuentes', () => {
    const fonts = readdirSync(resolve(root, 'assets/fonts'), { recursive: true })
      .filter(f => {
        const fullPath = resolve(root, 'assets/fonts', f);
        return statSync(fullPath).isFile();
      });
    expect(fonts.length, 'no hay archivos de fuentes').toBeGreaterThan(0);
  });
});

describe('directorios de assets', () => {
  const requiredDirs = [
    'assets/fonts',
    'assets/judges',
    'assets/logos',
    'assets/pilares',
  ];

  for (const dir of requiredDirs) {
    it(`${dir}/ existe`, () => {
      expect(existsSync(resolve(root, dir)), `${dir} no existe`).toBe(true);
    });
  }
});

describe('archivos criticos del proyecto', () => {
  const criticalFiles = [
    'CNAME',
    'LICENSE',
    '.nojekyll',
    '.gitignore',
    'data/hackathons.json',
    'data/projects/foundations.json',
    'data/projects/README.md',
  ];

  for (const file of criticalFiles) {
    it(`${file} existe`, () => {
      expect(existsSync(resolve(root, file)), `${file} no existe`).toBe(true);
    });
  }
});
