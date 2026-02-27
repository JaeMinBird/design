import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
} from '@react-pdf/renderer';
import type { DesignSystemOutput } from '@/lib/types';

/**
 * Professional design system PDF document.
 * Swiss-inspired layout with generous whitespace, clean grid,
 * and structured information hierarchy.
 *
 * IMPORTANT: All brand-colored elements use inline styles to avoid
 * StyleSheet.create() caching issues. Static styles use the stylesheet.
 *
 * Fonts are registered dynamically from Google Fonts based on the
 * design system's chosen heading and body fonts.
 */

/* ─── Font Note ──────────────────────────────────────────────── */
/*
 * The PDF renders with Helvetica (industry standard for design documents).
 * The chosen Google Fonts are clearly labeled in the Typography section
 * with their names, weights, and usage specifications.
 * Actual font rendering happens in the web preview and implementation.
 */

// Disable hyphenation for clean typography
Font.registerHyphenationCallback(word => [word]);

/* ─── Static Styles (brand-color-independent) ───────────────── */

const ink = '#2C2C2C';
const gray = '#6B6B6B';
const lightGray = '#E2E2E2';

const s = StyleSheet.create({
    page: {
        padding: 48,
        fontFamily: 'Helvetica',
        fontSize: 9,
        color: ink,
        backgroundColor: '#FFFFFF',
    },
    coverPage: {
        padding: 48,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        backgroundColor: '#FAFAFA',
    },
    coverTitle: {
        fontSize: 42,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: -1,
        marginBottom: 12,
        color: ink,
    },
    coverTagline: {
        fontSize: 14,
        color: gray,
        marginBottom: 32,
    },
    coverMeta: {
        fontSize: 8,
        color: gray,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 16,
        color: ink,
    },
    sectionBody: {
        fontSize: 10,
        lineHeight: 1.7,
        color: gray,
        maxWidth: 400,
        marginBottom: 24,
    },
    swatchGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    swatch: {
        width: 80,
        height: 80,
        borderRadius: 6,
        padding: 8,
        justifyContent: 'flex-end',
    },
    swatchName: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 2,
    },
    swatchHex: {
        fontSize: 7,
        opacity: 0.8,
    },
    typeRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: lightGray,
    },
    typeName: {
        width: 80,
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
    },
    typeSpec: {
        fontSize: 8,
        color: gray,
        width: 120,
    },
    typeUsage: {
        fontSize: 8,
        color: gray,
        flex: 1,
    },
    spacingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 8,
    },
    spacingLabel: {
        width: 32,
        fontSize: 8,
        color: gray,
    },
    spacingValue: {
        fontSize: 8,
        color: gray,
        marginLeft: 8,
    },
    radiusRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    radiusLabel: {
        fontSize: 8,
        color: gray,
    },
    footer: {
        position: 'absolute',
        bottom: 28,
        left: 48,
        right: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 7,
        color: '#A8A8A8',
        borderTopWidth: 0.5,
        borderTopColor: lightGray,
        paddingTop: 8,
    },
});

/* ─── Helpers ───────────────────────────────────────────────── */

function isLightColor(hex: string): boolean {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.5;
}

/** Create a light tint (85% toward white) of a hex color */
function tint(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const tr = Math.round(r + (255 - r) * 0.85);
    const tg = Math.round(g + (255 - g) * 0.85);
    const tb = Math.round(b + (255 - b) * 0.85);
    return `#${tr.toString(16).padStart(2, '0')}${tg.toString(16).padStart(2, '0')}${tb.toString(16).padStart(2, '0')}`;
}

function Footer({ brandName }: { brandName: string }) {
    return (
        <View style={s.footer} fixed>
            <Text>{brandName} — Design System</Text>
            <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
    );
}

/* ─── Inline style helpers for brand-colored elements ───────── */

/** Section header like "01 — COLOR SYSTEM" — uses brand primary */
function SectionHeader({ children, brandColor }: { children: string; brandColor: string }) {
    return (
        <Text style={{
            fontSize: 8,
            color: brandColor,
            textTransform: 'uppercase',
            letterSpacing: 3,
            marginBottom: 6,
            fontFamily: 'Helvetica-Bold',
        }}>
            {children}
        </Text>
    );
}

/** Sub-label like "CORE", "NEUTRALS" — uses brand primary */
function SubLabel({ children, brandColor, color }: { children: string; brandColor: string; color?: string }) {
    return (
        <Text style={{
            fontSize: 7,
            color: color || brandColor,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            fontFamily: 'Helvetica-Bold',
            marginBottom: 4,
            marginTop: 12,
        }}>
            {children}
        </Text>
    );
}

/** List item — no padding, aligns flush left with headers */
function ListItem({ children }: { children: React.ReactNode }) {
    return (
        <Text style={{
            fontSize: 9,
            lineHeight: 1.6,
            color: gray,
            marginBottom: 4,
            paddingLeft: 0,
        }}>
            {children}
        </Text>
    );
}

/* ─── Document ──────────────────────────────────────────────── */

interface Props {
    data: DesignSystemOutput;
}

export default function DesignSystemPDF({ data }: Props) {
    const d = data;
    const bc = d.colors.primary.hex; // brand color
    const bt = tint(bc); // brand tint

    return (
        <Document
            title={`${d.brandName} Design System`}
            author="Design System Generator"
            subject="Brand Design System"
        >
            {/* ─── Cover ─── */}
            <Page size="A4" style={s.coverPage}>
                <View>
                    {d.generatedLogoUrl && (
                        <Image src={d.generatedLogoUrl} style={{ width: 60, height: 60, marginBottom: 32 }} />
                    )}
                    <Text style={s.coverTitle}>{d.brandName}</Text>
                    <Text style={s.coverTagline}>{d.tagline}</Text>
                    <View style={{ width: 48, height: 3, backgroundColor: bc, marginBottom: 24 }} />
                    <Text style={{ fontSize: 11, lineHeight: 1.8, color: gray, maxWidth: 380 }}>
                        {d.brandOverview}
                    </Text>
                </View>
                <View>
                    <Text style={s.coverMeta}>Design System Manual</Text>
                    <Text style={[s.coverMeta, { marginTop: 4 }]}>
                        Generated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Text>
                </View>
            </Page>

            {/* ─── Logo Page ─── */}
            {d.generatedLogoUrl && (
                <Page size="A4" style={s.page}>
                    <SectionHeader brandColor={bc}>00 — Logo</SectionHeader>
                    <Text style={s.sectionTitle}>Brand Mark</Text>
                    <Text style={s.sectionBody}>{d.logoGuidelines.description}</Text>

                    {/* Logo on three backgrounds */}
                    <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
                        <View style={{
                            flex: 1,
                            padding: 32,
                            backgroundColor: '#FFFFFF',
                            borderWidth: 0.5,
                            borderColor: lightGray,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}>
                            <Image src={d.generatedLogoUrl} style={{ width: 80, height: 80, objectFit: 'contain' }} />
                            <Text style={{ fontSize: 7, color: gray, marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Light</Text>
                        </View>
                        <View style={{
                            flex: 1,
                            padding: 32,
                            backgroundColor: '#1A1A1A',
                            borderRadius: 8,
                            alignItems: 'center',
                        }}>
                            <Image src={d.generatedLogoUrl} style={{ width: 80, height: 80, objectFit: 'contain' }} />
                            <Text style={{ fontSize: 7, color: '#888', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Dark</Text>
                        </View>
                        <View style={{
                            flex: 1,
                            padding: 32,
                            backgroundColor: bc,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}>
                            <Image src={d.generatedLogoUrl} style={{ width: 80, height: 80, objectFit: 'contain' }} />
                            <Text style={{ fontSize: 7, color: isLightColor(bc) ? ink : '#FFFFFF', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7 }}>Brand</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 24, marginBottom: 24 }}>
                        <View style={{ flex: 1 }}>
                            <SubLabel brandColor={bc}>Clear Space</SubLabel>
                            <ListItem>{d.logoGuidelines.clearSpaceRule}</ListItem>
                        </View>
                        <View style={{ flex: 1 }}>
                            <SubLabel brandColor={bc}>Minimum Size</SubLabel>
                            <ListItem>{d.logoGuidelines.minimumSize}</ListItem>
                        </View>
                    </View>

                    <SubLabel brandColor={bc} color="#D9534F">Incorrect Usage</SubLabel>
                    {d.logoGuidelines.donts.map((dont, i) => (
                        <ListItem key={i}>{dont}</ListItem>
                    ))}

                    <Footer brandName={d.brandName} />
                </Page>
            )}

            {/* ─── Color System ─── */}
            <Page size="A4" style={s.page}>
                <SectionHeader brandColor={bc}>01 — Color System</SectionHeader>
                <Text style={s.sectionTitle}>Color Palette</Text>
                <Text style={s.sectionBody}>
                    These colors form the foundation of the brand&apos;s visual identity. Use them consistently across all touchpoints.
                </Text>

                <SubLabel brandColor={bc}>Core</SubLabel>
                <View style={s.swatchGrid}>
                    {[d.colors.primary, d.colors.secondary, d.colors.accent].map((sw) => (
                        <View key={sw.name} style={[s.swatch, { backgroundColor: sw.hex }]}>
                            <Text style={[s.swatchName, { color: isLightColor(sw.hex) ? ink : '#FFFFFF' }]}>{sw.name}</Text>
                            <Text style={[s.swatchHex, { color: isLightColor(sw.hex) ? gray : '#FFFFFFCC' }]}>{sw.hex.toUpperCase()}</Text>
                        </View>
                    ))}
                </View>

                <SubLabel brandColor={bc}>Neutrals</SubLabel>
                <View style={s.swatchGrid}>
                    {d.colors.neutrals.map((sw) => (
                        <View key={sw.name} style={[s.swatch, { backgroundColor: sw.hex, width: 60, height: 60 }]}>
                            <Text style={[s.swatchName, { color: isLightColor(sw.hex) ? ink : '#FFFFFF' }]}>{sw.name}</Text>
                            <Text style={[s.swatchHex, { color: isLightColor(sw.hex) ? gray : '#FFFFFFCC' }]}>{sw.hex.toUpperCase()}</Text>
                        </View>
                    ))}
                </View>

                <SubLabel brandColor={bc}>Semantic</SubLabel>
                <View style={s.swatchGrid}>
                    {[d.colors.semantic.success, d.colors.semantic.warning, d.colors.semantic.error, d.colors.semantic.info].map((sw) => (
                        <View key={sw.name} style={[s.swatch, { backgroundColor: sw.hex, width: 60, height: 60 }]}>
                            <Text style={[s.swatchName, { color: isLightColor(sw.hex) ? ink : '#FFFFFF' }]}>{sw.name}</Text>
                            <Text style={[s.swatchHex, { color: isLightColor(sw.hex) ? gray : '#FFFFFFCC' }]}>{sw.hex.toUpperCase()}</Text>
                        </View>
                    ))}
                </View>

                <SubLabel brandColor={bc}>Usage Guidelines</SubLabel>
                <ListItem>Primary: {d.colors.primary.usage}</ListItem>
                <ListItem>Secondary: {d.colors.secondary.usage}</ListItem>
                <ListItem>Accent: {d.colors.accent.usage}</ListItem>

                <Footer brandName={d.brandName} />
            </Page>

            {/* ─── Typography ─── */}
            <Page size="A4" style={s.page}>
                <SectionHeader brandColor={bc}>02 — Typography</SectionHeader>
                <Text style={s.sectionTitle}>Type System</Text>

                <View style={{ flexDirection: 'row', gap: 24, marginBottom: 24 }}>
                    <View style={{ flex: 1, padding: 16, backgroundColor: '#FAFAFA', borderRadius: 6 }}>
                        <SubLabel brandColor={bc}>Heading Font</SubLabel>
                        <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold' }}>{d.typography.headingFont}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 16, backgroundColor: '#FAFAFA', borderRadius: 6 }}>
                        <SubLabel brandColor={bc}>Body Font</SubLabel>
                        <Text style={{ fontSize: 18 }}>{d.typography.bodyFont}</Text>
                    </View>
                </View>

                <SubLabel brandColor={bc}>Type Scale</SubLabel>
                {d.typography.scale.map((level) => (
                    <View key={level.name} style={s.typeRow}>
                        <Text style={s.typeName}>{level.name}</Text>
                        <Text style={s.typeSpec}>{level.size} / {level.lineHeight} / {level.weight}</Text>
                        <Text style={s.typeUsage}>{level.usage}</Text>
                    </View>
                ))}

                <Footer brandName={d.brandName} />
            </Page>

            {/* ─── Spacing & Layout ─── */}
            <Page size="A4" style={s.page}>
                <SectionHeader brandColor={bc}>03 — Spacing & Layout</SectionHeader>
                <Text style={s.sectionTitle}>Spatial System</Text>
                <Text style={s.sectionBody}>
                    Built on a {d.spacing.baseUnit}px base unit. All spacings are multiples of this unit for consistent rhythm.
                </Text>

                <SubLabel brandColor={bc}>Spacing Scale</SubLabel>
                {d.spacing.scale.map((sp) => (
                    <View key={sp.name} style={s.spacingRow}>
                        <Text style={s.spacingLabel}>{sp.name}</Text>
                        <View style={{
                            height: 8,
                            width: Math.min(parseInt(sp.value) * 2, 300),
                            backgroundColor: bt,
                            borderWidth: 0.5,
                            borderColor: bc,
                            borderRadius: 2,
                        }} />
                        <Text style={s.spacingValue}>{sp.value}</Text>
                    </View>
                ))}

                <SubLabel brandColor={bc}>Border Radius</SubLabel>
                <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                    {d.spacing.borderRadius.map((r) => (
                        <View key={r.name} style={{ alignItems: 'center', gap: 4 }}>
                            <View style={{
                                width: 36,
                                height: 36,
                                borderWidth: 1.5,
                                borderColor: bc,
                                backgroundColor: bt,
                                borderRadius: r.value === '9999px' ? 18 : Math.min(parseInt(r.value), 18),
                            }} />
                            <Text style={s.radiusLabel}>{r.name}: {r.value}</Text>
                        </View>
                    ))}
                </View>

                <SubLabel brandColor={bc}>Shadows</SubLabel>
                {d.spacing.shadows.map((sh) => (
                    <View key={sh.name} style={{ marginBottom: 8 }}>
                        <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>{sh.name}</Text>
                        <Text style={{ fontSize: 8, color: gray }}>{sh.value}</Text>
                        <Text style={{ fontSize: 8, color: gray }}>{sh.usage}</Text>
                    </View>
                ))}

                <Footer brandName={d.brandName} />
            </Page>

            {/* ─── Logo Guidelines (non-logo page) ─── */}
            {!d.generatedLogoUrl && (
                <Page size="A4" style={s.page}>
                    <SectionHeader brandColor={bc}>04 — Logo</SectionHeader>
                    <Text style={s.sectionTitle}>Logo Guidelines</Text>
                    <Text style={s.sectionBody}>{d.logoGuidelines.description}</Text>

                    <View style={{ flexDirection: 'row', gap: 24, marginBottom: 24 }}>
                        <View style={{ flex: 1 }}>
                            <SubLabel brandColor={bc}>Clear Space</SubLabel>
                            <ListItem>{d.logoGuidelines.clearSpaceRule}</ListItem>
                        </View>
                        <View style={{ flex: 1 }}>
                            <SubLabel brandColor={bc}>Minimum Size</SubLabel>
                            <ListItem>{d.logoGuidelines.minimumSize}</ListItem>
                        </View>
                    </View>

                    <SubLabel brandColor={bc} color="#D9534F">Incorrect Usage</SubLabel>
                    {d.logoGuidelines.donts.map((dont, i) => (
                        <ListItem key={i}>{dont}</ListItem>
                    ))}

                    <Footer brandName={d.brandName} />
                </Page>
            )}

            {/* ─── Brand Voice ─── */}
            <Page size="A4" style={s.page}>
                <SectionHeader brandColor={bc}>05 — Brand Voice</SectionHeader>
                <Text style={s.sectionTitle}>Voice & Tone</Text>
                <Text style={s.sectionBody}>{d.brandVoice.personality}</Text>

                <SubLabel brandColor={bc}>Tone Attributes</SubLabel>
                <Text style={{ fontSize: 9, lineHeight: 1.6, color: gray, marginBottom: 16 }}>
                    {d.brandVoice.toneAttributes.join('  /  ')}
                </Text>

                <View style={{ flexDirection: 'row', gap: 24, marginBottom: 24 }}>
                    <View style={{ flex: 1 }}>
                        <SubLabel brandColor={bc} color="#5CB85C">Do</SubLabel>
                        {d.brandVoice.dos.map((item, i) => (
                            <ListItem key={i}>{item}</ListItem>
                        ))}
                    </View>
                    <View style={{ flex: 1 }}>
                        <SubLabel brandColor={bc} color="#D9534F">Don&apos;t</SubLabel>
                        {d.brandVoice.donts.map((item, i) => (
                            <ListItem key={i}>{item}</ListItem>
                        ))}
                    </View>
                </View>

                <View style={{ padding: 20, backgroundColor: '#FAFAFA', borderRadius: 6, marginBottom: 16 }}>
                    <SubLabel brandColor={bc}>Sample Headline</SubLabel>
                    <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', lineHeight: 1.4 }}>
                        &ldquo;{d.brandVoice.sampleHeadline}&rdquo;
                    </Text>
                </View>

                <View style={{ padding: 20, backgroundColor: '#FAFAFA', borderRadius: 6 }}>
                    <SubLabel brandColor={bc}>Sample Body</SubLabel>
                    <Text style={{ fontSize: 10, lineHeight: 1.7, color: gray }}>
                        {d.brandVoice.sampleBodyCopy}
                    </Text>
                </View>

                <Footer brandName={d.brandName} />
            </Page>
        </Document>
    );
}
