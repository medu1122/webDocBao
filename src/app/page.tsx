import articleStore from '@/lib/mock-data';
import { ArticleCard } from '@/components/article-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';

export default async function Home() {
  const articles = await articleStore.getPublishedArticles();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline text-primary">
            <Newspaper />
            FlexPress
          </Link>
          <Button asChild>
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight mb-4">The News, Flexible and Fast</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Welcome to FlexPress, where content creation meets modern technology. Discover articles on various topics, crafted with flexibility.
          </p>
        </div>
        
        {articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
            {articles.map((article, index) => (
              <div key={article.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-16">
            <h2 className="text-2xl font-headline">No articles published yet.</h2>
            <p className="mt-2">Check back later for new content!</p>
          </div>
        )}
      </main>
      <footer className="bg-card border-t text-center p-4 text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} FlexPress. All rights reserved.</p>
      </footer>
    </div>
  );
}
