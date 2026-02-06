import { Question } from '../models/question';

export const QUESTION_SET_VERSION = 3;

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
  {
    id: 'q13',
    text: 'A memory feels borrowed. It comforts you anyway.',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Hold onto it; comfort matters.' },
      { id: 'B', label: 'B', text: 'Discard it; accuracy matters.' },
      { id: 'C', label: 'C', text: 'Test it against evidence.' },
    ],
    scoring: {
      A: { empathy: 2, ambiguity: 1 },
      B: { efficiency: 2, empathy: -1 },
      C: { initiative: 1, ambiguity: 1 },
    },
  },
  {
    id: 'q14',
    text: 'You are asked to evaluate a being who sounds convincingly human.',
    durationSec: 13,
    options: [
      { id: 'A', label: 'A', text: 'Focus on emotional inconsistency.' },
      { id: 'B', label: 'B', text: 'Focus on factual precision.' },
      { id: 'C', label: 'C', text: 'Let them tell a story.' },
    ],
    scoring: {
      A: { empathy: 1, ambiguity: 1, initiative: 1 },
      B: { efficiency: 2, ambiguity: -1 },
      C: { empathy: 2, ambiguity: 1 },
    },
  },
  {
    id: 'q15',
    text: 'A hidden test measures how you react to animal suffering.',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Intervene immediately.' },
      { id: 'B', label: 'B', text: 'Assess risk before acting.' },
      { id: 'C', label: 'C', text: 'Document and report.' },
    ],
    scoring: {
      A: { empathy: 2, initiative: 1, efficiency: -1 },
      B: { ambiguity: 1, efficiency: 1 },
      C: { efficiency: 2, ambiguity: 1 },
    },
  },
  {
    id: 'q16',
    text: 'You realize someone has been imitating your mannerisms for weeks.',
    durationSec: 13,
    options: [
      { id: 'A', label: 'A', text: 'Ask them why; stay curious.' },
      { id: 'B', label: 'B', text: 'Confront them sharply.' },
      { id: 'C', label: 'C', text: 'Ignore it and protect your distance.' },
    ],
    scoring: {
      A: { empathy: 1, ambiguity: 1, initiative: 1 },
      B: { initiative: 2, empathy: -1 },
      C: { efficiency: 1, ambiguity: 1 },
    },
  },
  {
    id: 'q17',
    text: 'A partner asks if you would trade a memory to solve a crisis faster.',
    durationSec: 14,
    options: [
      { id: 'A', label: 'A', text: 'Yes, if it saves lives.' },
      { id: 'B', label: 'B', text: 'No, identity is not negotiable.' },
      { id: 'C', label: 'C', text: 'Ask what the memory is worth.' },
    ],
    scoring: {
      A: { efficiency: 2, empathy: 1 },
      B: { empathy: 2, initiative: 1 },
      C: { ambiguity: 2, initiative: 1 },
    },
  },
  {
    id: 'q18',
    text: 'You overhear someone calling you “manufactured.”',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Correct them calmly.' },
      { id: 'B', label: 'B', text: 'Ignore them; focus on task.' },
      { id: 'C', label: 'C', text: 'Challenge them publicly.' },
    ],
    scoring: {
      A: { ambiguity: 1, initiative: 1 },
      B: { efficiency: 2, empathy: -1 },
      C: { initiative: 2, empathy: 1 },
    },
  },
  {
    id: 'q19',
    text: 'A perfect solution would expose a painful truth for everyone involved.',
    durationSec: 13,
    options: [
      { id: 'A', label: 'A', text: 'Choose truth, even if it hurts.' },
      { id: 'B', label: 'B', text: 'Choose a softer, slower path.' },
      { id: 'C', label: 'C', text: 'Delay until you can soften it.' },
    ],
    scoring: {
      A: { efficiency: 2, initiative: 1 },
      B: { empathy: 2, ambiguity: 1 },
      C: { ambiguity: 2, empathy: 1 },
    },
  },
  {
    id: 'q20',
    text: 'A stranger offers a test to prove your “authenticity.”',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Refuse; authenticity isn’t performative.' },
      { id: 'B', label: 'B', text: 'Accept and control the terms.' },
      { id: 'C', label: 'C', text: 'Agree only if it helps them.' },
    ],
    scoring: {
      A: { initiative: 1, ambiguity: 1 },
      B: { efficiency: 1, initiative: 1 },
      C: { empathy: 2, ambiguity: 1 },
    },
  },
  {
    id: 'q21',
    text: 'You are asked to retire a being who claims to feel fear.',
    durationSec: 14,
    options: [
      { id: 'A', label: 'A', text: 'Verify the claim before acting.' },
      { id: 'B', label: 'B', text: 'Decline; fear deserves mercy.' },
      { id: 'C', label: 'C', text: 'Proceed; duty outweighs claims.' },
    ],
    scoring: {
      A: { ambiguity: 2, initiative: 1 },
      B: { empathy: 2, efficiency: -1 },
      C: { efficiency: 2, empathy: -1 },
    },
  },
  {
    id: 'q22',
    text: 'A child asks if your feelings are real.',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Answer gently and honestly.' },
      { id: 'B', label: 'B', text: 'Deflect to avoid confusion.' },
      { id: 'C', label: 'C', text: 'Explain the mechanics of emotion.' },
    ],
    scoring: {
      A: { empathy: 2, ambiguity: 1 },
      B: { efficiency: 1, ambiguity: 1 },
      C: { efficiency: 1, initiative: 1 },
    },
  },
];
