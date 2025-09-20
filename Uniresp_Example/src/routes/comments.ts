import { Router, type Request, type Response } from 'express';
import { asyncRoute } from '@uniresp/server-express';
import { MongoDBRepository } from '../repository/mongodb';
import { CreateCommentSchema } from '../schemas';
import { validate } from '../middleware/validation';
import { CommentController } from '../controllers/CommentController';

export function createCommentsRouter(repo: MongoDBRepository): Router {
  const router = Router();
  const controller = new CommentController(repo);

  router.get(
    '/article/:articleId',
    asyncRoute((req: Request, res: Response) => controller.getCommentsByArticle(req, res))
  );

  router.post(
    '/',
    validate(CreateCommentSchema),
    asyncRoute((req: Request, res: Response) => controller.createComment(req, res))
  );

  router.get(
    '/:id',
    asyncRoute((req: Request, res: Response) => controller.getComment(req, res))
  );

  router.delete(
    '/:id',
    asyncRoute((req: Request, res: Response) => controller.deleteComment(req, res))
  );

  router.get(
    '/user/:userId',
    asyncRoute((req: Request, res: Response) => controller.getCommentsByUser(req, res))
  );

  return router;
}
