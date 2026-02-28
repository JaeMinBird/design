'use client';

import React from 'react';
import { Sliders } from '../Icons';
import { COLOR_MOODS } from '@/lib/constants';
import { TYPOGRAPHY_PRESETS } from '@/lib/fonts';
import type { WizardState } from '@/lib/types';

interface StepThreeProps {
    data: WizardState;
    onChange: (updates: Partial<WizardState>) => void;
}

/**
 * Map typography preset IDs to representative Google Font CSS families.
 * These fonts are loaded via a <link> in the layout head.
 */
const PREVIEW_FONTS: Record<string, string> = {
    modern: '"Inter", sans-serif',
    classic: '"Playfair Display", serif',
    playful: '"Nunito", sans-serif',
    technical: '"Space Grotesk", monospace',
    elegant: '"Cormorant Garamond", serif',
    editorial: '"DM Serif Display", serif',
};

/**
 * Step 3 — Visual Preferences
 * Color mood (3×3 grid of squares), typography (with real fonts), density (centered ±).
 */
export default function StepThree({ data, onChange }: StepThreeProps) {
    // Density: -50 to +50 (mapped from 0-100 storage)
    const densityValue = data.designDensity - 50;
    const densityLabel = densityValue === 0 ? 'Balanced' : densityValue > 0 ? `+${densityValue}` : `${densityValue}`;

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Google Fonts preload for typography previews */}
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@400;700&family=Nunito:wght@400;700&family=Space+Grotesk:wght@400;700&family=Cormorant+Garamond:wght@400;700&family=DM+Serif+Display&display=swap"
            />

            {/* Header */}
            <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', border: '1.5px solid var(--blue)', marginBottom: 16 }}>
                    <Sliders size={22} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, margin: '0 0 8px' }}>Visual Preferences</h2>
                <p style={{ color: 'var(--ink-light)', fontSize: 13, margin: 0 }}>
                    Set the visual direction for your design system.
                </p>
            </div>

            {/* Color Mood — 3 column grid of square cards */}
            <div>
                <label className="wire-label">Color Palette Mood *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {COLOR_MOODS.map((mood) => {
                        const isSelected = data.colorMood === mood.id;
                        return (
                            <button
                                key={mood.id}
                                onClick={() => onChange({ colorMood: mood.id })}
                                className={`wire-card ${isSelected ? 'wire-card--selected' : ''}`}
                                style={{
                                    padding: 12,
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                    aspectRatio: '1',
                                    justifyContent: 'center',
                                }}
                            >
                                {/* Visual swatch — circular arrangement */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: 3,
                                    width: 48,
                                    height: 48,
                                }}>
                                    {mood.colors.slice(0, 4).map((c, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                background: c,
                                                borderRadius: i === 0 ? '6px 2px 2px 2px' : i === 1 ? '2px 6px 2px 2px' : i === 2 ? '2px 2px 2px 6px' : '2px 2px 6px 2px',
                                                gridColumn: i < 2 ? undefined : undefined,
                                            }}
                                        />
                                    ))}
                                    {mood.colors[4] && (
                                        <div
                                            style={{
                                                background: mood.colors[4],
                                                borderRadius: '2px',
                                                gridColumn: '2 / 3',
                                            }}
                                        />
                                    )}
                                </div>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                                        {mood.label}
                                    </div>
                                    <div style={{ fontSize: 9, color: 'var(--ink-light)', lineHeight: 1.3 }}>
                                        {mood.description}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Typography Style — with actual preview fonts */}
            <div>
                <label className="wire-label">Typography Style *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {TYPOGRAPHY_PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => onChange({ typographyStyle: preset.id })}
                            className={`wire-card ${data.typographyStyle === preset.id ? 'wire-card--selected' : ''}`}
                            style={{
                                padding: 16,
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                            }}
                        >
                            {/* Font preview with relevant font */}
                            <div
                                style={{
                                    fontFamily: PREVIEW_FONTS[preset.id] || 'var(--font-serif)',
                                    fontSize: 28,
                                    lineHeight: 1.1,
                                    color: 'var(--ink)',
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                Aa
                            </div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
                                    {preset.label}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--ink-light)', lineHeight: 1.4 }}>
                                    {preset.description}
                                </div>
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
                                {preset.headingFont} + {preset.bodyFont}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Design Density — centered at 0, range from -50 to +50 */}
            <div>
                <label className="wire-label">Design Density</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ position: 'relative', padding: '0 12px' }}>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={data.designDensity}
                            onChange={(e) => onChange({ designDensity: parseInt(e.target.value) })}
                            className="wire-slider"
                        />
                        {/* Center tick mark */}
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: -2,
                            width: 1,
                            height: 7,
                            background: 'var(--ink-faint)',
                            transform: 'translateX(-50%)',
                            pointerEvents: 'none',
                        }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', padding: '0 12px' }}>
                        <span>− Minimal</span>
                        <span style={{ color: 'var(--ink-light)', fontWeight: 700, fontSize: 11 }}>
                            {densityLabel}
                        </span>
                        <span>Detailed +</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
