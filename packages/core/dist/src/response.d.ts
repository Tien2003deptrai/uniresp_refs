import type { ApiSuccess, ApiError } from './types';
export declare const ok: <T>(data: T, meta?: Record<string, any>) => ApiSuccess<T>;
export declare const fail: (code: string, message: string, details?: any, traceId?: string) => ApiError;
//# sourceMappingURL=response.d.ts.map