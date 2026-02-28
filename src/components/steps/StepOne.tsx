'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Building, Upload, X } from '../Icons';
import { INDUSTRIES } from '@/lib/constants';
import type { WizardState } from '@/lib/types';

interface StepOneProps {
    data: WizardState;
    onChange: (updates: Partial<WizardState>) => void;
}

export default function StepOne({ data, onChange }: StepOneProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

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

    const selectedIndustry = INDUSTRIES.find((i) => i.value === data.industry);

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

            {/* Industry — seamless dropdown that extends from the input bar */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
                <label className="wire-label">Industry *</label>
                <button
                    type="button"
                    className="wire-input"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                        appearance: 'none',
                        paddingRight: 40,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        color: selectedIndustry ? 'var(--ink)' : 'var(--ink-faint)',
                        borderColor: dropdownOpen ? 'var(--blue)' : undefined,
                        boxShadow: dropdownOpen ? '0 0 0 3px rgba(106, 171, 219, 0.12)' : undefined,
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                >
                    {selectedIndustry ? selectedIndustry.label : 'Select an industry...'}
                    <span style={{ position: 'absolute', right: 16, color: 'var(--ink-faint)', transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                        ↓
                    </span>
                </button>

                {dropdownOpen && (
                    <div
                        className="dropdown-menu-scroll"
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1.5px solid var(--blue)',
                            borderRadius: 'var(--radius-md)',
                            maxHeight: 240,
                            overflowY: 'auto',
                            zIndex: 20,
                            boxShadow: '0 0 0 3px rgba(106, 171, 219, 0.12), 0 8px 24px rgba(0,0,0,0.08)',
                            paddingTop: 6,
                            paddingBottom: 6
                        }}
                    >
                        {INDUSTRIES.map((ind) => (
                            <button
                                key={ind.value}
                                type="button"
                                onClick={() => {
                                    onChange({ industry: ind.value });
                                    setDropdownOpen(false);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '10px 18px',
                                    border: 'none',
                                    background: data.industry === ind.value ? 'var(--blue-faint)' : 'transparent',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 13,
                                    color: data.industry === ind.value ? 'var(--blue-dark)' : 'var(--ink)',
                                    transition: 'background 0.1s',
                                }}
                                onMouseEnter={(e) => {
                                    if (data.industry !== ind.value) {
                                        (e.target as HTMLElement).style.background = '#f8f8f8';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (data.industry !== ind.value) {
                                        (e.target as HTMLElement).style.background = 'transparent';
                                    }
                                }}
                            >
                                {ind.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Two column: Logo + Color */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
                {/* Logo Upload — fixed height */}
                <div>
                    <label className="wire-label">Logo (optional)</label>
                    {data.logo ? (
                        <div
                            style={{
                                position: 'relative',
                                border: '1.5px solid var(--stroke)',
                                borderRadius: 'var(--radius-lg)',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 244,
                            }}
                        >
                            <img
                                src={data.logo}
                                alt="Logo preview"
                                style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
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
                            style={{
                                height: 244,
                                cursor: 'pointer',
                            }}
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
