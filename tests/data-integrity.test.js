import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');
const data = JSON.parse(readFileSync(resolve(root, 'data/hackathons.json'), 'utf-8'));

describe('hackathons.json — programa', () => {
  it('tiene campos del programa', () => {
    expect(data.program).toBeDefined();
    expect(data.program.name).toBe('Lightning Hackathons 2026');
    expect(data.program.organization).toBe('La Crypta');
  });

  it('tiene 6 posiciones de premios', () => {
    expect(data.program.prizeDistribution).toHaveLength(6);
  });

  it('premios suman 1,000,000 sats por hackathon', () => {
    const total = data.program.prizeDistribution.reduce((sum, p) => sum + p.sats, 0);
    expect(total).toBe(1_000_000);
    expect(data.program.prizePerHackathon).toBe(1_000_000);
  });

  it('total del programa es 8,000,000 sats', () => {
    expect(data.program.totalPrize).toBe(8_000_000);
  });

  it('posiciones estan ordenadas de 1 a 6', () => {
    const positions = data.program.prizeDistribution.map(p => p.position);
    expect(positions).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('premios estan en orden descendente', () => {
    const sats = data.program.prizeDistribution.map(p => p.sats);
    for (let i = 1; i < sats.length; i++) {
      expect(sats[i]).toBeLessThan(sats[i - 1]);
    }
  });
});

describe('hackathons.json — hackathons', () => {
  it('tiene exactamente 8 hackathons', () => {
    expect(data.hackathons).toHaveLength(8);
  });

  it('IDs son unicos', () => {
    const ids = data.hackathons.map(h => h.id);
    expect(new Set(ids).size).toBe(8);
  });

  it('numeros van de 1 a 8 sin repetir', () => {
    const numbers = data.hackathons.map(h => h.number).sort((a, b) => a - b);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  const requiredFields = ['id', 'number', 'name', 'focus', 'difficulty', 'stars', 'month', 'dates', 'icon', 'tags', 'topics'];

  it('cada hackathon tiene todos los campos requeridos', () => {
    for (const h of data.hackathons) {
      for (const field of requiredFields) {
        expect(h[field], `hackathon "${h.id}" falta campo "${field}"`).toBeDefined();
      }
    }
  });

  it('stars corresponden a dificultad', () => {
    const mapping = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
    for (const h of data.hackathons) {
      expect(h.stars, `hackathon "${h.id}" stars no coinciden con difficulty "${h.difficulty}"`).toBe(mapping[h.difficulty]);
    }
  });

  it('fechas son ISO validas y estan en orden cronologico', () => {
    for (const h of data.hackathons) {
      const dates = h.dates.map(d => d.date);
      for (const d of dates) {
        expect(isNaN(new Date(d).getTime()), `fecha invalida: ${d} en hackathon "${h.id}"`).toBe(false);
      }
      for (let i = 1; i < dates.length; i++) {
        expect(
          new Date(dates[i]).getTime(),
          `fechas desordenadas en hackathon "${h.id}": ${dates[i - 1]} > ${dates[i]}`
        ).toBeGreaterThan(new Date(dates[i - 1]).getTime());
      }
    }
  });

  it('hackathons estan ordenados por numero', () => {
    for (let i = 0; i < data.hackathons.length; i++) {
      expect(data.hackathons[i].number).toBe(i + 1);
    }
  });

  it('cada hackathon tiene al menos 1 fecha', () => {
    for (const h of data.hackathons) {
      expect(h.dates.length, `hackathon "${h.id}" no tiene fechas`).toBeGreaterThan(0);
    }
  });

  it('cada fecha tiene date, type y title', () => {
    for (const h of data.hackathons) {
      for (const d of h.dates) {
        expect(d.date, `fecha sin date en hackathon "${h.id}"`).toBeDefined();
        expect(d.type, `fecha sin type en hackathon "${h.id}"`).toBeDefined();
        expect(d.title, `fecha sin title en hackathon "${h.id}"`).toBeDefined();
      }
    }
  });
});
