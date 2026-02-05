import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Question } from '../../models/question';
import { ParticipantScores } from '../../models/participant';
import { QuestionService } from '../../services/question.service';
import { ParticipantService } from '../../services/participant.service';
import { SessionService } from '../../services/session.service';
import { ScoringService } from '../../services/scoring.service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent implements OnInit, OnDestroy {
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

  private participantId = '';
  private responseTimes: number[] = [];
  private timeouts = 0;
  private answeredIndices = new Set<number>();
  private timerId?: number;
  private questionStart = 0;
  private sessionSub?: Subscription;

  question = computed(() => {
    const index = this.currentIndex();
    return index >= 0 ? this.questions()[index] : null;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private participantService: ParticipantService,
    private sessionService: SessionService,
    private scoring: ScoringService,
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    if (!sessionId) {
      this.router.navigate(['/host']);
      return;
    }
    this.sessionId.set(sessionId);
    this.questions.set(this.questionService.getQuestions());
    this.participantId = this.participantService.getOrCreateParticipantId();

    this.sessionSub = this.sessionService.watchSession(sessionId).subscribe((session) => {
      if (!session) {
        return;
      }
      this.status.set(session.status);
      if (session.status === 'revealed') {
        this.router.navigate(['/result', sessionId]);
        return;
      }
      if (session.currentQuestionIndex !== this.currentIndex()) {
        this.currentIndex.set(session.currentQuestionIndex);
        this.selectedOption.set(null);
        this.startQuestionTimer();
      }
    });
  }

  ngOnDestroy(): void {
    this.sessionSub?.unsubscribe();
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }
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

  private startQuestionTimer(): void {
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }
    const current = this.question();
    if (!current || this.status() !== 'running') {
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

    if (optionId === 'timeout') {
      this.timeouts += 1;
    } else {
      this.scores.set(this.scoring.applyAnswer(this.scores(), currentQuestion, optionId));
    }

    this.responseTimes.push(responseTime);
    this.answeredCount.set(this.answeredCount() + 1);

    const avgResponseTime = this.responseTimes.length
      ? this.responseTimes.reduce((sum, value) => sum + value, 0) / this.responseTimes.length
      : 0;

    const finished = this.answeredCount() >= this.questions().length;
    await this.participantService.updateProgress(
      this.sessionId(),
      this.participantId,
      this.scores(),
      Number(avgResponseTime.toFixed(2)),
      this.timeouts,
      finished,
    );
  }
}
