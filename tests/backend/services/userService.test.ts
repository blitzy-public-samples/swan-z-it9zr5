import { userService } from 'src/backend/services/userService';
import { User } from 'src/backend/models/User';
import { StyleProfile } from 'src/backend/models/StyleProfile';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ApiError } from 'src/backend/utils/ApiError';

describe('userService', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.TEST_MONGODB_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    // Set up any global mocks or test data
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();

    // Clear any global mocks or test data
  });

  beforeEach(async () => {
    // Clear database collections
    await User.deleteMany({});
    await StyleProfile.deleteMany({});

    // Reset any mocks
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    const createdUser = await userService.createUser(userData);

    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(userData.email);
    expect(createdUser.name).toBe(userData.name);
    expect(createdUser.password).not.toBe(userData.password); // Password should be hashed
  });

  it('should authenticate a user with correct credentials', async () => {
    const userData = {
      email: 'auth@example.com',
      password: 'password123',
      name: 'Auth User',
    };

    await userService.createUser(userData);

    const authResult = await userService.authenticateUser(userData.email, userData.password);

    expect(authResult).toBeDefined();
    expect(authResult.user).toBeDefined();
    expect(authResult.token).toBeDefined();
  });

  it('should get a user by ID', async () => {
    const userData = {
      email: 'getuser@example.com',
      password: 'password123',
      name: 'Get User',
    };

    const createdUser = await userService.createUser(userData);

    const retrievedUser = await userService.getUserById(createdUser.id);

    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.id).toBe(createdUser.id);
    expect(retrievedUser?.email).toBe(userData.email);
  });

  it('should update user profile', async () => {
    const userData = {
      email: 'update@example.com',
      password: 'password123',
      name: 'Update User',
    };

    const createdUser = await userService.createUser(userData);

    const updatedData = {
      name: 'Updated Name',
    };

    const updatedUser = await userService.updateUserProfile(createdUser.id, updatedData);

    expect(updatedUser).toBeDefined();
    expect(updatedUser.name).toBe(updatedData.name);
  });

  it('should update user style profile', async () => {
    const userData = {
      email: 'style@example.com',
      password: 'password123',
      name: 'Style User',
    };

    const createdUser = await userService.createUser(userData);

    const styleProfileData = {
      quizResponses: { favoriteColor: 'blue' },
      preferences: [{ styleLine: 'CASUAL', preferenceScore: 80 }],
    };

    const updatedUser = await userService.updateUserStyleProfile(createdUser.id, styleProfileData);

    expect(updatedUser).toBeDefined();
    expect(updatedUser.styleProfile).toBeDefined();
    expect(updatedUser.styleProfile?.quizResponses).toEqual(styleProfileData.quizResponses);
  });

  it('should delete a user', async () => {
    const userData = {
      email: 'delete@example.com',
      password: 'password123',
      name: 'Delete User',
    };

    const createdUser = await userService.createUser(userData);

    await userService.deleteUser(createdUser.id);

    const deletedUser = await User.findById(createdUser.id);
    expect(deletedUser).toBeNull();
  });

  it('should hash password correctly', async () => {
    const password = 'testPassword123';
    const hashedPassword = await userService.hashPassword(password);

    expect(hashedPassword).not.toBe(password);
    expect(await bcrypt.compare(password, hashedPassword)).toBe(true);
  });

  it('should generate and verify JWT token', async () => {
    const userData = {
      email: 'token@example.com',
      password: 'password123',
      name: 'Token User',
    };

    const createdUser = await userService.createUser(userData);
    const token = userService.generateToken(createdUser);

    expect(token).toBeDefined();

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    expect(decodedToken.id).toBe(createdUser.id);
  });

  it('should throw error for duplicate email', async () => {
    const userData = {
      email: 'duplicate@example.com',
      password: 'password123',
      name: 'Duplicate User',
    };

    await userService.createUser(userData);

    await expect(userService.createUser(userData)).rejects.toThrow(ApiError);
  });

  it('should throw error for invalid user ID', async () => {
    const invalidId = 'invalidId123';

    await expect(userService.getUserById(invalidId)).rejects.toThrow(ApiError);
  });
});