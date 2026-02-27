/* ─── Wizard Input Types ────────────────────────────────────── */

export interface WizardState {
  // Step 1 — Company Info
  companyName: string;
  industry: string;
  logo: string | null; // base64 data URI or null
  primaryColor: string | null; // hex string or null

  // Step 2 — Brand Identity
  adjectives: string[];
  targetAudience: string;

  // Step 3 — Visual Preferences
  colorMood: string;
  typographyStyle: string;
  designDensity: number; // 0 (minimal/airy) → 100 (rich/detailed)
}

export const DEFAULT_WIZARD_STATE: WizardState = {
  companyName: '',
  industry: '',
  logo: null,
  primaryColor: null,
  adjectives: [],
  targetAudience: '',
  colorMood: '',
  typographyStyle: '',
  designDensity: 50,
};

/* ─── Gemini Output Types ───────────────────────────────────── */

export interface ColorSwatch {
  name: string;
  hex: string;
  usage: string;
}

export interface ColorPalette {
  primary: ColorSwatch;
  secondary: ColorSwatch;
  accent: ColorSwatch;
  neutrals: ColorSwatch[];
  semantic: {
    success: ColorSwatch;
    warning: ColorSwatch;
    error: ColorSwatch;
    info: ColorSwatch;
  };
}

export interface TypographySpec {
  headingFont: string;
  bodyFont: string;
  scale: {
    name: string;
    size: string;
    lineHeight: string;
    weight: string;
    usage: string;
  }[];
}

export interface SpacingSpec {
  baseUnit: number; // px
  scale: { name: string; value: string }[];
  borderRadius: { name: string; value: string }[];
  shadows: { name: string; value: string; usage: string }[];
}

export interface LogoGuideline {
  description: string;
  clearSpaceRule: string;
  minimumSize: string;
  donts: string[];
}

export interface BrandVoice {
  personality: string;
  toneAttributes: string[];
  dos: string[];
  donts: string[];
  sampleHeadline: string;
  sampleBodyCopy: string;
}

export interface DesignSystemOutput {
  brandName: string;
  tagline: string;
  brandOverview: string;
  colors: ColorPalette;
  typography: TypographySpec;
  spacing: SpacingSpec;
  logoGuidelines: LogoGuideline;
  brandVoice: BrandVoice;
  generatedLogoUrl: string | null; // base64 data URI if we generated one
}

/* ─── UI Selector Types ─────────────────────────────────────── */

export interface IndustryOption {
  value: string;
  label: string;
}

export interface AdjectiveOption {
  value: string;
  label: string;
}

export interface MoodOption {
  id: string;
  label: string;
  description: string;
  colors: string[]; // 5 preview hex colors
}

export interface TypographyPreset {
  id: string;
  label: string;
  description: string;
  headingFont: string;
  bodyFont: string;
}
