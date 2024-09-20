import request from 'supertest';
import { Express } from 'express';
import app from '../../../src/backend/server';
import User from '../../../src/backend/models/User';
import connectDB from '../../../src/backend/config/database';
import { UserType } from '../../../src/shared/types';

const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!'
};

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await (app as any).close();
});

describe('POST /api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  it('should not register a user with an existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should not register a user with an invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, email: 'invalid-email' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid email format');
  });

  it('should not register a user with a weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, password: 'weak' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Password does not meet requirements');
  });
});

describe('POST /api/auth/login', () => {
  it('should login a user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  it('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ ...testUser, password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should not login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'TestPassword123!' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});

describe('POST /api/auth/logout', () => {
  let token: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);
    token = res.body.token;
  });

  it('should logout a user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logged out successfully');
  });

  it('should not logout without authentication', async () => {
    const res = await request(app)
      .post('/api/auth/logout');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Authentication required');
  });
});

describe('GET /api/auth/me', () => {
  let token: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);
    token = res.body.token;
  });

  it('should retrieve authenticated user\'s profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', testUser.email);
  });

  it('should not access profile without authentication', async () => {
    const res = await request(app)
      .get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Authentication required');
  });
});