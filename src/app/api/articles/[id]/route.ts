import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Article from '@/lib/models/Article';

// GET /api/articles/[id] - Get a specific article
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Validate params
    if (!params || !params.id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }
    
    const article = await Article.findById(params.id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[id] - Update a specific article
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Check if article exists
    const existingArticle = await Article.findById(params.id);
    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // If slug is being updated, check for duplicates
    if (slug && slug !== existingArticle.slug) {
      const duplicateArticle = await Article.findOne({ slug });
      if (duplicateArticle) {
        return NextResponse.json(
          { error: 'Article with this slug already exists' },
          { status: 409 }
        );
      }
    }
    
    const updatedArticle = await Article.findByIdAndUpdate(
      params.id,
      {
        title: title || existingArticle.title,
        slug: slug || existingArticle.slug,
        summary: summary || existingArticle.summary,
        category: category || existingArticle.category,
        tags: tags !== undefined ? tags : existingArticle.tags,
        coverImage: coverImage !== undefined ? coverImage : existingArticle.coverImage,
        author_id: author_id || existingArticle.author_id,
        content_blocks: content_blocks !== undefined ? content_blocks : existingArticle.content_blocks,
        status: status || existingArticle.status
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id] - Delete a specific article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const article = await Article.findById(params.id);
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    await Article.findByIdAndDelete(params.id);
    
    return NextResponse.json(
      { message: 'Article deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 