import { Product, IProduct } from '../models/Product';
import { StyleLine } from '../models/StyleLine';
import { ApiError } from '../utils/ApiError';
import { PaginationOptions } from '../../shared/types/index';

export const createProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
  // Validate product data
  if (!productData.name || !productData.basePrice || !productData.styleLine) {
    throw new ApiError(400, 'Missing required product data');
  }

  // Check if the style line exists
  const styleLineExists = await StyleLine.exists({ _id: productData.styleLine });
  if (!styleLineExists) {
    throw new ApiError(404, 'Style line not found');
  }

  // Create a new Product document
  const product = new Product(productData);

  // Save the new product
  await product.save();

  // Return the created product
  return product;
};

export const getProductById = async (productId: string): Promise<IProduct> => {
  // Find product by ID
  const product = await Product.findById(productId);

  // If product not found, throw ApiError
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Return product document
  return product;
};

export const updateProduct = async (productId: string, updateData: Partial<IProduct>): Promise<IProduct> => {
  // Find product by ID
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Update product document with provided data
  Object.assign(product, updateData);

  // Save updated product
  await product.save();

  // Return updated product document
  return product;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  // Find product by ID
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Delete product document
  await product.remove();

  // TODO: Handle any related data cleanup (e.g., remove from orders, custom designs)
};

export const getProducts = async (options: PaginationOptions): Promise<{ products: IProduct[]; total: number }> => {
  // Apply pagination options to query
  const limit = options.limit || 10;
  const skip = options.page ? (options.page - 1) * limit : 0;

  // Execute query to get products
  const products = await Product.find().skip(skip).limit(limit);

  // Get total count of products
  const total = await Product.countDocuments();

  // Return products and total count
  return { products, total };
};

export const getProductsByStyleLine = async (styleLineId: string, options: PaginationOptions): Promise<{ products: IProduct[]; total: number }> => {
  // Check if style line exists
  const styleLineExists = await StyleLine.exists({ _id: styleLineId });
  if (!styleLineExists) {
    throw new ApiError(404, 'Style line not found');
  }

  // Apply pagination options to query
  const limit = options.limit || 10;
  const skip = options.page ? (options.page - 1) * limit : 0;

  // Execute query to get products for the style line
  const products = await Product.find({ styleLine: styleLineId }).skip(skip).limit(limit);

  // Get total count of products for the style line
  const total = await Product.countDocuments({ styleLine: styleLineId });

  // Return products and total count
  return { products, total };
};

export const searchProducts = async (searchParams: any, options: PaginationOptions): Promise<{ products: IProduct[]; total: number }> => {
  // Build search query based on searchParams
  const query: any = {};
  if (searchParams.name) {
    query.name = { $regex: searchParams.name, $options: 'i' };
  }
  if (searchParams.minPrice) {
    query.basePrice = { $gte: searchParams.minPrice };
  }
  if (searchParams.maxPrice) {
    query.basePrice = { ...query.basePrice, $lte: searchParams.maxPrice };
  }

  // Apply pagination options to query
  const limit = options.limit || 10;
  const skip = options.page ? (options.page - 1) * limit : 0;

  // Execute query to get matching products
  const products = await Product.find(query).skip(skip).limit(limit);

  // Get total count of matching products
  const total = await Product.countDocuments(query);

  // Return matching products and total count
  return { products, total };
};

export const updateProductStock = async (productId: string, quantityChange: number): Promise<IProduct> => {
  // Find product by ID
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Update stock quantity
  product.stockQuantity += quantityChange;

  // Check if new stock quantity is valid
  if (product.stockQuantity < 0) {
    throw new ApiError(400, 'Invalid stock quantity');
  }

  // Save updated product
  await product.save();

  // Return updated product document
  return product;
};