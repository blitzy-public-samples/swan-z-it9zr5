import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from 'src/mobile/components/atoms/Text';
import { useTheme } from 'src/shared/contexts/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  onPress?: () => void;
  style?: ViewStyle;
  elevated?: boolean;
  outlined?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  onPress,
  style,
  elevated = false,
  outlined = false,
}) => {
  const { theme } = useTheme();

  const containerStyles = [
    styles.container,
    {
      backgroundColor: theme === 'dark' ? COLOR_PALETTE.background : COLOR_PALETTE.primary,
      borderColor: theme === 'dark' ? COLOR_PALETTE.text : COLOR_PALETTE.secondary,
    },
    elevated && styles.elevated,
    outlined && styles.outlined,
    style,
  ];

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper style={containerStyles} onPress={onPress}>
      {title && (
        <Text variant="h3" style={styles.title}>
          {title}
        </Text>
      )}
      {children}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  elevated: {
    elevation: 4,
    shadowColor: COLOR_PALETTE.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  outlined: {
    borderWidth: 1,
  },
  title: {
    marginBottom: 8,
  },
});