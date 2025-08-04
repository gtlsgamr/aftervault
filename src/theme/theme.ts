// Theme configuration for AfterVault app
// Contains all design values like colors, fonts, spacing

export const colors = {
  // Monochrome palette
  black: '#000000',
  darkGray: '#333333',
  gray: '#777777',
  lightGray: '#f6f6f6',
  white: '#FFFFFF',
};

export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    bold: 'System',
  },
  // Font sizes
  fontSize: {
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 24,
    xxlarge: 32,
  },
  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
  } as const,
};


export const spacing = {
  // Spacing values
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
  xxl: 48,
};

export const layout = {
  // Layout values
  borderRadius: 8,
  buttonHeight: 48,
};

// Combined theme object
const theme = {
  colors,
  typography,
  spacing,
  layout,
};

export default theme;
