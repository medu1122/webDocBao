import type { Article } from './types';

const createStore = () => {
  let articles: Article[] = [
    {
      id: '1',
      title: 'The Future of AI in Content Creation',
      content: 'Artificial Intelligence is revolutionizing the way we create content. From automated journalism to AI-powered design tools, the landscape is changing rapidly. This article explores the potential impacts and ethical considerations of this technological shift. We will delve into how machine learning models are trained, the current capabilities of generative AI, and what the future holds for content creators in various industries.',
      author: 'Jane Doe',
      publicationDate: '2024-05-10T10:00:00Z',
      featuredImage: 'https://placehold.co/1200x600.png',
      tags: ['AI', 'Technology', 'Future'],
      metaTitle: 'The Future of AI in Content Creation | FlexPress',
      metaDescription: 'Explore the future of artificial intelligence in content creation and its impact on various industries.',
      status: 'published',
    },
    {
      id: '2',
      title: 'A Guide to Sustainable Living',
      content: 'Sustainable living is more than just a buzzword; it\'s a lifestyle choice that can have a profound impact on our planet. This guide provides practical tips on how to reduce your carbon footprint, from conscious consumerism to eco-friendly home practices. Learn about recycling, composting, saving water, and using renewable energy sources. Every small change contributes to a larger positive impact.',
      author: 'John Smith',
      publicationDate: '2024-05-09T14:30:00Z',
      featuredImage: 'https://placehold.co/1200x600.png',
      tags: ['Sustainability', 'Lifestyle', 'Environment'],
      metaTitle: 'A Guide to Sustainable Living | FlexPress',
      metaDescription: 'A practical guide with tips for a more sustainable lifestyle to help the environment.',
      status: 'published',
    },
    {
      id: '3',
      title: 'The Rise of Remote Work: Challenges and Opportunities',
      content: 'The global pandemic has accelerated the shift towards remote work. This article examines the benefits, such as flexibility and a better work-life balance, as well as the challenges, including isolation and cybersecurity risks. We also look at how companies are adapting their cultures and technologies to support a distributed workforce effectively. The future of work may be hybrid, and preparation is key.',
      author: 'Emily White',
      publicationDate: '2024-05-08T09:00:00Z',
      featuredImage: 'https://placehold.co/1200x600.png',
      tags: ['Remote Work', 'Business', 'Productivity'],
      metaTitle: 'The Rise of Remote Work: Challenges and Opportunities | FlexPress',
      metaDescription: 'An analysis of the challenges and opportunities presented by the global shift to remote work.',
      status: 'draft',
    },
  ];

  return {
    getArticles: async (): Promise<Article[]> => {
      // Create a deep copy to prevent mutation issues in React server components
      return JSON.parse(JSON.stringify(articles)).sort((a: Article, b: Article) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
    },
    getPublishedArticles: async (): Promise<Article[]> => {
      return JSON.parse(JSON.stringify(articles.filter((a: Article) => a.status === 'published'))).sort((a: Article, b: Article) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
    },
    getArticleById: async (id: string): Promise<Article | undefined> => {
      const article = articles.find(article => article.id === id);
      return article ? JSON.parse(JSON.stringify(article)) : undefined;
    },
    addArticle: async (articleData: Omit<Article, 'id' | 'publicationDate'>): Promise<Article> => {
      const newArticle: Article = {
        ...articleData,
        id: (articles.length + 1).toString(),
        publicationDate: new Date().toISOString(),
      };
      articles = [newArticle, ...articles];
      return JSON.parse(JSON.stringify(newArticle));
    },
    updateArticle: async (id: string, updates: Partial<Omit<Article, 'id'>>): Promise<Article | undefined> => {
      let updatedArticle: Article | undefined;
      articles = articles.map(article => {
        if (article.id === id) {
          updatedArticle = { ...article, ...updates };
          return updatedArticle;
        }
        return article;
      });
      return updatedArticle ? JSON.parse(JSON.stringify(updatedArticle)) : undefined;
    },
  };
};

const articleStore = createStore();
export default articleStore;
