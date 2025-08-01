import { IArticle } from "./models/Article";

export type Article = Omit<IArticle, "_id"> & { id: string } & {
    _id: string;
    publicationDate: string;
    created_at: string;
    summary: string;
    metaTitle: string;
    metaDescription: string;
    content: string;
    author: string;
    featuredImage: string;
};
