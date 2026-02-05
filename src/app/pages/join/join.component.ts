import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../../services/participant.service';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss',
})
export class JoinComponent implements OnInit {
  status = signal<'joining' | 'ready' | 'error'>('joining');
  sessionId = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private participantService: ParticipantService,
  ) {}

  async ngOnInit(): Promise<void> {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    if (!sessionId) {
      this.status.set('error');
      return;
    }
    this.sessionId.set(sessionId);

    try {
      const participantId = this.participantService.getOrCreateParticipantId();
      await this.participantService.joinSession(sessionId, participantId);
      this.status.set('ready');
      setTimeout(() => {
        this.router.navigate(['/play', sessionId]);
      }, 800);
    } catch (error) {
      this.status.set('error');
    }
  }
}
