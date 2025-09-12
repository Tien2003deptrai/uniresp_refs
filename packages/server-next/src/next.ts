import { NextRequest } from 'next/server';
import { ok, fail } from '@uniresp/core';
import { AppError } from '@uniresp/errors';

export function handleRoute<T>(fn: (req: NextRequest) => Promise<T>){
  return async (req: NextRequest) => {
    try{ const data = await fn(req); return Response.json(ok<T>(data)); }
    catch(err: any){ if (err instanceof AppError) return Response.json(fail(err.code, err.message, err.details), { status: err.status }); return Response.json(fail('SYS.UNKNOWN', 'Internal server error'), { status: 500 }); }
  };
}
