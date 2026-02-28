# Ideate

Design systems, realized in minutes.

## What it does
Ideate is a Next.js web application that acts as an AI-powered design system generator. Through a simple step-by-step wizard, users provide their company information, brand identity preferences, and visual choices. The application then uses Generative AI (powered by Google's Gen AI SDK) to automatically generate a complete design system, including a custom logo, color palettes, typography guidelines, and brand assets.

## How it works
1. **Wizard Input:** You enter your brand details across three steps:
   - **Company:** Your company name and industry.
   - **Identity:** Brand adjectives, target audience, and mission.
   - **Visual:** Preferred color mood and typography style.
2. **AI Generation:** Upon clicking "Generate":
   - If a logo is not provided, the app generates a custom logo via `/api/generate-logo`.
   - The app then calls `/api/generate` using `@google/genai` to structure and generate a comprehensive design system output based on your inputs.
3. **Results View:** The final output presents a custom-built dashboard displaying your new logo, brand colors, typography pairings, and other visual rules.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Make sure you set your required environment variables (e.g., API keys for Google Gen AI) in `.env.local`.

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action.
