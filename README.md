# UniResp

Unified API Response Handling for Node.js Applications

[![npm version](https://img.shields.io/npm/v/@uniresp/core.svg)](https://www.npmjs.com/package/@uniresp/core)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

UniResp is a TypeScript library that provides standardized API response handling and error management for Node.js applications. It offers a consistent way to structure your API responses and handle errors across your application.

## Packages

This monorepo contains the following packages:

- [@uniresp/core](./packages/core) - Core types and helpers for unified API responses
- [@uniresp/errors](./packages/errors) - Typed error classes (AppError & subclasses)
- [@uniresp/server-express](./packages/server-express) - Express.js adapters: errorHandler and asyncRoute

## ✨ Features

- **Standardized Responses**: Consistent API response structure
- **Typed Errors**: Comprehensive error handling with TypeScript support
- **Express Integration**: Ready-to-use Express.js middleware
- **Lightweight**: Minimal overhead, maximum utility
- **TypeScript First**: Built with TypeScript for excellent developer experience

## 🚀 Quick Start

### Installation

```bash
# Install the core package
npm install @uniresp/core

# Install error handling
npm install @uniresp/errors

# Install Express integration (if using Express)
npm install @uniresp/server-express
```

## 📚 Example Usage

For a complete example of how to use UniResp in a real application, check out our example repository:

[📘 UniResp Express Example](https://github.com/Tien2003deptrai/uniresp-be-clean)

This example demonstrates:

- Setting up a clean Express.js API
- Using UniResp for standardized responses
- Implementing error handling with custom error types
- Best practices for API structure

## 🛠 Development

### Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Build all packages:
   ```bash
   pnpm build
   ```
## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
