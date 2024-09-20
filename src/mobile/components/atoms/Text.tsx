import React from 'react';
import { StyleSheet, Text as RNText, TextStyle } from 'react-native';
import { useTheme } from 'src/shared/contexts/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  align?: 'left' | 'center' | 'right';
  color?: string;
  bold?: boolean;
  italic?: boolean;
  style?: TextStyle;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  align = 'left',
  color,
  bold = false,
  italic = false,
  style,
}) => {
  const { theme } = useTheme();

  const textStyles = StyleSheet.create({
    base: {
      color: color || theme.textColor,
      textAlign: align,
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
    },
    h1: {
      fontSize: 24,
      lineHeight: 32,
    },
    h2: {
      fontSize: 20,
      lineHeight: 28,
    },
    h3: {
      fontSize: 18,
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      lineHeight: 22,
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
    },
  });

  const mergedStyles = [textStyles.base, textStyles[variant], style];

  return <RNText style={mergedStyles}>{children}</RNText>;
};

// Default props
Text.defaultProps = {
  variant: 'body',
  align: 'left',
  bold: false,
  italic: false,
};