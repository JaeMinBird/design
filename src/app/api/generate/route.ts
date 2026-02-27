import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import type { WizardState, DesignSystemOutput } from '@/lib/types';
import { formatHarmonyOptionsForPrompt } from '@/lib/colors';

/**
 * POST /api/generate
 *
 * Receives the full WizardState from the wizard, constructs a detailed prompt,
 * and returns a structured DesignSystemOutput JSON from Gemini.
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
        ? 'minimal and airy — generous whitespace, few elements, breathing room'
        : wizardData.designDensity < 66
          ? 'balanced — moderate density, well-structured layouts'
          : 'rich and detailed — dense information, many visual elements, layered';

    // Build color guidance: if the user picked a primary, generate harmonious options
    const colorGuidance = wizardData.primaryColor
      ? `PRIMARY COLOR (user-chosen): ${wizardData.primaryColor}

${formatHarmonyOptionsForPrompt(wizardData.primaryColor)}`
      : 'PRIMARY COLOR: Choose one that fits the brand perfectly.';

    const prompt = `You are an expert brand designer and design systems architect. Generate a comprehensive design system for a company with these specifications:

COMPANY: "${wizardData.companyName}"
INDUSTRY: ${wizardData.industry}
BRAND ADJECTIVES: ${wizardData.adjectives.join(', ')}
TARGET AUDIENCE: ${wizardData.targetAudience}
COLOR MOOD: ${wizardData.colorMood}
TYPOGRAPHY STYLE PREFERENCE: ${wizardData.typographyStyle}
DESIGN DENSITY: ${densityLabel}
${colorGuidance}

Generate a COMPLETE design system as a JSON object with this EXACT structure. Be specific with actual values — real hex codes, real font names from Google Fonts, real pixel values. Every color should be carefully chosen for harmony and WCAG compliance.

{
  "brandName": "string — the company name, possibly refined",
  "tagline": "string — a short, punchy brand tagline",
  "brandOverview": "string — 2-3 sentence brand positioning statement",
  "colors": {
    "primary": { "name": "string", "hex": "#XXXXXX", "usage": "string — when to use" },
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
    "clearSpaceRule": "string — e.g. 'Maintain clear space equal to the height of the logomark on all sides'",
    "minimumSize": "string — e.g. '24px height for digital, 10mm for print'",
    "donts": ["string — list of 4-5 things NOT to do with the logo"]
  },
  "brandVoice": {
    "personality": "string — 1-2 sentence voice description",
    "toneAttributes": ["string — list of 4-5 tone words"],
    "dos": ["string — 4-5 writing guidelines to follow"],
    "donts": ["string — 4-5 writing mistakes to avoid"],
    "sampleHeadline": "string — example headline in brand voice",
    "sampleBodyCopy": "string — example paragraph in brand voice"
  }
}

IMPORTANT: Provide 5 neutrals (from lightest to darkest). Make all colors harmonious with the chosen mood. Use ONLY real Google Fonts names. Return ONLY the JSON, no markdown fences or extra text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text ?? '';

    // Parse the JSON — Gemini should return clean JSON with responseMimeType set
    let designSystem: DesignSystemOutput;
    try {
      designSystem = JSON.parse(text);
    } catch {
      // If Gemini wraps in markdown fences, strip them
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
