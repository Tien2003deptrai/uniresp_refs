import { Router, type Request, type Response } from 'express';
import { asyncRoute } from '@uniresp/server-express';
import { MongoDBRepository } from '../repository/mongodb';
import { CreateUserSchema } from '../schemas';
import { validate } from '../middleware/validation';
import { UserController } from '../controllers/UserController';

export function createUsersRouter(repo: MongoDBRepository): Router {
  const router = Router();
  const controller = new UserController(repo);

  router.get(
    '/',
    asyncRoute((req: Request, res: Response) => controller.listUsers(req, res))
  );

  router.get(
    '/:id',
    asyncRoute((req: Request, res: Response) => controller.getUser(req, res))
  );

  router.post(
    '/',
    validate(CreateUserSchema),
    asyncRoute((req: Request, res: Response) => controller.createUser(req, res))
  );

  router.get(
    '/:id/profile',
    asyncRoute((req: Request, res: Response) => controller.getUserProfile(req, res))
  );

  router.get(
    '/email/:email',
    asyncRoute((req: Request, res: Response) => controller.getUserByEmail(req, res))
  );

  return router;
}
