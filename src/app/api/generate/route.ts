import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import type { WizardState, DesignSystemOutput } from '@/lib/types';
import { formatHarmonyOptionsForPrompt } from '@/lib/colors';

/**
 * POST /api/generate
 *
 * Two-phase generation:
 *   Phase 1: Gemini reasons about and decides the complete color palette
 *   Phase 2: The decided colors are fed into a second call that generates
 *            the full design system with typography, spacing, voice, etc.
 *
 * This ensures color decisions are thoughtful and context-specific rather
 * than the LLM defaulting to the same generic semantic colors every time.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  try {
    const wizardData: WizardState = await request.json();
    const ai = new GoogleGenAI({ apiKey });

    const densityLabel =
      wizardData.designDensity < 33
        ? 'minimal and airy'
        : wizardData.designDensity < 66
          ? 'balanced'
          : 'rich and detailed';

    // ──────────────────────────────────────────────────────────────
    // PHASE 1: Color Palette Reasoning
    // ──────────────────────────────────────────────────────────────

    const colorGuidance = wizardData.primaryColor
      ? `The user has chosen this primary color: ${wizardData.primaryColor}
You MUST keep this exact primary color. Use these pre-generated harmonious options as starting points:

${formatHarmonyOptionsForPrompt(wizardData.primaryColor)}`
      : 'Choose a primary color that perfectly embodies the brand.';

    const colorPrompt = `You are an expert color theorist and brand designer. Your job is to reason about and decide a complete color palette for a brand.

BRAND: "${wizardData.companyName}"
INDUSTRY: ${wizardData.industry}
PERSONALITY: ${wizardData.adjectives.join(', ')}
TARGET AUDIENCE: ${wizardData.targetAudience}
COLOR MOOD: ${wizardData.colorMood}
DESIGN DENSITY: ${densityLabel}

${colorGuidance}

Think carefully about:
1. What emotions should the primary color evoke for this specific brand?
2. Which harmony type (complementary, analogous, triadic, split-complementary) best fits this brand's personality?
3. What saturation and lightness levels match the brand's energy?
4. Semantic colors (success/warning/error/info) should MATCH the overall palette's energy — if the brand is muted, semantics should be muted. If bold, semantics should be bold. Each semantic color must be UNIQUE and specifically chosen for this brand. Do NOT use generic defaults.
5. Neutrals should transition smoothly from near-white to near-black, with undertones that complement the primary.

Return ONLY a JSON object with this exact structure:
{
  "reasoning": "2-3 sentences explaining your color strategy",
  "primary": { "name": "string", "hex": "#XXXXXX", "usage": "string" },
  "secondary": { "name": "string", "hex": "#XXXXXX", "usage": "string" },
  "accent": { "name": "string", "hex": "#XXXXXX", "usage": "string" },
  "neutrals": [
    { "name": "Near White", "hex": "#XXXXXX", "usage": "Backgrounds" },
    { "name": "Light Gray", "hex": "#XXXXXX", "usage": "Borders, dividers" },
    { "name": "Mid Gray", "hex": "#XXXXXX", "usage": "Placeholder text" },
    { "name": "Dark Gray", "hex": "#XXXXXX", "usage": "Secondary text" },
    { "name": "Near Black", "hex": "#XXXXXX", "usage": "Headings, primary text" }
  ],
  "semantic": {
    "success": { "name": "string", "hex": "#XXXXXX", "usage": "string" },
    "warning": { "name": "string", "hex": "#XXXXXX", "usage": "string" },
    "error": { "name": "string", "hex": "#XXXXXX", "usage": "string" },
    "info": { "name": "string", "hex": "#XXXXXX", "usage": "string" }
  }
}`;

    const colorResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: colorPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const colorText = colorResponse.text ?? '';
    let colorPalette;
    try {
      colorPalette = JSON.parse(colorText);
    } catch {
      const cleaned = colorText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      colorPalette = JSON.parse(cleaned);
    }

    // ──────────────────────────────────────────────────────────────
    // PHASE 2: Full Design System (with decided colors)
    // ──────────────────────────────────────────────────────────────

    const decidedColors = JSON.stringify(colorPalette, null, 2);

    const systemPrompt = `You are an expert brand designer and design systems architect. Generate a comprehensive design system for a company. The color palette has already been decided by our color specialist — use it exactly as provided.

COMPANY: "${wizardData.companyName}"
INDUSTRY: ${wizardData.industry}
BRAND ADJECTIVES: ${wizardData.adjectives.join(', ')}
TARGET AUDIENCE: ${wizardData.targetAudience}
TYPOGRAPHY STYLE PREFERENCE: ${wizardData.typographyStyle}
DESIGN DENSITY: ${densityLabel}

DECIDED COLOR PALETTE (use these exact colors, do not change them):
${decidedColors}

Generate the COMPLETE design system as a JSON object with this EXACT structure. Use ONLY real Google Fonts names. Be specific with actual values.

{
  "brandName": "string — the company name, possibly refined",
  "tagline": "string — a short, punchy brand tagline",
  "brandOverview": "string — 2-3 sentence brand positioning statement",
  "colors": {
    "primary": { "name": "string", "hex": "#XXXXXX", "usage": "string" },
    "secondary": { "name": "string", "hex": "#XXXXXX", "usage": "string" },
    "accent": { "name": "string", "hex": "#XXXXXX", "usage": "string" },
    "neutrals": [
      { "name": "string", "hex": "#XXXXXX", "usage": "string" }
    ],
    "semantic": {
      "success": { "name": "string", "hex": "#XXXXXX", "usage": "string" },
      "warning": { "name": "string", "hex": "#XXXXXX", "usage": "string" },
      "error": { "name": "string", "hex": "#XXXXXX", "usage": "string" },
      "info": { "name": "string", "hex": "#XXXXXX", "usage": "string" }
    }
  },
  "typography": {
    "headingFont": "string — exact Google Fonts name",
    "bodyFont": "string — exact Google Fonts name",
    "scale": [
      { "name": "Display", "size": "48px", "lineHeight": "1.1", "weight": "700", "usage": "Hero headlines" },
      { "name": "H1", "size": "36px", "lineHeight": "1.2", "weight": "700", "usage": "Page titles" },
      { "name": "H2", "size": "28px", "lineHeight": "1.3", "weight": "600", "usage": "Section headers" },
      { "name": "H3", "size": "22px", "lineHeight": "1.4", "weight": "600", "usage": "Subsection headers" },
      { "name": "Body Large", "size": "18px", "lineHeight": "1.6", "weight": "400", "usage": "Lead paragraphs" },
      { "name": "Body", "size": "16px", "lineHeight": "1.6", "weight": "400", "usage": "Default body text" },
      { "name": "Small", "size": "14px", "lineHeight": "1.5", "weight": "400", "usage": "Captions, labels" },
      { "name": "Tiny", "size": "12px", "lineHeight": "1.4", "weight": "500", "usage": "Legal, footnotes" }
    ]
  },
  "spacing": {
    "baseUnit": 8,
    "scale": [
      { "name": "xs", "value": "4px" },
      { "name": "sm", "value": "8px" },
      { "name": "md", "value": "16px" },
      { "name": "lg", "value": "24px" },
      { "name": "xl", "value": "32px" },
      { "name": "2xl", "value": "48px" },
      { "name": "3xl", "value": "64px" }
    ],
    "borderRadius": [
      { "name": "sm", "value": "4px" },
      { "name": "md", "value": "8px" },
      { "name": "lg", "value": "16px" },
      { "name": "full", "value": "9999px" }
    ],
    "shadows": [
      { "name": "sm", "value": "0 1px 2px rgba(0,0,0,0.05)", "usage": "Subtle elevation" },
      { "name": "md", "value": "0 4px 12px rgba(0,0,0,0.1)", "usage": "Cards, dropdowns" },
      { "name": "lg", "value": "0 8px 24px rgba(0,0,0,0.15)", "usage": "Modals, popovers" }
    ]
  },
  "logoGuidelines": {
    "description": "string — describe the ideal logo concept",
    "clearSpaceRule": "string",
    "minimumSize": "string",
    "donts": ["string — 4-5 things NOT to do with the logo"]
  },
  "brandVoice": {
    "personality": "string — 1-2 sentence voice description",
    "toneAttributes": ["string — 4-5 tone words"],
    "dos": ["string — 4-5 writing guidelines to follow"],
    "donts": ["string — 4-5 writing mistakes to avoid"],
    "sampleHeadline": "string — example headline in brand voice",
    "sampleBodyCopy": "string — example paragraph in brand voice"
  }
}

CRITICAL: Copy the DECIDED COLOR PALETTE values exactly into the colors object. Do not invent new colors. Return ONLY JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text ?? '';

    let designSystem: DesignSystemOutput;
    try {
      designSystem = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      designSystem = JSON.parse(cleaned);
    }

    // Attach user's logo if they provided one
    designSystem.generatedLogoUrl = wizardData.logo;

    return NextResponse.json(designSystem);
  } catch (error) {
    console.error('Gemini generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
