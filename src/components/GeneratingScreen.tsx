'use client';

import React, { useEffect, useRef, useState } from 'react';

const STEPS = [
    'Color palette',
    'Typography pairings',
    'Spacing system',
    'Logo mark',
    'Brand voice',
    'Design patterns',
    'Usage guidelines',
];

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
    hue: number;
    angle: number; // position on ring
    ringRadius: number; // distance from center
    baseSpeed: number;
}

/**
 * Animated loading screen with ring-shaped particle animation.
 * Particles form a ring around "Ideating" and repel from the mouse cursor.
 */
export default function GeneratingScreen() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number>(0);
    const mouseRef = useRef<{ x: number; y: number } | null>(null);
    const [activeStep, setActiveStep] = useState(0);

    // Cycle through steps
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % STEPS.length);
        }, 2400);
        return () => clearInterval(interval);
    }, []);

    // Particle animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = 240;
        const height = 240;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        const cx = width / 2;
        const cy = height / 2;
        const ringR = 70; // ring radius

        // Create particles distributed around the ring
        const particles: Particle[] = [];
        const count = 80;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
            const rOffset = (Math.random() - 0.5) * 20; // slight random offset from ring
            const r = ringR + rOffset;
            particles.push({
                x: cx + Math.cos(angle) * r,
                y: cy + Math.sin(angle) * r,
                vx: 0,
                vy: 0,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.15,
                hue: 200 + Math.random() * 30,
                angle,
                ringRadius: r,
                baseSpeed: 0.002 + Math.random() * 0.003,
            });
        }
        particlesRef.current = particles;

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };
        const handleMouseLeave = () => {
            mouseRef.current = null;
        };
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            const mouse = mouseRef.current;

            for (const p of particles) {
                // Slowly orbit around center
                p.angle += p.baseSpeed;
                const targetX = cx + Math.cos(p.angle) * p.ringRadius;
                const targetY = cy + Math.sin(p.angle) * p.ringRadius;

                // Gently pull toward ring position
                p.vx += (targetX - p.x) * 0.02;
                p.vy += (targetY - p.y) * 0.02;

                // Mouse repulsion
                if (mouse) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 60) {
                        const force = (60 - dist) / 60;
                        p.vx += (dx / dist) * force * 1.5;
                        p.vy += (dy / dist) * force * 1.5;
                    }
                }

                // Damping
                p.vx *= 0.9;
                p.vy *= 0.9;

                p.x += p.vx;
                p.y += p.vy;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 50%, 65%, ${p.opacity})`;
                ctx.fill();
            }

            // Draw subtle connection lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 30) {
                        const alpha = (1 - dist / 30) * 0.08;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(106, 171, 219, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animFrameRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            className="animate-fade-in"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0,
                minHeight: 500,
                textAlign: 'center',
                position: 'relative',
            }}
        >
            {/* Particle canvas background */}
            <div style={{ position: 'relative', width: 240, height: 240 }}>
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: 0.7,
                    }}
                />
                {/* Center content overlay */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    pointerEvents: 'none',
                }}>
                    <h3
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 36,
                            margin: 0,
                            fontStyle: 'italic',
                            color: 'var(--ink)',
                        }}
                    >
                        Ideating
                    </h3>

                    {/* Subtle dots */}
                    <div style={{ display: 'flex', gap: 6 }}>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse-slow"
                                style={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    background: 'var(--ink-faint)',
                                    animationDelay: `${i * 0.4}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Step labels — centered below, moved up */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 8,
                maxWidth: 360,
                marginTop: -8,
            }}>
                {STEPS.map((step, i) => (
                    <span
                        key={step}
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            color: i === activeStep ? 'var(--ink)' : 'var(--ink-faint)',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-pill)',
                            border: `1px solid ${i === activeStep ? 'var(--stroke)' : 'transparent'}`,
                            background: i === activeStep ? 'white' : 'transparent',
                            transition: 'all 0.3s ease',
                            textTransform: 'lowercase',
                        }}
                    >
                        {step}
                    </span>
                ))}
            </div>
        </div>
    );
}
