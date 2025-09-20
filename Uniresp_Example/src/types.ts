export type Article = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  articleId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateArticleRequest = {
  title: string;
  content: string;
  author: string;
};

export type UpdateArticleRequest = {
  title?: string;
  content?: string;
  author?: string;
};

export type CreateUserRequest = {
  email: string;
  name: string;
  role?: 'admin' | 'user' | 'moderator';
};

export type CreateCommentRequest = {
  articleId: string;
  userId: string;
  content: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type SearchFilters = {
  query?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'title' | 'author' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};
