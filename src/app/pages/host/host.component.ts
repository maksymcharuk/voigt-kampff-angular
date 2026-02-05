import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { SessionDoc } from '../../models/session';
import { QuestionService } from '../../services/question.service';
import { SessionService } from '../../services/session.service';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './host.component.html',
  styleUrl: './host.component.scss',
})
export class HostComponent implements OnInit, OnDestroy {
  session = signal<SessionDoc | null>(null);
  sessionId = signal<string | null>(null);
  joinUrl = signal<string>('');
  qrCodeDataUrl = signal<string>('');
  participants = signal<number>(0);
  isBusy = signal<boolean>(false);
  error = signal<string | null>(null);

  private sessionSub?: Subscription;
  private countSub?: Subscription;

  constructor(
    private sessionService: SessionService,
    private questionService: QuestionService,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.sessionSub?.unsubscribe();
    this.countSub?.unsubscribe();
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
    } catch (error) {
      this.error.set('Failed to create session.');
    } finally {
      this.isBusy.set(false);
    }
  }

  async startSession(): Promise<void> {
    const id = this.sessionId();
    if (!id) {
      return;
    }
    await this.sessionService.updateStatus(id, 'running');
    await this.sessionService.resetQuestions(id);
  }

  async advanceQuestion(): Promise<void> {
    const id = this.sessionId();
    if (!id) {
      return;
    }
    await this.sessionService.advanceQuestion(id);
  }

  async revealResults(): Promise<void> {
    const id = this.sessionId();
    if (!id) {
      return;
    }
    await this.sessionService.updateStatus(id, 'revealed');
    await this.sessionService.recomputeResults(id);
  }

  async simulateParticipants(): Promise<void> {
    const id = this.sessionId();
    if (!id) {
      return;
    }
    this.isBusy.set(true);
    await this.sessionService.simulateParticipants(id, 6);
    this.isBusy.set(false);
  }

  private watchSession(sessionId: string): void {
    this.sessionSub?.unsubscribe();
    this.countSub?.unsubscribe();

    this.sessionSub = this.sessionService.watchSession(sessionId).subscribe((session) => {
      this.session.set(session);
    });
    this.countSub = this.sessionService.watchParticipantsCount(sessionId).subscribe((count) => {
      this.participants.set(count);
    });
  }

  private buildJoinUrl(sessionId: string): string {
    const base =
      environment.appBaseUrl === 'https://app.example.com'
        ? window.location.origin
        : environment.appBaseUrl;
    return `${base}/join/${sessionId}`;
  }
}
