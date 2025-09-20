import type { ApiSuccess, ApiError } from './types.js';
export const ok = <T>(
  data: T,
  options?: { message?: string; meta?: Record<string, any> }
): ApiSuccess<T> => ({ ok: true, message: options?.message, data, meta: options?.meta });
export const fail = (
  code: string,
  message: string,
  details?: any,
  traceId?: string
): ApiError => ({ ok: false, error: { code, message, details, traceId } });
