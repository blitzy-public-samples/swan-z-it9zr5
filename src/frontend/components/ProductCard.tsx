import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { addToCart } from 'src/frontend/redux/slices/cartSlice';
import { Product } from 'src/shared/types';
import { formatCurrency } from 'src/shared/utils/formatters';

interface ProductCardProps {
  product: Product;
  showAddToCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showAddToCart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    setIsLoading(true);
    dispatch(addToCart(product));
    setIsLoading(false);
  };

  const handleProductPress = () => {
    navigation.navigate('ProductDetails', { productId: product.id });
  };

  return (
    <CardContainer onPress={handleProductPress}>
      <ProductImage source={{ uri: product.images[0] }} />
      <ProductInfo>
        <ProductName>{product.name}</ProductName>
        <ProductPrice>{formatCurrency(product.basePrice)}</ProductPrice>
      </ProductInfo>
      {showAddToCart && (
        <AddToCartButton onPress={handleAddToCart} disabled={isLoading}>
          <ButtonText>{isLoading ? 'Adding...' : 'Add to Cart'}</ButtonText>
        </AddToCartButton>
      )}
    </CardContainer>
  );
};

const CardContainer = styled(TouchableOpacity)`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const ProductImage = styled(Image)`
  width: 100%;
  height: 200px;
  resize-mode: cover;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const ProductInfo = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ProductName = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const ProductPrice = styled(Text)`
  font-size: 14px;
  color: #666;
`;

const AddToCartButton = styled(TouchableOpacity)`
  background-color: #4CAF50;
  padding-vertical: 8px;
  padding-horizontal: 12px;
  border-radius: 4px;
  margin-top: 8px;
`;

const ButtonText = styled(Text)`
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
`;

export default ProductCard;