'use server';

/**
 * @fileOverview An AI agent that suggests relevant tags for articles based on their content.
 *
 * - suggestArticleTags - A function that suggests tags for an article.
 * - SuggestArticleTagsInput - The input type for the suggestArticleTags function.
 * - SuggestArticleTagsOutput - The return type for the suggestArticleTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestArticleTagsInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the article for which tags are to be suggested.'),
});
export type SuggestArticleTagsInput = z.infer<typeof SuggestArticleTagsInputSchema>;

const SuggestArticleTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the article.'),
});
export type SuggestArticleTagsOutput = z.infer<typeof SuggestArticleTagsOutputSchema>;

export async function suggestArticleTags(
  input: SuggestArticleTagsInput
): Promise<SuggestArticleTagsOutput> {
  return suggestArticleTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestArticleTagsPrompt',
  input: {schema: SuggestArticleTagsInputSchema},
  output: {schema: SuggestArticleTagsOutputSchema},
  prompt: `You are an expert in content categorization and tagging.
  Given the content of an article, suggest relevant tags that can be used to categorize the article and improve its discoverability.
  The tags should be specific and relevant to the content.
  Return the tags as a JSON array of strings.

  Article Content: {{{articleContent}}}`,
});

const suggestArticleTagsFlow = ai.defineFlow(
  {
    name: 'suggestArticleTagsFlow',
    inputSchema: SuggestArticleTagsInputSchema,
    outputSchema: SuggestArticleTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
