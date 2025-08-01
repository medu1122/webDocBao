import { ArticleForm } from "@/components/article-form";
import articleStore from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
    const article = await articleStore.getArticleById(params.id);

    if (!article) {
        notFound();
    }

    return (
        <div>
            <ArticleForm article={article} />
        </div>
    )
}
