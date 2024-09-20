import request from 'supertest';
import { Express } from 'express';
import { jest } from '@types/jest';
import app from '../../../src/backend/server';
import { Product } from '../../../src/backend/models/Product';
import { ProductType } from '../../../src/shared/types';
import { generateTestToken } from '../../../src/backend/services/authService';

describe('Products API', () => {
  let testToken: string;

  beforeAll(async () => {
    // Connect to the test database
    // This step assumes you have a separate test database configuration
    await connectToTestDatabase();

    // Clear the products collection
    await Product.deleteMany({});

    // Insert test product data
    const testProducts: ProductType[] = [
      {
        name: 'Test Product 1',
        description: 'Description for test product 1',
        price: 19.99,
        category: 'Test Category',
        imageUrl: 'http://example.com/image1.jpg',
      },
      {
        name: 'Test Product 2',
        description: 'Description for test product 2',
        price: 29.99,
        category: 'Test Category',
        imageUrl: 'http://example.com/image2.jpg',
      },
    ];
    await Product.insertMany(testProducts);

    // Generate a test token for authenticated requests
    testToken = await generateTestToken();
  });

  afterAll(async () => {
    // Clear the products collection
    await Product.deleteMany({});

    // Close the database connection
    await closeTestDatabaseConnection();
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product by ID', async () => {
      const product = await Product.findOne();
      const response = await request(app)
        .get(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(product.name);
    });

    it('should return 404 for non-existent product ID', async () => {
      const nonExistentId = '5f8d0f3c1d7c3c2d9c5a3e1f';
      const response = await request(app)
        .get(`/api/products/${nonExistentId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProduct: ProductType = {
        name: 'New Test Product',
        description: 'Description for new test product',
        price: 39.99,
        category: 'New Test Category',
        imageUrl: 'http://example.com/new-image.jpg',
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${testToken}`)
        .send(newProduct);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newProduct.name);
    });

    it('should return 400 for invalid product data', async () => {
      const invalidProduct = {
        name: 'Invalid Product',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${testToken}`)
        .send(invalidProduct);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update an existing product', async () => {
      const product = await Product.findOne();
      const updatedData = {
        name: 'Updated Product Name',
        price: 49.99,
      };

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.price).toBe(updatedData.price);
    });

    it('should return 404 for updating non-existent product', async () => {
      const nonExistentId = '5f8d0f3c1d7c3c2d9c5a3e1f';
      const updatedData = {
        name: 'Updated Product Name',
      };

      const response = await request(app)
        .put(`/api/products/${nonExistentId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send(updatedData);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete an existing product', async () => {
      const product = await Product.findOne();

      const response = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(204);

      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
    });

    it('should return 404 for deleting non-existent product', async () => {
      const nonExistentId = '5f8d0f3c1d7c3c2d9c5a3e1f';

      const response = await request(app)
        .delete(`/api/products/${nonExistentId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(404);
    });
  });
});