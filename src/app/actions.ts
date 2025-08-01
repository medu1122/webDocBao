'use server'

import { z } from 'zod';
import { suggestArticleTags } from '@/ai/flows/suggest-article-tags';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Article } from '@/lib/types';
import { generateSlug } from '@/lib/utils/slug';

const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  featuredImage: z.string().url('Must be a valid URL'),
  tags: z.string().transform((val) => val.split(',').map(tag => tag.trim()).filter(tag => tag !== '')),
  metaTitle: z.string().min(1, 'Meta title is required'),
  metaDescription: z.string().min(1, 'Meta description is required'),
  status: z.enum(['draft', 'published']),
  category: z.string().optional(),
});

export async function createOrUpdateArticle(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = articleSchema.safeParse(data);

    if (!parsed.success) {
        return {
            error: parsed.error.flatten().fieldErrors,
        };
    }

    const { id, title, content, author, featuredImage, tags, metaTitle, metaDescription, status } = parsed.data;

    const articleData = {
        title,
        slug: generateSlug(title),
        summary: metaDescription,
        category: parsed.data.category || 'uncategorized',
        tags,
        coverImage: featuredImage,
        author_id: author, 
        content_blocks: [{ type: 'text', data: content }],
        status,
        // The mock-data compatible fields
        content,
        author,
        featuredImage,
        metaTitle,
        metaDescription,
    };

    try {
        const apiUrl = id 
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/articles`;

        const method = id ? 'PUT' : 'POST';

        const response = await fetch(apiUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(articleData),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("API Error:", errorBody);
            return {
                error: { _server: [errorBody.error || `Failed to ${id ? 'update' : 'create'} article.`] },
            };
        }

    } catch (e) {
        console.error("Request Error:", e);
        return {
            error: { _server: ['Failed to save article. Please check your connection.'] },
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
