import type { DailyResponse, ScoreResponse } from '../shared/api';

declare const state: { steps: number };

declare global {
  interface Window {
    win: () => void;
    start: (lang: string) => void;
  }
}

const $ = (id: string): HTMLElement => document.getElementById(id) as HTMLElement;
const esc = (s: string): string =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c);

const style = document.createElement('style');
style.textContent = `#daily{position:fixed;top:6px;right:8px;z-index:5;font:11px monospace;color:#e8b44a;
background:#241d2bcc;padding:4px 8px;border:1px solid #e8b44a55;border-radius:4px;max-width:46vw}
.lb{margin:10px 0 0;padding:0;list-style:none;font:12px monospace;text-align:left;display:inline-block}
.lb li{padding:1px 0}.lb b{color:#e8b44a}`;
document.head.appendChild(style);

let daily: DailyResponse | undefined;

async function load(): Promise<void> {
  try {
    const r = await fetch('/api/daily');
    daily = (await r.json()) as DailyResponse;
    $('daily').innerHTML = `DAILY ${esc(daily.day)}<br>${esc(daily.mutation)}`;
    document.querySelectorAll<SVGElement>('#scene svg').forEach((n) => {
      n.style.filter = `hue-rotate(${daily?.hue ?? 0}deg)`;
    });
  } catch {
    $('daily').textContent = 'offline';
  }
}

function board(top: DailyResponse['top'], mine?: number): string {
  if (!top.length) return '<p>No scores yet today. You could be first.</p>';
  return (
    `<ol class="lb">` +
    top.map((e, i) => `<li><b>${i + 1}.</b> u/${esc(e.user)}: ${e.steps} actions</li>`).join('') +
    `</ol>` +
    (mine ? `<p>Your best today: ${mine} actions.</p>` : '')
  );
}

const origWin = window.win;
window.win = function () {
  origWin();
  const steps = state.steps;
  const card = $('card');
  const holder = document.createElement('div');
  holder.innerHTML = '<p>Posting your score...</p>';
  card.insertBefore(holder, card.querySelector('#again'));
  fetch('/api/score', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ steps }),
  })
    .then((r) => r.json() as Promise<ScoreResponse>)
    .then((s) => {
      holder.innerHTML =
        `<p><b>Today's board (fewest actions wins)</b></p>${board(s.top, s.best)}` +
        `<p style="font-size:11px;color:#8d7fa0">A new mutation and a fresh board arrive every day.</p>`;
    })
    .catch(() => {
      holder.innerHTML = '<p>Could not reach the leaderboard.</p>';
    });
};

void load();
