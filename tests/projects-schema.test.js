import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');
const hackathonsData = JSON.parse(readFileSync(resolve(root, 'data/hackathons.json'), 'utf-8'));
const validHackathonIds = hackathonsData.hackathons.map(h => h.id);
const validStatuses = ['idea', 'building', 'submitted', 'finalist', 'winner', 'official'];

const projectFiles = readdirSync(resolve(root, 'data/projects'))
  .filter(f => f.endsWith('.json'));

describe('proyectos — archivos JSON', () => {
  it('existe al menos un archivo de proyectos', () => {
    expect(projectFiles.length).toBeGreaterThan(0);
  });

  for (const file of projectFiles) {
    describe(`data/projects/${file}`, () => {
      const content = JSON.parse(readFileSync(resolve(root, 'data/projects', file), 'utf-8'));

      it('parsea correctamente como JSON', () => {
        expect(content).toBeDefined();
      });

      it('tiene campo hackathon que coincide con un ID valido', () => {
        expect(validHackathonIds).toContain(content.hackathon);
      });

      it('tiene array de projects', () => {
        expect(Array.isArray(content.projects)).toBe(true);
      });

      it('IDs de proyecto son unicos', () => {
        const ids = content.projects.map(p => p.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      const requiredFields = ['id', 'name', 'description', 'team', 'repo', 'tech', 'status'];

      it('cada proyecto tiene campos requeridos', () => {
        for (const project of content.projects) {
          for (const field of requiredFields) {
            expect(project[field], `proyecto "${project.id || project.name}" falta campo "${field}"`).toBeDefined();
          }
        }
      });

      it('status es un valor valido', () => {
        for (const project of content.projects) {
          expect(
            validStatuses,
            `proyecto "${project.id}" tiene status invalido: "${project.status}"`
          ).toContain(project.status);
        }
      });

      it('repo es una URL valida', () => {
        for (const project of content.projects) {
          if (project.repo) {
            expect(
              () => new URL(project.repo),
              `proyecto "${project.id}" tiene repo URL invalida: "${project.repo}"`
            ).not.toThrow();
          }
        }
      });

      it('team es un array con al menos un miembro', () => {
        for (const project of content.projects) {
          expect(Array.isArray(project.team), `proyecto "${project.id}" team no es array`).toBe(true);
          expect(project.team.length, `proyecto "${project.id}" team esta vacio`).toBeGreaterThan(0);
        }
      });

      it('tech es un array no vacio', () => {
        for (const project of content.projects) {
          expect(Array.isArray(project.tech), `proyecto "${project.id}" tech no es array`).toBe(true);
          expect(project.tech.length, `proyecto "${project.id}" tech esta vacio`).toBeGreaterThan(0);
        }
      });
    });
  }
});
