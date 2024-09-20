import { Request, Response, NextFunction } from 'express';
import * as productService from 'src/backend/services/productService';
import { ApiError } from 'src/backend/utils/ApiError';
import { catchAsync } from 'src/backend/utils/catchAsync';
import { validateSchema } from 'src/backend/middleware/validateSchema';
import { createProductSchema, updateProductSchema } from 'src/backend/schemas/productSchemas';
import { PaginationOptions } from 'src/shared/types/index';

export const createProduct = catchAsync(
  validateSchema(createProductSchema),
  async (req: Request, res: Response) => {
    const productData = req.body;
    const newProduct = await productService.createProduct(productData);
    res.status(201).json({ success: true, data: newProduct });
  }
);

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id;
  const product = await productService.getProductById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  res.status(200).json({ success: true, data: product });
});

export const updateProduct = catchAsync(
  validateSchema(updateProductSchema),
  async (req: Request, res: Response) => {
    const productId = req.params.id;
    const updateData = req.body;
    const updatedProduct = await productService.updateProduct(productId, updateData);
    if (!updatedProduct) {
      throw new ApiError(404, 'Product not found');
    }
    res.status(200).json({ success: true, data: updatedProduct });
  }
);

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id;
  await productService.deleteProduct(productId);
  res.status(204).send();
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions: PaginationOptions = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
  };
  const { products, total } = await productService.getProducts(paginationOptions);
  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      total,
    },
  });
});

export const searchProducts = catchAsync(async (req: Request, res: Response) => {
  const searchParams = req.query;
  const paginationOptions: PaginationOptions = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
  };
  const { products, total } = await productService.searchProducts(searchParams, paginationOptions);
  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      total,
    },
  });
});

export const getProductsByStyleLine = catchAsync(async (req: Request, res: Response) => {
  const styleLineId = req.params.styleLineId;
  const paginationOptions: PaginationOptions = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
  };
  const { products, total } = await productService.getProductsByStyleLine(styleLineId, paginationOptions);
  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      total,
    },
  });
});

// Human tasks:
// TODO: Implement input sanitization for all product-related inputs to prevent XSS attacks
// TODO: Add proper error handling for cases where products are not found or unauthorized access
// TODO: Implement caching mechanism for frequently accessed products to improve performance
// TODO: Add support for bulk product operations (e.g., bulk create, update, delete)
// TODO: Implement filtering options for product listing (e.g., by price range, colors, sizes)
// TODO: Add support for product image upload and management
// TODO: Implement proper logging for all product-related actions for auditing purposes
// TODO: Add support for product variants (e.g., different sizes, colors)
// TODO: Implement rate limiting for product creation and update requests to prevent abuse
// TODO: Add unit tests for all productController functions