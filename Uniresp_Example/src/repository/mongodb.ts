import { Article, User, Comment, IArticle, IUser, IComment } from '../models';
import type {
  CreateArticleInput,
  UpdateArticleInput,
  CreateUserInput,
  CreateCommentInput,
  SearchFilters,
  PaginationInput,
} from '../schemas';
import { NotFoundError, ValidationError } from '@uniresp/errors';
import { Types, Document } from 'mongoose';

// Simplified base functions for common CRUD operations
const validateId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

const createEntity = async <T extends Document>(model: any, data: any): Promise<T> => {
  try {
    const entity = new model(data);
    return await entity.save();
  } catch (error: any) {
    if (error.code === 11000) {
      throw new ValidationError({}, 'Entity already exists');
    }
    throw new Error(`Failed to create entity: ${error.message}`);
  }
};

const findById = async <T extends Document>(model: any, id: string): Promise<T | null> => {
  if (!validateId(id)) {
    return null;
  }

  try {
    return await model.findById(id).lean();
  } catch (error: any) {
    throw new Error(`Failed to retrieve entity: ${error.message}`);
  }
};

const updateEntity = async <T extends Document>(model: any, id: string, data: any): Promise<T | null> => {
  if (!validateId(id)) {
    return null;
  }

  try {
    const entity = await model.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    return entity;
  } catch (error: any) {
    throw new Error(`Failed to update entity: ${error.message}`);
  }
};

const deleteEntity = async <T extends Document>(model: any, id: string): Promise<T | null> => {
  if (!validateId(id)) {
    return null;
  }

  try {
    return await model.findByIdAndDelete(id).lean();
  } catch (error: any) {
    throw new Error(`Failed to delete entity: ${error.message}`);
  }
};

const findAll = async <T extends Document>(model: any): Promise<T[]> => {
  try {
    return await model.find().sort({ createdAt: -1 }).lean();
  } catch (error: any) {
    throw new Error(`Failed to retrieve entities: ${error.message}`);
  }
};

export class MongoDBRepository {
  // Article methods
  async listArticles(
    filters?: SearchFilters,
    pagination?: PaginationInput
  ): Promise<{ data: IArticle[]; meta: any }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (filters?.query) {
      query.$text = { $search: filters.query };
    }

    if (filters?.author) {
      query.author = { $regex: filters.author, $options: 'i' };
    }

    if (filters?.dateFrom || filters?.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) {
        query.createdAt.$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        query.createdAt.$lte = new Date(filters.dateTo);
      }
    }

    // Build sort
    const sort: any = {};
    if (filters?.sortBy) {
      sort[filters.sortBy] = filters.sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by newest
    }

    try {
      const [articles, total] = await Promise.all([
        Article.find(query).sort(sort).skip(skip).limit(limit).lean(),
        Article.countDocuments(query),
      ]);

      return {
        data: articles,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error('Failed to retrieve articles');
    }
  }

  async getArticle(id: string): Promise<IArticle | null> {
    return findById<IArticle>(Article, id);
  }

  async createArticle(data: CreateArticleInput): Promise<IArticle> {
    try {
      return await createEntity<IArticle>(Article, data);
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw new ValidationError(
          { title: data.title },
          'Article with this title already exists'
        );
      }
      throw error;
    }
  }

  async updateArticle(
    id: string,
    data: UpdateArticleInput
  ): Promise<IArticle | null> {
    return updateEntity<IArticle>(Article, id, data);
  }

  async deleteArticle(id: string): Promise<IArticle | null> {
    return deleteEntity<IArticle>(Article, id);
  }

  // User methods
  async listUsers(): Promise<IUser[]> {
    return findAll<IUser>(User);
  }

  async getUser(id: string): Promise<IUser | null> {
    return findById<IUser>(User, id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email: email.toLowerCase() }).lean();
    } catch (error: any) {
      throw new Error('Failed to retrieve user');
    }
  }

  async createUser(data: CreateUserInput): Promise<IUser> {
    try {
      return await createEntity<IUser>(User, data);
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw new ValidationError(
          { email: data.email },
          'User with this email already exists'
        );
      }
      throw error;
    }
  }

  async updateUser(
    id: string,
    data: Partial<CreateUserInput>
  ): Promise<IUser | null> {
    return updateEntity<IUser>(User, id, data);
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return deleteEntity<IUser>(User, id);
  }

  // Comment methods
  async getCommentsByArticle(articleId: string): Promise<IComment[]> {
    if (!Types.ObjectId.isValid(articleId)) {
      return [];
    }

    try {
      return await Comment.find({ articleId: new Types.ObjectId(articleId) })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .lean();
    } catch (error: any) {
      throw new Error('Failed to retrieve comments');
    }
  }

  async getCommentsByUser(userId: string): Promise<IComment[]> {
    if (!Types.ObjectId.isValid(userId)) {
      return [];
    }

    try {
      return await Comment.find({ userId: new Types.ObjectId(userId) })
        .populate('articleId', 'title')
        .sort({ createdAt: -1 })
        .lean();
    } catch (error: any) {
      throw new Error('Failed to retrieve comments');
    }
  }

  async getComment(id: string): Promise<IComment | null> {
    return findById<IComment>(Comment, id);
  }

  async createComment(data: CreateCommentInput): Promise<IComment> {
    // Validate that article and user exist
    const [article, user] = await Promise.all([
      this.getArticle(data.articleId),
      this.getUser(data.userId),
    ]);

    if (!article) {
      throw new NotFoundError('Article not found', {
        articleId: data.articleId,
      });
    }

    if (!user) {
      throw new NotFoundError('User not found', { userId: data.userId });
    }

    try {
      const comment = new Comment({
        ...data,
        articleId: new Types.ObjectId(data.articleId),
        userId: new Types.ObjectId(data.userId),
      });

      return await comment.save();
    } catch (error: any) {
      throw new Error('Failed to create comment');
    }
  }

  async updateComment(
    id: string,
    data: Partial<CreateCommentInput>
  ): Promise<IComment | null> {
    return updateEntity<IComment>(Comment, id, data);
  }

  async deleteComment(id: string): Promise<IComment | null> {
    return deleteEntity<IComment>(Comment, id);
  }

  // Utility methods
  async getArticleStats(): Promise<any> {
    try {
      const [totalArticles, totalUsers, totalComments] = await Promise.all([
        Article.countDocuments(),
        User.countDocuments(),
        Comment.countDocuments(),
      ]);

      return {
        totalArticles,
        totalUsers,
        totalComments,
      };
    } catch (error: any) {
      throw new Error('Failed to retrieve statistics');
    }
  }

  async searchArticles(query: string, limit = 10): Promise<IArticle[]> {
    try {
      return await Article.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .lean();
    } catch (error: any) {
      throw new Error('Failed to search articles');
    }
  }
}
