import { type Request, type Response } from 'express';
import { ok } from '@uniresp/core';
import { NotFoundError } from '@uniresp/errors';
import { asyncRoute } from '@uniresp/server-express';
import { MongoDBRepository } from '../repository/mongodb';
import {
  type CreateArticleInput,
  type UpdateArticleInput
} from '../schemas';
import { BaseController } from './BaseController';

export class ArticleController extends BaseController {
  constructor(private repo: MongoDBRepository) {
    super();
  }

  listArticles = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const filters: any = {};

    const result = await this.repo.listArticles(filters, { page, limit });

    const articles = result.data.map(article => ({
      ...article,
    }));

    res.json(
      ok(articles, {
        message: "Articles listed successfully",
        pagination: result.meta,
        filters,
        searchQuery: req.query.q || null,
      })
    );
  });

  getArticle = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const article = await this.repo.getArticle(req.params.id);
    if (!article) {
      this.notFoundError('Article not found', {
        articleId: req.params.id,
      });
    }

    res.json(ok(this.pick(article, ['_id', 'title', 'content', 'author']))
    );
  });

  getArticleDetails = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const article = await this.repo.getArticle(req.params.id);
    if (!article) {
      this.notFoundError('Article not found', {
        articleId: req.params.id,
      });
    }

    res.json(ok(article, { message: 'Article detail' }));
  });

  createArticle = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const created = await this.repo.createArticle(req.body as CreateArticleInput);

    res.status(201).json(ok(created, { message: 'Article created successfully' })
    );
  });

  updateArticle = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const updated = await this.repo.updateArticle(
      req.params.id,
      req.body as UpdateArticleInput
    );
    if (!updated) {
      this.notFoundError('Article not found', {
        articleId: req.params.id,
      });
    }

    res.json(ok(updated, { message: 'Article updated successfully' }));
  });

  deleteArticle = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const deleted = await this.repo.deleteArticle(req.params.id);
    if (!deleted) {
      this.notFoundError('Article not found', {
        articleId: req.params.id,
      });
    }
    res.json(ok({ message: 'Article deleted successfully' }));
  });
}
