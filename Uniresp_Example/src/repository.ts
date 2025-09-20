import type {
  Article,
  User,
  Comment,
  CreateArticleRequest,
  UpdateArticleRequest,
  CreateUserRequest,
  CreateCommentRequest,
  SearchFilters,
  PaginationMeta,
} from './types';
import { generateId, sanitizeString } from './utils';

export class ArticleRepository {
  private articles: Article[] = [
    {
      id: '1',
      title: 'Getting Started with TypeScript',
      content:
        'TypeScript is a powerful programming language that builds on JavaScript by adding static type definitions. Types provide a way to describe the shape of an object, providing better documentation, and allowing TypeScript to validate that your code is working correctly.',
      author: 'John Doe',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Advanced Node.js Patterns',
      content:
        'Node.js offers many advanced patterns for building scalable applications. From event-driven architecture to microservices, understanding these patterns is crucial for modern development.',
      author: 'Jane Smith',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
    {
      id: '3',
      title: 'Clean Architecture Principles',
      content:
        'Clean Architecture is a software design philosophy that separates the elements of a design into ring levels. The main rule of clean architecture is that code dependencies can only point inward.',
      author: 'Bob Johnson',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
    },
  ];

  private users: User[] = [
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      role: 'user',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
  ];

  private comments: Comment[] = [
    {
      id: '1',
      articleId: '1',
      userId: '2',
      content: 'Great article! Very helpful for beginners.',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    },
  ];

  // Article methods
  async list(
    filters?: SearchFilters,
    page = 1,
    limit = 10
  ): Promise<{ data: Article[]; meta: PaginationMeta }> {
    let filteredArticles = [...this.articles];

    if (filters) {
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredArticles = filteredArticles.filter(
          article =>
            article.title.toLowerCase().includes(query) ||
            article.content.toLowerCase().includes(query)
        );
      }

      if (filters.author) {
        filteredArticles = filteredArticles.filter(article =>
          article.author.toLowerCase().includes(filters.author!.toLowerCase())
        );
      }

      if (filters.dateFrom) {
        filteredArticles = filteredArticles.filter(
          article => article.createdAt >= filters.dateFrom!
        );
      }

      if (filters.dateTo) {
        filteredArticles = filteredArticles.filter(
          article => article.createdAt <= filters.dateTo!
        );
      }

      if (filters.sortBy) {
        filteredArticles.sort((a, b) => {
          const aVal = a[filters.sortBy!];
          const bVal = b[filters.sortBy!];
          const order = filters.sortOrder === 'desc' ? -1 : 1;
          return aVal < bVal ? -1 * order : aVal > bVal ? 1 * order : 0;
        });
      }
    }

    const total = filteredArticles.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filteredArticles.slice(startIndex, endIndex);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async get(id: string): Promise<Article | null> {
    return this.articles.find(article => article.id === id) || null;
  }

  async create(data: CreateArticleRequest): Promise<Article> {
    const now = new Date().toISOString();
    const article: Article = {
      id: generateId(),
      title: sanitizeString(data.title),
      content: sanitizeString(data.content),
      author: sanitizeString(data.author),
      createdAt: now,
      updatedAt: now,
    };
    this.articles.push(article);
    return article;
  }

  async update(
    id: string,
    data: UpdateArticleRequest
  ): Promise<Article | null> {
    const index = this.articles.findIndex(article => article.id === id);
    if (index === -1) return null;

    const updateData: Partial<Article> = {};
    if (data.title) updateData.title = sanitizeString(data.title);
    if (data.content) updateData.content = sanitizeString(data.content);
    if (data.author) updateData.author = sanitizeString(data.author);

    this.articles[index] = {
      ...this.articles[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return this.articles[index];
  }

  async remove(id: string): Promise<Article | null> {
    const index = this.articles.findIndex(article => article.id === id);
    if (index === -1) return null;

    return this.articles.splice(index, 1)[0];
  }

  // User methods
  async listUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getUser(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      id: generateId(),
      email: data.email.toLowerCase(),
      name: sanitizeString(data.name),
      role: data.role || 'user',
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);
    return user;
  }

  // Comment methods
  async getCommentsByArticle(articleId: string): Promise<Comment[]> {
    return this.comments.filter(comment => comment.articleId === articleId);
  }

  async createComment(data: CreateCommentRequest): Promise<Comment> {
    const now = new Date().toISOString();
    const comment: Comment = {
      id: generateId(),
      articleId: data.articleId,
      userId: data.userId,
      content: sanitizeString(data.content),
      createdAt: now,
      updatedAt: now,
    };
    this.comments.push(comment);
    return comment;
  }

  async getComment(id: string): Promise<Comment | null> {
    return this.comments.find(comment => comment.id === id) || null;
  }

  async removeComment(id: string): Promise<Comment | null> {
    const index = this.comments.findIndex(comment => comment.id === id);
    if (index === -1) return null;

    return this.comments.splice(index, 1)[0];
  }
}
