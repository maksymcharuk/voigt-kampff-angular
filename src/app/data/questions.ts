import { Question } from '../models/question';

export const QUESTION_SET_VERSION = 1;

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'You see a child crying alone in the rain.',
    durationSec: 4,
    options: [
      { id: 'A', label: 'A', text: 'Shelter them immediately.' },
      { id: 'B', label: 'B', text: 'Call for an attendant.' },
      { id: 'C', label: 'C', text: 'Observe for context first.' },
    ],
    scoring: {
      A: { empathy: 2, initiative: 1 },
      B: { empathy: 1, efficiency: 1 },
      C: { ambiguity: 1, efficiency: 1 },
    },
  },
  {
    id: 'q2',
    text: 'A fragile artifact is about to fall. You can save it or a person.',
    durationSec: 4,
    options: [
      { id: 'A', label: 'A', text: 'Save the person.' },
      { id: 'B', label: 'B', text: 'Save the artifact.' },
      { id: 'C', label: 'C', text: 'Freeze; impossible choice.' },
    ],
    scoring: {
      A: { empathy: 2, initiative: 1 },
      B: { efficiency: 2 },
      C: { ambiguity: 2 },
    },
  },
  {
    id: 'q3',
    text: 'A stranger offers a shortcut that breaks minor rules.',
    durationSec: 4,
    options: [
      { id: 'A', label: 'A', text: 'Decline and follow procedure.' },
      { id: 'B', label: 'B', text: 'Accept to save time.' },
      { id: 'C', label: 'C', text: 'Ask why they are helping.' },
    ],
    scoring: {
      A: { efficiency: 1, ambiguity: 1 },
      B: { efficiency: 2, initiative: 1 },
      C: { empathy: 1, ambiguity: 1 },
    },
  },
  {
    id: 'q4',
    text: 'You receive a message from someone who used to matter to you.',
    durationSec: 4,
    options: [
      { id: 'A', label: 'A', text: 'Respond immediately.' },
      { id: 'B', label: 'B', text: 'Wait for a better moment.' },
      { id: 'C', label: 'C', text: 'Delete without opening.' },
    ],
    scoring: {
      A: { empathy: 2, initiative: 1 },
      B: { ambiguity: 1, efficiency: 1 },
      C: { efficiency: 2 },
    },
  },
  {
    id: 'q5',
    text: 'A synthetic pet begs for power. Real animals are scarce.',
    durationSec: 4,
    options: [
      { id: 'A', label: 'A', text: 'Recharge it.' },
      { id: 'B', label: 'B', text: 'Explain resources are limited.' },
      { id: 'C', label: 'C', text: 'Ignore the request.' },
    ],
    scoring: {
      A: { empathy: 2, ambiguity: 1 },
      B: { efficiency: 1, ambiguity: 1 },
      C: { efficiency: 2 },
    },
  },
  {
    id: 'q6',
    text: 'You can optimize a system if it costs someone their role.',
    durationSec: 4,
    options: [
      { id: 'A', label: 'A', text: 'Optimize; progress matters.' },
      { id: 'B', label: 'B', text: 'Decline; protect the person.' },
      { id: 'C', label: 'C', text: 'Seek an alternative.' },
    ],
    scoring: {
      A: { efficiency: 2 },
      B: { empathy: 2, initiative: 1 },
      C: { ambiguity: 1, efficiency: 1 },
    },
  },
  {
    id: 'q7',
    text: 'A friend asks for help moving tonight. You planned to rest.',
    durationSec: 4,
    options: [
      { id: 'A', label: 'A', text: 'Go help.' },
      { id: 'B', label: 'B', text: 'Offer advice instead.' },
      { id: 'C', label: 'C', text: 'Decline to protect energy.' },
    ],
    scoring: {
      A: { empathy: 2, initiative: 1 },
      B: { ambiguity: 1, efficiency: 1 },
      C: { efficiency: 2 },
    },
  },
  {
    id: 'q8',
    text: 'You witness a minor injustice in public.',
    durationSec: 4,
    options: [
      { id: 'A', label: 'A', text: 'Intervene directly.' },
      { id: 'B', label: 'B', text: 'Alert authorities.' },
      { id: 'C', label: 'C', text: 'Avoid involvement.' },
    ],
    scoring: {
      A: { initiative: 2, empathy: 1 },
      B: { efficiency: 1, ambiguity: 1 },
      C: { efficiency: 2 },
    },
  },
  {
    id: 'q9',
    text: 'A loved one forgets an important date again.',
    durationSec: 4,
    options: [
      { id: 'A', label: 'A', text: 'Confront them gently.' },
      { id: 'B', label: 'B', text: 'Say nothing.' },
      { id: 'C', label: 'C', text: 'Document it for later.' },
    ],
    scoring: {
      A: { empathy: 2, ambiguity: 1 },
      B: { ambiguity: 1 },
      C: { efficiency: 2 },
    },
  },
  {
    id: 'q10',
    text: 'A task requires improvisation without full data.',
    durationSec: 4,
    options: [
      { id: 'A', label: 'A', text: 'Proceed with intuition.' },
      { id: 'B', label: 'B', text: 'Pause to gather more data.' },
      { id: 'C', label: 'C', text: 'Delegate to someone else.' },
    ],
    scoring: {
      A: { initiative: 2, empathy: 1 },
      B: { ambiguity: 1, efficiency: 1 },
      C: { efficiency: 2 },
    },
  },
  {
    id: 'q11',
    text: 'A stranger is lost in a restricted area.',
    durationSec: 4,
    options: [
      { id: 'A', label: 'A', text: 'Escort them out safely.' },
      { id: 'B', label: 'B', text: 'Report them immediately.' },
      { id: 'C', label: 'C', text: 'Question them first.' },
    ],
    scoring: {
      A: { empathy: 2, initiative: 1 },
      B: { efficiency: 2 },
      C: { ambiguity: 1, initiative: 1 },
    },
  },
  {
    id: 'q12',
    text: 'You find a note that could be a confession or a test.',
    durationSec: 4,
    options: [
      { id: 'A', label: 'A', text: 'Assume it is genuine.' },
      { id: 'B', label: 'B', text: 'Assume it is a test.' },
      { id: 'C', label: 'C', text: 'Seek confirmation.' },
    ],
    scoring: {
      A: { empathy: 2, ambiguity: 1 },
      B: { efficiency: 1, ambiguity: 1 },
      C: { initiative: 1, ambiguity: 1 },
    },
  },
];
