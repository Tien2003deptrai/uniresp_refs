import { type Request, type Response } from 'express';
import { ok } from '@uniresp/core';
import { asyncRoute } from '@uniresp/server-express';
import { MongoDBRepository } from '../repository/mongodb';
import { type CreateCommentInput } from '../schemas';
import { BaseController } from './BaseController';

export class CommentController extends BaseController {
  constructor(private repo: MongoDBRepository) {
    super();
  }

  getCommentsByArticle = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const article = await this.repo.getArticle(req.params.articleId);
    if (!article) {
      this.notFoundError('Article not found', {
        articleId: req.params.articleId,
      });
    }

    const comments = await this.repo.getCommentsByArticle(req.params.articleId);
    res.json(ok(comments, { message: "Get list comments successfully" }));
  });

  createComment = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const comment = await this.repo.createComment(req.body as CreateCommentInput);

    res.status(201).json(ok(comment, { message: 'Comment created successfully', }));
  });

  getComment = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const comment = await this.repo.getComment(req.params.id);
    if (!comment) {
      this.notFoundError('Comment not found', {
        commentId: req.params.id,
      });
    }
    res.json(ok(comment, { message: 'Get comment successfully', }));
  });

  deleteComment = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const comment = await this.repo.getComment(req.params.id);
    if (!comment) {
      this.notFoundError('Comment not found', {
        commentId: req.params.id,
      });
    }

    await this.repo.deleteComment(req.params.id);
    res.json(ok({ message: 'Delete comment successfully', }));
  });

  getCommentsByUser = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const user = await this.repo.getUser(req.params.userId);
    if (!user) {
      this.notFoundError('User not found', {
        userId: req.params.userId,
      });
    }

    const userComments = await this.repo.getCommentsByUser(req.params.userId);
    res.json(ok(userComments, { message: 'Get list comments successfully', }));
  });
}
