import type { ApiSuccess, ApiError } from './types';
export const ok = <T>(data: T, meta?: Record<string, any>): ApiSuccess<T> => ({ ok: true, data, meta });
export const fail = (code: string, message: string, details?: any, traceId?: string): ApiError => ({ ok: false, error: { code, message, details, traceId }});
