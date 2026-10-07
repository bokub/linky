import { APIError, Session } from '../lib/index.js';
import jwt from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';

const session = new Session(jwt.sign({ sub: ['11111111111111'] }, 'secret'));

describe('Linky module', () => {
  it('propagates API errors', async () => {
    expect.assertions(3);
    try {
      await session.getDailyConsumption('2023-04-02', '2023-04-01');
    } catch (e) {
      expect((e as APIError).message).toContain('Conso API a répondu avec une erreur');
      expect((e as APIError).code).toBe(400);
      expect((e as APIError).toString()).toContain('ADAM-ERR0002');
    }
  });

  it('can retrieve daily consumption', async () => {
    const data = await session.getDailyConsumption('2023-04-01', '2023-04-04');
    expect(data.grandeur[0].unite).toBe('Wh');
    expect(data.grandeur[0].points.length).toBe(3);
    expect(data.grandeur[0].points.map((point) => point.d)).toStrictEqual(['2023-04-01', '2023-04-02', '2023-04-03']);
  });

  it('can retrieve load curve', async () => {
    const data = await session.getLoadCurve('2023-04-01', '2023-04-02');
    expect(data.grandeur[0].unite).toBe('W');
    expect(data.grandeur[0].points.length).toBe(48);
    expect(data.grandeur[0].points[0].d).toBe(`2023-04-01 00:30:00`);
    expect(data.grandeur[0].points[3].d).toBe(`2023-04-01 02:00:00`);
  });

  it('can retrieve max power', async () => {
    const data = await session.getMaxPower('2023-04-01', '2023-04-04');
    expect(data.grandeur[0].unite).toBe('VA');
    expect(data.grandeur[0].points.length).toBe(3);
    expect(data.grandeur[0].points.map((point) => point.d.slice(0, 10))).toStrictEqual([
      '2023-04-01',
      '2023-04-02',
      '2023-04-03',
    ]);
  });

  it('can retrieve daily production', async () => {
    const data = await session.getDailyProduction('2023-04-01', '2023-04-04');
    expect(data.grandeur[0].unite).toBe('Wh');
    expect(data.grandeur[0].points.length).toBe(3);
    expect(data.grandeur[0].points.map((point) => point.d)).toStrictEqual(['2023-04-01', '2023-04-02', '2023-04-03']);
  });

  it('can retrieve production load curve', async () => {
    const data = await session.getProductionLoadCurve('2023-04-01', '2023-04-02');
    expect(data.grandeur[0].unite).toBe('W');
    expect(data.grandeur[0].points.length).toBe(48);
    expect(data.grandeur[0].points[0].d).toBe(`2023-04-01 00:30:00`);
    expect(data.grandeur[0].points[3].d).toBe(`2023-04-01 02:00:00`);
  });
});
