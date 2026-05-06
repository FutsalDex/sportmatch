'use server';
/**
 * @fileOverview A Genkit flow for generating a concise, professional summary of a user's profile.
 *
 * - generateProfileSummary - A function that generates a profile summary.
 * - GenerateProfileSummaryInput - The input type for the generateProfileSummary function.
 * - GenerateProfileSummaryOutput - The return type for the generateProfileSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProfileSummaryInputSchema = z.object({
  discipline: z.string().describe('The sport discipline (e.g., "Fútbol", "Fútbol Sala").'),
  role: z.string().describe('The user\'s role (e.g., "Player", "Coach", "Club").'),
  bio: z.string().optional().describe('A brief biography or description of the user.'),
  teamHistory: z.string().optional().describe('A summary of the user\'s team or club history.'),
});
export type GenerateProfileSummaryInput = z.infer<typeof GenerateProfileSummaryInputSchema>;

const GenerateProfileSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, professional summary of the user\'s profile.'),
});
export type GenerateProfileSummaryOutput = z.infer<typeof GenerateProfileSummaryOutputSchema>;

export async function generateProfileSummary(
  input: GenerateProfileSummaryInput
): Promise<GenerateProfileSummaryOutput> {
  return generateProfileSummaryFlow(input);
}

const generateProfileSummaryPrompt = ai.definePrompt({
  name: 'generateProfileSummaryPrompt',
  input: {schema: GenerateProfileSummaryInputSchema},
  output: {schema: GenerateProfileSummaryOutputSchema},
  prompt: `You are an AI assistant specialized in creating professional and concise summaries for sports profiles on the SportMatch platform.

Your goal is to highlight the key attributes and achievements of a user, allowing potential connections (players, coaches, clubs) to quickly understand their profile without reading the full details.

Generate a summary based on the following information:

Discipline: {{{discipline}}}
Role: {{{role}}}

{{#if bio}}
Bio: {{{bio}}}
{{/if}}

{{#if teamHistory}}
Team History: {{{teamHistory}}}
{{/if}}

Your summary should be:
- Professional in tone.
- Concise (ideally 2-3 sentences).
- Focused on what makes the user stand out.
- Optimized for quick readability.

Example Output: { "summary": "[Generated Summary Here]" }`,
});

const generateProfileSummaryFlow = ai.defineFlow(
  {
    name: 'generateProfileSummaryFlow',
    inputSchema: GenerateProfileSummaryInputSchema,
    outputSchema: GenerateProfileSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateProfileSummaryPrompt(input);
    return output!;
  }
);
