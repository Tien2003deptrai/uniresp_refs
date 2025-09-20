import { NotFoundError } from '@uniresp/errors';
import { pick } from '../utils';

export abstract class BaseController {
  protected notFoundError(message: string, details?: Record<string, any>): never {
    throw new NotFoundError(message, details);
  }

  protected pick<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    fields: K[]
  ): Pick<T, K> {
    return pick(obj, fields);
  }
}
