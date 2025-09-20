import { Router, type Request, type Response } from 'express';
import { ok } from '@uniresp/core';
import { NotFoundError } from '@uniresp/errors';
import { asyncRoute } from '@uniresp/server-express';
import { MongoDBRepository } from '../repository/mongodb';
import { CreateCommentSchema, type CreateCommentInput } from '../schemas';
import { validate } from '../middleware/validation';

export function createCommentsRouter(repo: MongoDBRepository): Router {
  const router = Router();

  router.get(
    '/article/:articleId',
    asyncRoute(async (req: Request, res: Response) => {
      const article = await repo.getArticle(req.params.articleId);
      if (!article)
        throw new NotFoundError('Article not found', {
          articleId: req.params.articleId,
        });

      const comments = await repo.getCommentsByArticle(req.params.articleId);
      res.json(
        ok(comments, {
          articleId: req.params.articleId,
          count: comments.length,
          articleTitle: article.title,
        })
      );
    })
  );

  router.post(
    '/',
    validate(CreateCommentSchema),
    asyncRoute(async (req: Request, res: Response) => {
      const comment = await repo.createComment(req.body as CreateCommentInput);
      res.status(201).json(
        ok(comment, {
          message: 'Comment created successfully',
          articleTitle: (comment.articleId as any)?.title || 'Unknown Article',
          authorName: (comment.userId as any)?.name || 'Unknown User',
        })
      );
    })
  );

  router.get(
    '/:id',
    asyncRoute(async (req: Request, res: Response) => {
      const comment = await repo.getComment(req.params.id);
      if (!comment)
        throw new NotFoundError('Comment not found', {
          commentId: req.params.id,
        });
      res.json(ok(comment));
    })
  );

  router.delete(
    '/:id',
    asyncRoute(async (req: Request, res: Response) => {
      const comment = await repo.getComment(req.params.id);
      if (!comment)
        throw new NotFoundError('Comment not found', {
          commentId: req.params.id,
        });

      await repo.deleteComment(req.params.id);
      res.status(204).send();
    })
  );

  router.get(
    '/user/:userId',
    asyncRoute(async (req: Request, res: Response) => {
      const user = await repo.getUser(req.params.userId);
      if (!user)
        throw new NotFoundError('User not found', {
          userId: req.params.userId,
        });

      const userComments = await repo.getCommentsByUser(req.params.userId);
      res.json(
        ok(userComments, {
          userId: req.params.userId,
          userName: user.name,
          count: userComments.length,
        })
      );
    })
  );

  return router;
}
