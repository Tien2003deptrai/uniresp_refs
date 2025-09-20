import { connectDatabase } from '../config/database';
import { MongoDBRepository } from '../repository/mongodb';
import { Article, User, Comment } from '../models';

const seedData = async () => {
  try {
    await connectDatabase();

    // Clear existing data
    await Promise.all([
      Article.deleteMany({}),
      User.deleteMany({}),
      Comment.deleteMany({}),
    ]);

    console.log('🗑️  Cleared existing data');

    // Create users
    const users = await User.insertMany([
      {
        email: 'john@example.com',
        name: 'John Doe',
        role: 'admin',
      },
      {
        email: 'jane@example.com',
        name: 'Jane Smith',
        role: 'user',
      },
      {
        email: 'bob@example.com',
        name: 'Bob Johnson',
        role: 'moderator',
      },
    ]);

    console.log('👥 Created users');

    // Create articles
    const articles = await Article.insertMany([
      {
        title: 'Getting Started with TypeScript',
        content:
          'TypeScript is a powerful programming language that builds on JavaScript by adding static type definitions. Types provide a way to describe the shape of an object, providing better documentation, and allowing TypeScript to validate that your code is working correctly. Writing TypeScript feels like writing JavaScript with additional features that help catch errors early and improve code quality.',
        author: 'John Doe',
      },
      {
        title: 'Advanced Node.js Patterns',
        content:
          'Node.js offers many advanced patterns for building scalable applications. From event-driven architecture to microservices, understanding these patterns is crucial for modern development. This article explores various patterns including the Observer pattern, Module pattern, and how to implement them effectively in Node.js applications.',
        author: 'Jane Smith',
      },
      {
        title: 'Clean Architecture Principles',
        content:
          'Clean Architecture is a software design philosophy that separates the elements of a design into ring levels. The main rule of clean architecture is that code dependencies can only point inward. This creates a system that is independent of frameworks, databases, and external agencies, making it testable and maintainable.',
        author: 'Bob Johnson',
      },
      {
        title: 'MongoDB Best Practices',
        content:
          'MongoDB is a powerful NoSQL database that offers flexibility and scalability. This article covers best practices for schema design, indexing strategies, query optimization, and performance tuning. Learn how to structure your data effectively and avoid common pitfalls when working with MongoDB.',
        author: 'John Doe',
      },
      {
        title: 'Zod Validation Deep Dive',
        content:
          'Zod is a TypeScript-first schema validation library that provides runtime type checking and validation. This comprehensive guide covers schema definition, error handling, custom validators, and integration with popular frameworks. Learn how to build robust applications with type-safe validation.',
        author: 'Jane Smith',
      },
    ]);

    console.log('📰 Created articles');

    // Create comments
    await Comment.insertMany([
      {
        articleId: articles[0]._id,
        userId: users[1]._id,
        content:
          'Great article! Very helpful for beginners learning TypeScript.',
      },
      {
        articleId: articles[0]._id,
        userId: users[2]._id,
        content:
          'Excellent explanation of TypeScript concepts. Thanks for sharing!',
      },
      {
        articleId: articles[1]._id,
        userId: users[0]._id,
        content:
          'These Node.js patterns are exactly what I needed for my project.',
      },
      {
        articleId: articles[2]._id,
        userId: users[1]._id,
        content: 'Clean Architecture has really improved our codebase quality.',
      },
      {
        articleId: articles[3]._id,
        userId: users[2]._id,
        content:
          'MongoDB best practices are crucial for production applications.',
      },
    ]);

    console.log('💬 Created comments');

    // Get final statistics
    const stats = await Promise.all([
      User.countDocuments(),
      Article.countDocuments(),
      Comment.countDocuments(),
    ]);

    console.log('\n✅ Seed data created successfully!');
    console.log(`👥 Users: ${stats[0]}`);
    console.log(`📰 Articles: ${stats[1]}`);
    console.log(`💬 Comments: ${stats[2]}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedData();
}

export { seedData };
