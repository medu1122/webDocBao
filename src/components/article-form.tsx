'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createOrUpdateArticle, suggestTags } from '@/app/actions';
import type { Article } from '@/lib/types';
import { TagInput } from '@/components/tag-input';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const articleFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  author: z.string().min(2, 'Author name must be at least 2 characters.'),
  featuredImage: z.string().url('Please enter a valid image URL.'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag.'),
  metaTitle: z.string().min(3, 'Meta title must be at least 3 characters.'),
  metaDescription: z.string().min(10, 'Meta description must be at least 10 characters.'),
  status: z.enum(['draft', 'published']),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

export function ArticleForm({ article }: { article?: Article }) {
  const [isPending, startTransition] = useTransition();
  const [isSuggesting, startSuggestionTransition] = useTransition();
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      id: article?.id,
      title: article?.title || '',
      content: article?.content || '',
      author: article?.author || 'Admin',
      featuredImage: article?.featuredImage || '',
      tags: article?.tags || [],
      metaTitle: article?.metaTitle || '',
      metaDescription: article?.metaDescription || '',
      status: article?.status || 'draft',
    },
  });

  const onSubmit = (data: ArticleFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, Array.isArray(value) ? value.join(',') : value.toString());
        }
      });
      
      const result = await createOrUpdateArticle(formData);
      
      if (result?.error) {
        toast({
            variant: "destructive",
            title: "Error saving article",
            description: "Please check the form for errors and try again.",
        });
      } else {
        toast({
            title: `Article ${article ? 'updated' : 'created'}`,
            description: "Your article has been saved successfully.",
        });
        router.push('/admin/articles');
      }
    });
  };

  const handleSuggestTags = () => {
    const content = form.getValues('content');
    startSuggestionTransition(async () => {
      const result = await suggestTags(content);
      if ('tags' in result) {
        setSuggestedTags(result.tags.filter(tag => !form.getValues('tags').includes(tag)));
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
                <CardDescription>Fill in the main details of your article.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="Your article title" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="content" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl><Textarea placeholder="Write your article here..." {...field} rows={15} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO & Metadata</CardTitle>
                <CardDescription>Optimize your article for search engines.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="metaTitle" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl><Input placeholder="SEO-friendly title" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="metaDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl><Textarea placeholder="Short description for search results" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="author" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="featuredImage" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="tags" render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                        <TagInput
                            {...form.register('tags')}
                            suggestedTags={suggestedTags}
                            onAddSuggestedTag={(tag) => {
                                setSuggestedTags(prev => prev.filter(t => t !== tag));
                            }}
                        />
                    </FormControl>
                    <Button type="button" variant="outline" size="sm" onClick={handleSuggestTags} disabled={isSuggesting}>
                      {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                      Suggest Tags with AI
                    </Button>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {article ? 'Update' : 'Create'} Article
          </Button>
        </div>
      </form>
    </Form>
  );
}
