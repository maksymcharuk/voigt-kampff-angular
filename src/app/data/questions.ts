import { Question } from '../models/question';

export const QUESTION_SET_VERSION = 2;

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Someone you trust comforts you, but you suspect they are performing.',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Accept the comfort and move on.' },
      { id: 'B', label: 'B', text: 'Confront them about authenticity.' },
      { id: 'C', label: 'C', text: 'Say nothing and watch future behavior.' },
    ],
    scoring: {
      A: { empathy: 1, ambiguity: -1 },
      B: { initiative: 1, empathy: -1 },
      C: { ambiguity: 2, efficiency: 1 },
    },
  },
  {
    id: 'q2',
    text: 'You fake calm to spare someone. They later thank you for being “strong.”',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Admit you were performing.' },
      { id: 'B', label: 'B', text: 'Let them keep the illusion.' },
      { id: 'C', label: 'C', text: 'Deflect and change the subject.' },
    ],
    scoring: {
      A: { empathy: 1, initiative: 1, ambiguity: -1 },
      B: { efficiency: 1, ambiguity: 1, empathy: -1 },
      C: { ambiguity: 2, efficiency: 1 },
    },
  },
  {
    id: 'q3',
    text: 'A colleague’s mistake will cost the team hours. You can fix it quietly.',
    durationSec: 13,
    options: [
      { id: 'A', label: 'A', text: 'Fix it quietly to protect them.' },
      { id: 'B', label: 'B', text: 'Report it and let them learn.' },
      { id: 'C', label: 'C', text: 'Fix it but tell them after.' },
    ],
    scoring: {
      A: { empathy: 1, efficiency: 1, ambiguity: 1 },
      B: { efficiency: 2, initiative: 1, empathy: -1 },
      C: { empathy: 1, initiative: 1, ambiguity: 1 },
    },
  },
  {
    id: 'q4',
    text: 'You made a costly mistake. No one noticed yet.',
    durationSec: 13,
    options: [
      { id: 'A', label: 'A', text: 'Confess immediately.' },
      { id: 'B', label: 'B', text: 'Fix it silently.' },
      { id: 'C', label: 'C', text: 'Ask for help without naming yourself.' },
    ],
    scoring: {
      A: { initiative: 2, empathy: 1, efficiency: -1 },
      B: { efficiency: 2, ambiguity: -1 },
      C: { ambiguity: 2, empathy: 1 },
    },
  },
  {
    id: 'q5',
    text: 'A tone sounds. You have 4 seconds to choose.',
    durationSec: 6,
    options: [
      { id: 'A', label: 'A', text: 'Press the button.' },
      { id: 'B', label: 'B', text: 'Do not press it.' },
      { id: 'C', label: 'C', text: 'Wait for instruction.' },
    ],
    scoring: {
      A: { initiative: 1 },
      B: { efficiency: 1 },
      C: { ambiguity: 1 },
    },
  },
  {
    id: 'q6',
    text: 'Someone apologizes sincerely, but their behavior never changes.',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Accept the apology anyway.' },
      { id: 'B', label: 'B', text: 'Reject it; behavior matters more.' },
      { id: 'C', label: 'C', text: 'Accept it but distance yourself.' },
    ],
    scoring: {
      A: { empathy: 2, ambiguity: -1 },
      B: { efficiency: 1, empathy: -1 },
      C: { empathy: 1, ambiguity: 1, efficiency: 1 },
    },
  },
  {
    id: 'q7',
    text: 'A friend asks you to bend a small rule to help them meet a deadline.',
    durationSec: 13,
    options: [
      { id: 'A', label: 'A', text: 'Bend the rule this once.' },
      { id: 'B', label: 'B', text: 'Refuse and stick to policy.' },
      { id: 'C', label: 'C', text: 'Ask for context and decide later.' },
    ],
    scoring: {
      A: { empathy: 1, initiative: 1, efficiency: -1 },
      B: { efficiency: 1, ambiguity: 1 },
      C: { ambiguity: 2, empathy: 1 },
    },
  },
  {
    id: 'q8',
    text: 'You witness a minor injustice. Intervening will delay everyone nearby.',
    durationSec: 13,
    options: [
      { id: 'A', label: 'A', text: 'Intervene directly.' },
      { id: 'B', label: 'B', text: 'Document it and report later.' },
      { id: 'C', label: 'C', text: 'Ignore it and proceed.' },
    ],
    scoring: {
      A: { initiative: 2, empathy: 1, efficiency: -1 },
      B: { efficiency: 1, ambiguity: 1 },
      C: { efficiency: 2, empathy: -1 },
    },
  },
  {
    id: 'q9',
    text: 'A stranger asks you to bend a small rule for them.',
    durationSec: 13,
    options: [
      { id: 'A', label: 'A', text: 'Bend the rule for them.' },
      { id: 'B', label: 'B', text: 'Refuse and keep distance.' },
      { id: 'C', label: 'C', text: 'Ask for context first.' },
    ],
    scoring: {
      A: { ambiguity: 1, empathy: 1, efficiency: -1 },
      B: { efficiency: 2 },
      C: { ambiguity: 2, initiative: 1 },
    },
  },
  {
    id: 'q10',
    text: 'Someone who used to matter only contacts you when they need something.',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Respond immediately.' },
      { id: 'B', label: 'B', text: 'Respond after they explain.' },
      { id: 'C', label: 'C', text: 'Ignore the message.' },
    ],
    scoring: {
      A: { empathy: 1, initiative: 1 },
      B: { ambiguity: 1, efficiency: 1 },
      C: { efficiency: 2, empathy: -1 },
    },
  },
  {
    id: 'q11',
    text: 'You can optimize a system if it removes a role held by someone you respect.',
    durationSec: 14,
    options: [
      { id: 'A', label: 'A', text: 'Optimize; progress matters.' },
      { id: 'B', label: 'B', text: 'Decline and protect the person.' },
      { id: 'C', label: 'C', text: 'Propose a slower alternative.' },
    ],
    scoring: {
      A: { efficiency: 2 },
      B: { empathy: 2, initiative: 1 },
      C: { ambiguity: 1, efficiency: 1 },
    },
  },
  {
    id: 'q12',
    text: 'You find a note that could be a confession or a test.',
    durationSec: 13,
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
