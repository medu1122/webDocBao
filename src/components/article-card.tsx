"use client";

import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

export function ArticleCard({ article }: { article: Article }) {
    const content = article.content || article.summary || '';
    const publicationDate = article.publicationDate || article.created_at || new Date().toISOString();
    const featuredImage = article.featuredImage || article.coverImage || 'https://placehold.co/1200x600.png';
    const id = article.id || article._id;


  const truncatedContent = content.length > 100 
    ? content.substring(0, 100) + '...' 
    : content;

  const getAiHint = (tags: string[]) => {
    if (tags.includes('AI')) return 'future AI';
    if (tags.includes('Sustainability')) return 'sustainable living';
    if (tags.includes('Remote Work')) return 'remote work';
    return 'news article';
  }

  return (
    <Link href={`/articles/${id}`} className="group block">
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={featuredImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={getAiHint(article.tags)}
            />
          </div>
          <div className="p-6 pb-2">
            <CardTitle className="text-xl leading-tight">
              {article.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground text-sm">{truncatedContent}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
            <span>{format(new Date(publicationDate), 'MMM d, yyyy')}</span>
            <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all duration-300">
              Read More
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
