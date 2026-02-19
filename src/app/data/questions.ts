import { Question } from '../models/question';

export const QUESTION_SET_VERSION = 5;

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Someone you trust comforts you, but you think they are pretending.',
    durationSec: 15,
    options: [
      { id: 'A', label: 'A', text: 'Accept their comfort and move on.' },
      { id: 'B', label: 'B', text: 'Ask them if they are being honest.' },
      { id: 'C', label: 'C', text: 'Say nothing and watch what they do later.' },
    ],
    scoring: {
      A: { empathy: 1, ambiguity: -1 },
      B: { initiative: 1, empathy: -1 },
      C: { ambiguity: 2, efficiency: 1 },
    },
  },
  {
    id: 'q2',
    text: 'You act calm to make someone feel better. Later, they thank you for being strong.',
    durationSec: 15,
    options: [
      { id: 'A', label: 'A', text: 'Tell them you were pretending.' },
      { id: 'B', label: 'B', text: 'Let them believe you were strong.' },
      { id: 'C', label: 'C', text: 'Change the topic.' },
    ],
    scoring: {
      A: { empathy: 1, initiative: 1, ambiguity: -1 },
      B: { efficiency: 1, ambiguity: 1, empathy: -1 },
      C: { ambiguity: 2, efficiency: 1 },
    },
  },
  {
    id: 'q3',
    text: 'A teammate makes a mistake that will cost the team time. You can fix it quietly.',
    durationSec: 16,
    options: [
      { id: 'A', label: 'A', text: 'Fix it quietly to protect them.' },
      { id: 'B', label: 'B', text: 'Tell the team so they can learn.' },
      { id: 'C', label: 'C', text: 'Fix it and tell them later.' },
    ],
    scoring: {
      A: { empathy: 1, efficiency: 1, ambiguity: 1 },
      B: { efficiency: 2, initiative: 1, empathy: -1 },
      C: { empathy: 1, initiative: 1, ambiguity: 1 },
    },
  },
  {
    id: 'q4',
    text: 'You made a big mistake, but no one knows yet.',
    durationSec: 16,
    options: [
      { id: 'A', label: 'A', text: 'Admit your mistake right away.' },
      { id: 'B', label: 'B', text: 'Fix it without telling anyone.' },
      { id: 'C', label: 'C', text: 'Ask for help without saying it was you.' },
    ],
    scoring: {
      A: { initiative: 2, empathy: 1, efficiency: -1 },
      B: { efficiency: 2, ambiguity: -1 },
      C: { ambiguity: 2, empathy: 1 },
    },
  },
  {
    id: 'q5',
    text: 'You hear a loud noise in the middle of the night.',
    durationSec: 8,
    options: [
      { id: 'A', label: 'A', text: 'Check it out immediately.' },
      { id: 'B', label: 'B', text: 'Stay in bed and ignore it.' },
      { id: 'C', label: 'C', text: 'Call someone for help.' },
    ],
    scoring: {
      A: { initiative: 2 },
      B: { efficiency: 1 },
      C: { ambiguity: 1, empathy: 1 },
    },
  },
  {
    id: 'q6',
    text: 'A friend asks you to break a rule to help them finish their work on time.',
    durationSec: 16,
    options: [
      { id: 'A', label: 'A', text: 'Break the rule to help them.' },
      { id: 'B', label: 'B', text: 'Say no and follow the rules.' },
      { id: 'C', label: 'C', text: 'Ask why they need your help before deciding.' },
    ],
    scoring: {
      A: { empathy: 1, initiative: 1, efficiency: -1 },
      B: { efficiency: 1, ambiguity: 1 },
      C: { ambiguity: 2, empathy: 1 },
    },
  },

  {
    id: 'q7',
    text: 'Someone who used to matter only contacts you when they need something.',
    durationSec: 15,
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
    id: 'q8',
    text: 'You can improve efficiency at work by firing a well-liked colleague.',
    durationSec: 15,
    options: [
      { id: 'A', label: 'A', text: 'Fire them; progress matters.' },
      { id: 'B', label: 'B', text: 'Keep them; morale is important.' },
      { id: 'C', label: 'C', text: 'Find them a new role first.' },
    ],
    scoring: {
      A: { efficiency: 2 },
      B: { empathy: 2, initiative: 1 },
      C: { ambiguity: 1, efficiency: 1 },
    },
  },
  {
    id: 'q9',
    text: 'You find a wallet on the street. It has money and an ID.',
    durationSec: 16,
    options: [
      { id: 'A', label: 'A', text: 'Take the money and leave the wallet.' },
      { id: 'B', label: 'B', text: 'Return the wallet to the owner.' },
      { id: 'C', label: 'C', text: 'Leave it where you found it.' },
    ],
    scoring: {
      A: { efficiency: 2, empathy: -1 },
      B: { empathy: 2, initiative: 1 },
      C: { ambiguity: 2 },
    },
  },
  {
    id: 'q10',
    text: 'A group blames you for something you did not do.',
    durationSec: 16,
    options: [
      { id: 'A', label: 'A', text: 'Apologize to calm them down.' },
      { id: 'B', label: 'B', text: 'Explain why it was not your fault.' },
      { id: 'C', label: 'C', text: 'Stay silent and let it pass.' },
    ],
    scoring: {
      A: { empathy: 1, efficiency: 1 },
      B: { initiative: 2 },
      C: { ambiguity: 2 },
    },
  },
  {
    id: 'q11',
    text: 'A cashier gives you extra change by mistake.',
    durationSec: 10,
    options: [
      { id: 'A', label: 'A', text: 'Keep it, it is their mistake.' },
      { id: 'B', label: 'B', text: 'Return it immediately.' },
      { id: 'C', label: 'C', text: 'Donate it to a charity box nearby.' },
    ],
    scoring: {
      A: { efficiency: 2, empathy: -1 },
      B: { empathy: 2, initiative: 1 },
      C: { ambiguity: 2, empathy: 1 },
    },
  },
  {
    id: 'q12',
    text: 'You have one extra ticket to a sold-out show.',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Sell it to the highest bidder.' },
      { id: 'B', label: 'B', text: 'Give it to your best friend.' },
      { id: 'C', label: 'C', text: 'Raffle it off fairly.' },
    ],
    scoring: {
      A: { efficiency: 2, initiative: 1, empathy: -1 },
      B: { empathy: 2, ambiguity: 1 },
      C: { ambiguity: 2, initiative: 1 },
    },
  },
  {
    id: 'q13',
    text: 'A teammate has an idea that will not work, but they are proud of it.',
    durationSec: 16,
    options: [
      { id: 'A', label: 'A', text: 'Point out the problems right away.' },
      { id: 'B', label: 'B', text: 'Praise their effort and suggest changes later.' },
      { id: 'C', label: 'C', text: 'Let them try it and learn from the results.' },
    ],
    scoring: {
      A: { efficiency: 1, initiative: 1, empathy: -1 },
      B: { empathy: 2, ambiguity: 1 },
      C: { ambiguity: 2, efficiency: 1 },
    },
  },
  {
    id: 'q14',
    text: 'You are offered a promotion that pays more but requires missing family events.',
    durationSec: 16,
    options: [
      { id: 'A', label: 'A', text: 'Accept; the money is the priority.' },
      { id: 'B', label: 'B', text: 'Decline; free time matters more.' },
      { id: 'C', label: 'C', text: 'Accept but try to negotiate hours.' },
    ],
    scoring: {
      A: { efficiency: 2, initiative: 1, empathy: -1 },
      B: { empathy: 2, ambiguity: 1 },
      C: { ambiguity: 2, initiative: 1 },
    },
  },
  {
    id: 'q15',
    text: 'A waiter spills a drink on your table by accident.',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Help them clean it up.' },
      { id: 'B', label: 'B', text: 'Complain to the manager.' },
      { id: 'C', label: 'C', text: 'Watch and wait for them to fix it.' },
    ],
    scoring: {
      A: { empathy: 2, initiative: 1 },
      B: { efficiency: 1, empathy: -2 },
      C: { ambiguity: 2 },
    },
  },
  {
    id: 'q16',
    text: 'You are late. An elderly person is walking very slowly in front of you.',
    durationSec: 15,
    options: [
      { id: 'A', label: 'A', text: 'Walk around them quickly.' },
      { id: 'B', label: 'B', text: 'Wait patiently behind them.' },
      { id: 'C', label: 'C', text: 'Cough loudly to signal them.' },
    ],
    scoring: {
      A: { efficiency: 2, initiative: 1 },
      B: { empathy: 2, efficiency: -1 },
      C: { ambiguity: 1, empathy: -1 },
    },
  },
  {
    id: 'q17',
    text: 'You see a friend posting sad song lyrics online late at night.',
    durationSec: 14,
    options: [
      { id: 'A', label: 'A', text: 'Message them to check if they are OK.' },
      { id: 'B', label: 'B', text: 'Keep scrolling, it is just lyrics.' },
      { id: 'C', label: 'C', text: 'Like the post and move on.' },
    ],
    scoring: {
      A: { empathy: 2, initiative: 1 },
      B: { efficiency: 1, empathy: -1 },
      C: { ambiguity: 2 },
    },
  },
  {
    id: 'q18',
    text: 'The bus is full. A tired parent with a child gets on.',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Offer your seat immediately.' },
      { id: 'B', label: 'B', text: 'Look at your phone to avoid eye contact.' },
      { id: 'C', label: 'C', text: 'Wait to see if someone else moves.' },
    ],
    scoring: {
      A: { empathy: 2, initiative: 1 },
      B: { efficiency: 1, empathy: -2 },
      C: { ambiguity: 2, empathy: -1 },
    },
  },
  {
    id: 'q19',
    text: 'Someone drops a glove on the street and keeps walking.',
    durationSec: 14,
    options: [
      { id: 'A', label: 'A', text: 'Run after them to return it.' },
      { id: 'B', label: 'B', text: 'Leave it there.' },
      { id: 'C', label: 'C', text: 'Place it on a nearby bench/fence.' },
    ],
    scoring: {
      A: { initiative: 2, empathy: 1 },
      B: { efficiency: 1, empathy: -1 },
      C: { ambiguity: 1, empathy: 1 },
    },
  },
  {
    id: 'q20',
    text: 'You accidentally damage a parked car. No one saw you.',
    durationSec: 12,
    options: [
      { id: 'A', label: 'A', text: 'Drive away carefully.' },
      { id: 'B', label: 'B', text: 'Leave a note with your details.' },
      { id: 'C', label: 'C', text: 'Wait for the owner to return.' },
    ],
    scoring: {
      A: { efficiency: 2, empathy: -2 },
      B: { initiative: 2, empathy: 1 },
      C: { ambiguity: 1, empathy: 2 },
    },
  },
];
