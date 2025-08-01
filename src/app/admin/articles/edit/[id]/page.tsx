import { ArticleForm } from "@/components/article-form";
import { notFound } from "next/navigation";
import type { Article } from "@/lib/types";

async function getArticle(id: string): Promise<Article | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error('Failed to fetch article', error);
        return null;
    }
}


export default async function EditArticlePage({ params }: { params: { id: string } }) {
    const article = await getArticle(params.id);

    if (!article) {
        notFound();
    }

    return (
        <div>
            <ArticleForm article={article} />
        </div>
    )
}
