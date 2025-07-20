export type PaperConfig = {
  schoolName: string;
  examTerm: string;
  time: string;
  class: string;
  subject: string;
  chapter: string;
  mcq: { count: number; marks: number };
  saq: { count: number; marks: number };
  long: { count: number; marks: number };
  trueFalse: { count: number; marks: number };
  fillInBlanks: { count: number; marks: number };
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
  type: 'MCQ' | 'SAQ' | 'Long' | 'True/False' | 'Fill in the Blanks';
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
