import mongoose, { Schema, Document } from 'mongoose';

export interface IContentBlock {
  type: 'text' | 'image' | 'video';
  data: string | {
    url: string;
    caption?: string;
  };
}

export interface IArticle extends Document {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  coverImage: string;
  author_id: string;
  content_blocks: IContentBlock[];
  created_at: Date;
  updated_at: Date;
  status: 'draft' | 'published' | 'archived';
}

const ContentBlockSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['text', 'image', 'video'],
    required: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  }
}, { _id: false });

const ArticleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  summary: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  coverImage: {
    type: String,
    default: ''
  },
  author_id: {
    type: String,
    required: true,
    ref: 'Author'
  },
  content_blocks: [ContentBlockSchema],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Create index for better search performance
ArticleSchema.index({ title: 'text', summary: 'text', tags: 'text' });
// Note: slug index is automatically created by unique: true constraint
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ status: 1 });
ArticleSchema.index({ created_at: -1 });

// Prevent mongoose from creating the model multiple times
export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema); 