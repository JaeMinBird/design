import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from '@react-pdf/renderer';
import type { DesignSystemOutput } from '@/lib/types';

/**
 * Professional design system PDF document.
 * Swiss-inspired layout with generous whitespace, clean grid,
 * and structured information hierarchy.
 */

/* ─── Styles ────────────────────────────────────────────────── */

const ink = '#2C2C2C';
const gray = '#6B6B6B';
const lightGray = '#E2E2E2';

/**
 * Create styles dynamically based on the brand's primary color.
 * This ensures the PDF reflects the user's design system, not our app colors.
 */
function createStyles(brandColor: string) {
    // Parse the hex to create a light tint version for backgrounds
    const r = parseInt(brandColor.slice(1, 3), 16);
    const g = parseInt(brandColor.slice(3, 5), 16);
    const b = parseInt(brandColor.slice(5, 7), 16);
    const tintR = Math.round(r + (255 - r) * 0.85);
    const tintG = Math.round(g + (255 - g) * 0.85);
    const tintB = Math.round(b + (255 - b) * 0.85);
    const brandTint = `#${tintR.toString(16).padStart(2, '0')}${tintG.toString(16).padStart(2, '0')}${tintB.toString(16).padStart(2, '0')}`;


    return StyleSheet.create({
        page: {
            padding: 48,
            fontFamily: 'Helvetica',
            fontSize: 9,
            color: ink,
            backgroundColor: '#FFFFFF',
        },
        /* Cover */
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
        coverDivider: {
            width: 48,
            height: 3,
            backgroundColor: brandColor,
            marginBottom: 24,
        },
        coverMeta: {
            fontSize: 8,
            color: gray,
            textTransform: 'uppercase',
            letterSpacing: 2,
        },
        /* Section headers */
        sectionHeader: {
            fontSize: 8,
            color: brandColor,
            textTransform: 'uppercase',
            letterSpacing: 3,
            marginBottom: 6,
            fontFamily: 'Helvetica-Bold',
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
        /* Swatches */
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
        /* Typography */
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
        /* Spacing */
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
        spacingBar: {
            height: 8,
            backgroundColor: brandTint,
            borderWidth: 0.5,
            borderColor: brandColor,
            borderRadius: 2,
        },
        spacingValue: {
            fontSize: 8,
            color: gray,
            marginLeft: 8,
        },
        /* Lists */
        listItem: {
            fontSize: 9,
            lineHeight: 1.6,
            color: gray,
            marginBottom: 3,
        },
        subLabel: {
            fontSize: 7,
            color: brandColor,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            fontFamily: 'Helvetica-Bold',
            marginBottom: 4,
            marginTop: 12,
        },
        /* Footer */
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
        /* Radius demo */
        radiusBox: {
            width: 36,
            height: 36,
            borderWidth: 1.5,
            borderColor: brandColor,
            backgroundColor: brandTint,
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
    });
}

/* ─── Helper ────────────────────────────────────────────────── */

function isLightColor(hex: string): boolean {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.5;
}

function Footer({ brandName, styles }: { brandName: string; styles: ReturnType<typeof createStyles> }) {
    return (
        <View style={styles.footer} fixed>
            <Text>{brandName} — Design System</Text>
            <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
    );
}

/* ─── Document ──────────────────────────────────────────────── */

interface Props {
    data: DesignSystemOutput;
}

export default function DesignSystemPDF({ data }: Props) {
    const d = data;
    const s = createStyles(d.colors.primary.hex);

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
                    <View style={s.coverDivider} />
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

            {/* ─── Color System ─── */}
            <Page size="A4" style={s.page}>
                <Text style={s.sectionHeader}>01 — Color System</Text>
                <Text style={s.sectionTitle}>Color Palette</Text>
                <Text style={s.sectionBody}>
                    These colors form the foundation of the brand's visual identity. Use them consistently across all touchpoints.
                </Text>

                <Text style={s.subLabel}>Core</Text>
                <View style={s.swatchGrid}>
                    {[d.colors.primary, d.colors.secondary, d.colors.accent].map((sw) => (
                        <View key={sw.name} style={[s.swatch, { backgroundColor: sw.hex }]}>
                            <Text style={[s.swatchName, { color: isLightColor(sw.hex) ? ink : '#FFFFFF' }]}>{sw.name}</Text>
                            <Text style={[s.swatchHex, { color: isLightColor(sw.hex) ? gray : '#FFFFFFCC' }]}>{sw.hex.toUpperCase()}</Text>
                        </View>
                    ))}
                </View>

                <Text style={s.subLabel}>Neutrals</Text>
                <View style={s.swatchGrid}>
                    {d.colors.neutrals.map((sw) => (
                        <View key={sw.name} style={[s.swatch, { backgroundColor: sw.hex, width: 60, height: 60 }]}>
                            <Text style={[s.swatchName, { color: isLightColor(sw.hex) ? ink : '#FFFFFF' }]}>{sw.name}</Text>
                            <Text style={[s.swatchHex, { color: isLightColor(sw.hex) ? gray : '#FFFFFFCC' }]}>{sw.hex.toUpperCase()}</Text>
                        </View>
                    ))}
                </View>

                <Text style={s.subLabel}>Semantic</Text>
                <View style={s.swatchGrid}>
                    {[d.colors.semantic.success, d.colors.semantic.warning, d.colors.semantic.error, d.colors.semantic.info].map((sw) => (
                        <View key={sw.name} style={[s.swatch, { backgroundColor: sw.hex, width: 60, height: 60 }]}>
                            <Text style={[s.swatchName, { color: isLightColor(sw.hex) ? ink : '#FFFFFF' }]}>{sw.name}</Text>
                            <Text style={[s.swatchHex, { color: isLightColor(sw.hex) ? gray : '#FFFFFFCC' }]}>{sw.hex.toUpperCase()}</Text>
                        </View>
                    ))}
                </View>

                {/* Usage notes */}
                <Text style={s.subLabel}>Usage Guidelines</Text>
                <Text style={s.listItem}>• Primary: {d.colors.primary.usage}</Text>
                <Text style={s.listItem}>• Secondary: {d.colors.secondary.usage}</Text>
                <Text style={s.listItem}>• Accent: {d.colors.accent.usage}</Text>

                <Footer brandName={d.brandName} styles={s} />
            </Page>

            {/* ─── Typography ─── */}
            <Page size="A4" style={s.page}>
                <Text style={s.sectionHeader}>02 — Typography</Text>
                <Text style={s.sectionTitle}>Type System</Text>

                <View style={{ flexDirection: 'row', gap: 24, marginBottom: 24 }}>
                    <View style={{ flex: 1, padding: 16, backgroundColor: '#FAFAFA', borderRadius: 6 }}>
                        <Text style={s.subLabel}>Heading Font</Text>
                        <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold' }}>{d.typography.headingFont}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 16, backgroundColor: '#FAFAFA', borderRadius: 6 }}>
                        <Text style={s.subLabel}>Body Font</Text>
                        <Text style={{ fontSize: 18 }}>{d.typography.bodyFont}</Text>
                    </View>
                </View>

                <Text style={s.subLabel}>Type Scale</Text>
                {d.typography.scale.map((level) => (
                    <View key={level.name} style={s.typeRow}>
                        <Text style={s.typeName}>{level.name}</Text>
                        <Text style={s.typeSpec}>{level.size} / {level.lineHeight} / {level.weight}</Text>
                        <Text style={s.typeUsage}>{level.usage}</Text>
                    </View>
                ))}

                <Footer brandName={d.brandName} styles={s} />
            </Page>

            {/* ─── Spacing & Layout ─── */}
            <Page size="A4" style={s.page}>
                <Text style={s.sectionHeader}>03 — Spacing & Layout</Text>
                <Text style={s.sectionTitle}>Spatial System</Text>
                <Text style={s.sectionBody}>
                    Built on a {d.spacing.baseUnit}px base unit. All spacings are multiples of this unit for consistent rhythm.
                </Text>

                <Text style={s.subLabel}>Spacing Scale</Text>
                {d.spacing.scale.map((sp) => (
                    <View key={sp.name} style={s.spacingRow}>
                        <Text style={s.spacingLabel}>{sp.name}</Text>
                        <View style={[s.spacingBar, { width: Math.min(parseInt(sp.value) * 2, 300) }]} />
                        <Text style={s.spacingValue}>{sp.value}</Text>
                    </View>
                ))}

                <Text style={s.subLabel}>Border Radius</Text>
                <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                    {d.spacing.borderRadius.map((r) => (
                        <View key={r.name} style={{ alignItems: 'center', gap: 4 }}>
                            <View style={[s.radiusBox, {
                                borderRadius: r.value === '9999px' ? 18 : Math.min(parseInt(r.value), 18),
                            }]} />
                            <Text style={s.radiusLabel}>{r.name}: {r.value}</Text>
                        </View>
                    ))}
                </View>

                <Text style={s.subLabel}>Shadows</Text>
                {d.spacing.shadows.map((sh) => (
                    <View key={sh.name} style={{ marginBottom: 8 }}>
                        <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>{sh.name}</Text>
                        <Text style={{ fontSize: 8, color: gray }}>{sh.value}</Text>
                        <Text style={{ fontSize: 8, color: gray }}>{sh.usage}</Text>
                    </View>
                ))}

                <Footer brandName={d.brandName} styles={s} />
            </Page>

            {/* ─── Logo Guidelines ─── */}
            <Page size="A4" style={s.page}>
                <Text style={s.sectionHeader}>04 — Logo</Text>
                <Text style={s.sectionTitle}>Logo Guidelines</Text>
                <Text style={s.sectionBody}>{d.logoGuidelines.description}</Text>

                {d.generatedLogoUrl && (
                    <View style={{ alignItems: 'center', padding: 32, marginBottom: 24, backgroundColor: '#FAFAFA', borderRadius: 8 }}>
                        <Image src={d.generatedLogoUrl} style={{ width: 100, height: 100, objectFit: 'contain' }} />
                    </View>
                )}

                <View style={{ flexDirection: 'row', gap: 24, marginBottom: 24 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={s.subLabel}>Clear Space</Text>
                        <Text style={s.listItem}>{d.logoGuidelines.clearSpaceRule}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={s.subLabel}>Minimum Size</Text>
                        <Text style={s.listItem}>{d.logoGuidelines.minimumSize}</Text>
                    </View>
                </View>

                <Text style={s.subLabel}>Incorrect Usage</Text>
                {d.logoGuidelines.donts.map((dont, i) => (
                    <Text key={i} style={s.listItem}>✗ {dont}</Text>
                ))}

                <Footer brandName={d.brandName} styles={s} />
            </Page>

            {/* ─── Brand Voice ─── */}
            <Page size="A4" style={s.page}>
                <Text style={s.sectionHeader}>05 — Brand Voice</Text>
                <Text style={s.sectionTitle}>Voice & Tone</Text>
                <Text style={s.sectionBody}>{d.brandVoice.personality}</Text>

                <Text style={s.subLabel}>Tone Attributes</Text>
                <Text style={[s.listItem, { marginBottom: 16 }]}>
                    {d.brandVoice.toneAttributes.join('  •  ')}
                </Text>

                <View style={{ flexDirection: 'row', gap: 24, marginBottom: 24 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[s.subLabel, { color: '#5CB85C' }]}>Do</Text>
                        {d.brandVoice.dos.map((item, i) => (
                            <Text key={i} style={s.listItem}>✓ {item}</Text>
                        ))}
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[s.subLabel, { color: '#D9534F' }]}>Don't</Text>
                        {d.brandVoice.donts.map((item, i) => (
                            <Text key={i} style={s.listItem}>✗ {item}</Text>
                        ))}
                    </View>
                </View>

                <View style={{ padding: 20, backgroundColor: '#FAFAFA', borderRadius: 6, marginBottom: 16 }}>
                    <Text style={s.subLabel}>Sample Headline</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', lineHeight: 1.4 }}>
                        &ldquo;{d.brandVoice.sampleHeadline}&rdquo;
                    </Text>
                </View>

                <View style={{ padding: 20, backgroundColor: '#FAFAFA', borderRadius: 6 }}>
                    <Text style={s.subLabel}>Sample Body</Text>
                    <Text style={{ fontSize: 10, lineHeight: 1.7, color: gray }}>
                        {d.brandVoice.sampleBodyCopy}
                    </Text>
                </View>

                <Footer brandName={d.brandName} styles={s} />
            </Page>
        </Document>
    );
}
