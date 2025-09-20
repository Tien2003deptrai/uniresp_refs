import { Router, type Request, type Response } from 'express';
import { ok } from '@uniresp/core';
import { NotFoundError } from '@uniresp/errors';
import { asyncRoute } from '@uniresp/server-express';
import { MongoDBRepository } from '../repository/mongodb';
import { CreateUserSchema, type CreateUserInput } from '../schemas';
import { validate } from '../middleware/validation';
import { pick } from '../utils';

export function createUsersRouter(repo: MongoDBRepository): Router {
  const router = Router();

  router.get(
    '/',
    asyncRoute(async (req: Request, res: Response) => {
      const users = await repo.listUsers();
      res.json(
        ok(users, {
          count: users.length,
        })
      );
    })
  );

  router.get(
    '/:id',
    asyncRoute(async (req: Request, res: Response) => {
      const user = await repo.getUser(req.params.id);
      if (!user)
        throw new NotFoundError('User not found', { userId: req.params.id });

      res.json(ok(pick(user, ['id', 'name', 'email', 'role', 'createdAt'])));
    })
  );

  router.post(
    '/',
    validate(CreateUserSchema),
    asyncRoute(async (req: Request, res: Response) => {
      const user = await repo.createUser(req.body as CreateUserInput);
      res.status(201).json(
        ok(user, {
          message: 'User created successfully',
        })
      );
    })
  );

  router.get(
    '/:id/profile',
    asyncRoute(async (req: Request, res: Response) => {
      const user = await repo.getUser(req.params.id);
      if (!user)
        throw new NotFoundError('User not found', { userId: req.params.id });

      res.json(
        ok(user, {
          profileType: 'detailed',
        })
      );
    })
  );

  router.get(
    '/email/:email',
    asyncRoute(async (req: Request, res: Response) => {
      const user = await repo.getUserByEmail(req.params.email);
      if (!user)
        throw new NotFoundError('User not found', { email: req.params.email });
      res.json(ok(user));
    })
  );

  return router;
}
