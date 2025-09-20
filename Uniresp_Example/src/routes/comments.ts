import { Router, type Request, type Response } from 'express';
import { MongoDBRepository } from '../repository/mongodb';
import { CreateCommentSchema } from '../schemas';
import { validate } from '../middleware/validation';
import { CommentController } from '../controllers/CommentController';

export function createCommentsRouter(repo: MongoDBRepository): Router {
  const router = Router();
  const controller = new CommentController(repo);

  router.get(
    '/article/:articleId',
    controller.getCommentsByArticle
  );

  router.post(
    '/',
    validate(CreateCommentSchema),
    controller.createComment
  );

  router.get(
    '/:id',
    controller.getComment
  );

  router.delete(
    '/:id',
    controller.deleteComment
  );

  router.get(
    '/user/:userId',
    controller.getCommentsByUser
  );

  return router;
}
