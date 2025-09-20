import { Router, type Request, type Response } from 'express';
import { asyncRoute } from '@uniresp/server-express';
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
    asyncRoute((req: Request, res: Response) => controller.listArticles(req, res))
  );

  router.get(
    '/search',
    validateQuery(ArticleSearchSchema),
    asyncRoute((req: Request, res: Response) => controller.searchArticles(req, res))
  );

  router.get(
    '/:id',
    asyncRoute((req: Request, res: Response) => controller.getArticle(req, res))
  );

  router.get(
    '/:id/details',
    asyncRoute((req: Request, res: Response) => controller.getArticleDetails(req, res))
  );

  router.post(
    '/',
    validate(CreateArticleSchema),
    asyncRoute((req: Request, res: Response) => controller.createArticle(req, res))
  );

  router.put(
    '/:id',
    validate(UpdateArticleSchema),
    asyncRoute((req: Request, res: Response) => controller.updateArticle(req, res))
  );

  router.delete(
    '/:id',
    asyncRoute((req: Request, res: Response) => controller.deleteArticle(req, res))
  );

  return router;
}
