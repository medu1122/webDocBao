import articleStore from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { MoreVertical, PlusCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ArticlesPage() {
    const articles = await articleStore.getArticles();
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Articles</h2>
                <Button asChild>
                    <Link href="/admin/articles/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Article
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {articles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium">{article.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className={article.status === 'published' ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}>
                                            {article.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{article.author}</TableCell>
                                    <TableCell>{format(new Date(article.publicationDate), 'MMM d, yyyy')}</TableCell>
                                    <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/articles/edit/${article.id}`}>Edit</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/articles/${article.id}`} target="_blank">View</Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
