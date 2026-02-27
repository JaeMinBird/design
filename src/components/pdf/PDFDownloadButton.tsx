'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DesignSystemPDF from './DesignSystemPDF';
import { Download } from '../Icons';
import type { DesignSystemOutput } from '@/lib/types';

interface Props {
    designSystem: DesignSystemOutput;
}

/**
 * PDF download button wrapper.
 * Uses PDFDownloadLink which generates the PDF blob on-demand client-side.
 */
export default function PDFDownloadButton({ designSystem }: Props) {
    const fileName = `${designSystem.brandName.toLowerCase().replace(/\s+/g, '-')}-design-system.pdf`;

    return (
        <PDFDownloadLink
            document={<DesignSystemPDF data={designSystem} />}
            fileName={fileName}
            style={{ textDecoration: 'none' }}
        >
            {({ loading }) => (
                <button className="wire-btn wire-btn--primary" disabled={loading}>
                    <Download size={16} />
                    {loading ? 'Preparing PDF...' : 'Download PDF'}
                </button>
            )}
        </PDFDownloadLink>
    );
}
