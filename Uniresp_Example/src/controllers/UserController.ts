import { type Request, type Response } from 'express';
import { ok } from '@uniresp/core';
import { asyncRoute } from '@uniresp/server-express';
import { MongoDBRepository } from '../repository/mongodb';
import { type CreateUserInput } from '../schemas';
import { BaseController } from './BaseController';

export class UserController extends BaseController {
  constructor(private repo: MongoDBRepository) {
    super();
  }

  listUsers = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const users = await this.repo.listUsers();
    res.json(
      ok(users, {
        meta: {
          total: users.length,
        },
      })
    );
  });

  getUser = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const user = await this.repo.getUser(req.params.id);
    if (!user) {
      this.notFoundError('User not found', { userId: req.params.id });
    }

    const result = this.pick(user, ['id', 'name', 'email', 'role']);
    res.json(ok(result, { message: 'Get user successfully', }));
  });

  createUser = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const user = await this.repo.createUser(req.body as CreateUserInput);

    res.status(201).json(ok(user, { message: 'User created successfully', }));
  });

  getUserProfile = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const user = await this.repo.getUser(req.params.id);
    if (!user) {
      this.notFoundError('User not found', { userId: req.params.id });
    }

    res.json(ok(user, { message: 'Get user profile successfully', }));
  });

  getUserByEmail = asyncRoute(async (req: Request, res: Response): Promise<void> => {
    const user = await this.repo.getUserByEmail(req.params.email);
    if (!user) {
      this.notFoundError('User not found', { email: req.params.email });
    }
    res.json(ok(user));
  });
}
