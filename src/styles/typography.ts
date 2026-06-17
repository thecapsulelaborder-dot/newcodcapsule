/**
 * Centralized Typography Configuration File
 * This defines font families for headings, body text, and monospaced elements.
 * Supports multilingual auto-switching per active language.
 */

export const typography = {
  // Google Fonts URL to load dynamically
  importUrl: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Noto+Serif+Armenian:wght@300;400;500;600;700&family=Noto+Sans+Armenian:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",

  // Universal default fallback in case language isn't directly matched
  fonts: {
    body: '"Noto Sans Armenian", system-ui, sans-serif',
    heading: '"Cinzel", "Playfair Display", "Cormorant Garamond", "Noto Serif Armenian", serif',
    mono: '"JetBrains Mono", monospace'
  },

  // Centralized configuration categorized by active language prefix (html lang attribute)
  languages: {
    hy: {
      sans: '"Noto Sans Armenian", "Helvetica Neue", Helvetica, Arial, sans-serif',
      serif: '"Cinzel", "Playfair Display", "Cormorant Garamond", "Noto Serif Armenian", serif',
      mono: '"JetBrains Mono", monospace'
    },
    en: {
      sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      serif: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      mono: '"JetBrains Mono", monospace'
    },
    ru: {
      sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      serif: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      mono: '"JetBrains Mono", monospace'
    },
    ar: {
      sans: 'system-ui, -apple-system, sans-serif',
      serif: 'system-ui, -apple-system, serif',
      mono: '"JetBrains Mono", monospace'
    }
  }
};
