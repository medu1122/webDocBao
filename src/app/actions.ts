'use server'

import { z } from 'zod';
import { suggestArticleTags } from '@/ai/flows/suggest-article-tags';
import articleStore from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Article } from '@/lib/types';

const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  featuredImage: z.string().url('Must be a valid URL'),
  tags: z.string().transform((val) => val.split(',').filter(tag => tag.trim() !== '')),
  metaTitle: z.string().min(1, 'Meta title is required'),
  metaDescription: z.string().min(1, 'Meta description is required'),
  status: z.enum(['draft', 'published']),
});

export async function createOrUpdateArticle(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = articleSchema.safeParse(data);

    if (!parsed.success) {
        return {
            error: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        if (parsed.data.id) {
            await articleStore.updateArticle(parsed.data.id, parsed.data as Partial<Article>);
        } else {
            await articleStore.addArticle(parsed.data as Omit<Article, 'id' | 'publicationDate'>);
        }
    } catch (e) {
        return {
            error: { _server: ['Failed to save article.'] },
        };
    }

    revalidatePath('/admin/articles');
    revalidatePath('/');
    redirect('/admin/articles');
}


export async function suggestTags(content: string): Promise<{ tags: string[] } | { error: string }> {
    if (!content || content.trim().length < 50) {
        return { error: 'Please provide more content to suggest tags.' };
    }
    try {
        const result = await suggestArticleTags({ articleContent: content });
        return { tags: result.tags };
    } catch (error) {
        console.error('Error suggesting tags:', error);
        return { error: 'Failed to suggest tags. Please try again.' };
    }
}
