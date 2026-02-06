import { EnvironmentInjector, Injectable, inject, runInInjectionContext } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { docData } from '@angular/fire/firestore';
import {
  doc,
  getFirestore,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { ParticipantDoc, ParticipantScores } from '../models/participant';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly storageKey = 'vk_participant_id';
  private readonly firestore = getFirestore(inject(FirebaseApp));
  private readonly injector = inject(EnvironmentInjector);

  getOrCreateParticipantId(): string {
    const existing = localStorage.getItem(this.storageKey);
    if (existing) {
      return existing;
    }
    const id = crypto.randomUUID();
    localStorage.setItem(this.storageKey, id);
    return id;
  }

  async joinSession(sessionId: string, participantId: string): Promise<void> {
    const participantRef = doc(
      this.firestore,
      'sessions',
      sessionId,
      'participants',
      participantId,
    );
    const snapshot = await getDoc(participantRef);
    if (!snapshot.exists()) {
      const participant: ParticipantDoc = {
        joinedAt: serverTimestamp(),
        finished: false,
        avgResponseTime: 0,
        timeouts: 0,
        answeredCount: 0,
        totalQuestions: 0,
        scores: {
          empathy: 0,
          initiative: 0,
          ambiguity: 0,
          efficiency: 0,
        },
      };
      await setDoc(participantRef, participant);
      await updateDoc(doc(this.firestore, 'sessions', sessionId), {
        totalParticipants: increment(1),
      });
    }
  }

  async writeAnswer(
    sessionId: string,
    participantId: string,
    questionId: string,
    choice: string,
    responseTime: number,
  ): Promise<void> {
    const answerRef = doc(
      this.firestore,
      'sessions',
      sessionId,
      'participants',
      participantId,
      'answers',
      questionId,
    );
    await setDoc(answerRef, { choice, responseTime }, { merge: true });
  }

  async updateProgress(
    sessionId: string,
    participantId: string,
    scores: ParticipantScores,
    avgResponseTime: number,
    timeouts: number,
    finished: boolean,
    answeredCount: number,
    totalQuestions: number,
  ): Promise<void> {
    const participantRef = doc(
      this.firestore,
      'sessions',
      sessionId,
      'participants',
      participantId,
    );
    await updateDoc(participantRef, {
      scores,
      avgResponseTime,
      timeouts,
      finished,
      answeredCount,
      totalQuestions,
    });
  }

  watchParticipant(sessionId: string, participantId: string): Observable<ParticipantDoc | null> {
    const participantRef = doc(
      this.firestore,
      'sessions',
      sessionId,
      'participants',
      participantId,
    );
    return runInInjectionContext(this.injector, () =>
      docData(participantRef, { idField: 'id' }).pipe(
        map((data) => (data as ParticipantDoc) ?? null),
      ),
    );
  }
}
