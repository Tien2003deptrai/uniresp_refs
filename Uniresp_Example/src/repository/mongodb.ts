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
import { Types } from 'mongoose';

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
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    try {
      return await Article.findById(id).lean();
    } catch (error) {
      throw new Error('Failed to retrieve article');
    }
  }

  async createArticle(data: CreateArticleInput): Promise<IArticle> {
    try {
      const article = new Article(data);
      return await article.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ValidationError(
          { title: data.title },
          'Article with this title already exists'
        );
      }
      throw new Error('Failed to create article');
    }
  }

  async updateArticle(
    id: string,
    data: UpdateArticleInput
  ): Promise<IArticle | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    try {
      const article = await Article.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();

      return article;
    } catch (error) {
      throw new Error('Failed to update article');
    }
  }

  async deleteArticle(id: string): Promise<IArticle | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    try {
      return await Article.findByIdAndDelete(id).lean();
    } catch (error) {
      throw new Error('Failed to delete article');
    }
  }

  // User methods
  async listUsers(): Promise<IUser[]> {
    try {
      return await User.find().sort({ createdAt: -1 }).lean();
    } catch (error) {
      throw new Error('Failed to retrieve users');
    }
  }

  async getUser(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    try {
      return await User.findById(id).lean();
    } catch (error) {
      throw new Error('Failed to retrieve user');
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email: email.toLowerCase() }).lean();
    } catch (error) {
      throw new Error('Failed to retrieve user');
    }
  }

  async createUser(data: CreateUserInput): Promise<IUser> {
    try {
      const user = new User(data);
      return await user.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ValidationError(
          { email: data.email },
          'User with this email already exists'
        );
      }
      throw new Error('Failed to create user');
    }
  }

  async updateUser(
    id: string,
    data: Partial<CreateUserInput>
  ): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    try {
      const user = await User.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();

      return user;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    try {
      return await User.findByIdAndDelete(id).lean();
    } catch (error) {
      throw new Error('Failed to delete user');
    }
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
    } catch (error) {
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
    } catch (error) {
      throw new Error('Failed to retrieve comments');
    }
  }

  async getComment(id: string): Promise<IComment | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    try {
      return await Comment.findById(id)
        .populate('userId', 'name email')
        .populate('articleId', 'title')
        .lean();
    } catch (error) {
      throw new Error('Failed to retrieve comment');
    }
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
    } catch (error) {
      throw new Error('Failed to create comment');
    }
  }

  async updateComment(
    id: string,
    data: Partial<CreateCommentInput>
  ): Promise<IComment | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    try {
      const comment = await Comment.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
        .populate('userId', 'name email')
        .populate('articleId', 'title')
        .lean();

      return comment;
    } catch (error) {
      throw new Error('Failed to update comment');
    }
  }

  async deleteComment(id: string): Promise<IComment | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    try {
      return await Comment.findByIdAndDelete(id).lean();
    } catch (error) {
      throw new Error('Failed to delete comment');
    }
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
    } catch (error) {
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
    } catch (error) {
      throw new Error('Failed to search articles');
    }
  }
}
