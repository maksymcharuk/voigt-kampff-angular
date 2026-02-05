import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../../services/participant.service';
import { ScoringService } from '../../services/scoring.service';
import { ParticipantDoc } from '../../models/participant';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultComponent implements OnInit {
  sessionId = signal<string>('');
  result = signal<{ title: string; confidence: number; summary: string } | null>(null);
  participant = signal<ParticipantDoc | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private participantService: ParticipantService,
    private scoring: ScoringService,
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    if (!sessionId) {
      this.router.navigate(['/host']);
      return;
    }
    this.sessionId.set(sessionId);
    const participantId = this.participantService.getOrCreateParticipantId();
    this.participantService.watchParticipant(sessionId, participantId).subscribe((participant) => {
      if (!participant) {
        return;
      }
      this.participant.set(participant);
      const classification = this.scoring.classify(
        participant.scores ?? this.scoring.emptyScores(),
        participant.avgResponseTime ?? 0,
        participant.timeouts ?? 0,
      );
      this.result.set({
        title: classification.archetype,
        confidence: classification.confidence,
        summary: classification.summary,
      });
    });
  }
}
