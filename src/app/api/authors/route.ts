import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Author from '@/lib/models/Author';

// GET /api/authors - Get all authors
export async function GET() {
  try {
    await connectDB();
    const authors = await Author.find({}).sort({ created_at: -1 });
    
    return NextResponse.json(authors, { status: 200 });
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/authors - Create a new author
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { name, email, avatar, bio } = body;
    
    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Check if author with this email already exists
    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return NextResponse.json(
        { error: 'Author with this email already exists' },
        { status: 409 }
      );
    }
    
    const author = new Author({
      name,
      email,
      avatar: avatar || '',
      bio: bio || ''
    });
    
    const savedAuthor = await author.save();
    
    return NextResponse.json(savedAuthor, { status: 201 });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 