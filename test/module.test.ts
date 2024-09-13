import { APIError, Session } from '../lib/index.js';
import jwt from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import('./fixtures/fixtures.cjs');

const session = new Session(jwt.sign({ sub: ['11111111111111'] }, 'secret'));

describe('Linky module', () => {
  it('propagates API errors', async () => {
    expect.assertions(3);
    try {
      await session.getDailyConsumption('2023-04-02', '2023-04-01');
    } catch (e) {
      expect((e as APIError).message).toContain('Conso API a répondu avec une erreur');
      expect((e as APIError).code).toBe(400);
      expect((e as APIError).toString()).toContain('Invalid_request');
    }
  });

  it('can retrieve daily consumption', async () => {
    const data = await session.getDailyConsumption('2023-04-01', '2023-04-04');
    expect(data.reading_type.unit).toBe('Wh');
    expect(data.interval_reading.length).toBe(3);
    expect(data.interval_reading.map((d) => d.date)).toStrictEqual(['2023-04-01', '2023-04-02', '2023-04-03']);
  });

  it('can retrieve load curve', async () => {
    const data = await session.getLoadCurve('2023-04-01', '2023-04-02');
    expect(data.reading_type.unit).toBe('W');
    expect(data.interval_reading.length).toBe(48);
    expect(data.interval_reading[0].date).toBe(`2023-04-01 00:30:00`);
    expect(data.interval_reading[3].date).toBe(`2023-04-01 02:00:00`);
  });

  it('can retrieve max power', async () => {
    const data = await session.getMaxPower('2023-04-01', '2023-04-04');
    expect(data.reading_type.unit).toBe('VA');
    expect(data.interval_reading.length).toBe(3);
    expect(data.interval_reading.map((d) => d.date.slice(0, 10))).toStrictEqual([
      '2023-04-01',
      '2023-04-02',
      '2023-04-03',
    ]);
  });

  it('can retrieve daily production', async () => {
    const data = await session.getDailyProduction('2023-04-01', '2023-04-04');
    expect(data.reading_type.unit).toBe('Wh');
    expect(data.interval_reading.length).toBe(3);
    expect(data.interval_reading.map((d) => d.date)).toStrictEqual(['2023-04-01', '2023-04-02', '2023-04-03']);
  });

  it('can retrieve production load curve', async () => {
    const data = await session.getProductionLoadCurve('2023-04-01', '2023-04-02');
    expect(data.reading_type.unit).toBe('W');
    expect(data.interval_reading.length).toBe(48);
    expect(data.interval_reading[0].date).toBe(`2023-04-01 00:30:00`);
    expect(data.interval_reading[3].date).toBe(`2023-04-01 02:00:00`);
  });
});
