import { type Request, type Response } from 'express';
import { ok } from '@uniresp/core';
import { NotFoundError } from '@uniresp/errors';
import { MongoDBRepository } from '../repository/mongodb';
import { type CreateUserInput } from '../schemas';
import { pick } from '../utils';
import { BaseController } from './BaseController';

export class UserController extends BaseController {
  constructor(private repo: MongoDBRepository) {
    super();
  }

  async listUsers(req: Request, res: Response): Promise<void> {
    const users = await this.repo.listUsers();
    res.json(
      ok(users, {
        count: users.length,
      })
    );
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const user = await this.repo.getUser(req.params.id);
    if (!user) {
      this.notFoundError('User not found', { userId: req.params.id });
    }

    res.json(ok(this.pick(user, ['id', 'name', 'email', 'role', 'createdAt'])));
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const user = await this.repo.createUser(req.body as CreateUserInput);
    res.status(201).json(
      ok(user, {
        message: 'User created successfully',
      })
    );
  }

  async getUserProfile(req: Request, res: Response): Promise<void> {
    const user = await this.repo.getUser(req.params.id);
    if (!user) {
      this.notFoundError('User not found', { userId: req.params.id });
    }

    res.json(
      ok(user, {
        profileType: 'detailed',
      })
    );
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    const user = await this.repo.getUserByEmail(req.params.email);
    if (!user) {
      this.notFoundError('User not found', { email: req.params.email });
    }
    res.json(ok(user));
  }
}
