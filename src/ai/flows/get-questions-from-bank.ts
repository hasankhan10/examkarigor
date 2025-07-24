
'use server';

/**
 * @fileOverview An AI agent for fetching a list of questions for a question bank.
 *
 * - getQuestionsFromBank - A function that fetches a list of questions based on given criteria.
 * - GetQuestionsFromBankInput - The input type for the getQuestionsFromBank function.
 * - GetQuestionsFromBankOutput - The return type for the getQuestionsFromBank function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionTypeEnum = z.enum(['MCQ', 'SAQ', 'Long', 'True/False', 'Fill in the Blanks', 'Rochonadhormi']);

const GetQuestionsFromBankInputSchema = z.object({
  class: z.string().describe('The class for which to generate the exam paper (e.g., 5-12).'),
  subject: z.string().describe('The subject for which to generate the exam paper (e.g., Bengali, Math, Science).'),
  chapters: z.array(z.string()).describe('The chapters for which to generate the exam paper (e.g., specific topics within the subject).'),
  questionTypes: z.array(QuestionTypeEnum).describe('The types of questions to be generated.'),
  language: z.string().describe('The language for the exam paper (e.g., "Bengali", "English"). This dictates the language of the generated questions.'),
});

export type GetQuestionsFromBankInput = z.infer<typeof GetQuestionsFromBankInputSchema>;

const SingleQuestionSchema = z.object({
    text: z.string().describe('The question text.'),
    options: z.array(z.string()).optional().describe('A list of options for MCQ questions.'),
});

const QuestionSchema = z.object({
    type: QuestionTypeEnum.describe('The type of question.'),
    alternatives: z.array(SingleQuestionSchema).describe('A list of alternative questions. Often just one, but can be more for "OR" questions.'),
    marks: z.number().describe('The suggested marks for this question.'),
    chapter: z.string().describe('The chapter this question belongs to.'),
});

const GetQuestionsFromBankOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('The generated list of questions for the question bank.'),
});

export type GetQuestionsFromBankOutput = z.infer<typeof GetQuestionsFromBankOutputSchema>;

export async function getQuestionsFromBank(input: GetQuestionsFromBankInput): Promise<GetQuestionsFromBankOutput> {
  return getQuestionsFromBankFlow(input);
}

const getQuestionsFromBankPrompt = ai.definePrompt({
  name: 'getQuestionsFromBankPrompt',
  input: {schema: GetQuestionsFromBankInputSchema},
  output: {schema: GetQuestionsFromBankOutputSchema},
  prompt: `You are an expert teacher specializing in creating question banks for students in West Bengal, India. Your task is to generate a comprehensive, diverse, and relevant list of all possible high-quality questions based on a given set of criteria.

**IMPORTANT: The entire question, including all text and options, MUST be in the '{{{language}}}' language.**

You will generate a list of questions based on the following criteria:
Class: {{{class}}}
Subject: {{{subject}}}
Chapters: {{#each chapters}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Question Types to Generate: {{#each questionTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

For each specified question type, please generate a comprehensive and diverse list of questions. Do not limit the number of questions; provide as many unique and high-quality questions as possible that are relevant to the specified chapters.
The questions MUST be from the specified chapters only. For each generated question, specify which chapter it belongs to in the 'chapter' field.
The questions must be pertinent to the syllabus of the WBBSE/WBCHSE board.

- For MCQs, provide 4 distinct options.
- For True/False questions, the question text should be a statement to be evaluated. Do not include options.
- For Fill in the Blanks, use underscores (___) to indicate the blank space.
- For Rochonadhormi questions, provide a thoughtful, open-ended essay prompt.
- For each question, provide a suggested mark value based on its type and complexity (e.g., MCQ: 1, SAQ: 2, Long: 5).

Return the output as a JSON object containing a list of questions.
`,
});

const getQuestionsFromBankFlow = ai.defineFlow(
  {
    name: 'getQuestionsFromBankFlow',
    inputSchema: GetQuestionsFromBankInputSchema,
    outputSchema: GetQuestionsFromBankOutputSchema,
  },
  async input => {
    // If no chapters are selected, return an empty list to avoid generating generic questions.
    if (input.chapters.length === 0) {
      return { questions: [] };
    }
    const {output} = await getQuestionsFromBankPrompt(input);
    return output!;
  }
);

