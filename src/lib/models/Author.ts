import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthor extends Document {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  created_at: Date;
  updated_at: Date;
}

const AuthorSchema: Schema = new Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Prevent mongoose from creating the model multiple times
export default mongoose.models.Author || mongoose.model<IAuthor>('Author', AuthorSchema); 