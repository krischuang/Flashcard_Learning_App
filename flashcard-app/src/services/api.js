// Mock API service — swap this file for real HTTP calls when backend is ready.
// All functions return Promises to mirror async fetch() behaviour.

let cards = [
  {
    id: '1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    category: 'General Knowledge',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    question: "Who wrote 'Romeo and Juliet'?",
    answer: 'William Shakespeare',
    category: 'General Knowledge',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    question: 'What is the speed of light?',
    answer: 'Approximately 299,792,458 metres per second (3 × 10⁸ m/s)',
    category: 'Science',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    question: 'What is the chemical symbol for gold?',
    answer: "Au — from the Latin word 'Aurum'",
    category: 'Science',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    question: 'State the Pythagorean theorem.',
    answer: 'a² + b² = c², where c is the hypotenuse of a right-angled triangle.',
    category: 'Math',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    question: 'What is the value of π (pi) to 5 decimal places?',
    answer: '3.14159',
    category: 'Math',
    createdAt: new Date().toISOString(),
  },
];

let nextId = 7;

export const getCards = () => Promise.resolve([...cards]);

export const createCard = (data) => {
  const card = {
    id: String(nextId++),
    ...data,
    createdAt: new Date().toISOString(),
  };
  cards.push(card);
  return Promise.resolve({ ...card });
};

export const updateCard = (id, data) => {
  const idx = cards.findIndex((c) => c.id === id);
  if (idx === -1) return Promise.reject(new Error('Card not found'));
  cards[idx] = { ...cards[idx], ...data };
  return Promise.resolve({ ...cards[idx] });
};

export const deleteCard = (id) => {
  cards = cards.filter((c) => c.id !== id);
  return Promise.resolve();
};
