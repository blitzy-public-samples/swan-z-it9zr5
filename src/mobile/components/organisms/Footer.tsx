import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from 'src/mobile/components/atoms/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'src/shared/contexts/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';
import { useNavigation } from '@react-navigation/native';

interface FooterProps {
  activeTab: string;
  style?: ViewStyle;
}

interface FooterItem {
  label: string;
  icon: string;
  route: string;
}

const footerItems: FooterItem[] = [
  { label: 'Home', icon: 'home', route: 'Home' },
  { label: 'Explore', icon: 'search', route: 'Explore' },
  { label: 'Design', icon: 'brush', route: 'Design' },
  { label: 'Cart', icon: 'shopping-cart', route: 'Cart' },
  { label: 'Profile', icon: 'person', route: 'Profile' },
];

export const Footer: React.FC<FooterProps> = ({ activeTab, style }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleNavigation = (route: string) => {
    navigation.navigate(route);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    item: {
      alignItems: 'center',
    },
    activeItem: {
      color: theme.colors.primary,
    },
    inactiveItem: {
      color: theme.colors.text,
    },
    label: {
      fontSize: 12,
      marginTop: 4,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {footerItems.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.item}
          onPress={() => handleNavigation(item.route)}
          accessibilityRole="button"
          accessibilityLabel={item.label}
        >
          <Icon
            name={item.icon}
            size={24}
            color={activeTab === item.route ? theme.colors.primary : theme.colors.text}
          />
          <Text
            style={[
              styles.label,
              activeTab === item.route ? styles.activeItem : styles.inactiveItem,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};