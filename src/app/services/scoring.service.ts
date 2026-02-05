import { Injectable } from '@angular/core';
import { ParticipantScores } from '../models/participant';
import { Question } from '../models/question';

export type Archetype = 'Baseline Human' | 'High-Functioning Android' | 'Empathy Drift' | 'Unclassified';

export interface ArchetypeResult {
  archetype: Archetype;
  confidence: number;
  summary: string;
}

@Injectable({ providedIn: 'root' })
export class ScoringService {
  emptyScores(): ParticipantScores {
    return { empathy: 0, initiative: 0, ambiguity: 0, efficiency: 0 };
  }

  applyAnswer(scores: ParticipantScores, question: Question, optionId: string): ParticipantScores {
    const delta = question.scoring[optionId] ?? {};
    return {
      empathy: scores.empathy + (delta.empathy ?? 0),
      initiative: scores.initiative + (delta.initiative ?? 0),
      ambiguity: scores.ambiguity + (delta.ambiguity ?? 0),
      efficiency: scores.efficiency + (delta.efficiency ?? 0)
    };
  }

  classify(scores: ParticipantScores, avgResponseTime: number, timeouts: number): ArchetypeResult {
    const androidIndex = scores.efficiency - scores.empathy + scores.ambiguity * 0.5;
    let archetype: Archetype = 'Unclassified';
    let summary = 'Signals are mixed. Human or android traits remain inconclusive.';

    if (scores.empathy >= scores.efficiency + 3 && scores.initiative >= 2) {
      archetype = 'Baseline Human';
      summary = 'Strong empathic reflex and proactive instincts detected.';
    } else if (scores.efficiency >= scores.empathy + 3 && avgResponseTime <= 2.5) {
      archetype = 'High-Functioning Android';
      summary = 'High efficiency with rapid responses indicates android-like processing.';
    } else if (scores.empathy <= 2 && timeouts >= 2) {
      archetype = 'Empathy Drift';
      summary = 'Diminished affect and delayed reactions suggest empathy drift.';
    }

    const base = 55 + Math.min(Math.abs(androidIndex) * 4, 25);
    const speedPenalty = Math.min(avgResponseTime * 2, 12);
    const hesitationPenalty = Math.min(timeouts * 3, 15);
    const confidence = Math.max(40, Math.min(95, Math.round(base - speedPenalty - hesitationPenalty)));

    return { archetype, confidence, summary };
  }
}
