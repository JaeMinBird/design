'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles } from './Icons';

const MESSAGES = [
    'Analyzing brand personality...',
    'Generating color harmonies...',
    'Selecting typography pairings...',
    'Defining spacing system...',
    'Crafting brand voice...',
    'Composing design guidelines...',
    'Finalizing your design system...',
];

/**
 * Animated loading screen displayed while Gemini generates the design system.
 * Shows a rotating wireframe circle and cycling status messages.
 */
export default function GeneratingScreen() {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="animate-fade-in"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 32,
                minHeight: 400,
                textAlign: 'center',
            }}
        >
            {/* Spinner */}
            <div style={{ position: 'relative', width: 80, height: 80 }}>
                {/* Outer ring */}
                <svg
                    width={80}
                    height={80}
                    viewBox="0 0 80 80"
                    className="animate-spin"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                >
                    <circle
                        cx={40}
                        cy={40}
                        r={36}
                        fill="none"
                        stroke="var(--stroke-light)"
                        strokeWidth={1.5}
                        strokeDasharray="12 8"
                    />
                </svg>
                {/* Inner icon */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'var(--blue)',
                    }}
                >
                    <Sparkles size={28} />
                </div>
            </div>

            {/* Status messages */}
            <div>
                <h3
                    style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 24,
                        margin: '0 0 12px',
                    }}
                >
                    Generating your design system
                </h3>
                <p
                    key={messageIndex}
                    className="animate-fade-in"
                    style={{
                        color: 'var(--blue-dark)',
                        fontSize: 13,
                        fontFamily: 'var(--font-mono)',
                        margin: 0,
                    }}
                >
                    {MESSAGES[messageIndex]}
                </p>
            </div>

            {/* Subtle progress dots */}
            <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="animate-pulse-slow"
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: 'var(--blue)',
                            animationDelay: `${i * 0.4}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
