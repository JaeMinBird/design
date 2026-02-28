'use client';

import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProgressBar from '@/components/ProgressBar';
import StepOne from '@/components/steps/StepOne';
import StepTwo from '@/components/steps/StepTwo';
import StepThree from '@/components/steps/StepThree';
import GeneratingScreen from '@/components/GeneratingScreen';
import ResultsView from '@/components/ResultsView';
import { ArrowLeft, ArrowRight, Sparkles } from '@/components/Icons';
import { DEFAULT_WIZARD_STATE } from '@/lib/types';
import type { WizardState, DesignSystemOutput } from '@/lib/types';

const STEPS = ['Company', 'Identity', 'Visual'];

/**
 * Validates whether the user can proceed from the current step.
 */
function canProceed(step: number, data: WizardState): boolean {
  switch (step) {
    case 0:
      return data.companyName.trim().length > 0 && data.industry !== '';
    case 1:
      return data.adjectives.length >= 3 && data.targetAudience.trim().length > 0;
    case 2:
      return data.colorMood !== '' && data.typographyStyle !== '';
    default:
      return false;
  }
}

type AppPhase = 'wizard' | 'generating' | 'results' | 'error';

export default function Home() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardState>({ ...DEFAULT_WIZARD_STATE });
  const [phase, setPhase] = useState<AppPhase>('wizard');
  const [result, setResult] = useState<DesignSystemOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const updateData = useCallback((updates: Partial<WizardState>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const goNext = () => {
    if (step < 2) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const handleGenerate = async () => {
    setPhase('generating');
    setError(null);

    try {
      // If no logo, try to generate one
      if (!data.logo) {
        try {
          const logoRes = await fetch('/api/generate-logo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              companyName: data.companyName,
              industry: data.industry,
              adjectives: data.adjectives,
            }),
          });
          if (logoRes.ok) {
            const logoData = await logoRes.json();
            if (logoData.imageBase64) {
              data.logo = logoData.imageBase64;
            }
          }
        } catch {
          // Logo generation is optional — continue without it
          console.warn('Logo generation failed, continuing without logo');
        }
      }

      // Generate design system
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Generation failed');
      }

      const designSystem: DesignSystemOutput = await res.json();
      setResult(designSystem);
      setPhase('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setPhase('error');
    }
  };

  const handleStartOver = () => {
    setStep(0);
    setData({ ...DEFAULT_WIZARD_STATE });
    setResult(null);
    setError(null);
    setPhase('wizard');
  };

  // Page transition variants
  const pageVariants = {
    enter: (d: number) => ({
      x: d * 60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d * -60,
      opacity: 0,
    }),
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 24px',
      }}
    >
      {/* App header */}
      <header style={{ textAlign: 'center', marginBottom: 48 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 8,
          }}
        >
          {/* Retro "logo" — stacked circles */}
          <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="12" stroke="var(--blue)" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="14" cy="14" r="6" stroke="var(--blue)" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="2" fill="var(--blue)" />
          </svg>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: 'var(--ink)',
            }}
          >
            Design System Generator
          </span>
        </div>
        {phase === 'wizard' && (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 18,
              color: 'var(--ink-light)',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            Create a complete brand system in minutes.
          </p>
        )}
      </header>

      {/* Main content area */}
      <main
        style={{
          width: '100%',
          maxWidth: 640,
        }}
      >
        {/* Wizard */}
        {phase === 'wizard' && (
          <>
            <ProgressBar currentStep={step} steps={STEPS} />

            <div style={{ marginTop: 40, position: 'relative', overflow: 'hidden' }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  {step === 0 && <StepOne data={data} onChange={updateData} />}
                  {step === 1 && <StepTwo data={data} onChange={updateData} />}
                  {step === 2 && <StepThree data={data} onChange={updateData} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 40,
                paddingTop: 24,
                borderTop: '1px dashed var(--stroke)',
              }}
            >
              <button
                className="wire-btn"
                onClick={goBack}
                disabled={step === 0}
                style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
              >
                <ArrowLeft size={16} />
                Back
              </button>

              {step < 2 ? (
                <button
                  className="wire-btn wire-btn--primary"
                  onClick={goNext}
                  disabled={!canProceed(step, data)}
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  className="wire-btn wire-btn--primary"
                  onClick={handleGenerate}
                  disabled={!canProceed(step, data)}
                >
                  <Sparkles size={16} />
                  Generate
                </button>
              )}
            </div>
          </>
        )}

        {/* Generating */}
        {phase === 'generating' && <GeneratingScreen />}

        {/* Results */}
        {phase === 'results' && result && (
          <ResultsView designSystem={result} onStartOver={handleStartOver} />
        )}

        {/* Error */}
        {phase === 'error' && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '60px 0' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '2px solid var(--red)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                fontSize: 20,
                color: 'var(--red)',
              }}
            >
              !
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, margin: '0 0 8px' }}>
              Something went wrong
            </h3>
            <p style={{ color: 'var(--ink-light)', fontSize: 13, margin: '0 0 24px', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
              {error}
            </p>
            <button className="wire-btn" onClick={handleStartOver}>
              Try Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

