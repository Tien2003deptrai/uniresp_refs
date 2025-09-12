export declare class AppError extends Error {
    code: string;
    details?: any | undefined;
    status: number;
    constructor(code: string, message: string, details?: any | undefined, status?: number);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class ValidationError extends AppError {
    constructor(details?: any, message?: string);
}
export declare class SystemError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map