export type Axis = 'empathy' | 'initiative' | 'ambiguity' | 'efficiency';

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
}

export interface QuestionScore {
  [key: string]: Partial<Record<Axis, number>>;
}

export interface Question {
  id: string;
  text: string;
  durationSec: number;
  options: QuestionOption[];
  scoring: QuestionScore;
}
