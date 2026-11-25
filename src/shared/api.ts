export type Entry = { user: string; steps: number };

export type DailyResponse = {
  day: string;
  mutation: string;
  hue: number;
  top: Entry[];
};

export type ScoreResponse = {
  best: number;
  top: Entry[];
};
