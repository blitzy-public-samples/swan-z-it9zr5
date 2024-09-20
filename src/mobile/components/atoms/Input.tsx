import React from 'react';
import { StyleSheet, TextInput, View, Text, ViewStyle, KeyboardTypeOptions, ReturnKeyTypeOptions } from 'react-native';
import { useTheme } from 'src/shared/contexts/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  label?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  style?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  label,
  error,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
  style,
}) => {
  const { theme } = useTheme();

  const containerStyles = [
    styles.container,
    { borderColor: error ? COLOR_PALETTE.error : theme.borderColor },
    style,
  ];

  const inputStyles = [
    styles.input,
    { color: theme.textColor },
  ];

  const labelStyles = [
    styles.label,
    { color: theme.textColor },
  ];

  const errorStyles = [
    styles.error,
    { color: COLOR_PALETTE.error },
  ];

  return (
    <View style={containerStyles}>
      {label && <Text style={labelStyles}>{label}</Text>}
      <TextInput
        style={inputStyles}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholderColor}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
      />
      {error && <Text style={errorStyles}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});