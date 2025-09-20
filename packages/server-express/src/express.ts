import type { Request, Response, NextFunction } from 'express';
import { fail } from '../../core/src/response.js';
import { AppError } from '../../errors/src/errors.js';

type Options = {
  onLog?: (err: any, req: Request) => void;
  traceId?: (req: Request) => string | undefined;
};

export function errorHandler(opts?: Options) {
  return (err: any, req: Request, res: Response, _next: NextFunction) => {
    const traceId = opts?.traceId?.(req);
    opts?.onLog?.(err, req);
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json(fail(err.code, err.message, err.details, traceId));
    const message = err?.message ?? 'Unknown error';
    return res
      .status(500)
      .json(fail('SYS.UNKNOWN', 'Internal server error', { message }, traceId));
  };
}
export const asyncRoute = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
