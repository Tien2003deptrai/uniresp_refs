export type ApiSuccess<T> = { ok: true; data: T; code?: string; meta?: Record<string, any>; };
export type ApiError = { ok: false; error: { code: string; message: string; details?: any; traceId?: string; }; };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
