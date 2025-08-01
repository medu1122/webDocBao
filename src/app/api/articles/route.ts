import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Article from '@/lib/models/Article';

// GET /api/articles - Get all articles with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Debug logging
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Handle case where request.url might be undefined
    let searchParams: URLSearchParams;
    
    try {
      if (!request.url) {
        console.error('Request URL is undefined');
        return NextResponse.json(
          { error: 'Invalid request URL' },
          { status: 400 }
        );
      }
      
    
      let fullUrl = request.url;
      if (!fullUrl.startsWith('http')) {
        const host = request.headers.get('host');
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        fullUrl = `${protocol}://${host}${fullUrl}`;
      }
      
      const url = new URL(fullUrl);
      searchParams = url.searchParams;
    } catch (urlError) {
      console.error('Error parsing URL:', urlError);
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // Debug logging
    console.log('Search params:', { page, limit, category, status, search });
    
    // Build query
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Get articles with pagination
    const articles = await Article.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Article.countDocuments(query);
    
    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/articles - Create a new article
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const {
      title,
      slug,
      summary,
      category,
      tags,
      coverImage,
      author_id,
      content_blocks,
      status
    } = body;
    
    // Validate required fields
    if (!title || !slug || !summary || !category || !author_id) {
      return NextResponse.json(
        { error: 'Title, slug, summary, category, and author_id are required' },
        { status: 400 }
      );
    }
    
    // Check if article with this slug already exists
    const existingArticle = await Article.findOne({ slug });
    if (existingArticle) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 409 }
      );
    }
    
    const article = new Article({
      title,
      slug,
      summary,
      category,
      tags: tags || [],
      coverImage: coverImage || '',
      author_id,
      content_blocks: content_blocks || [],
      status: status || 'draft'
    });
    
    const savedArticle = await article.save();
    
    return NextResponse.json(savedArticle, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 