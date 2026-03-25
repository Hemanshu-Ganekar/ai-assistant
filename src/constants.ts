import { Subject, Grade } from './types';

export const SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: '📐',
    chapters: [
      { id: '1', title: 'Real Numbers', content: 'Real numbers are the foundation of mathematics. They include rational and irrational numbers...' },
      { id: '2', title: 'Polynomials', content: 'A polynomial is an expression consisting of variables and coefficients...' },
      { id: '3', title: 'Quadratic Equations', content: 'A quadratic equation is any equation that can be rearranged in standard form as ax² + bx + c = 0...' }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🧪',
    chapters: [
      { id: '1', title: 'Chemical Reactions', content: 'A chemical reaction is a process that leads to the chemical transformation of one set of chemical substances to another...' },
      { id: '2', title: 'Life Processes', content: 'Life processes are the basic functions performed by living organisms to maintain their life on earth...' },
      { id: '3', title: 'Light - Reflection and Refraction', content: 'Light is a form of energy that enables us to see things. Reflection is the bouncing back of light...' }
    ]
  },
  {
    id: 'social',
    name: 'Social Science',
    icon: '🌍',
    chapters: [
      { id: '1', title: 'The Rise of Nationalism in Europe', content: 'Nationalism is an ideology and movement that promotes the interests of a particular nation...' },
      { id: '2', title: 'Resources and Development', content: 'Resources are everything available in our environment which can be used to satisfy our needs...' },
      { id: '3', title: 'Power Sharing', content: 'Power sharing is a strategy wherein all the major segments of the society are provided with a permanent share of power...' }
    ]
  }
];

export const APTITUDE_QUESTIONS = [
  {
    id: 1,
    question: "If a train travels 120 km in 2 hours, what is its speed?",
    options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
    correct: "60 km/h"
  },
  {
    id: 2,
    question: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
    options: ["24", "30", "32", "40"],
    correct: "32"
  },
  {
    id: 3,
    question: "Which of these is a prime number?",
    options: ["9", "15", "21", "23"],
    correct: "23"
  }
];
