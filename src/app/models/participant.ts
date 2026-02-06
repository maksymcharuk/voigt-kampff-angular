export interface ParticipantScores {
  empathy: number;
  initiative: number;
  ambiguity: number;
  efficiency: number;
}

export interface QuestionResponseSummary {
  questionId: string;
  optionId: string;
  responseTime: number;
  axisTotals: ParticipantScores;
}

export interface ParticipantDoc {
  id?: string;
  joinedAt?: unknown;
  finished: boolean;
  avgResponseTime: number;
  scores: ParticipantScores;
  timeouts: number;
  responses?: QuestionResponseSummary[];
  answeredCount?: number;
  totalQuestions?: number;
}
