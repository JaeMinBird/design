'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Font } from '@react-pdf/renderer';
import DesignSystemPDF from './DesignSystemPDF';
import { Download, Refresh } from '../Icons';
import type { DesignSystemOutput } from '@/lib/types';

// We dynamically import PDFDownloadLink because it inherently only runs on the client.
// This prevents Next.js hydration mismatch errors entirely.
const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
    { ssr: false, loading: () => <button className="wire-btn wire-btn--primary" disabled><Download size={16} />Loading PDF Engine...</button> }
);

interface Props {
    designSystem: DesignSystemOutput;
}

export default function PDFDownloadButton({ designSystem }: Props) {
    const fileName = `${designSystem.brandName.toLowerCase().replace(/\s+/g, '-')}-design-system.pdf`;
    const [fontsReady, setFontsReady] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function loadFonts() {
            try {
                const headingFont = designSystem.typography.headingFont;
                const bodyFont = designSystem.typography.bodyFont;

                // Fetch for heading
                const rH = await fetch(`/api/fonts?family=${encodeURIComponent(headingFont)}`);
                const dH = await rH.json();

                if (dH.regularUrl) {
                    Font.register({
                        family: headingFont,
                        fonts: [
                            { src: dH.regularUrl, fontWeight: 400 },
                            ...(dH.boldUrl ? [{ src: dH.boldUrl, fontWeight: 700 }] : [])
                        ]
                    });
                }

                // Fetch for body if different
                if (headingFont !== bodyFont) {
                    const rB = await fetch(`/api/fonts?family=${encodeURIComponent(bodyFont)}`);
                    const dB = await rB.json();
                    if (dB.regularUrl) {
                        Font.register({
                            family: bodyFont,
                            fonts: [
                                { src: dB.regularUrl, fontWeight: 400 },
                                ...(dB.boldUrl ? [{ src: dB.boldUrl, fontWeight: 700 }] : [])
                            ]
                        });
                    }
                }
            } catch (e) {
                console.warn('Failed to register PDF fonts:', e);
            } finally {
                if (mounted) setFontsReady(true);
            }
        }

        loadFonts();
        return () => { mounted = false; };
    }, [designSystem]);

    if (!fontsReady) {
        return (
            <button className="wire-btn wire-btn--primary" disabled>
                <Refresh size={16} className="animate-spin" />
                Fetching Fonts...
            </button>
        );
    }

    return (
        <PDFDownloadLink
            document={<DesignSystemPDF data={designSystem} />}
            fileName={fileName}
            style={{ textDecoration: 'none' }}
        >
            {({ loading }) => (
                <button className="wire-btn wire-btn--primary" disabled={loading}>
                    {loading ? <Refresh size={16} className="animate-spin" /> : <Download size={16} />}
                    {loading ? 'Preparing PDF...' : 'Download PDF'}
                </button>
            )}
        </PDFDownloadLink>
    );
}
