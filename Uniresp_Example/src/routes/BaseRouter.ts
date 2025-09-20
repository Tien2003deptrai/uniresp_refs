import { Router, type Request, type Response } from 'express';
import { ok } from '@uniresp/core';
import { NotFoundError } from '@uniresp/errors';
import { asyncRoute } from '@uniresp/server-express';
import { MongoDBRepository } from '../repository/mongodb';
import { validate, validateQuery } from '../middleware/validation';
import { pick } from '../utils';

export abstract class BaseRouter {
  protected router: Router;
  protected repo: MongoDBRepository;

  constructor(repo: MongoDBRepository) {
    this.router = Router();
    this.repo = repo;
    this.setupRoutes();
  }

  protected abstract setupRoutes(): void;

  protected sendSuccess(res: Response, data: any, meta?: Record<string, any>): void {
    res.json(ok(data, meta));
  }

  protected sendCreated(res: Response, data: any, meta?: Record<string, any>): void {
    res.status(201).json(ok(data, meta));
  }

  protected sendNoContent(res: Response): void {
    res.status(204).send();
  }

  protected validateRequest(schema: any) {
    return validate(schema);
  }

  protected validateQueryRequest(schema: any) {
    return validateQuery(schema);
  }

  protected asyncRoute(handler: (req: Request, res: Response) => Promise<void>) {
    return asyncRoute(handler);
  }

  protected notFoundError(message: string, details?: Record<string, any>): never {
    throw new NotFoundError(message, details);
  }

  protected pick<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    fields: K[]
  ): Pick<T, K> {
    return pick(obj, fields);
  }

  public getRouter(): Router {
    return this.router;
  }
}
