export class AppError extends Error {
    constructor(code, message, details, status = 400) {
        super(message);
        this.code = code;
        this.details = details;
        this.status = status;
        this.name = this.constructor.name;
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') { super('AUTH.UNAUTHORIZED', message, undefined, 401); }
}
export class NotFoundError extends AppError {
    constructor(message = 'Not found', details) { super('RESOURCE.NOT_FOUND', message, details, 404); }
}
export class ValidationError extends AppError {
    constructor(details, message = 'Invalid input') { super('INPUT.VALIDATION', message, details, 422); }
}
export class SystemError extends AppError {
    constructor(message = 'Internal server error') { super('SYS.UNKNOWN', message, undefined, 500); }
}
