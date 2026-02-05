import { EnvironmentInjector, Injectable, inject, runInInjectionContext } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { collectionData, docData } from '@angular/fire/firestore';
import {
  collection,
  doc,
  getFirestore,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { SessionDoc, SessionResults, SessionStatus } from '../models/session';
import { ParticipantDoc } from '../models/participant';
import { ScoringService } from './scoring.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly firestore = getFirestore(inject(FirebaseApp));
  private readonly scoring = inject(ScoringService);
  private readonly injector = inject(EnvironmentInjector);

  async createSession(questionSetVersion: number): Promise<string> {
    const sessionId = this.generateSessionId();
    const sessionRef = doc(this.firestore, 'sessions', sessionId);

    const session: SessionDoc = {
      status: 'lobby',
      currentQuestionIndex: -1,
      questionSetVersion,
      totalParticipants: 0,
      createdAt: serverTimestamp(),
    };

    await setDoc(sessionRef, session);
    return sessionId;
  }

  watchSession(sessionId: string): Observable<SessionDoc | null> {
    const sessionRef = doc(this.firestore, 'sessions', sessionId);
    return runInInjectionContext(this.injector, () =>
      docData(sessionRef, { idField: 'id' }).pipe(map((data) => (data as SessionDoc) ?? null)),
    );
  }

  updateStatus(sessionId: string, status: SessionStatus): Promise<void> {
    const sessionRef = doc(this.firestore, 'sessions', sessionId);
    return updateDoc(sessionRef, { status });
  }

  async advanceQuestion(sessionId: string): Promise<void> {
    const sessionRef = doc(this.firestore, 'sessions', sessionId);
    await updateDoc(sessionRef, { currentQuestionIndex: increment(1) });
  }

  async resetQuestions(sessionId: string): Promise<void> {
    const sessionRef = doc(this.firestore, 'sessions', sessionId);
    await updateDoc(sessionRef, { currentQuestionIndex: 0 });
  }

  async updateResults(sessionId: string, results: SessionResults): Promise<void> {
    const sessionRef = doc(this.firestore, 'sessions', sessionId);
    await updateDoc(sessionRef, { results });
  }

  async recomputeResults(sessionId: string): Promise<SessionResults> {
    const participantsRef = collection(this.firestore, 'sessions', sessionId, 'participants');
    const snapshot = await getDocs(query(participantsRef));

    let total = 0;
    let empathySum = 0;
    let avgResponseSum = 0;
    let androidCount = 0;
    let confidenceSum = 0;

    snapshot.forEach((docSnap) => {
      const participant = docSnap.data() as ParticipantDoc;
      total += 1;
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

    const results: SessionResults = {
      androidRate: total === 0 ? 0 : Math.round((androidCount / total) * 100),
      empathyAvg: total === 0 ? 0 : Number((empathySum / total).toFixed(1)),
      avgResponseTime: total === 0 ? 0 : Number((avgResponseSum / total).toFixed(2)),
      confidence: total === 0 ? 0 : Math.round(confidenceSum / total),
    };

    await this.updateResults(sessionId, results);
    return results;
  }

  async simulateParticipants(sessionId: string, count: number): Promise<void> {
    const participantsRef = collection(this.firestore, 'sessions', sessionId, 'participants');

    const writes: Promise<void>[] = [];
    for (let i = 0; i < count; i += 1) {
      const participantId = `sim-${Math.random().toString(36).slice(2, 8)}`;
      const participant: ParticipantDoc = {
        finished: true,
        avgResponseTime: Number((Math.random() * 2 + 1.2).toFixed(2)),
        timeouts: Math.floor(Math.random() * 2),
        scores: {
          empathy: Math.floor(Math.random() * 6),
          initiative: Math.floor(Math.random() * 5),
          ambiguity: Math.floor(Math.random() * 4),
          efficiency: Math.floor(Math.random() * 6),
        },
      };
      writes.push(setDoc(doc(participantsRef, participantId), participant));
    }

    await Promise.all(writes);
    const sessionRef = doc(this.firestore, 'sessions', sessionId);
    await updateDoc(sessionRef, { totalParticipants: increment(count) });
  }

  watchParticipantsCount(sessionId: string): Observable<number> {
    const participantsRef = collection(this.firestore, 'sessions', sessionId, 'participants');
    return runInInjectionContext(this.injector, () =>
      collectionData(participantsRef).pipe(map((list) => list.length)),
    );
  }

  private generateSessionId(): string {
    return Math.random().toString(36).slice(2, 10).toUpperCase();
  }
}
