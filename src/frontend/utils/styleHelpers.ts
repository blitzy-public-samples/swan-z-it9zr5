import { StyleProfile, StylePreference, Product } from 'src/shared/types/index';
import { STYLE_CATEGORIES } from 'src/shared/constants/index';
import colorConvert from 'color-convert';

/**
 * Calculates the style match score between a user's style profile and a product
 * @param userProfile The user's style profile
 * @param product The product to compare
 * @returns A score between 0 and 1 representing the style match
 */
export function calculateStyleMatch(userProfile: StyleProfile, product: Product): number {
  const userPreferences = userProfile.preferences;
  const productAttributes = product.styleAttributes;

  let totalScore = 0;
  let totalWeight = 0;

  STYLE_CATEGORIES.forEach(category => {
    const userPreference = userPreferences.find(pref => pref.category === category);
    const productAttribute = productAttributes.find(attr => attr.category === category);

    if (userPreference && productAttribute) {
      const weight = userPreference.weight || 1;
      const score = 1 - Math.abs(userPreference.value - productAttribute.value);
      totalScore += score * weight;
      totalWeight += weight;
    }
  });

  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

/**
 * Returns a list of recommended products based on the user's style profile
 * @param userProfile The user's style profile
 * @param products Array of available products
 * @param limit Maximum number of recommendations to return
 * @returns An array of recommended products
 */
export function getRecommendedProducts(userProfile: StyleProfile, products: Product[], limit: number): Product[] {
  const scoredProducts = products.map(product => ({
    product,
    score: calculateStyleMatch(userProfile, product)
  }));

  scoredProducts.sort((a, b) => b.score - a.score);

  return scoredProducts.slice(0, limit).map(item => item.product);
}

/**
 * Generates a human-readable description of a user's style profile
 * @param userProfile The user's style profile
 * @returns A textual description of the user's style
 */
export function generateStyleDescription(userProfile: StyleProfile): string {
  const dominantStyles = userProfile.preferences
    .filter(pref => pref.value > 0.7)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  if (dominantStyles.length === 0) {
    return "Your style is eclectic and diverse, incorporating elements from various fashion categories.";
  }

  const styleDescriptions = dominantStyles.map(style => {
    switch (style.category) {
      case 'Casual':
        return 'relaxed and comfortable';
      case 'Formal':
        return 'elegant and sophisticated';
      case 'Sporty':
        return 'athletic and energetic';
      case 'Bohemian':
        return 'free-spirited and artistic';
      case 'Vintage':
        return 'classic and timeless';
      default:
        return style.category.toLowerCase();
    }
  });

  return `Your style is predominantly ${styleDescriptions.join(', ')}, reflecting a unique and personal fashion sense.`;
}

/**
 * Returns a set of complementary colors based on a given primary color
 * @param primaryColor The primary color in hex format
 * @returns An array of complementary color hex codes
 */
export function getComplementaryColors(primaryColor: string): string[] {
  const hsl = colorConvert.hex.hsl(primaryColor);
  const complementaryHues = [
    (hsl[0] + 30) % 360,
    (hsl[0] + 180) % 360,
    (hsl[0] + 330) % 360
  ];

  return complementaryHues.map(hue => {
    const complementaryHsl = [hue, hsl[1], hsl[2]] as [number, number, number];
    return `#${colorConvert.hsl.hex(complementaryHsl)}`;
  });
}