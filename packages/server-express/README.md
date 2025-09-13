# @uniresp/server-express

Express.js adapters for the `@uniresp` ecosystem:
- **`errorHandler(opts?)`**: converts thrown `AppError` (and unknown errors) to the unified `ApiError` JSON.
- **`asyncRoute(fn)`**: tiny helper to bubble async exceptions to the error handler.

[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](#)
[![Express](https://img.shields.io/badge/Express-ready-blue.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#)

## Install
```bash
npm i @uniresp/server-express @uniresp/core @uniresp/errors express
# or
pnpm add @uniresp/server-express @uniresp/core @uniresp/errors express
```

> **Peer deps:** `express@^4` (v5 preview also works in most cases).

## API
```ts
import type { Request } from 'express'
import { errorHandler, asyncRoute } from '@uniresp/server-express'

type Options = {
  onLog?: (err: any, req: Request) => void
  traceId?: (req: Request) => string | undefined
}

const handler = errorHandler({
  onLog: (err, req) => console.error('[ERR]', req.method, req.url, err),
  traceId: (req) => req.headers['x-request-id'] as string | undefined,
})
```

- **`onLog`**: hook to record/ship exceptions (pino, winston, APM…).
- **`traceId`**: compute an id (e.g. from headers) and inject into the response’s `error.traceId`.

## Usage with Express
```ts
import express from 'express'
import { asyncRoute, errorHandler } from '@uniresp/server-express'
import { ok } from '@uniresp/core'
import { NotFoundError } from '@uniresp/errors'

const app = express()

app.get('/health', (_req, res) => res.json(ok({ up: true })))

app.get('/users/:id', asyncRoute(async (req, res) => {
  const user = await repo.findById(req.params.id)
  if (!user) throw new NotFoundError('User not found')
  res.json(ok(user))
}))

// 404 as AppError
app.use((_req, _res, next) => next(new NotFoundError('Route not found')))

// centralized JSON error output
app.use(errorHandler({
  onLog: (err, req) => console.error(err),
  traceId: (req) => req.headers['x-request-id'] as string | undefined,
}))

app.listen(3000)
```

## Output examples
**Success**
```json
{ "ok": true, "data": { "id": 1 }, "meta": { "page": 1 } }
```
**Error (thrown AppError)**
```json
{ "ok": false, "error": { "code": "RESOURCE.NOT_FOUND", "message": "User not found", "traceId": "req-123" } }
```
**Error (unknown)**
```json
{ "ok": false, "error": { "code": "SYS.UNKNOWN", "message": "Internal server error" } }
```

## Notes
- Keep business code throwing typed errors; let the adapter shape the response.
- Prefer `asyncRoute` for concise route code without `try/catch` noise.
- Works great together with `@uniresp/core` and `@uniresp/errors`.

## License
MIT © 2025-present
