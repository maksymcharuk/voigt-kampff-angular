import { Injectable } from '@angular/core';
import { QUESTIONS, QUESTION_SET_VERSION } from '../data/questions';
import { Question } from '../models/question';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly perSessionCount = 12;

  getQuestions(sessionId?: string): Question[] {
    const pool = [...QUESTIONS];
    const shuffled = sessionId ? this.seededShuffle(pool, sessionId) : this.shuffle(pool);
    return shuffled.slice(0, this.perSessionCount);
  }

  getPerSessionCount(): number {
    return this.perSessionCount;
  }

  getVersion(): number {
    return QUESTION_SET_VERSION;
  }

  private shuffle(list: Question[]): Question[] {
    for (let index = list.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
    }
    return list;
  }

  private seededShuffle(list: Question[], seedSource: string): Question[] {
    const random = this.createSeededRandom(seedSource);
    for (let index = list.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
    }
    return list;
  }

  private createSeededRandom(seedSource: string): () => number {
    let seed = 0;
    for (let index = 0; index < seedSource.length; index += 1) {
      seed = (seed * 31 + seedSource.charCodeAt(index)) >>> 0;
    }
    return this.mulberry32(seed || 1);
  }

  private mulberry32(seed: number): () => number {
    let state = seed;
    return () => {
      state |= 0;
      state = (state + 0x6d2b79f5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
}
