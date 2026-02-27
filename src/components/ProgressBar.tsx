'use client';

import React from 'react';
import { Check } from './Icons';

interface ProgressBarProps {
    currentStep: number; // 0-indexed
    steps: string[];
}

/**
 * Retro wireframe step indicator — horizontal dots with labels.
 * Connected by dashed lines for the blueprint feel.
 */
export default function ProgressBar({ currentStep, steps }: ProgressBarProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, width: '100%', maxWidth: 480, margin: '0 auto' }}>
            {steps.map((label, i) => {
                const isCompleted = i < currentStep;
                const isActive = i === currentStep;

                return (
                    <React.Fragment key={label}>
                        {/* Step circle + label */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    border: `2px solid ${isCompleted || isActive ? 'var(--blue)' : 'var(--stroke)'}`,
                                    background: isCompleted ? 'var(--blue)' : isActive ? 'var(--blue-faint)' : 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 13,
                                    color: isCompleted ? 'white' : isActive ? 'var(--blue-dark)' : 'var(--ink-faint)',
                                    transition: 'all 200ms ease',
                                }}
                            >
                                {isCompleted ? <Check size={16} /> : i + 1}
                            </div>
                            <span
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 10,
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase' as const,
                                    color: isActive ? 'var(--blue-dark)' : 'var(--ink-faint)',
                                    whiteSpace: 'nowrap',
                                    transition: 'color 200ms ease',
                                }}
                            >
                                {label}
                            </span>
                        </div>

                        {/* Dashed connector line */}
                        {i < steps.length - 1 && (
                            <div
                                style={{
                                    flex: 1,
                                    height: 0,
                                    borderTop: `1.5px dashed ${i < currentStep ? 'var(--blue)' : 'var(--stroke)'}`,
                                    marginBottom: 28,
                                    minWidth: 40,
                                    transition: 'border-color 200ms ease',
                                }}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
