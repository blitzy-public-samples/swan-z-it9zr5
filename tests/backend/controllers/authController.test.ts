import request from 'supertest';
import app from 'src/backend/app';
import { authController } from 'src/backend/controllers/authController';
import { User } from 'src/backend/models/User';
import { userService } from 'src/backend/services/userService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

describe('authController', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.TEST_MONGODB_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear database collections
    await User.deleteMany({});
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(newUser.email);
      expect(response.body.user.name).toBe(newUser.name);

      // Verify user is saved in the database
      const savedUser = await User.findOne({ email: newUser.email });
      expect(savedUser).toBeTruthy();
    });

    it('should return 400 for duplicate email registration', async () => {
      const existingUser = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      await User.create(existingUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Email already exists');
    });

    it('should return 400 for invalid input', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: '123', // Too short
        name: '',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid input');
    });
  });

  describe('User Login', () => {
    it('should login a user successfully', async () => {
      const user = {
        email: 'login@example.com',
        password: 'password123',
        name: 'Login User',
      };

      await User.create({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(user.email);
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrongpassword' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid credentials');
    });
  });

  describe('User Logout', () => {
    it('should logout a user successfully', async () => {
      const token = jwt.sign({ userId: 'testuser' }, process.env.JWT_SECRET as string);

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Logged out successfully');
    });
  });

  // Additional test cases can be implemented here for password reset, token refresh, etc.
});