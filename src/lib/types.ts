export type PaperConfig = {
  class: string;
  subject: string;
  chapter: string;
  totalMarks: number;
  mcqCount: number;
  saqCount: number;
  longQuestionCount: number;
};

export type Question = {
  id: number;
  class: string;
  subject: string;
  chapter: string;
  type: 'MCQ' | 'SAQ' | 'Long';
  text: string;
  options?: string[];
  marks: number;
};

export type SubjectDetails = {
  [subject: string]: {
    classes: string[];
    chapters: {
      [classNum: string]: string[];
    };
  };
};
