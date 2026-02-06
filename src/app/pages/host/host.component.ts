import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ParticipantDoc } from '../../models/participant';
import { SessionDoc } from '../../models/session';
import { QuestionService } from '../../services/question.service';
import { ScoringService } from '../../services/scoring.service';
import { SessionService } from '../../services/session.service';
import * as QRCode from 'qrcode';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-host',
  imports: [CommonModule],
  templateUrl: './host.component.html',
  styleUrl: './host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostComponent implements OnDestroy {
  private readonly sessionService = inject(SessionService);
  private readonly questionService = inject(QuestionService);
  private readonly scoring = inject(ScoringService);

  session = signal<SessionDoc | null>(null);
  sessionId = signal<string | null>(null);
  joinUrl = signal<string>('');
  qrCodeDataUrl = signal<string>('');
  participantsList = signal<ParticipantDoc[]>([]);
  totalQuestions = signal<number>(this.questionService.getQuestions().length);
  isBusy = signal<boolean>(false);
  error = signal<string | null>(null);
  info = signal<string | null>(null);
  countdownLeft = signal<number>(0);

  participantsCount = computed(() => this.participantsList().length);
  scanActive = computed(() => this.session()?.status === 'running');
  countdownActive = computed(() => this.countdownLeft() > 0);
  allFinished = computed(() => {
    const list = this.participantsList();
    return list.length > 0 && list.every((participant) => participant.finished);
  });
  createSessionLabel = computed(() => (this.session() ? 'Create New Session' : 'Create Session'));
  createSessionPrimary = computed(() => !this.session() || this.session()?.status === 'revealed');
  startSessionPrimary = computed(() => !!this.session() && this.session()?.status === 'lobby');
  revealResultsPrimary = computed(
    () => !!this.session() && this.session()?.status === 'running' && this.allFinished(),
  );
  progressParticipants = computed(() =>
    this.participantsList().map((participant, index) => {
      const answeredCount = participant.answeredCount ?? 0;
      const total = this.totalQuestions();
      const progress = total === 0 ? 0 : Math.min(100, Math.round((answeredCount / total) * 100));
      const classification = participant.finished
        ? this.scoring.classify(
            participant.scores ?? this.scoring.emptyScores(),
            participant.avgResponseTime ?? 0,
            participant.timeouts ?? 0,
          )
        : null;
      return {
        id: participant.id ?? `P${index + 1}`,
        label: index + 1,
        answeredCount,
        total,
        progress,
        avgResponseTime: participant.avgResponseTime ?? 0,
        timeouts: participant.timeouts ?? 0,
        finished: participant.finished,
        classification,
      };
    }),
  );
  aggregateResults = computed(() => {
    const list = this.participantsList();
    if (list.length === 0) {
      return null;
    }

    let empathySum = 0;
    let avgResponseSum = 0;
    let androidCount = 0;
    let confidenceSum = 0;

    list.forEach((participant) => {
      empathySum += participant.scores?.empathy ?? 0;
      avgResponseSum += participant.avgResponseTime ?? 0;
      const classification = this.scoring.classify(
        participant.scores ?? this.scoring.emptyScores(),
        participant.avgResponseTime ?? 0,
        participant.timeouts ?? 0,
      );
      if (classification.archetype === 'High-Functioning Android') {
        androidCount += 1;
      }
      confidenceSum += classification.confidence;
    });

    const total = list.length;
    return {
      androidRate: Math.round((androidCount / total) * 100),
      empathyAvg: Number((empathySum / total).toFixed(1)),
      avgResponseTime: Number((avgResponseSum / total).toFixed(2)),
      confidence: Math.round(confidenceSum / total),
    };
  });

  private sessionSub?: Subscription;
  private participantsSub?: Subscription;
  private countdownTimerId?: number;
  private infoTimerId?: number;

  ngOnDestroy(): void {
    this.sessionSub?.unsubscribe();
    this.participantsSub?.unsubscribe();
    this.clearCountdownTimer();
    this.clearInfoTimer();
  }

  async createSession(): Promise<void> {
    this.isBusy.set(true);
    this.error.set(null);
    try {
      const id = await this.sessionService.createSession(this.questionService.getVersion());
      this.sessionId.set(id);
      const joinUrl = this.buildJoinUrl(id);
      this.joinUrl.set(joinUrl);
      this.qrCodeDataUrl.set(
        await QRCode.toDataURL(joinUrl, {
          margin: 1,
          width: 240,
          color: { dark: '#8cf0ff', light: '#0a0c12' },
        }),
      );
      this.watchSession(id);
    } catch (error: unknown) {
      console.error('Create session failed', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.error.set(`Failed to create session: ${message}`);
    } finally {
      this.isBusy.set(false);
    }
  }

  async startSession(): Promise<void> {
    const id = this.sessionId();
    if (!id) {
      return;
    }
    if (this.participantsCount() === 0) {
      this.showInfo('At least one participant must join before starting the scan.');
      return;
    }
    if (this.session()?.status !== 'lobby') {
      return;
    }
    await this.sessionService.startSession(id, 5);
  }

  async revealResults(): Promise<void> {
    const id = this.sessionId();
    if (!id) {
      return;
    }
    if (this.session()?.status !== 'running') {
      return;
    }
    if (!this.allFinished()) {
      this.showInfo('Results can be revealed after all participants finish the scan.');
      return;
    }
    await this.sessionService.updateStatus(id, 'revealed');
    await this.sessionService.recomputeResults(id);
  }

  private watchSession(sessionId: string): void {
    this.sessionSub?.unsubscribe();
    this.participantsSub?.unsubscribe();

    this.sessionSub = this.sessionService.watchSession(sessionId).subscribe((session) => {
      this.session.set(session);
      this.syncCountdown(session);
    });
    this.participantsSub = this.sessionService
      .watchParticipants(sessionId)
      .subscribe((participants) => {
        this.participantsList.set(participants);
      });
  }

  private buildJoinUrl(sessionId: string): string {
    const base =
      environment.appBaseUrl === 'https://app.example.com'
        ? window.location.origin
        : environment.appBaseUrl;
    return `${base}/join/${sessionId}`;
  }

  private syncCountdown(session: SessionDoc | null): void {
    if (!session || session.status !== 'running') {
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

  private showInfo(message: string): void {
    this.info.set(message);
    this.clearInfoTimer();
    this.infoTimerId = window.setTimeout(() => {
      this.info.set(null);
      this.infoTimerId = undefined;
    }, 3200);
  }

  private clearInfoTimer(): void {
    if (this.infoTimerId) {
      window.clearTimeout(this.infoTimerId);
      this.infoTimerId = undefined;
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
