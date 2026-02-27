'use client';

import React from 'react';
import { Users } from '../Icons';
import { ADJECTIVES } from '@/lib/constants';
import type { WizardState } from '@/lib/types';

interface StepTwoProps {
    data: WizardState;
    onChange: (updates: Partial<WizardState>) => void;
}

/**
 * Step 2 — Brand Identity
 * Select 3-5 brand adjectives and describe the target audience.
 */
export default function StepTwo({ data, onChange }: StepTwoProps) {
    const toggleAdjective = (value: string) => {
        const current = data.adjectives;
        if (current.includes(value)) {
            onChange({ adjectives: current.filter((a) => a !== value) });
        } else if (current.length < 5) {
            onChange({ adjectives: [...current, value] });
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', border: '1.5px solid var(--blue)', marginBottom: 16 }}>
                    <Users size={22} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, margin: '0 0 8px' }}>Brand Identity</h2>
                <p style={{ color: 'var(--ink-light)', fontSize: 13, margin: 0 }}>
                    How should your brand feel? Select 3–5 adjectives.
                </p>
            </div>

            {/* Adjective Tags */}
            <div>
                <label className="wire-label">
                    Brand Personality * &nbsp;
                    <span style={{ color: data.adjectives.length >= 3 ? 'var(--green)' : 'var(--ink-faint)', textTransform: 'none', letterSpacing: 0 }}>
                        ({data.adjectives.length}/5 selected)
                    </span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {ADJECTIVES.map((adj) => {
                        const selected = data.adjectives.includes(adj.value);
                        const disabled = !selected && data.adjectives.length >= 5;
                        return (
                            <button
                                key={adj.value}
                                onClick={() => !disabled && toggleAdjective(adj.value)}
                                className={`wire-tag ${selected ? 'wire-tag--selected' : ''}`}
                                style={{
                                    opacity: disabled ? 0.4 : 1,
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {selected && (
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', display: 'inline-block' }} />
                                )}
                                {adj.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <hr className="wire-divider" />

            {/* Target Audience */}
            <div>
                <label className="wire-label">Target Audience *</label>
                <textarea
                    className="wire-input wire-textarea"
                    placeholder="e.g. Young professionals aged 25-40 who value sustainability and modern design..."
                    value={data.targetAudience}
                    onChange={(e) => onChange({ targetAudience: e.target.value })}
                    rows={3}
                />
                <p style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 6, marginBottom: 0 }}>
                    Describe who your brand speaks to — age, interests, values.
                </p>
            </div>
        </div>
    );
}
