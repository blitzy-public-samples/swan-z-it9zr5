import mongoose from 'mongoose';
import { User } from '../../src/backend/models/User';
import { expect } from '@jest/globals';

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/test_swanz_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Close the database connection
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the User collection before each test
    await User.deleteMany({});
  });

  it('should create a new user with valid data', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.password).not.toBe(userData.password); // Password should be hashed
  });

  it('should not create a user with invalid email', async () => {
    const userData = {
      email: 'invalid-email',
      password: 'Password123!',
      name: 'Test User',
    };

    const user = new User(userData);

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should not create a user with a short password', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'short',
      name: 'Test User',
    };

    const user = new User(userData);

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should not allow duplicate emails', async () => {
    const userData = {
      email: 'duplicate@example.com',
      password: 'Password123!',
      name: 'Test User',
    };

    await new User(userData).save();
    const duplicateUser = new User(userData);

    await expect(duplicateUser.save()).rejects.toThrow(mongoose.Error.MongoError);
  });

  it('should hash the password before saving', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    };

    const user = new User(userData);
    await user.save();

    expect(user.password).not.toBe(userData.password);
    expect(user.password.length).toBeGreaterThan(userData.password.length);
  });

  it('should correctly compare passwords', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    };

    const user = new User(userData);
    await user.save();

    const isMatch = await user.comparePassword(userData.password);
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('WrongPassword');
    expect(isNotMatch).toBe(false);
  });

  it('should generate an auth token', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    };

    const user = new User(userData);
    await user.save();

    const token = user.generateAuthToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
});