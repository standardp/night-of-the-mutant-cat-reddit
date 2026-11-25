import { Hono } from 'hono';
import { redis, reddit } from '@devvit/web/server';
import type { DailyResponse, Entry, ScoreResponse } from '../../shared/api';
import { dayKey, todaysMutation } from '../core/daily';

export const api = new Hono();

const boardKey = (day: string): string => `board:${day}`;

async function top10(day: string): Promise<Entry[]> {
  const rows = await redis.zRange(boardKey(day), 0, 9, { by: 'rank' });
  return rows.map((r) => ({ user: r.member, steps: r.score }));
}

api.get('/daily', async (c) => {
  const day = dayKey();
  const body: DailyResponse = { day, ...todaysMutation(day), top: await top10(day) };
  return c.json(body);
});

api.post('/score', async (c) => {
  const day = dayKey();
  const user = (await reddit.getCurrentUsername()) ?? 'anonymous';
  const { steps } = (await c.req.json()) as { steps?: unknown };
  const n = typeof steps === 'number' && Number.isInteger(steps) ? steps : 0;
  if (n < 8 || n > 1000) return c.json({ status: 'error', message: 'bad score' }, 400);
  const key = boardKey(day);
  const prev = await redis.zScore(key, user);
  if (prev === undefined || n < prev) await redis.zAdd(key, { member: user, score: n });
  await redis.expire(key, 60 * 60 * 24 * 30);
  const best = Math.min(n, prev ?? n);
  const body: ScoreResponse = { best, top: await top10(day) };
  return c.json(body);
});
