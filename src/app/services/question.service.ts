import { Injectable } from '@angular/core';
import { QUESTIONS, QUESTION_SET_VERSION } from '../data/questions';
import { Question } from '../models/question';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  getQuestions(): Question[] {
    return QUESTIONS;
  }

  getVersion(): number {
    return QUESTION_SET_VERSION;
  }
}
