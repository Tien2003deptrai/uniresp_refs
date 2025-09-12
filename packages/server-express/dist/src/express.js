import { fail } from '@uniresp/core';
import { AppError } from '@uniresp/errors';
export function errorHandler(opts) {
    return (err, req, res, _next) => {
        const traceId = opts?.traceId?.(req);
        opts?.onLog?.(err, req);
        if (err instanceof AppError)
            return res.status(err.status).json(fail(err.code, err.message, err.details, traceId));
        const message = err?.message ?? 'Unknown error';
        return res.status(500).json(fail('SYS.UNKNOWN', 'Internal server error', { message }, traceId));
    };
}
export const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
