import React, { useRef, useEffect, useState } from 'react';
import StandardInvoice from '../templates/StandardInvoice';
import FreelanceInvoice from '../templates/FreelanceInvoice';
import RentReceipt from '../templates/RentReceipt';
import { useInvoice } from '../../context/InvoiceContext';

export default function TemplateRenderer() {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const { invoiceData } = useInvoice();

    const a4Width = 794;

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const parentWidth = containerRef.current.parentElement.clientWidth;
                const availableWidth = parentWidth - 48; // padding
                if (availableWidth < a4Width) {
                    setScale(availableWidth / a4Width);
                } else {
                    setScale(1);
                }
            }
        };

        handleResize(); // initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderTemplate = () => {
        switch (invoiceData.template) {
            case 'freelance': return <FreelanceInvoice />;
            case 'rent': return <RentReceipt />;
            case 'standard':
            default:
                return <StandardInvoice />;
        }
    };

    return (
        <div className="w-full flex justify-center origin-top relative mb-20" ref={containerRef}>
            <div
                className="bg-white shadow-xl ring-1 ring-slate-900/5 origin-top transition-transform shrink-0 relative overflow-hidden"
                style={{
                    width: `${a4Width}px`,
                    aspectRatio: '1/1.414',
                    transform: `scale(${scale})`
                }}
            >
                <div className="w-full h-full p-10 relative">
                    {renderTemplate()}
                </div>
            </div>
        </div>
    );
}
