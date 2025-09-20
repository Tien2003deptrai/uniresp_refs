import { z } from 'zod';

// Base schemas
export const BaseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Article schemas
export const CreateArticleSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters long')
    .max(10000, 'Content must not exceed 10000 characters')
    .trim(),
  author: z
    .string()
    .min(2, 'Author name must be at least 2 characters long')
    .max(100, 'Author name must not exceed 100 characters')
    .trim(),
});

export const UpdateArticleSchema = CreateArticleSchema.partial().refine(
  data => Object.keys(data).length > 0,
  'At least one field must be provided for update'
);

export const ArticleSchema = BaseEntitySchema.extend({
  title: z.string(),
  content: z.string(),
  author: z.string(),
});

export const ArticleQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val) : 10)),
  q: z.string().optional(),
  author: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(['title', 'author', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const ArticleSearchSchema = ArticleQuerySchema.refine(
  data => data.q || data.author || data.dateFrom || data.dateTo,
  {
    message: 'At least one search parameter is required',
    path: ['q', 'author', 'dateFrom', 'dateTo'],
  }
);

// User schemas
export const CreateUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  role: z.enum(['admin', 'user', 'moderator']).default('user').optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial().refine(
  data => Object.keys(data).length > 0,
  'At least one field must be provided for update'
);

export const UserSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'user', 'moderator']),
});

// Comment schemas
export const CreateCommentSchema = z.object({
  articleId: z.string().min(1, 'Article ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  content: z
    .string()
    .min(3, 'Comment must be at least 3 characters long')
    .max(1000, 'Comment must not exceed 1000 characters')
    .trim(),
});

export const CommentSchema = BaseEntitySchema.extend({
  articleId: z.string(),
  userId: z.string(),
  content: z.string(),
});

// Search and pagination schemas
export const SearchFiltersSchema = z.object({
  query: z.string().optional(),
  author: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(['title', 'author', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// Demo validation schema
export const DemoValidationSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  age: z
    .number()
    .int()
    .min(0, 'Age must be at least 0')
    .max(150, 'Age must not exceed 150')
    .optional(),
  role: z.enum(['admin', 'user', 'moderator']).optional(),
});

// Type exports
export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;
export type Article = z.infer<typeof ArticleSchema>;

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type User = z.infer<typeof UserSchema>;

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type Comment = z.infer<typeof CommentSchema>;

export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;

export type DemoValidationInput = z.infer<typeof DemoValidationSchema>;
