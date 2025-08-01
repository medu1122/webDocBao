import { IArticle } from "./models/Article";

export type Article = IArticle & {
    id?: string; // Optional for compatibility
    publicationDate?: string;
    metaTitle?: string;
    metaDescription?: string;
    content?: string;
    author?: string;
    featuredImage?: string;
};
