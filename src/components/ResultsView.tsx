'use client';

import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { Download, Refresh } from './Icons';
import { isLight, contrastRatio } from '@/lib/colors';
import type { DesignSystemOutput } from '@/lib/types';

/**
 * Dynamically import the PDF components to avoid SSR issues.
 * @react-pdf/renderer must run client-side only.
 */
const PDFDownloadButton = dynamic<{ designSystem: DesignSystemOutput }>(
    () => import('./pdf/PDFDownloadButton') as never,
    { ssr: false }
);

interface ResultsViewProps {
    designSystem: DesignSystemOutput;
    onStartOver: () => void;
}

/**
 * Interactive preview of the generated design system.
 * Uses the brand's primary color as the accent throughout,
 * replacing our app's default blue for a realistic preview.
 */
export default function ResultsView({ designSystem, onStartOver }: ResultsViewProps) {
    const [activeSection, setActiveSection] = useState('overview');
    const ds = designSystem;
    const brandColor = ds.colors.primary.hex;
    const brandColorLight = brandColor + '22';
    const brandColorMed = brandColor + '30';

    const sections = [
        { id: 'overview', label: 'Overview' },
        { id: 'colors', label: 'Colors' },
        { id: 'typography', label: 'Type' },
        { id: 'spacing', label: 'Spacing' },
        { id: 'logo', label: 'Logo' },
        { id: 'voice', label: 'Voice' },
    ];

    const renderSwatch = useCallback((swatch: { name: string; hex: string; usage: string }, large = false) => {
        const light = isLight(swatch.hex);
        return (
            <div
                key={swatch.name}
                style={{
                    background: swatch.hex,
                    borderRadius: 'var(--radius-md)',
                    padding: large ? '24px 20px' : '16px 14px',
                    color: light ? '#2C2C2C' : '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    border: '1px solid rgba(0,0,0,0.08)',
                    minHeight: large ? 100 : 70,
                    justifyContent: 'flex-end',
                }}
            >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>
                    {swatch.name}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.8 }}>
                    {swatch.hex.toUpperCase()}
                </span>
                {large && (
                    <span style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
                        {swatch.usage}
                    </span>
                )}
            </div>
        );
    }, []);

    return (
        <div
            className="animate-fade-in"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                // Override CSS custom properties for brand color
                // This makes hover effects, focus rings, etc. use brand color
                ['--blue' as string]: brandColor,
                ['--blue-light' as string]: brandColor + '66',
                ['--blue-faint' as string]: brandColorLight,
                ['--blue-dark' as string]: brandColor,
            }}
        >
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
                {ds.generatedLogoUrl ? (
                    <div style={{ marginBottom: 16 }}>
                        <img
                            src={ds.generatedLogoUrl}
                            alt={`${ds.brandName} logo`}
                            style={{
                                width: 56,
                                height: 56,
                                objectFit: 'contain',
                                borderRadius: 'var(--radius-md)',
                            }}
                        />
                    </div>
                ) : (
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        border: `1.5px solid ${brandColor}`,
                        marginBottom: 16,
                        color: brandColor,
                        fontSize: 20,
                        fontFamily: 'var(--font-serif)',
                    }}>
                        {ds.brandName.charAt(0)}
                    </div>
                )}
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, margin: '0 0 4px' }}>{ds.brandName}</h2>
                <p style={{ color: 'var(--ink-light)', fontSize: 14, margin: '0 0 4px', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                    {ds.tagline}
                </p>
            </div>

            {/* Section Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                {sections.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                        <button
                            key={sec.id}
                            onClick={() => setActiveSection(sec.id)}
                            className="wire-tag"
                            style={{
                                fontSize: 11,
                                ...(isActive ? {
                                    borderColor: brandColor,
                                    background: brandColorLight,
                                    color: brandColor,
                                } : {}),
                            }}
                        >
                            {sec.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div
                className="wire-card"
                style={{
                    padding: 28,
                    borderColor: 'var(--stroke)',
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = brandColor;
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--stroke)';
                }}
            >
                {/* Overview */}
                {activeSection === 'overview' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label className="wire-label">Brand Overview</label>
                            <p style={{ margin: 0, lineHeight: 1.7, fontSize: 14 }}>{ds.brandOverview}</p>
                        </div>

                        {/* Quick color preview */}
                        <div>
                            <label className="wire-label">Core Palette</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                {renderSwatch(ds.colors.primary)}
                                {renderSwatch(ds.colors.secondary)}
                                {renderSwatch(ds.colors.accent)}
                            </div>
                        </div>

                        {/* Typography preview */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div style={{ padding: 12, background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--stroke-light)' }}>
                                <label className="wire-label">Heading Font</label>
                                <p style={{ margin: 0, fontSize: 18, fontFamily: 'var(--font-serif)' }}>{ds.typography.headingFont}</p>
                            </div>
                            <div style={{ padding: 12, background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--stroke-light)' }}>
                                <label className="wire-label">Body Font</label>
                                <p style={{ margin: 0, fontSize: 18 }}>{ds.typography.bodyFont}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Colors */}
                {activeSection === 'colors' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label className="wire-label">Core Palette</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                {renderSwatch(ds.colors.primary, true)}
                                {renderSwatch(ds.colors.secondary, true)}
                                {renderSwatch(ds.colors.accent, true)}
                            </div>
                        </div>

                        <div>
                            <label className="wire-label">Neutrals</label>
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${ds.colors.neutrals.length}, 1fr)`, gap: 4 }}>
                                {ds.colors.neutrals.map((n) => renderSwatch(n))}
                            </div>
                        </div>

                        <div>
                            <label className="wire-label">Semantic</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                                {renderSwatch(ds.colors.semantic.success)}
                                {renderSwatch(ds.colors.semantic.warning)}
                                {renderSwatch(ds.colors.semantic.error)}
                                {renderSwatch(ds.colors.semantic.info)}
                            </div>
                        </div>

                        <div>
                            <label className="wire-label">Contrast Ratios (vs White)</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
                                {[ds.colors.primary, ds.colors.secondary, ds.colors.accent].map((swatch) => {
                                    const ratio = contrastRatio(swatch.hex, '#FFFFFF');
                                    const pass = ratio >= 4.5;
                                    return (
                                        <div key={swatch.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 16, height: 16, borderRadius: '50%', background: swatch.hex, border: '1px solid var(--stroke)', flexShrink: 0 }} />
                                            <span style={{ flex: 1, fontFamily: 'var(--font-mono)' }}>{swatch.name}</span>
                                            <span style={{ fontFamily: 'var(--font-mono)', color: pass ? 'var(--green)' : 'var(--amber)' }}>
                                                {ratio.toFixed(1)}:1 {pass ? 'AA Pass' : 'AA Fail'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Typography */}
                {activeSection === 'typography' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div style={{ padding: 16, background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--stroke-light)' }}>
                                <label className="wire-label">Heading Font</label>
                                <p style={{ margin: 0, fontSize: 20, fontFamily: 'var(--font-serif)' }}>{ds.typography.headingFont}</p>
                            </div>
                            <div style={{ padding: 16, background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--stroke-light)' }}>
                                <label className="wire-label">Body Font</label>
                                <p style={{ margin: 0, fontSize: 20, fontFamily: 'var(--font-mono)' }}>{ds.typography.bodyFont}</p>
                            </div>
                        </div>

                        <div>
                            <label className="wire-label">Type Scale</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {ds.typography.scale.map((level) => (
                                    <div key={level.name} style={{ display: 'flex', alignItems: 'baseline', gap: 12, paddingBottom: 12, borderBottom: '1px dashed var(--stroke-light)' }}>
                                        <span style={{
                                            fontSize: Math.min(parseInt(level.size), 36),
                                            fontWeight: parseInt(level.weight),
                                            lineHeight: level.lineHeight,
                                            fontFamily: 'var(--font-serif)',
                                            flex: '0 0 120px',
                                        }}>
                                            {level.name}
                                        </span>
                                        <div style={{ fontSize: 11, color: 'var(--ink-light)', fontFamily: 'var(--font-mono)' }}>
                                            <span>{level.size} / {level.lineHeight} / {level.weight}</span>
                                            <br />
                                            <span style={{ color: 'var(--ink-faint)' }}>{level.usage}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Spacing */}
                {activeSection === 'spacing' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label className="wire-label">Base Unit: {ds.spacing.baseUnit}px</label>
                        </div>

                        <div>
                            <label className="wire-label">Spacing Scale</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {ds.spacing.scale.map((s) => (
                                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, width: 40, color: 'var(--ink-light)' }}>{s.name}</span>
                                        <div style={{ width: parseInt(s.value), height: 12, background: brandColorLight, borderRadius: 2, border: `1px solid ${brandColor}`, minWidth: 4 }} />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)' }}>{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="wire-label">Border Radius</label>
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                {ds.spacing.borderRadius.map((r) => (
                                    <div key={r.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                        <div style={{
                                            width: 48,
                                            height: 48,
                                            border: `2px solid ${brandColor}`,
                                            borderRadius: r.value === '9999px' ? '50%' : r.value,
                                            background: brandColorLight,
                                        }} />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-light)' }}>{r.name}: {r.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="wire-label">Shadows</label>
                            <div style={{ display: 'flex', gap: 16 }}>
                                {ds.spacing.shadows.map((s) => (
                                    <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 64,
                                            height: 48,
                                            background: 'white',
                                            borderRadius: 8,
                                            boxShadow: s.value,
                                        }} />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-light)' }}>{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Logo */}
                {activeSection === 'logo' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {ds.generatedLogoUrl && (
                            <div>
                                <label className="wire-label">Logo Mark</label>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 24,
                                    flexWrap: 'wrap',
                                }}>
                                    {/* Light background */}
                                    <div style={{
                                        padding: 32,
                                        background: 'white',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--stroke-light)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}>
                                        <img src={ds.generatedLogoUrl} alt="Logo on light" style={{ maxHeight: 80, objectFit: 'contain' }} />
                                        <span style={{ fontSize: 10, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>Light Background</span>
                                    </div>
                                    {/* Dark background */}
                                    <div style={{
                                        padding: 32,
                                        background: '#1a1a1a',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid #333',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}>
                                        <img src={ds.generatedLogoUrl} alt="Logo on dark" style={{ maxHeight: 80, objectFit: 'contain' }} />
                                        <span style={{ fontSize: 10, color: '#888', fontFamily: 'var(--font-mono)' }}>Dark Background</span>
                                    </div>
                                    {/* Brand color background */}
                                    <div style={{
                                        padding: 32,
                                        background: brandColor,
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}>
                                        <img src={ds.generatedLogoUrl} alt="Logo on brand" style={{ maxHeight: 80, objectFit: 'contain' }} />
                                        <span style={{ fontSize: 10, color: isLight(brandColor) ? '#2C2C2C' : '#FFFFFF', fontFamily: 'var(--font-mono)', opacity: 0.7 }}>Brand Color</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="wire-label">Description</label>
                            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>{ds.logoGuidelines.description}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                            <div style={{ padding: 12, background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--stroke-light)' }}>
                                <strong style={{ fontSize: 10, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Clear Space</strong>
                                <p style={{ margin: '4px 0 0', color: 'var(--ink-light)' }}>{ds.logoGuidelines.clearSpaceRule}</p>
                            </div>
                            <div style={{ padding: 12, background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--stroke-light)' }}>
                                <strong style={{ fontSize: 10, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Min Size</strong>
                                <p style={{ margin: '4px 0 0', color: 'var(--ink-light)' }}>{ds.logoGuidelines.minimumSize}</p>
                            </div>
                        </div>

                        <div>
                            <label className="wire-label" style={{ color: 'var(--red)' }}>Incorrect Usage</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--ink-light)' }}>
                                {ds.logoGuidelines.donts.map((d, i) => <p key={i} style={{ margin: 0 }}>{d}</p>)}
                            </div>
                        </div>
                    </div>
                )}

                {/* Brand Voice */}
                {activeSection === 'voice' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label className="wire-label">Personality</label>
                            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>{ds.brandVoice.personality}</p>
                        </div>

                        <div>
                            <label className="wire-label">Tone Attributes</label>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {ds.brandVoice.toneAttributes.map((attr) => (
                                    <span key={attr} className="wire-tag" style={{ cursor: 'default' }}>{attr}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label className="wire-label" style={{ color: 'var(--green)' }}>Do&apos;s</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--ink-light)' }}>
                                    {ds.brandVoice.dos.map((d, i) => <p key={i} style={{ margin: 0 }}>{d}</p>)}
                                </div>
                            </div>
                            <div>
                                <label className="wire-label" style={{ color: 'var(--red)' }}>Don&apos;ts</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--ink-light)' }}>
                                    {ds.brandVoice.donts.map((d, i) => <p key={i} style={{ margin: 0 }}>{d}</p>)}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="wire-label">Sample Headline</label>
                            <p style={{ margin: 0, fontSize: 22, fontFamily: 'var(--font-serif)', lineHeight: 1.3 }}>
                                &ldquo;{ds.brandVoice.sampleHeadline}&rdquo;
                            </p>
                        </div>

                        <div>
                            <label className="wire-label">Sample Body Copy</label>
                            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: 'var(--ink-light)' }}>
                                {ds.brandVoice.sampleBodyCopy}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="wire-btn" onClick={onStartOver}>
                    <Refresh size={16} />
                    Start Over
                </button>
                <PDFDownloadButton designSystem={ds} />
            </div>
        </div>
    );
}
