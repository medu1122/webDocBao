import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Author from '@/lib/models/Author';

// GET /api/authors/[id] - Get a specific author
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const author = await Author.findById(params.id);
    
    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(author, { status: 200 });
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/authors/[id] - Update a specific author
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { name, email, avatar, bio } = body;
    
    // Check if author exists
    const existingAuthor = await Author.findById(params.id);
    if (!existingAuthor) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }
    
    // If email is being updated, check for duplicates
    if (email && email !== existingAuthor.email) {
      const duplicateAuthor = await Author.findOne({ email });
      if (duplicateAuthor) {
        return NextResponse.json(
          { error: 'Author with this email already exists' },
          { status: 409 }
        );
      }
    }
    
    const updatedAuthor = await Author.findByIdAndUpdate(
      params.id,
      {
        name: name || existingAuthor.name,
        email: email || existingAuthor.email,
        avatar: avatar !== undefined ? avatar : existingAuthor.avatar,
        bio: bio !== undefined ? bio : existingAuthor.bio
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedAuthor, { status: 200 });
  } catch (error) {
    console.error('Error updating author:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/authors/[id] - Delete a specific author
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const author = await Author.findById(params.id);
    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }
    
    await Author.findByIdAndDelete(params.id);
    
    return NextResponse.json(
      { message: 'Author deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 