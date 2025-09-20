import { Router, type Request, type Response } from 'express';
import { ok } from '@uniresp/core';
import { NotFoundError } from '@uniresp/errors';
import { asyncRoute } from '@uniresp/server-express';
import { MongoDBRepository } from '../repository/mongodb';
import {
  CreateArticleSchema,
  UpdateArticleSchema,
  ArticleQuerySchema,
  ArticleSearchSchema,
  type CreateArticleInput,
  type UpdateArticleInput,
} from '../schemas';
import { validate, validateQuery } from '../middleware/validation';
import { pick, calculateReadingTime } from '../utils';

export function createArticlesRouter(repo: MongoDBRepository): Router {
  const router = Router();

  router.get(
    '/',
    validateQuery(ArticleQuerySchema),
    asyncRoute(async (req: Request, res: Response) => {
      const { page, limit, ...filters } = req.query as any;
      const result = await repo.listArticles(filters, { page, limit });

      const articlesWithReadingTime = result.data.map(article => ({
        ...article,
        readingTime: calculateReadingTime(article.content),
      }));

      res.json(
        ok(articlesWithReadingTime, {
          pagination: result.meta,
          filters,
          searchQuery: req.query.q || null,
          timestamp: new Date().toISOString(),
        })
      );
    })
  );

  router.get(
    '/search',
    validateQuery(ArticleSearchSchema),
    asyncRoute(async (req: Request, res: Response) => {
      const { page, limit, ...filters } = req.query as any;
      const result = await repo.listArticles(filters, { page, limit });

      res.json(
        ok(result.data, {
          pagination: result.meta,
          searchCriteria: filters,
          timestamp: new Date().toISOString(),
          searchId: Math.random().toString(36).substr(2, 9),
        })
      );
    })
  );

  router.get(
    '/:id',
    asyncRoute(async (req: Request, res: Response) => {
      const article = await repo.getArticle(req.params.id);
      if (!article)
        throw new NotFoundError('Article not found', {
          articleId: req.params.id,
        });

      res.json(
        ok(pick(article, ['_id', 'title', 'content', 'author']), {
          readingTime: calculateReadingTime(article.content),
          lastAccessed: new Date().toISOString(),
        })
      );
    })
  );

  router.get(
    '/:id/details',
    asyncRoute(async (req: Request, res: Response) => {
      const article = await repo.getArticle(req.params.id);
      if (!article)
        throw new NotFoundError('Article not found', {
          articleId: req.params.id,
        });

      res.json(
        ok(article, {
          readingTime: calculateReadingTime(article.content),
          wordCount: article.content.split(/\s+/).length,
          characterCount: article.content.length,
          lastAccessed: new Date().toISOString(),
          version: '1.0.0',
        })
      );
    })
  );

  router.post(
    '/',
    validate(CreateArticleSchema),
    asyncRoute(async (req: Request, res: Response) => {
      const created = await repo.createArticle(req.body as CreateArticleInput);

      res.status(201).json(
        ok(created, {
          message: 'Article created successfully',
          readingTime: calculateReadingTime(created.content),
          wordCount: created.content.split(/\s+/).length,
          timestamp: new Date().toISOString(),
        })
      );
    })
  );

  router.put(
    '/:id',
    validate(UpdateArticleSchema),
    asyncRoute(async (req: Request, res: Response) => {
      const updated = await repo.updateArticle(
        req.params.id,
        req.body as UpdateArticleInput
      );
      if (!updated)
        throw new NotFoundError('Article not found', {
          articleId: req.params.id,
        });

      res.json(
        ok(updated, {
          message: 'Article updated successfully',
          readingTime: calculateReadingTime(updated.content),
          wordCount: updated.content.split(/\s+/).length,
          timestamp: new Date().toISOString(),
        })
      );
    })
  );

  router.delete(
    '/:id',
    asyncRoute(async (req: Request, res: Response) => {
      const deleted = await repo.deleteArticle(req.params.id);
      if (!deleted)
        throw new NotFoundError('Article not found', {
          articleId: req.params.id,
        });
      res.status(204).send();
    })
  );

  return router;
}
