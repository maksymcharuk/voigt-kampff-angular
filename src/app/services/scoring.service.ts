import { Injectable } from '@angular/core';
import { ParticipantScores, QuestionResponseSummary } from '../models/participant';
import { Question } from '../models/question';

export type Archetype =
  | 'Human — Affective Variability'
  | 'Human-Leaning — Emotional Friction'
  | 'Unclassified — Indeterminate Signal'
  | 'Android-Leaning — Optimized Affect'
  | 'Android — High-Functioning Optimization'
  | 'Unclassified — Self-Inconsistent Pattern';

export interface ArchetypeResult {
  archetype: Archetype;
  confidence: number;
  summary: string;
}

@Injectable({ providedIn: 'root' })
export class ScoringService {
  private readonly axisMin = -2;
  private readonly axisMax = 2;

  emptyScores(): ParticipantScores {
    return { empathy: 0, initiative: 0, ambiguity: 0, efficiency: 0 };
  }

  getAxisTotals(question: Question, optionId: string): ParticipantScores {
    if (optionId === 'timeout') {
      return this.emptyScores();
    }
    const delta = question.scoring[optionId] ?? {};
    return {
      empathy: delta.empathy ?? 0,
      initiative: delta.initiative ?? 0,
      ambiguity: delta.ambiguity ?? 0,
      efficiency: delta.efficiency ?? 0,
    };
  }

  applyAnswer(scores: ParticipantScores, question: Question, optionId: string): ParticipantScores {
    const delta = this.getAxisTotals(question, optionId);
    return {
      empathy: scores.empathy + (delta.empathy ?? 0),
      initiative: scores.initiative + (delta.initiative ?? 0),
      ambiguity: scores.ambiguity + (delta.ambiguity ?? 0),
      efficiency: scores.efficiency + (delta.efficiency ?? 0),
    };
  }

  classify(
    scores: ParticipantScores,
    responses: QuestionResponseSummary[],
    avgResponseTime: number,
    timeouts: number,
  ): ArchetypeResult {
    const usableResponses = responses.filter((response) => response.optionId !== 'timeout');
    const perQuestionTotals = usableResponses.map((response) => response.axisTotals);
    const axisMean = this.computeAxisMeans(perQuestionTotals, scores, usableResponses.length);
    const consistencyIndex = this.computeConsistencyIndex(perQuestionTotals);
    const normalizedConsistency = this.normalize(consistencyIndex, 0, 0.5);
    const hesitationSignal = this.computeHesitationSignal(usableResponses, avgResponseTime);
    const normalizedHesitation = this.normalize(hesitationSignal, -2, 2);
    const extremeBias = this.computeExtremeBias(axisMean);
    const normalizedExtremeBias = this.normalize(extremeBias, 0, 0.6);

    const androidLikelihood = this.clamp(
      0.35 * axisMean.efficiency +
        0.2 * axisMean.initiative -
        0.25 * axisMean.empathy -
        0.1 * axisMean.ambiguity +
        0.1 * (1 - normalizedConsistency) +
        0.1 * normalizedExtremeBias +
        0.1 * (1 - normalizedHesitation),
      0,
      1,
    );

    const humanLikelihood = this.clamp(
      0.3 * axisMean.empathy +
        0.2 * axisMean.ambiguity +
        0.15 * normalizedConsistency +
        0.15 * normalizedHesitation -
        0.1 * axisMean.efficiency -
        0.1 * axisMean.initiative -
        0.1 * normalizedExtremeBias,
      0,
      1,
    );

    const diff = androidLikelihood - humanLikelihood;
    const timeoutPenalty = this.clamp(timeouts * 2, 0, 10);
    const confidence = this.clamp(Math.round(60 + 40 * Math.abs(diff) - timeoutPenalty), 60, 95);

    let archetype: Archetype = 'Unclassified — Indeterminate Signal';
    let summary =
      'Likelihood bands remain close. Behavioral signals are mixed and resist stable classification.';

    if (normalizedConsistency > 0.7 && Math.abs(diff) < 0.15) {
      archetype = 'Unclassified — Self-Inconsistent Pattern';
      summary =
        'High variance across responses suggests internal conflict, adaptive masking, or unstable heuristics.';
    } else if (diff <= -0.2 && humanLikelihood >= 0.65) {
      archetype = 'Human — Affective Variability';
      summary =
        'Empathic signals are present with meaningful variance and slower deliberation on affective items.';
    } else if (diff <= -0.08) {
      archetype = 'Human-Leaning — Emotional Friction';
      summary = 'Human-leaning patterns with mixed efficiency and hesitation on empathic choices.';
    } else if (diff >= 0.2 && androidLikelihood >= 0.65) {
      archetype = 'Android — High-Functioning Optimization';
      summary =
        'Consistent optimization, low ambiguity tolerance, and fast efficient responses dominate.';
    } else if (diff >= 0.08) {
      archetype = 'Android-Leaning — Optimized Affect';
      summary =
        'Efficiency and initiative trend high; empathy appears deliberate rather than reflexive.';
    }

    return { archetype, confidence, summary };
  }

  private computeAxisMeans(
    perQuestionTotals: ParticipantScores[],
    aggregateScores: ParticipantScores,
    count: number,
  ): ParticipantScores {
    if (perQuestionTotals.length === 0 || count === 0) {
      const divisor = Math.max(1, count);
      return {
        empathy: this.normalize(aggregateScores.empathy / divisor, this.axisMin, this.axisMax),
        initiative: this.normalize(
          aggregateScores.initiative / divisor,
          this.axisMin,
          this.axisMax,
        ),
        ambiguity: this.normalize(aggregateScores.ambiguity / divisor, this.axisMin, this.axisMax),
        efficiency: this.normalize(
          aggregateScores.efficiency / divisor,
          this.axisMin,
          this.axisMax,
        ),
      };
    }

    const sums = perQuestionTotals.reduce(
      (acc, current) => ({
        empathy: acc.empathy + this.normalize(current.empathy, this.axisMin, this.axisMax),
        initiative: acc.initiative + this.normalize(current.initiative, this.axisMin, this.axisMax),
        ambiguity: acc.ambiguity + this.normalize(current.ambiguity, this.axisMin, this.axisMax),
        efficiency: acc.efficiency + this.normalize(current.efficiency, this.axisMin, this.axisMax),
      }),
      { empathy: 0, initiative: 0, ambiguity: 0, efficiency: 0 },
    );

    const divisor = Math.max(1, perQuestionTotals.length);
    return {
      empathy: sums.empathy / divisor,
      initiative: sums.initiative / divisor,
      ambiguity: sums.ambiguity / divisor,
      efficiency: sums.efficiency / divisor,
    };
  }

  private computeConsistencyIndex(perQuestionTotals: ParticipantScores[]): number {
    if (perQuestionTotals.length <= 1) {
      return 0;
    }
    const totals = perQuestionTotals.map(
      (scores) =>
        this.normalize(scores.empathy, this.axisMin, this.axisMax) +
        this.normalize(scores.initiative, this.axisMin, this.axisMax) +
        this.normalize(scores.ambiguity, this.axisMin, this.axisMax) +
        this.normalize(scores.efficiency, this.axisMin, this.axisMax),
    );
    const mean = totals.reduce((sum, value) => sum + value, 0) / totals.length;
    const variance =
      totals.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / totals.length;
    return variance;
  }

  private computeHesitationSignal(
    responses: QuestionResponseSummary[],
    fallbackAvg: number,
  ): number {
    const empathyTimes = responses
      .filter((response) => response.axisTotals.empathy > 0)
      .map((response) => response.responseTime);
    const efficiencyTimes = responses
      .filter((response) => response.axisTotals.efficiency > 0)
      .map((response) => response.responseTime);

    const empathyAvg = empathyTimes.length
      ? empathyTimes.reduce((sum, value) => sum + value, 0) / empathyTimes.length
      : fallbackAvg;
    const efficiencyAvg = efficiencyTimes.length
      ? efficiencyTimes.reduce((sum, value) => sum + value, 0) / efficiencyTimes.length
      : fallbackAvg;

    return empathyAvg - efficiencyAvg;
  }

  private computeExtremeBias(axisMean: ParticipantScores): number {
    return Math.max(
      Math.abs(axisMean.efficiency - axisMean.empathy),
      Math.abs(axisMean.initiative - axisMean.ambiguity),
    );
  }

  private normalize(value: number, min: number, max: number): number {
    if (max === min) {
      return 0;
    }
    return this.clamp((value - min) / (max - min), 0, 1);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
