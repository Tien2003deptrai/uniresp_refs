# @uniresp/core

> **VN (tóm tắt):** Bộ _types_ và _helper_ nhỏ gọn để chuẩn hoá response API với một format duy nhất:
> `{ ok: true, data }` **hoặc** `{ ok: false, error }`.

[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#)

## Why

A single, typed envelope for every HTTP/API response keeps clients simple and errors predictable.
This package exposes:

- **Types**: `ApiSuccess<T>`, `ApiError`, `ApiResponse<T>`
- **Helpers**: `ok(data, meta?)`, `fail(code, message, details?, traceId?)`

## Install

```bash
npm i @uniresp/core
# or
pnpm add @uniresp/core
```

## Response shape

```ts
type ApiSuccess<T> = {
  ok: true;
  data: T;
  code?: string;
  meta?: Record<string, any>;
};
type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: any;
    traceId?: string;
  };
};
type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

## Helpers

```ts
import { ok, fail } from '@uniresp/core';

// success
return ok({ id: 1, name: 'Alice' }, { page: 1 });

// failure
return fail('INPUT.VALIDATION', 'Invalid email', { field: 'email' }, 'req-123');
```

## Server example

```ts
import { ok, fail, type ApiResponse } from '@uniresp/core';

export type User = { id: number; name: string };

// Any handler/service can return ApiResponse<User>
async function getUser(id: number): Promise<ApiResponse<User>> {
  const user = await db.user.findById(id);
  if (!user) return fail('USER.NOT_FOUND', 'User not found');
  return ok(user);
}
```

## Client example (type-narrowing)

```ts
import type { ApiResponse } from '@uniresp/core';
import type { User } from './types';

async function fetchUser(id: number) {
  const res = await fetch(`/api/users/${id}`);
  const body: ApiResponse<User> = await res.json();

  if (!body.ok) {
    // body is ApiError here
    console.error(body.error.code, body.error.message);
    throw new Error(body.error.message);
  }
  // body is ApiSuccess<User>
  return body.data;
}
```

## Notes

- `meta` is a free-form object for pagination, totals, etc.
- `code` is a stable, machine-friendly identifier (keep it consistent across services).
- `traceId` helps correlate logs/traces across systems (usually injected by a web adapter).

## License

MIT © 2025-present
