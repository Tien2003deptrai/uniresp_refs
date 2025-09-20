import express, { ErrorRequestHandler } from 'express';
import { json } from 'express';
import { errorHandler } from '@uniresp/server-express';
import { ok } from '@uniresp/core';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { MongoDBRepository } from './repository/mongodb';
import { createArticlesRouter } from './routes/articles';
import { createUsersRouter } from './routes/users';
import { createCommentsRouter } from './routes/comments';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Initialize MongoDB repository
const repo = new MongoDBRepository();

// Routes
app.use('/api/articles', createArticlesRouter(repo));
app.use('/api/users', createUsersRouter(repo));
app.use('/api/comments', createCommentsRouter(repo));

// Health check endpoint with comprehensive information
app.get('/api/health', (_req, res) => {
  res.json(
    ok(
      {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      },
      {
        services: {
          database: 'in-memory',
          cache: 'none',
          logging: 'console',
        },
        features: [
          'Articles CRUD',
          'Users Management',
          'Comments System',
          'Advanced Search',
          'Pagination',
          'Error Handling',
          'Validation',
          'Demo Endpoints',
        ],
      }
    )
  );
});

// Error handling middleware (must be last)
app.use(
  errorHandler({
    onLog: (err, req) => {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] ERROR:`, {
        message: err.message,
        code: err.code || 'UNKNOWN',
        status: err.status || 500,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
    },
    traceId: req => (req.headers['x-request-id'] as string) || undefined,
  }) as unknown as ErrorRequestHandler
);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    ok: false,
    error: {
      code: 'ROUTE.NOT_FOUND',
      message: 'Route not found',
      details: { path: _req.originalUrl },
    },
  });
});

const port = Number(process.env.PORT ?? 3000);

// Start server after MongoDB connection
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Express server
    app.listen(port, () => {
      console.log(`
        Uniresp Example Server Started!
        URL: http://localhost:${port}
        API Docs: http://localhost:${port}/api
        Health: http://localhost:${port}/api/health
        Demo: http://localhost:${port}/api/demo/features
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
