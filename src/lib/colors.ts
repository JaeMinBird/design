/**
 * Color utility functions for palette generation and contrast checking.
 * Used by the Gemini prompt builder to validate and expand color choices.
 */

/** Convert hex (#RRGGBB) to HSL { h: 0-360, s: 0-100, l: 0-100 } */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** Convert HSL to hex string */
export function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (x: number) =>
        Math.round(x * 255)
            .toString(16)
            .padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

/** Relative luminance per WCAG 2.0 */
export function relativeLuminance(hex: string): number {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 0;

    const [r, g, b] = [result[1], result[2], result[3]].map((c) => {
        const v = parseInt(c, 16) / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colors */
export function contrastRatio(hex1: string, hex2: string): number {
    const l1 = relativeLuminance(hex1);
    const l2 = relativeLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

/** Check if two colors pass WCAG AA for normal text (ratio ≥ 4.5) */
export function passesAA(hex1: string, hex2: string): boolean {
    return contrastRatio(hex1, hex2) >= 4.5;
}

/** Determine if a color is "light" (returns true) or "dark" */
export function isLight(hex: string): boolean {
    return relativeLuminance(hex) > 0.179;
}

/* ─── Color Harmony Generation ──────────────────────────────── */

/**
 * Generate a comprehensive set of harmonious "coworking" colors from a primary hex.
 * Uses classical color theory relationships in HSL space to produce palettes
 * that are guaranteed to work well together.
 */
export interface HarmonyPalette {
    name: string;
    colors: { role: string; hex: string }[];
}

/** Clamp hue to 0-360 range */
function normalizeHue(h: number): number {
    return ((h % 360) + 360) % 360;
}

/**
 * Generate multiple harmony palettes from a primary color.
 * Returns 5 palette options (complementary, analogous, triadic,
 * split-complementary, tetradic) each with secondary + accent.
 */
export function generateHarmonies(primaryHex: string): HarmonyPalette[] {
    const { h, s, l } = hexToHsl(primaryHex);

    // Slightly adjust saturation/lightness for secondary/accent roles
    const secS = Math.max(20, s - 10);
    const secL = Math.min(85, l + 10);
    const accS = Math.min(100, s + 10);
    const accL = Math.max(25, l - 5);

    return [
        {
            name: 'Complementary',
            colors: [
                { role: 'primary', hex: primaryHex },
                { role: 'secondary', hex: hslToHex(normalizeHue(h + 180), secS, secL) },
                { role: 'accent', hex: hslToHex(normalizeHue(h + 180), accS, accL) },
            ],
        },
        {
            name: 'Analogous',
            colors: [
                { role: 'primary', hex: primaryHex },
                { role: 'secondary', hex: hslToHex(normalizeHue(h + 30), secS, secL) },
                { role: 'accent', hex: hslToHex(normalizeHue(h - 30), accS, accL) },
            ],
        },
        {
            name: 'Triadic',
            colors: [
                { role: 'primary', hex: primaryHex },
                { role: 'secondary', hex: hslToHex(normalizeHue(h + 120), secS, secL) },
                { role: 'accent', hex: hslToHex(normalizeHue(h + 240), accS, accL) },
            ],
        },
        {
            name: 'Split-Complementary',
            colors: [
                { role: 'primary', hex: primaryHex },
                { role: 'secondary', hex: hslToHex(normalizeHue(h + 150), secS, secL) },
                { role: 'accent', hex: hslToHex(normalizeHue(h + 210), accS, accL) },
            ],
        },
        {
            name: 'Tetradic',
            colors: [
                { role: 'primary', hex: primaryHex },
                { role: 'secondary', hex: hslToHex(normalizeHue(h + 90), secS, secL) },
                { role: 'accent', hex: hslToHex(normalizeHue(h + 180), accS, Math.min(80, accL + 10)) },
            ],
        },
    ];
}

/**
 * Generate a set of harmonious semantic colors (success, warning, error, info)
 * that visually coexist well with the given primary color.
 * Uses fixed hue ranges for semantic meaning but adjusts saturation/lightness
 * to match the primary's character.
 */
export function generateSemanticSuggestions(primaryHex: string): {
    success: string[];
    warning: string[];
    error: string[];
    info: string[];
} {
    const { s, l } = hexToHsl(primaryHex);

    // Match the saturation/lightness energy of the primary
    const semS = Math.max(35, Math.min(75, s));
    const semL = Math.max(35, Math.min(55, l));

    return {
        success: [
            hslToHex(145, semS, semL),         // Classic green
            hslToHex(155, semS, semL + 5),      // Teal-green
            hslToHex(135, semS - 5, semL + 5),  // Warm green
        ],
        warning: [
            hslToHex(40, semS + 10, semL + 10), // Classic amber
            hslToHex(35, semS + 5, semL + 15),  // Gold
            hslToHex(45, semS, semL + 5),       // Warm yellow
        ],
        error: [
            hslToHex(0, semS + 5, semL + 5),    // Classic red
            hslToHex(355, semS, semL),           // Cool red
            hslToHex(10, semS + 5, semL + 5),   // Warm red
        ],
        info: [
            hslToHex(210, semS, semL + 5),      // Classic blue
            hslToHex(200, semS - 5, semL + 10), // Soft blue
            hslToHex(220, semS, semL),          // Deep blue
        ],
    };
}

/**
 * Generate a formatted string of suggested palettes for the LLM prompt.
 * Gives the LLM pre-validated color options to choose from.
 */
export function formatHarmonyOptionsForPrompt(primaryHex: string): string {
    const harmonies = generateHarmonies(primaryHex);
    const semantics = generateSemanticSuggestions(primaryHex);

    let output = `PRE-GENERATED HARMONIOUS PALETTE OPTIONS (choose the best option for the brand):

`;

    harmonies.forEach((palette) => {
        output += `${palette.name}: `;
        output += palette.colors.map((c) => `${c.role}=${c.hex}`).join(', ');
        output += '\n';
    });

    output += `
PRE-GENERATED SEMANTIC COLOR OPTIONS (choose ONE from each row):
Success options: ${semantics.success.join(', ')}
Warning options: ${semantics.warning.join(', ')}
Error options: ${semantics.error.join(', ')}
Info options: ${semantics.info.join(', ')}

You MUST use the provided primary color ${primaryHex} as-is. For secondary and accent, choose from one of the palette options above. For semantic colors, choose from the options above. You may adjust lightness ±5% if needed for contrast.`;

    return output;
}
