import { type Request, type Response } from 'express';
import { ok } from '@uniresp/core';
import { NotFoundError } from '@uniresp/errors';
import { MongoDBRepository } from '../repository/mongodb';
import {
  type CreateArticleInput,
  type UpdateArticleInput
} from '../schemas';
import { calculateReadingTime } from '../utils';
import { BaseController } from './BaseController';

export class ArticleController extends BaseController {
  constructor(private repo: MongoDBRepository) {
    super();
  }

  async listArticles(req: Request, res: Response): Promise<void> {
    const { page, limit, ...filters } = req.query as any;
    const result = await this.repo.listArticles(filters, { page, limit });

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
  }

  async searchArticles(req: Request, res: Response): Promise<void> {
    const { page, limit, ...filters } = req.query as any;
    const result = await this.repo.listArticles(filters, { page, limit });

    res.json(
      ok(result.data, {
        pagination: result.meta,
        searchCriteria: filters,
        timestamp: new Date().toISOString(),
        searchId: Math.random().toString(36).substr(2, 9),
      })
    );
  }

  async getArticle(req: Request, res: Response): Promise<void> {
    const article = await this.repo.getArticle(req.params.id);
    if (!article) {
      this.notFoundError('Article not found', {
        articleId: req.params.id,
      });
    }

    res.json(
      ok(this.pick(article, ['_id', 'title', 'content', 'author']), {
        readingTime: calculateReadingTime(article.content),
        lastAccessed: new Date().toISOString(),
      })
    );
  }

  async getArticleDetails(req: Request, res: Response): Promise<void> {
    const article = await this.repo.getArticle(req.params.id);
    if (!article) {
      this.notFoundError('Article not found', {
        articleId: req.params.id,
      });
    }

    res.json(
      ok(article, {
        readingTime: calculateReadingTime(article.content),
        wordCount: article.content.split(/\s+/).length,
        characterCount: article.content.length,
        lastAccessed: new Date().toISOString(),
        version: '1.0.0',
      })
    );
  }

  async createArticle(req: Request, res: Response): Promise<void> {
    const created = await this.repo.createArticle(req.body as CreateArticleInput);

    res.status(201).json(
      ok(created, {
        message: 'Article created successfully',
        readingTime: calculateReadingTime(created.content),
        wordCount: created.content.split(/\s+/).length,
        timestamp: new Date().toISOString(),
      })
    );
  }

  async updateArticle(req: Request, res: Response): Promise<void> {
    const updated = await this.repo.updateArticle(
      req.params.id,
      req.body as UpdateArticleInput
    );
    if (!updated) {
      this.notFoundError('Article not found', {
        articleId: req.params.id,
      });
    }

    res.json(
      ok(updated, {
        message: 'Article updated successfully',
        readingTime: calculateReadingTime(updated.content),
        wordCount: updated.content.split(/\s+/).length,
        timestamp: new Date().toISOString(),
      })
    );
  }

  async deleteArticle(req: Request, res: Response): Promise<void> {
    const deleted = await this.repo.deleteArticle(req.params.id);
    if (!deleted) {
      this.notFoundError('Article not found', {
        articleId: req.params.id,
      });
    }
    res.status(204).send();
  }
}
