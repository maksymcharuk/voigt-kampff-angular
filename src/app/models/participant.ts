export interface ParticipantScores {
  empathy: number;
  initiative: number;
  ambiguity: number;
  efficiency: number;
}

export interface ParticipantDoc {
  id?: string;
  joinedAt?: unknown;
  finished: boolean;
  avgResponseTime: number;
  scores: ParticipantScores;
  timeouts: number;
  answeredCount?: number;
  totalQuestions?: number;
}
