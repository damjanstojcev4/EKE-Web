/** A fixed design-reference snapshot, not a live availability calculation. */
export type TrainingSession = {
  id: string;
  title: string;
  audience: string;
  format: string;
  language: string;
  cost: string;
  days: string;
  countdownLabel: string;
  category: string;
  learning: string;
  method: string;
  location: string;
  dates: string;
  spots: number;
  status: "open" | "closed";
};

export type TrainingTheme = {
  id: string;
  label: string;
  title: string;
  description: string;
  illustration: string;
};
