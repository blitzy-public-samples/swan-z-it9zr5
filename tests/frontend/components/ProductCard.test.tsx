import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { expect, toBeInTheDocument, toHaveTextContent } from '@testing-library/jest-dom';
import { ProductCard } from 'src/frontend/components/ProductCard';
import { Product } from 'src/shared/types';
import { addToCart } from 'src/frontend/redux/slices/cartSlice';
import { useDispatch } from 'react-redux';

// Mock the useDispatch and useNavigation hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

describe('ProductCard component', () => {
  let mockProduct: Product;

  beforeEach(() => {
    mockProduct = {
      id: '1',
      name: 'Test Product',
      price: 19.99,
      imageUrl: 'https://example.com/test-product.jpg',
      description: 'A test product description',
    };

    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({ navigate: mockNavigate });
  });

  test('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.name)).toHaveAttribute('src', mockProduct.imageUrl);
  });

  test('calls addToCart when Add to Cart button is clicked', () => {
    render(<ProductCard product={mockProduct} />);

    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    expect(mockDispatch).toHaveBeenCalledWith(addToCart(mockProduct));
  });

  test('navigates to product details when product is clicked', () => {
    render(<ProductCard product={mockProduct} />);

    const productCard = screen.getByTestId('product-card');
    fireEvent.click(productCard);

    expect(mockNavigate).toHaveBeenCalledWith('ProductDetails', { productId: mockProduct.id });
  });
});