
'use server';

/**
 * @fileOverview An AI agent for generating random exam papers based on the selected class, subject, and chapter.
 *
 * - generateRandomPaper - A function that handles the random exam paper generation process.
 * - GenerateRandomPaperInput - The input type for the generateRandomPaper function.
 * - GenerateRandomPaperOutput - The return type for the generateRandomPaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionTypeDetailSchema = z.object({
  count: z.number().describe('The number of questions of this type.'),
  marks: z.number().describe('The marks allocated to each question of this type.'),
});

const GenerateRandomPaperInputSchema = z.object({
  class: z.string().describe('The class for which to generate the exam paper (e.g., 5-12).'),
  subject: z.string().describe('The subject for which to generate the exam paper (e.g., Bengali, Math, Science).'),
  chapter: z.string().describe('The chapter for which to generate the exam paper (e.g., specific topics within the subject).'),
  difficulty: z.number().min(0).max(100).describe('The difficulty level of the questions on a scale of 0 to 100, where 0 is easiest and 100 is hardest. This is a crucial parameter.'),
  language: z.string().describe('The language for the exam paper (e.g., "Bengali", "English"). This dictates the language of the generated questions.'),
  mcq: QuestionTypeDetailSchema.describe('Details for Multiple Choice Questions.'),
  saq: QuestionTypeDetailSchema.describe('Details for Short Answer Questions.'),
  long: QuestionTypeDetailSchema.describe('Details for Long Questions.'),
  trueFalse: QuestionTypeDetailSchema.describe('Details for True/False Questions.'),
  fillInBlanks: QuestionTypeDetailSchema.describe('Details for Fill in the Blanks Questions.'),
  rochonadhormi: QuestionTypeDetailSchema.describe('Details for Essay Questions.'),
});

export type GenerateRandomPaperInput = z.infer<typeof GenerateRandomPaperInputSchema>;

const SingleQuestionSchema = z.object({
    text: z.string().describe('The question text.'),
    options: z.array(z.string()).optional().describe('A list of options for MCQ questions.'),
});

const QuestionSchema = z.object({
    type: z.enum(['MCQ', 'SAQ', 'Long', 'True/False', 'Fill in the Blanks', 'Rochonadhormi']).describe('The type of question.'),
    alternatives: z.array(SingleQuestionSchema).describe('A list of alternative questions. Often just one, but can be more for "OR" questions.'),
    marks: z.number().describe('The marks for this question.'),
});

const GenerateRandomPaperOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('The generated list of questions for the exam paper.'),
});

export type GenerateRandomPaperOutput = z.infer<typeof GenerateRandomPaperOutputSchema>;

export async function generateRandomPaper(input: GenerateRandomPaperInput): Promise<GenerateRandomPaperOutput> {
  return generateRandomPaperFlow(input);
}

const generateRandomPaperPrompt = ai.definePrompt({
  name: 'generateRandomPaperPrompt',
  input: {schema: GenerateRandomPaperInputSchema},
  output: {schema: GenerateRandomPaperOutputSchema},
  prompt: `You are an expert teacher specializing in creating exam papers for students in West Bengal, India.

**IMPORTANT: The entire question paper, including all question text, options, and instructions, MUST be in the '{{{language}}}' language.**

You will generate a random exam paper based on the following criteria:

Class: {{{class}}}
Subject: {{{subject}}}
Chapter: {{{chapter}}}
Difficulty Level (0-100): {{{difficulty}}}

Your primary goal is to generate the exact number of questions for each type as specified below, with the specified marks for each question.
- Multiple Choice Questions (MCQ):
  - Number of questions: {{{mcq.count}}}
  - Marks per question: {{{mcq.marks}}}
- Short Answer Questions (SAQ):
  - Number of questions: {{{saq.count}}}
  - Marks per question: {{{saq.marks}}}
- Long Questions:
  - Number of questions: {{{long.count}}}
  - Marks per question: {{{long.marks}}}
- True/False Questions:
  - Number of questions: {{{trueFalse.count}}}
  - Marks per question: {{{trueFalse.marks}}}
- Fill in the Blanks Questions:
  - Number of questions: {{{fillInBlanks.count}}}
  - Marks per question: {{{fillInBlanks.marks}}}
- Essay (Rochonadhormi) Questions:
  - Number of questions: {{{rochonadhormi.count}}}
  - Marks per question: {{{rochonadhormi.marks}}}

This structure is a strict, non-negotiable requirement. You MUST generate exactly the specified number of questions for each type with the specified marks.

The total marks for the paper will be the sum of all questions. Your generated question set MUST match this structure perfectly.
The questions MUST be of the specified '{{{difficulty}}}' difficulty level (0 is easiest, 100 is hardest). This is extremely important.

For some questions, you can provide an alternative "OR" question by adding a second item to the 'alternatives' array for that question.

The generated questions must be pertinent to the syllabus of the WBBSE/WBCHSE board.
If the language is Bengali, use Unicode for Bengali script.
For MCQs, provide 4 distinct options.
For True/False questions, the question text should be a statement to be evaluated. Do not include options.
For Fill in the Blanks, use underscores (___) to indicate the blank space.
For Rochonadhormi questions, provide a thoughtful, open-ended essay prompt.

Return the output as a JSON object containing a list of questions.
`,
});

const generateRandomPaperFlow = ai.defineFlow(
  {
    name: 'generateRandomPaperFlow',
    inputSchema: GenerateRandomPaperInputSchema,
    outputSchema: GenerateRandomPaperOutputSchema,
  },
  async input => {
    const {output} = await generateRandomPaperPrompt(input);
    return output!;
  }
);
