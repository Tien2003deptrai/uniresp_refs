import { ok, fail } from '@uniresp/core';
import { AppError } from '@uniresp/errors';
export function handleRoute(fn) {
    return async (req) => {
        try {
            const data = await fn(req);
            return Response.json(ok(data));
        }
        catch (err) {
            if (err instanceof AppError)
                return Response.json(fail(err.code, err.message, err.details), { status: err.status });
            return Response.json(fail('SYS.UNKNOWN', 'Internal server error'), { status: 500 });
        }
    };
}
