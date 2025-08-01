import articleStore from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCircle, Calendar } from 'lucide-react';
import { Newspaper } from 'lucide-react';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await articleStore.getArticleById(params.id);

  if (!article || article.status !== 'published') {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.publicationDate,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle,
      description: article.metaDescription,
      images: [article.featuredImage],
    },
  };
}

const getAiHint = (tags: string[]) => {
  if (tags.includes('AI')) return 'future AI';
  if (tags.includes('Sustainability')) return 'sustainable living';
  if (tags.includes('Remote Work')) return 'remote work';
  return 'news article';
}

export default async function ArticlePage({ params }: Props) {
  const article = await articleStore.getArticleById(params.id);

  if (!article || article.status !== 'published') {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
       <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline text-primary">
            <Newspaper />
            FlexPress
          </Link>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <article className="animate-fade-in">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-headline leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <UserCircle className="w-5 h-5" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <time dateTime={article.publicationDate}>
                  {format(new Date(article.publicationDate), 'MMMM d, yyyy')}
                </time>
              </div>
            </div>
          </div>

          <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
              data-ai-hint={getAiHint(article.tags)}
            />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-foreground/80 prose-headings:text-foreground">
            {article.content.split('\\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">{tag}</Badge>
              ))}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
