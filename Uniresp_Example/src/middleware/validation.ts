import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { ValidationError } from '@uniresp/errors';

const createValidationError = (error: z.ZodError, message: string) => {
  const details = error.issues.reduce(
    (acc: Record<string, any>, err) => ({
      ...acc,
      [err.path.join('.')]: { message: err.message, received: err.input },
    }),
    {}
  );
  throw new ValidationError(details, message);
};

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError)
        createValidationError(error, 'Validation failed');
      next(error);
    }
  };

export const validateQuery =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      Object.assign(req.query, parsed);
      next();
    } catch (error) {
      if (error instanceof z.ZodError)
        createValidationError(error, 'Query validation failed');
      next(error);
    }
  };

export const validateParams =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the params and assign properties instead of replacing the object
      const parsed = schema.parse(req.params);
      Object.assign(req.params, parsed);
      next();
    } catch (error) {
      if (error instanceof z.ZodError)
        createValidationError(error, 'Parameter validation failed');
      next(error);
    }
  };
