# @uniresp/errors

> **VN (tóm tắt):** Tập hợp các _error classes_ đã chuẩn hoá (`AppError` & các lớp con) để ném lỗi có `code`, `message`, `details`, và `status` nhất quán.

[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#)

## Install

```bash
npm i @uniresp/errors
# or
pnpm add @uniresp/errors
```

## What you get

- **`AppError`**: base class → `new AppError(code, message, details?, status = 400)`
- **`UnauthorizedError`** → `AUTH.UNAUTHORIZED`, HTTP 401
- **`NotFoundError`** → `RESOURCE.NOT_FOUND`, HTTP 404
- **`ValidationError`** → `INPUT.VALIDATION`, HTTP 422
- **`SystemError`** → `SYS.UNKNOWN`, HTTP 500

> All of these work seamlessly with `@uniresp/server-express`’s `errorHandler` to emit the standardized `ApiError` JSON.

## Usage

```ts
import { ValidationError, NotFoundError, AppError } from '@uniresp/errors';

// throw from services/handlers
function createUser(input: any) {
  if (!input?.email)
    throw new ValidationError({ field: 'email' }, 'Email is required');
  // ...
}

async function getUser(id: string) {
  const user = await db.user.findById(id);
  if (!user) throw new NotFoundError('User not found');
  return user;
}

// customizing
throw new AppError(
  'PAYMENT.REJECTED',
  'Card declined',
  { reason: 'insufficient_funds' },
  402
);
```

## Error shape produced by adapters

When used with `@uniresp/server-express`, thrown `AppError` (or subclasses) are converted to:

```json
{
  "ok": false,
  "error": {
    "code": "INPUT.VALIDATION",
    "message": "Invalid input",
    "details": { "...": "..." },
    "traceId": "req-123"
  }
}
```

## Notes

- Prefer stable `code`s (e.g. `USER.NOT_FOUND`) over free-text parsing.
- `details` is optional and can carry validation errors, raw provider payloads, etc.
- You can extend `AppError` to add domain-specific errors while keeping consistency.

## License

MIT © 2025-present
