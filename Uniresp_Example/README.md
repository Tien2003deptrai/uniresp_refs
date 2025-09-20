# Uniresp Example (Express + TypeScript)

An example CRUD API for managing articles using Uniresp packages.

## Packages

- @uniresp/core — response helpers
- @uniresp/server-express — async routes + error handler
- @uniresp/errors — typed errors

## Scripts

- npm run dev — start in watch mode
- npm run build — compile TypeScript to dist/
- npm start — run compiled server

## Endpoints

- GET /api/health
- GET /api/articles
- GET /api/articles/:id
- POST /api/articles — body: { title, content, author }
- PUT /api/articles/:id — body: { title?, content?, author? }
- DELETE /api/articles/:id

## Run

```bash
npm i
npm run dev
# open http://localhost:3000/api/health
```
