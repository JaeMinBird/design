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
 * Step 3 — Visual Preferences
 * Color mood palette selector, typography style selector, design density slider.
 */
export default function StepThree({ data, onChange }: StepThreeProps) {
    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
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

            {/* Color Mood */}
            <div>
                <label className="wire-label">Color Palette Mood *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {COLOR_MOODS.map((mood) => (
                        <button
                            key={mood.id}
                            onClick={() => onChange({ colorMood: mood.id })}
                            className={`wire-card ${data.colorMood === mood.id ? 'wire-card--selected' : ''}`}
                            style={{
                                padding: 16,
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 10,
                            }}
                        >
                            {/* Swatch preview */}
                            <div className="swatch-row">
                                {mood.colors.map((c, i) => (
                                    <div key={i} style={{ background: c }} />
                                ))}
                            </div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
                                    {mood.label}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--ink-light)', lineHeight: 1.4 }}>
                                    {mood.description}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <hr className="wire-divider" />

            {/* Typography Style */}
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
                            {/* Font preview */}
                            <div
                                style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: 22,
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

            <hr className="wire-divider" />

            {/* Design Density */}
            <div>
                <label className="wire-label">Design Density</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={data.designDensity}
                        onChange={(e) => onChange({ designDensity: parseInt(e.target.value) })}
                        className="wire-slider"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
                        <span>Minimal &amp; Airy</span>
                        <span style={{ color: 'var(--ink-light)', fontWeight: 700 }}>{data.designDensity}%</span>
                        <span>Rich &amp; Detailed</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
