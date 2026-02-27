'use client';

import React, { useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Building, Upload, X } from '../Icons';
import { INDUSTRIES } from '@/lib/constants';
import type { WizardState } from '@/lib/types';

interface StepOneProps {
    data: WizardState;
    onChange: (updates: Partial<WizardState>) => void;
}

/**
 * Step 1 — Company Info
 * Company name, industry, optional logo upload, optional primary color.
 */
export default function StepOne({ data, onChange }: StepOneProps) {
    const handleLogoDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => onChange({ logo: reader.result as string });
                reader.readAsDataURL(file);
            }
        },
        [onChange]
    );

    const handleLogoSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => onChange({ logo: reader.result as string });
                reader.readAsDataURL(file);
            }
        },
        [onChange]
    );

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', border: '1.5px solid var(--blue)', marginBottom: 16 }}>
                    <Building size={22} className="" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, margin: '0 0 8px' }}>Company Info</h2>
                <p style={{ color: 'var(--ink-light)', fontSize: 13, margin: 0 }}>
                    Tell us about your company. We&apos;ll build your system from here.
                </p>
            </div>

            {/* Company Name */}
            <div>
                <label className="wire-label">Company Name *</label>
                <input
                    type="text"
                    className="wire-input"
                    placeholder="e.g. Meridian Labs"
                    value={data.companyName}
                    onChange={(e) => onChange({ companyName: e.target.value })}
                />
            </div>

            {/* Industry */}
            <div>
                <label className="wire-label">Industry *</label>
                <div style={{ position: 'relative' }}>
                    <select
                        className="wire-input"
                        value={data.industry}
                        onChange={(e) => onChange({ industry: e.target.value })}
                        style={{ appearance: 'none', paddingRight: 40, cursor: 'pointer' }}
                    >
                        <option value="">Select an industry...</option>
                        {INDUSTRIES.map((ind) => (
                            <option key={ind.value} value={ind.value}>
                                {ind.label}
                            </option>
                        ))}
                    </select>
                    <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--ink-faint)' }}>
                        ↓
                    </div>
                </div>
            </div>

            {/* Two column: Logo + Color */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Logo Upload */}
                <div>
                    <label className="wire-label">Logo (optional)</label>
                    {data.logo ? (
                        <div
                            style={{
                                position: 'relative',
                                padding: 24,
                                border: '1.5px solid var(--stroke)',
                                borderRadius: 'var(--radius-lg)',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: 140,
                            }}
                        >
                            <img
                                src={data.logo}
                                alt="Logo preview"
                                style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain' }}
                            />
                            <button
                                onClick={() => onChange({ logo: null })}
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    border: '1.5px solid var(--stroke)',
                                    background: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--ink-light)',
                                }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <label
                            className="wire-upload"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleLogoDrop}
                            style={{ minHeight: 140, cursor: 'pointer' }}
                        >
                            <Upload size={24} />
                            <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>
                                Drop your logo here
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
                                or click to browse
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoSelect}
                                style={{ display: 'none' }}
                            />
                        </label>
                    )}
                </div>

                {/* Primary Color */}
                <div>
                    <label className="wire-label">Primary Color (optional)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <HexColorPicker
                            color={data.primaryColor || '#6AABDB'}
                            onChange={(color) => onChange({ primaryColor: color })}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: data.primaryColor || '#6AABDB',
                                    border: '1.5px solid var(--stroke)',
                                    flexShrink: 0,
                                }}
                            />
                            <input
                                type="text"
                                className="wire-input"
                                placeholder="#6AABDB"
                                value={data.primaryColor || ''}
                                onChange={(e) => onChange({ primaryColor: e.target.value })}
                                style={{ fontSize: 12, padding: '8px 14px', fontFamily: 'var(--font-mono)' }}
                            />
                            {data.primaryColor && (
                                <button
                                    onClick={() => onChange({ primaryColor: null })}
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        border: '1.5px solid var(--stroke)',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--ink-light)',
                                        flexShrink: 0,
                                    }}
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
