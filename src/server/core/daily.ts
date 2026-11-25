const MUTATIONS = [
  'Toxic green night',
  'Violet glow night',
  'Orange alarm night',
  'Cold blue night',
  'Rose pink night',
  'Sickly yellow night',
  'A normal night (the cat is still enormous)',
];

export const dayKey = (d = new Date()): string => d.toISOString().slice(0, 10);

const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export const todaysMutation = (day: string): { mutation: string; hue: number } => {
  const h = hash(`mutant-cat-${day}`);
  const i = h % MUTATIONS.length;
  const hue = i === MUTATIONS.length - 1 ? 0 : (h >>> 8) % 360;
  return { mutation: MUTATIONS[i] ?? MUTATIONS[0]!, hue };
};
