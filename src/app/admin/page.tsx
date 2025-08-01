import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenSquare, CheckCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import articleStore from "@/lib/mock-data";

export default async function AdminDashboard() {
  const articles = await articleStore.getArticles();
  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold">Welcome Back, Admin!</h2>
          <p className="text-muted-foreground">Here's a quick overview of your content.</p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Article
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <PenSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">All articles you've created.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Articles</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
            <p className="text-xs text-muted-foreground">Live and visible to readers.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <PenSquare className="h-4 w-4 text-muted-foreground text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
            <p className="text-xs text-muted-foreground">In-progress articles.</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Recent Articles</h3>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {articles.slice(0, 5).map(article => (
                <div key={article.id} className="flex items-center justify-between p-4">
                  <div>
                    <Link href={`/admin/articles/edit/${article.id}`} className="font-medium hover:underline">{article.title}</Link>
                    <p className="text-sm text-muted-foreground">{article.author}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/articles/edit/${article.id}`}>Edit</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
