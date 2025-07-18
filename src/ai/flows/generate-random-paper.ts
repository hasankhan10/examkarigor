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

const GenerateRandomPaperInputSchema = z.object({
  class: z.string().describe('The class for which to generate the exam paper (e.g., 5-12).'),
  subject: z.string().describe('The subject for which to generate the exam paper (e.g., Bengali, Math, Science).'),
  chapter: z.string().describe('The chapter for which to generate the exam paper (e.g., specific topics within the subject).'),
  totalMarks: z.number().describe('The total marks for the exam paper.'),
  mcqCount: z.number().describe('The number of multiple-choice questions in the paper.'),
  saqCount: z.number().describe('The number of short-answer questions in the paper.'),
  longQuestionCount: z.number().describe('The number of long questions in the paper.'),
});

export type GenerateRandomPaperInput = z.infer<typeof GenerateRandomPaperInputSchema>;

const QuestionSchema = z.object({
    type: z.enum(['MCQ', 'SAQ', 'Long']).describe('The type of question.'),
    text: z.string().describe('The question text.'),
    options: z.array(z.string()).optional().describe('A list of options for MCQ questions.'),
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
  prompt: `You are an expert teacher specializing in creating exam papers for Bengali medium students in West Bengal, India.

You will generate a random exam paper based on the following criteria:

Class: {{{class}}}
Subject: {{{subject}}}
Chapter: {{{chapter}}}
Total Marks: {{{totalMarks}}}

Your primary goal is to generate the exact number of questions for each type as specified below:
- Number of MCQs: {{{mcqCount}}}
- Number of SAQs: {{{saqCount}}}
- Number of Long Questions: {{{longQuestionCount}}}

You MUST generate exactly {{{mcqCount}}} MCQ questions, {{{saqCount}}} SAQ questions, and {{{longQuestionCount}}} Long questions.

The generated questions must be pertinent to the syllabus of WBBSE/WBCHSE board.
All questions and instructions should be in Bengali by default, using Unicode for Bengali script.
For MCQs, provide 4 distinct options.
Distribute the marks among the questions so the sum is as close as possible to the total marks specified ({{{totalMarks}}}).
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
