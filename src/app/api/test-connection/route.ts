import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Author from '@/lib/models/Author';
import Article from '@/lib/models/Article';

// GET /api/test-connection - Test database connection and return stats
export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    // Get collection statistics
    const authorsCount = await Author.countDocuments();
    const articlesCount = await Article.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      database: 'news_portal',
      authors: {
        count: authorsCount
      },
      articles: {
        count: articlesCount
      },
      timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error) {
    console.error('Database connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Database connection failed',
      database: 'news_portal',
      authors: { count: 0 },
      articles: { count: 0 },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 