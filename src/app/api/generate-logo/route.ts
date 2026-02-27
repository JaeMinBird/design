import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

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

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: prompt,
            config: {
                responseModalities: ['image', 'text'],
            },
        });

        // Extract image data from response
        const parts = response.candidates?.[0]?.content?.parts ?? [];
        for (const part of parts) {
            if (part.inlineData?.data) {
                return NextResponse.json({
                    imageBase64: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                });
            }
        }

        return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    } catch (error) {
        console.error('Logo generation error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Logo generation failed' },
            { status: 500 }
        );
    }
}
