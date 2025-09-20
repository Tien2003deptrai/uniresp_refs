import { Router, type Request, type Response } from 'express';
import { MongoDBRepository } from '../repository/mongodb';
import { CreateUserSchema } from '../schemas';
import { validate } from '../middleware/validation';
import { UserController } from '../controllers/UserController';

export function createUsersRouter(repo: MongoDBRepository): Router {
  const router = Router();
  const controller = new UserController(repo);

  router.get(
    '/',
    controller.listUsers
  );

  router.get(
    '/:id',
    controller.getUser
  );

  router.post(
    '/',
    validate(CreateUserSchema),
    controller.createUser
  );

  router.get(
    '/:id/profile',
    controller.getUserProfile
  );

  router.get(
    '/email/:email',
    controller.getUserByEmail
  );

  return router;
}
