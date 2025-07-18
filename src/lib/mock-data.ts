import type { PaperConfig, Question, SubjectDetails } from './types';

export const initialConfig: PaperConfig = {
  class: '10',
  subject: 'গণিত',
  chapter: 'all',
  totalMarks: 90,
  mcqCount: 15,
  saqCount: 10,
  longQuestionCount: 5,
};

export const subjectDetails: SubjectDetails = {
  'গণিত': {
    classes: ['9', '10'],
    chapters: {
      '9': ['বাস্তব সংখ্যা', 'সূচকের নিয়মাবলী', 'লেখচিত্র'],
      '10': ['একচলবিশিষ্ট দ্বিঘাত সমীকরণ', 'সরল সুদকষা', 'বৃত্ত সম্পর্কিত উপপাদ্য'],
    },
  },
  'বিজ্ঞান': {
    classes: ['9', '10'],
    chapters: {
      '9': ['পরিমাপ', 'বল ও গতি', 'পদার্থের গঠন ও ধর্ম'],
      '10': ['পর্যায় সারণি', 'আলো', 'বিদ্যুৎ'],
    },
  },
  'বাংলা': {
    classes: ['9', '10'],
    chapters: {
      '9': ['ইলিয়াস', 'ধীবর বৃত্তান্ত', 'খেয়া'],
      '10': ['জ্ঞানচক্ষু', 'অসুখী একজন', 'আফ্রিকা'],
    },
  },
};

export const questionBank: Question[] = [
  // Class 10 Math
  {
    id: 1,
    class: '10',
    subject: 'গণিত',
    chapter: 'একচলবিশিষ্ট দ্বিঘাত সমীকরণ',
    type: 'MCQ',
    alternatives: [{
      text: 'k-এর কোন্ মানের জন্য kx² + 2x + 3k = 0 সমীকরণের বীজদ্বয়ের সমষ্টি এবং গুণফল সমান হবে?',
      options: ['2/3', '-2/3', '3/2', '-3/2'],
    }],
    marks: 1,
  },
  {
    id: 2,
    class: '10',
    subject: 'গণিত',
    chapter: 'একচলবিশিষ্ট দ্বিঘাত সমীকরণ',
    type: 'SAQ',
    alternatives: [{ text: 'একটি দ্বিঘাত সমীকরণের বীজদ্বয়ের সমষ্টি 14 এবং গুণফল 24 হলে, দ্বিঘাত সমীকরণটি লিখুন।' }],
    marks: 2,
  },
  {
    id: 3,
    class: '10',
    subject: 'গণিত',
    chapter: 'একচলবিশিষ্ট দ্বিঘাত সমীকরণ',
    type: 'Long',
    alternatives: [{ text: 'দুই অঙ্কের একটি ধনাত্মক সংখ্যাকে উহার এককের ঘরের অঙ্ক দিয়ে গুণ করলে গুণফল 189 হয় এবং দশকের ঘরের অঙ্ক এককের ঘরের অঙ্কের দ্বিগুণ। এককের ঘরের অঙ্কটি নির্ণয় করুন।' }],
    marks: 5,
  },
  // Class 10 Science
  {
    id: 4,
    class: '10',
    subject: 'বিজ্ঞান',
    chapter: 'আলো',
    type: 'MCQ',
    alternatives: [{
        text: 'কোন ধরণের দর্পণে বস্তুর প্রতিবিম্ব সর্বদা অসদ্ ও খর্বাকার হয়?',
        options: ['উত্তল দর্পণ', 'অবতল দর্পণ', 'সমতল দর্পণ', 'কোনোটিই নয়'],
    }],
    marks: 1,
  },
  {
    id: 5,
    class: '10',
    subject: 'বিজ্ঞান',
    chapter: 'আলো',
    type: 'SAQ',
    alternatives: [{ text: 'আলোর বিচ্ছুরণের একটি প্রাকৃতিক উদাহরণ দিন।' }],
    marks: 2,
  },
  // Class 9 Math
  {
    id: 6,
    class: '9',
    subject: 'গণিত',
    chapter: 'বাস্তব সংখ্যা',
    type: 'SAQ',
    alternatives: [{ text: 'দুটি অমূলদ সংখ্যার উদাহরণ দাও যাদের গুণফল একটি মূলদ সংখ্যা।' }],
    marks: 2,
  },
  {
    id: 7,
    class: '9',
    subject: 'গণিত',
    chapter: 'সূচকের নিয়মাবলী',
    type: 'Long',
    alternatives: [{ text: 'যদি a + b + c = 0 হয়, তবে দেখাও যে, 1/(xᵇ+x⁻ᶜ+1) + 1/(xᶜ+x⁻ᵃ+1) + 1/(xᵃ+x⁻ᵇ+1) = 1' }],
    marks: 5,
  },
];
