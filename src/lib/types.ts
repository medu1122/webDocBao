export type Article = {
  id: string;
  title: string;
  content: string;
  author: string;
  publicationDate: string;
  featuredImage: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  status: 'draft' | 'published';
};
