import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../../services/participant.service';

@Component({
  selector: 'app-join',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly participantService = inject(ParticipantService);
  private readonly storageKey = 'vk_participant_name';

  status = signal<'idle' | 'joining' | 'ready' | 'error'>('idle');
  sessionId = signal<string>('');
  isBusy = signal<boolean>(false);
  nameControl = new FormControl<string>(this.loadStoredName(), {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(28)],
  });

  async ngOnInit(): Promise<void> {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    if (!sessionId) {
      this.status.set('error');
      return;
    }
    this.sessionId.set(sessionId);
  }

  async join(): Promise<void> {
    if (this.isBusy() || this.status() === 'joining') {
      return;
    }
    this.nameControl.markAsTouched();
    if (this.nameControl.invalid) {
      return;
    }
    const sessionId = this.sessionId();
    if (!sessionId) {
      this.status.set('error');
      return;
    }

    this.isBusy.set(true);
    this.status.set('joining');
    const rawName = this.nameControl.value.trim();
    const name = rawName.replace(/\s+/g, ' ');

    try {
      this.storeName(name);
      const participantId = this.participantService.getOrCreateParticipantId();
      await this.participantService.joinSession(sessionId, participantId, name);
      this.status.set('ready');
      setTimeout(() => {
        this.router.navigate(['/play', sessionId]);
      }, 700);
    } catch (error) {
      this.status.set('error');
    } finally {
      this.isBusy.set(false);
    }
  }

  private loadStoredName(): string {
    return localStorage.getItem(this.storageKey) ?? '';
  }

  private storeName(value: string): void {
    localStorage.setItem(this.storageKey, value);
  }
}
