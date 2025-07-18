export type PaperConfig = {
  class: string;
  subject: string;
  chapter: string;
  totalMarks: number;
  mcqCount: number;
  saqCount: number;
  longQuestionCount: number;
};

export type SingleQuestion = {
  text: string;
  options?: string[];
};

export type Question = {
  id: number;
  class: string;
  subject: string;
  chapter: string;
  type: 'MCQ' | 'SAQ' | 'Long';
  alternatives: SingleQuestion[];
  marks: number;
};

export type AiQuestion = Omit<Question, 'id' | 'class' | 'subject' | 'chapter'>;

export type SubjectDetails = {
  [subject: string]: {
    classes: string[];
    chapters: {
      [classNum: string]: string[];
    };
  };
};
