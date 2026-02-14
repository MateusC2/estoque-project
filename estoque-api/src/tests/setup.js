// Jest test configuration and setup
process.env.DATABASEHOST = 'localhost';
process.env.DATABASEUSER = 'matezin';
process.env.DATABASEPASSWORD = '1234';
process.env.DATABASENAME = 'simple_stock';
process.env.PORT = '5000';
process.env.NODE_ENV = 'test';

// Suppress console messages during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
