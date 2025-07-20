
export type QuestionTypeDetail = {
  enabled: boolean;
  count: number;
  marks: number;
};

export type QuestionType = 'mcq' | 'saq' | 'long' | 'trueFalse' | 'fillInBlanks' | 'rochonadhormi';

export type PaperConfig = {
  schoolName: string;
  examTerm: string;
  time: string;
  class: string;
  subject: string;
  chapter: string;
  mcq: QuestionTypeDetail;
  saq: QuestionTypeDetail;
  long: QuestionTypeDetail;
  trueFalse: QuestionTypeDetail;
  fillInBlanks: QuestionTypeDetail;
  rochonadhormi: QuestionTypeDetail;
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
  type: 'MCQ' | 'SAQ' | 'Long' | 'True/False' | 'Fill in the Blanks' | 'Rochonadhormi';
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
