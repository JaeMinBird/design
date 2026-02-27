import type { TypographyPreset } from './types';

/**
 * Curated Google Fonts presets organized by style category.
 * Each preset is a heading + body pair chosen for cohesion.
 */
export const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
    {
        id: 'modern',
        label: 'Modern',
        description: 'Clean geometric sans-serifs. Contemporary and confident.',
        headingFont: 'Inter',
        bodyFont: 'Inter',
    },
    {
        id: 'classic',
        label: 'Classic',
        description: 'Traditional serifs paired with clean sans. Timeless authority.',
        headingFont: 'Playfair Display',
        bodyFont: 'Source Sans 3',
    },
    {
        id: 'playful',
        label: 'Playful',
        description: 'Rounded, friendly forms. Approachable and warm.',
        headingFont: 'Nunito',
        bodyFont: 'Nunito Sans',
    },
    {
        id: 'technical',
        label: 'Technical',
        description: 'Monospaced + grotesque. Precision and transparency.',
        headingFont: 'Space Grotesk',
        bodyFont: 'IBM Plex Sans',
    },
    {
        id: 'elegant',
        label: 'Elegant',
        description: 'High-contrast serifs with graceful details. Refined luxury.',
        headingFont: 'Cormorant Garamond',
        bodyFont: 'Raleway',
    },
    {
        id: 'editorial',
        label: 'Editorial',
        description: 'Magazine-inspired contrast. Bold headlines, readable body.',
        headingFont: 'DM Serif Display',
        bodyFont: 'DM Sans',
    },
];

/**
 * Build a Google Fonts stylesheet URL for a list of font families.
 * Loads weights 400, 500, 600, 700 for each.
 */
export function buildGoogleFontsUrl(families: string[]): string {
    const params = families
        .map((f) => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700`)
        .join('&');
    return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
