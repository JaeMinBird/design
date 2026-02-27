'use client';

import React from 'react';

/**
 * Custom SVG icon set for the retro wireframe aesthetic.
 * All icons: 24x24 viewBox, thin stroke (1.5px), round linecaps,
 * slightly organic feel — no sharp mechanical precision.
 */

interface IconProps {
    size?: number;
    className?: string;
    strokeWidth?: number;
}

const defaults: Required<Pick<IconProps, 'size' | 'strokeWidth'>> = {
    size: 24,
    strokeWidth: 1.5,
};

function Svg({ size, className, children }: IconProps & { children: React.ReactNode }) {
    const s = size ?? defaults.size;
    return (
        <svg
            width={s}
            height={s}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={defaults.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {children}
        </svg>
    );
}

export function ArrowRight(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
        </Svg>
    );
}

export function ArrowLeft(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M19 12H5" />
            <path d="M11 18l-6-6 6-6" />
        </Svg>
    );
}

export function Upload(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M12 16V4" />
            <path d="M8 8l4-4 4 4" />
            <path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
        </Svg>
    );
}

export function Palette(props: IconProps) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="9" />
            <circle cx="9" cy="9" r="1.5" fill="currentColor" />
            <circle cx="15" cy="9" r="1.5" fill="currentColor" />
            <circle cx="8" cy="14" r="1.5" fill="currentColor" />
            <circle cx="16" cy="13" r="1.5" fill="currentColor" />
        </Svg>
    );
}

export function Type(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M4 7V4h16v3" />
            <path d="M12 4v16" />
            <path d="M8 20h8" />
        </Svg>
    );
}

export function Sliders(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M4 8h4m4 0h8" />
            <circle cx="10" cy="8" r="2" />
            <path d="M4 16h8m4 0h4" />
            <circle cx="14" cy="16" r="2" />
        </Svg>
    );
}

export function Check(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M6 12l4 4 8-8" />
        </Svg>
    );
}

export function Star(props: IconProps) {
    return (
        <Svg {...props}>
            <polygon
                points="12,3 14.5,9 21,9.5 16,14 17.5,21 12,17.5 6.5,21 8,14 3,9.5 9.5,9"
                fill="none"
            />
        </Svg>
    );
}

export function Download(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M12 4v12" />
            <path d="M8 12l4 4 4-4" />
            <path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
        </Svg>
    );
}

export function Sparkles(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z" />
            <path d="M18 14l.75 2.25L21 17l-2.25.75L18 20l-.75-2.25L15 17l2.25-.75z" />
        </Svg>
    );
}

export function Building(props: IconProps) {
    return (
        <Svg {...props}>
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M9 7h2m-2 4h2m-2 4h2" />
            <path d="M13 7h2m-2 4h2" />
            <path d="M10 21v-4h4v4" />
        </Svg>
    );
}

export function Users(props: IconProps) {
    return (
        <Svg {...props}>
            <circle cx="9" cy="7" r="3" />
            <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            <circle cx="17" cy="9" r="2.5" />
            <path d="M21 21v-1.5a3 3 0 0 0-2-2.83" />
        </Svg>
    );
}

export function Loader(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
        </Svg>
    );
}

export function ChevronDown(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M6 9l6 6 6-6" />
        </Svg>
    );
}

export function X(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
        </Svg>
    );
}

export function Eye(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
        </Svg>
    );
}

export function FileText(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
            <path d="M14 3v4h4" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
        </Svg>
    );
}

export function Refresh(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </Svg>
    );
}
