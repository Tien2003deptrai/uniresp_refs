import mongoose, { Schema, Document } from 'mongoose';

// Article Model
export interface IArticle extends Document {
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [10, 'Content must be at least 10 characters long'],
      maxlength: [10000, 'Content must not exceed 10000 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      minlength: [2, 'Author name must be at least 2 characters long'],
      maxlength: [100, 'Author name must not exceed 100 characters'],
    },
  },
  {
    timestamps: true,
    collection: 'articles',
  }
);

// User Model
export interface IUser extends Document {
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [255, 'Email must not exceed 255 characters'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'user', 'moderator'],
        message: 'Role must be one of: admin, user, moderator',
      },
      default: 'user',
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Comment Model
export interface IComment extends Document {
  articleId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: [true, 'Article ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [3, 'Comment must be at least 3 characters long'],
      maxlength: [1000, 'Comment must not exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    collection: 'comments',
  }
);

// Indexes for better performance
ArticleSchema.index({ title: 'text', content: 'text' });
ArticleSchema.index({ author: 1 });
ArticleSchema.index({ createdAt: -1 });

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

CommentSchema.index({ articleId: 1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ createdAt: -1 });

// Export models
export const Article = mongoose.model<IArticle>('Article', ArticleSchema);
export const User = mongoose.model<IUser>('User', UserSchema);
export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
