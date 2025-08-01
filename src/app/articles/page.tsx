'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  coverImage: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived';
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data.articles || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Bài viết</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Bài viết</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Lỗi: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bài viết</h1>
      
      {articles.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Chưa có bài viết nào.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article._id} className="hover:shadow-lg transition-shadow">
                             {article.coverImage && !article.coverImage.includes('yourcdn.com') && (
                 <div className="aspect-video overflow-hidden rounded-t-lg">
                   <img 
                     src={article.coverImage} 
                     alt={article.title}
                     className="w-full h-full object-cover"
                     onError={(e) => {
                       // Hide image if it fails to load
                       const target = e.target as HTMLImageElement;
                       target.style.display = 'none';
                     }}
                   />
                 </div>
               )}
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{article.category}</Badge>
                  <Badge 
                    variant={article.status === 'published' ? 'default' : 'secondary'}
                  >
                    {article.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl line-clamp-2">
                  <Link href={`/articles/${article._id}`} className="hover:text-blue-600">
                    {article.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">{article.summary}</p>
                
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                     <span className="text-sm text-gray-600">Author ID: {article.author_id}</span>
                   </div>
                   <span className="text-sm text-gray-500">
                     {new Date(article.created_at).toLocaleDateString('vi-VN')}
                   </span>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 