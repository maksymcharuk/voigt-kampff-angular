import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Question } from '../../models/question';
import { ParticipantScores, QuestionResponseSummary } from '../../models/participant';
import { QuestionService } from '../../services/question.service';
import { ParticipantService } from '../../services/participant.service';
import { SessionService } from '../../services/session.service';
import { ScoringService } from '../../services/scoring.service';
import { SessionDoc } from '../../models/session';
import { Timestamp } from 'firebase/firestore';
import { VignetteService } from '../../services/vignette.service';

@Component({
  selector: 'app-play',
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly questionService = inject(QuestionService);
  private readonly participantService = inject(ParticipantService);
  private readonly sessionService = inject(SessionService);
  private readonly scoring = inject(ScoringService);
  private readonly vignette = inject(VignetteService);

  sessionId = signal<string>('');
  status = signal<'lobby' | 'running' | 'revealed'>('lobby');
  currentIndex = signal<number>(-1);
  questions = signal<Question[]>([]);
  timeLeft = signal<number>(0);
  selectedOption = signal<string | null>(null);
  error = signal<string | null>(null);
  scores = signal<ParticipantScores>({
    empathy: 0,
    initiative: 0,
    ambiguity: 0,
    efficiency: 0,
  });
  answeredCount = signal<number>(0);
  countdownLeft = signal<number>(0);
  isFinished = computed(() => this.answeredCount() >= this.questions().length);
  countdownActive = computed(() => this.countdownLeft() > 0);

  private participantId = '';
  private totalResponseTime = 0;
  private timeouts = 0;
  private responses: QuestionResponseSummary[] = [];
  private answeredIndices = new Set<number>();
  private timerId?: number;
  private countdownTimerId?: number;
  private questionStart = 0;
  private sessionSub?: Subscription;
  private participantSub?: Subscription;
  private lastSelectedOption: string | null = null;
  private readonly timeoutEffect = effect(() => {
    const option = this.selectedOption();
    if (option === 'timeout' && this.lastSelectedOption !== 'timeout') {
      this.vignette.triggerTimeoutVignette();
    }
    this.lastSelectedOption = option;
  });

  question = computed(() => {
    const index = this.currentIndex();
    return index >= 0 ? this.questions()[index] : null;
  });

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    if (!sessionId) {
      this.router.navigate(['/host']);
      return;
    }
    this.sessionId.set(sessionId);
    this.questions.set(this.questionService.getQuestions(sessionId));
    this.participantId = this.participantService.getOrCreateParticipantId();

    this.participantSub = this.participantService
      .watchParticipant(sessionId, this.participantId)
      .subscribe((participant) => {
        if (!participant) {
          return;
        }
        this.scores.set(participant.scores ?? this.scoring.emptyScores());
        this.timeouts = participant.timeouts ?? 0;
        const answeredCount = participant.answeredCount ?? 0;
        this.answeredCount.set(answeredCount);
        this.responses = participant.responses ?? [];
        this.totalResponseTime = this.responses.length
          ? this.responses.reduce((sum, response) => sum + response.responseTime, 0)
          : (participant.avgResponseTime ?? 0) * answeredCount;
        this.answeredIndices = new Set(Array.from({ length: answeredCount }, (_, index) => index));
        if (this.status() === 'running' && !this.countdownActive()) {
          this.ensureCurrentQuestion();
        }
      });

    this.sessionSub = this.sessionService.watchSession(sessionId).subscribe((session) => {
      if (!session) {
        return;
      }
      this.status.set(session.status);
      if (session.status === 'revealed') {
        this.router.navigate(['/result', sessionId]);
        return;
      }
      if (session.status === 'running') {
        this.syncCountdown(session);
        if (!this.countdownActive()) {
          this.ensureCurrentQuestion();
        }
        return;
      }
      this.syncCountdown(session);
    });
  }

  ngOnDestroy(): void {
    this.sessionSub?.unsubscribe();
    this.participantSub?.unsubscribe();
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }
    this.clearCountdownTimer();
    this.vignette.clear();
  }

  async selectOption(optionId: string): Promise<void> {
    if (!this.question() || this.selectedOption() || this.status() !== 'running') {
      return;
    }
    this.error.set(null);
    try {
      await this.recordAnswer(optionId, this.elapsedSeconds());
    } catch (error: unknown) {
      console.error('Failed to record answer', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.error.set(`Failed to record answer: ${message}`);
    }
  }

  private ensureCurrentQuestion(): void {
    if (this.countdownActive()) {
      return;
    }
    if (this.isFinished()) {
      this.currentIndex.set(this.questions().length - 1);
      if (this.timerId) {
        window.clearInterval(this.timerId);
      }
      return;
    }
    const nextIndex = this.answeredCount();
    if (nextIndex !== this.currentIndex()) {
      this.currentIndex.set(nextIndex);
      this.selectedOption.set(null);
    }
    this.startQuestionTimer();
  }

  private startQuestionTimer(): void {
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }
    const current = this.question();
    if (!current || this.status() !== 'running' || this.countdownActive()) {
      return;
    }
    if (this.answeredIndices.has(this.currentIndex())) {
      this.timeLeft.set(0);
      return;
    }
    this.questionStart = performance.now();
    this.timeLeft.set(current.durationSec);
    this.timerId = window.setInterval(() => {
      const remaining = Math.max(0, current.durationSec - this.elapsedSeconds());
      this.timeLeft.set(Number(remaining.toFixed(1)));
      if (remaining <= 0 && !this.answeredIndices.has(this.currentIndex())) {
        this.recordAnswer('timeout', current.durationSec);
      }
    }, 100);
  }

  private elapsedSeconds(): number {
    return (performance.now() - this.questionStart) / 1000;
  }

  private async recordAnswer(optionId: string, responseTime: number): Promise<void> {
    const currentQuestion = this.question();
    if (!currentQuestion || this.answeredIndices.has(this.currentIndex())) {
      return;
    }
    this.selectedOption.set(optionId);
    this.answeredIndices.add(this.currentIndex());

    await this.participantService.writeAnswer(
      this.sessionId(),
      this.participantId,
      currentQuestion.id,
      optionId,
      Number(responseTime.toFixed(2)),
    );

    const axisTotals = this.scoring.getAxisTotals(currentQuestion, optionId);
    this.responses = [
      ...this.responses,
      {
        questionId: currentQuestion.id,
        optionId,
        responseTime: Number(responseTime.toFixed(2)),
        axisTotals,
      },
    ];

    if (optionId === 'timeout') {
      this.timeouts += 1;
    } else {
      this.scores.set(this.scoring.applyAnswer(this.scores(), currentQuestion, optionId));
    }

    this.totalResponseTime += responseTime;
    const updatedCount = this.answeredCount() + 1;
    this.answeredCount.set(updatedCount);

    const avgResponseTime = updatedCount === 0 ? 0 : this.totalResponseTime / updatedCount;

    const finished = updatedCount >= this.questions().length;
    await this.participantService.updateProgress(
      this.sessionId(),
      this.participantId,
      this.scores(),
      Number(avgResponseTime.toFixed(2)),
      this.timeouts,
      finished,
      updatedCount,
      this.questions().length,
      this.responses,
    );

    if (!finished) {
      this.ensureCurrentQuestion();
    }
  }

  private syncCountdown(session: SessionDoc): void {
    if (session.status !== 'running') {
      this.countdownLeft.set(0);
      this.clearCountdownTimer();
      return;
    }

    const startedAt = this.getTimestampMillis(session.countdownStartedAt);
    if (!startedAt) {
      this.countdownLeft.set(0);
      this.clearCountdownTimer();
      return;
    }

    const duration = session.countdownSeconds ?? 5;
    const normalizedStartedAt = Math.min(startedAt, Date.now());
    const updateCountdown = () => {
      const elapsedSeconds = Math.max(0, (Date.now() - normalizedStartedAt) / 1000);
      const remaining = Math.max(0, duration - elapsedSeconds);
      this.countdownLeft.set(Math.ceil(remaining));
      if (remaining <= 0) {
        this.clearCountdownTimer();
        this.ensureCurrentQuestion();
      }
    };

    updateCountdown();
    if (this.countdownLeft() > 0) {
      this.clearCountdownTimer();
      this.countdownTimerId = window.setInterval(updateCountdown, 200);
    }
  }

  private clearCountdownTimer(): void {
    if (this.countdownTimerId) {
      window.clearInterval(this.countdownTimerId);
      this.countdownTimerId = undefined;
    }
  }

  private getTimestampMillis(value: unknown): number | null {
    if (!value) {
      return null;
    }
    if (value instanceof Timestamp) {
      return value.toMillis();
    }
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === 'number') {
      return value;
    }
    return null;
  }
}
