import { Router, type Request, type Response } from 'express';
import { MongoDBRepository } from '../repository/mongodb';
import {
  CreateArticleSchema,
  UpdateArticleSchema,
  ArticleQuerySchema,
  ArticleSearchSchema,
} from '../schemas';
import { validate, validateQuery } from '../middleware/validation';
import { ArticleController } from '../controllers/ArticleController';

export function createArticlesRouter(repo: MongoDBRepository): Router {
  const router = Router();
  const controller = new ArticleController(repo);

  router.get(
    '/',
    validateQuery(ArticleQuerySchema),
    controller.listArticles
  );

  router.get(
    '/:id',
    controller.getArticle
  );

  router.get(
    '/:id/details',
    controller.getArticleDetails
  );

  router.post(
    '/',
    validate(CreateArticleSchema),
    controller.createArticle
  );

  router.put(
    '/:id',
    validate(UpdateArticleSchema),
    controller.updateArticle
  );

  router.delete(
    '/:id',
    controller.deleteArticle
  );

  return router;
}
