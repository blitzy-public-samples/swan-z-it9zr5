import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from 'src/mobile/components/atoms/Button';
import { ThemeProvider } from 'src/shared/contexts/index';

describe('Button component', () => {
  const mockTheme = {
    colors: {
      primary: '#4A90E2',
      secondary: '#50E3C2',
      text: '#333333',
      background: '#FFFFFF',
    },
  };

  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider value={mockTheme}>
        {component}
      </ThemeProvider>
    );
  };

  it('renders with default props', () => {
    const { getByText } = renderWithTheme(<Button title="Test Button" onPress={() => {}} />);
    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });

  it('renders with custom props', () => {
    const { getByText } = renderWithTheme(
      <Button 
        title="Custom Button" 
        onPress={() => {}} 
        variant="secondary" 
        size="large" 
      />
    );
    const button = getByText('Custom Button');
    expect(button).toBeTruthy();
    // Add more specific assertions for custom props
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = renderWithTheme(<Button title="Press Me" onPress={onPressMock} />);
    const button = getByText('Press Me');
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = renderWithTheme(
      <Button title="Disabled Button" onPress={onPressMock} disabled={true} />
    );
    const button = getByText('Disabled Button');
    fireEvent.press(button);
    expect(onPressMock).not.toHaveBeenCalled();
    // Add assertion for disabled styling
  });

  it('renders primary variant correctly', () => {
    const { getByText } = renderWithTheme(
      <Button title="Primary Button" onPress={() => {}} variant="primary" />
    );
    const button = getByText('Primary Button');
    // Add assertions for primary variant styling
  });

  it('renders secondary variant correctly', () => {
    const { getByText } = renderWithTheme(
      <Button title="Secondary Button" onPress={() => {}} variant="secondary" />
    );
    const button = getByText('Secondary Button');
    // Add assertions for secondary variant styling
  });

  it('renders outline variant correctly', () => {
    const { getByText } = renderWithTheme(
      <Button title="Outline Button" onPress={() => {}} variant="outline" />
    );
    const button = getByText('Outline Button');
    // Add assertions for outline variant styling
  });

  it('renders small size correctly', () => {
    const { getByText } = renderWithTheme(
      <Button title="Small Button" onPress={() => {}} size="small" />
    );
    const button = getByText('Small Button');
    // Add assertions for small size styling
  });

  it('renders medium size correctly', () => {
    const { getByText } = renderWithTheme(
      <Button title="Medium Button" onPress={() => {}} size="medium" />
    );
    const button = getByText('Medium Button');
    // Add assertions for medium size styling
  });

  it('renders large size correctly', () => {
    const { getByText } = renderWithTheme(
      <Button title="Large Button" onPress={() => {}} size="large" />
    );
    const button = getByText('Large Button');
    // Add assertions for large size styling
  });

  // Add more test cases here as needed
});