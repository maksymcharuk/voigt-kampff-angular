export type SessionStatus = 'lobby' | 'running' | 'revealed';

export interface SessionResults {
  androidRate: number;
  empathyAvg: number;
  avgResponseTime: number;
  confidence: number;
}

export interface SessionDoc {
  id?: string;
  createdAt?: unknown;
  status: SessionStatus;
  currentQuestionIndex: number;
  questionSetVersion: number;
  totalParticipants: number;
  results?: SessionResults;
}
