import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const family = searchParams.get('family');

    if (!family) {
        return NextResponse.json({ error: 'Missing family parameter' }, { status: 400 });
    }

    try {
        const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;700&display=swap`;
        // Fetch from Google Fonts pretending to be an old browser to force it to return .ttf files
        const res = await fetch(cssUrl, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
            },
            cache: 'force-cache'
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch font CSS: ${res.statusText}`);
        }

        const css = await res.text();

        // Extract the font URLs for 400 and 700 weights
        const urlRegex = /url\((https:\/\/[^)]+\.ttf)\)/g;
        const matches = [...css.matchAll(urlRegex)];

        // Google fonts CSS groups by font-weight in @font-face blocks.
        // For simplicity, we can extract based on parsing or just assume the first is regular, second is bold if 2 found.
        // A better approach is to look at the font-weight property in the CSS block

        let regularUrl = '';
        let boldUrl = '';

        const blocks = css.split('@font-face');
        for (const block of blocks) {
            if (!block.trim()) continue;

            const isBold = block.includes('font-weight: 700');
            const urlMatch = block.match(/url\((https:\/\/[^)]+\.ttf)\)/);

            if (urlMatch) {
                if (isBold && !boldUrl) {
                    boldUrl = urlMatch[1];
                } else if (!isBold && !regularUrl) {
                    regularUrl = urlMatch[1];
                }
            }
        }

        return NextResponse.json({ regularUrl, boldUrl });
    } catch (error) {
        console.error('Error proxying font request:', error);
        return NextResponse.json({ error: 'Failed to find font' }, { status: 500 });
    }
}
