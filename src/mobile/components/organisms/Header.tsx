import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from 'src/mobile/components/atoms/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'src/shared/contexts/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
  style,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const containerStyles = [
    styles.container,
    { backgroundColor: theme.headerBackground },
    style,
  ];

  return (
    <View style={containerStyles}>
      {showBackButton && (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={theme.headerText} />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: theme.headerText }]}>{title}</Text>
      {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  rightComponent: {
    marginLeft: 16,
  },
});