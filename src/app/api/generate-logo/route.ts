import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 4000;

/**
 * POST /api/generate-logo
 *
 * Uses Gemini's Imagen image generation to create a minimalist logo
 * based on company details. Returns { imageBase64: string } on success.
 */
export async function POST(request: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    try {
        const { companyName, industry, adjectives } = await request.json();

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `Create a minimal, modern logo mark for a company called "${companyName}" in the ${industry} industry. The brand personality is: ${adjectives.join(', ')}. 

Design requirements:
- Simple geometric or abstract mark — NOT text/wordmark
- Flat design, no gradients or 3D effects  
- Single color on white background
- Suitable for scaling down to favicon size
- Clean, professional, memorable
- Style: clean vector-like minimal icon`;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: prompt,
                    config: {
                        responseModalities: ['Text', 'Image'],
                    },
                });

                const candidate = response.candidates?.[0];
                if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
                    console.warn('Logo generation blocked:', candidate.finishReason);
                    return NextResponse.json(
                        { error: `Image generation was blocked: ${candidate.finishReason}` },
                        { status: 400 }
                    );
                }

                const parts = candidate?.content?.parts ?? [];
                for (const part of parts) {
                    if (part.inlineData?.data) {
                        return NextResponse.json({
                            imageBase64: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                        });
                    }
                }

                console.warn('Logo response had no image data. Parts:', JSON.stringify(parts.map(p => ({ text: p.text?.slice(0, 100), hasInlineData: !!p.inlineData }))));
                return NextResponse.json({ error: 'No image generated — model returned text only' }, { status: 500 });
            } catch (err: unknown) {
                const isRateLimit =
                    err instanceof Error &&
                    (err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED'));

                if (isRateLimit && attempt < MAX_RETRIES) {
                    const delay = BASE_DELAY_MS * Math.pow(2, attempt);
                    await new Promise((r) => setTimeout(r, delay));
                    continue;
                }
                throw err;
            }
        }

        return NextResponse.json({ error: 'Logo generation failed after retries' }, { status: 500 });
    } catch (error) {
        console.error('Logo generation error:', error);
        const message = error instanceof Error ? error.message : 'Logo generation failed';
        const isQuota = message.includes('429') || message.includes('RESOURCE_EXHAUSTED') || message.includes('quota');
        return NextResponse.json(
            { error: isQuota
                ? 'API rate limit reached. The free tier allows ~20 requests/day. Please wait or check your Gemini billing plan.'
                : message },
            { status: isQuota ? 429 : 500 }
        );
    }
}
