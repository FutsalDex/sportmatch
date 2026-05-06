'use server';
/**
 * @fileOverview An AI agent that analyzes a user's sports profile to provide detailed insights into strengths, weaknesses, and potential.
 *
 * - generateProfileAnalysis - A function that generates a detailed analysis of a sports profile.
 * - GenerateProfileAnalysisInput - The input type for the generateProfileAnalysis function.
 * - GenerateProfileAnalysisOutput - The return type for the generateProfileAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProfileAnalysisInputSchema = z.object({
  role: z.string().describe('The role of the user (e.g., player, coach, club).'),
  discipline: z.string().describe('The sports discipline (e.g., Football, Futsal).'),
  bio: z.string().describe('A biography or general description of the user.'),
  teamHistory: z.array(z.string()).describe('A list of past teams or clubs the user has been associated with.'),
  achievements: z.array(z.string()).optional().describe('A list of achievements or notable accomplishments.'),
  // Assuming 'score' and 'level' are available for more nuanced analysis
  score: z.number().optional().describe('A numerical score representing overall relevance or skill level.'),
  level: z.string().optional().describe('The skill level of the user (e.g., amateur, semi-pro, professional).')
});
export type GenerateProfileAnalysisInput = z.infer<typeof GenerateProfileAnalysisInputSchema>;

const GenerateProfileAnalysisOutputSchema = z.object({
  strengths: z.array(z.string()).describe('Key strengths identified from the profile.'),
  weaknesses: z.array(z.string()).describe('Potential areas for improvement or weaknesses identified.'),
  potential: z.string().describe('An assessment of the user\u0027s future potential and growth opportunities.'),
  summary: z.string().describe('A concise overall summary of the profile analysis.')
});
export type GenerateProfileAnalysisOutput = z.infer<typeof GenerateProfileAnalysisOutputSchema>;

export async function generateProfileAnalysis(input: GenerateProfileAnalysisInput): Promise<GenerateProfileAnalysisOutput> {
  return generateProfileAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProfileAnalysisPrompt',
  input: {schema: GenerateProfileAnalysisInputSchema},
  output: {schema: GenerateProfileAnalysisOutputSchema},
  prompt: `You are an expert sports intelligence analyst for SportMatch AI, a platform connecting players, coaches, and clubs.
Your task is to provide a detailed, objective analysis of a user's profile, highlighting their strengths, weaknesses, and potential.
Consider all provided information to give a comprehensive insight.

User Profile Details:
Role: {{{role}}}
Discipline: {{{discipline}}}
Biography: {{{bio}}}
Team History: {{#each teamHistory}}- {{{this}}}\n{{/each}}
{{#if achievements}}Achievements: {{#each achievements}}- {{{this}}}\n{{/each}}{{/if}}
{{#if score}}Score: {{{score}}}\n{{/if}}
{{#if level}}Level: {{{level}}}\n{{/if}}

Based on the above profile, provide a detailed analysis structured as follows:
`,
});

const generateProfileAnalysisFlow = ai.defineFlow(
  {
    name: 'generateProfileAnalysisFlow',
    inputSchema: GenerateProfileAnalysisInputSchema,
    outputSchema: GenerateProfileAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
