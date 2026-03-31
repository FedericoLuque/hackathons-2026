import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

const root = resolve(import.meta.dirname, '..');

const htmlFiles = [
  'index.html',
  'hackathons.html',
  'hackathons/foundations.html',
  'hackathons/identity.html',
  'hackathons/zaps.html',
  'hackathons/commerce.html',
  'hackathons/media.html',
  'hackathons/ai-agents.html',
  'hackathons/infrastructure.html',
  'hackathons/integration.html',
  'hackathons/como-participar.html',
  'docs/reglas.html',
  'docs/codigo-conducta.html',
];

describe('archivos HTML — existencia', () => {
  for (const file of htmlFiles) {
    it(`${file} existe y no esta vacio`, () => {
      const fullPath = resolve(root, file);
      expect(existsSync(fullPath), `${file} no existe`).toBe(true);
      const content = readFileSync(fullPath, 'utf-8');
      expect(content.trim().length, `${file} esta vacio`).toBeGreaterThan(0);
    });
  }
});

describe('archivos HTML — estructura basica', () => {
  for (const file of htmlFiles) {
    describe(file, () => {
      const content = readFileSync(resolve(root, file), 'utf-8');

      it('tiene DOCTYPE html', () => {
        expect(content.toLowerCase()).toContain('<!doctype html>');
      });

      it('tiene tag <html', () => {
        expect(content.toLowerCase()).toContain('<html');
      });

      it('tiene tag <head>', () => {
        expect(content.toLowerCase()).toContain('<head>');
      });

      it('tiene tag <body', () => {
        expect(content.toLowerCase()).toContain('<body');
      });

      it('tiene <title> no vacio', () => {
        const match = content.match(/<title>([^<]+)<\/title>/i);
        expect(match, `${file} no tiene <title>`).not.toBeNull();
        expect(match[1].trim().length, `${file} tiene <title> vacio`).toBeGreaterThan(0);
      });
    });
  }
});

describe('links internos', () => {
  for (const file of htmlFiles) {
    it(`${file} — links internos .html apuntan a archivos existentes`, () => {
      const fullPath = resolve(root, file);
      const content = readFileSync(fullPath, 'utf-8');
      const fileDir = dirname(fullPath);

      const linkRegex = /href="([^"]*\.html[^"]*)"/g;
      let match;
      while ((match = linkRegex.exec(content)) !== null) {
        const href = match[1].split('#')[0].split('?')[0];
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) continue;
        if (href === '') continue;

        const targetPath = resolve(fileDir, href);
        expect(
          existsSync(targetPath),
          `${file} tiene link roto: href="${match[1]}" → ${targetPath}`
        ).toBe(true);
      }
    });
  }
});

describe('CSS referenciados existen', () => {
  for (const file of htmlFiles) {
    it(`${file} — archivos CSS referenciados existen`, () => {
      const fullPath = resolve(root, file);
      const content = readFileSync(fullPath, 'utf-8');
      const fileDir = dirname(fullPath);

      const cssRegex = /href="([^"]*\.css)"/g;
      let match;
      while ((match = cssRegex.exec(content)) !== null) {
        const href = match[1];
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) continue;

        const targetPath = resolve(fileDir, href);
        expect(
          existsSync(targetPath),
          `${file} referencia CSS inexistente: href="${href}" → ${targetPath}`
        ).toBe(true);
      }
    });
  }
});
