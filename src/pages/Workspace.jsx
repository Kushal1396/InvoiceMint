import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Edit3, Download, Printer, Loader2, RotateCcw } from 'lucide-react';
import BusinessDetails from '../components/form/BusinessDetails';
import LineItems from '../components/form/LineItems';
import TaxConfig from '../components/form/TaxConfig';
import TemplateRenderer from '../components/preview/TemplateRenderer';
import { useInvoice } from '../context/InvoiceContext';
import { pdf } from '@react-pdf/renderer';
import StandardInvoicePdf from '../components/pdf/StandardInvoicePdf';
import FreelanceInvoicePdf from '../components/pdf/FreelanceInvoicePdf';
import RentReceiptPdf from '../components/pdf/RentReceiptPdf';

export default function Workspace() {
    const [mobileView, setMobileView] = useState('edit');
    const [generating, setGenerating] = useState(false);
    const { invoiceData, resetInvoice } = useInvoice();

    const handleReset = useCallback(() => {
        if (window.confirm('Start a new invoice? This will clear all current data.')) {
            resetInvoice();
        }
    }, [resetInvoice]);

    const getPdfDocument = useCallback(() => {
        switch (invoiceData.template) {
            case 'freelance': return <FreelanceInvoicePdf data={invoiceData} />;
            case 'rent': return <RentReceiptPdf data={invoiceData} />;
            case 'standard':
            default:
                return <StandardInvoicePdf data={invoiceData} />;
        }
    }, [invoiceData]);

    const handleDownloadPdf = useCallback(async () => {
        setGenerating(true);
        try {
            const blob = await pdf(getPdfDocument()).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${invoiceData.invoiceNumber || 'invoice'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('PDF generation failed:', err);
            alert('PDF generation failed. Please check console for details.');
        } finally {
            setGenerating(false);
        }
    }, [getPdfDocument, invoiceData.invoiceNumber]);

    const handlePrint = useCallback(async () => {
        setGenerating(true);
        try {
            const blob = await pdf(getPdfDocument()).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (err) {
            console.error('PDF generation failed:', err);
            alert('Preview generation failed. Please check console for details.');
        } finally {
            setGenerating(false);
        }
    }, [getPdfDocument]);

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-50 font-sans text-slate-900">
            <Helmet>
                <title>Editor | InvoiceMint</title>
                <meta name="description" content="Use the InvoiceMint Editor to create and download custom invoices, receipts, and bills as PDF for free." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>

            {/* Header */}
            <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 md:px-6 justify-between flex-shrink-0 z-20 print:hidden">
                <div className="flex items-center gap-3">
                    <img src="/favicon.svg" alt="InvoiceMint Logo" className="w-8 h-8 drop-shadow" />
                    <h2 className="font-bold text-lg hidden sm:block">InvoiceMint</h2>
                </div>

                {/* Mobile Toggle Buttons */}
                <div className="md:hidden flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setMobileView('edit')}
                        className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${mobileView === 'edit' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Edit3 size={16} /> Edit
                    </button>
                    <button
                        onClick={() => setMobileView('preview')}
                        className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${mobileView === 'preview' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <FileText size={16} /> Preview
                    </button>
                </div>

                <div className="hidden md:flex gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <RotateCcw size={16} /> New
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <Printer size={16} /> Print Slip
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        disabled={generating}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait"
                    >
                        {generating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><Download size={16} /> Download PDF</>}
                    </button>
                </div>
            </header>

            {/* Main Split Interface */}
            <main className="flex-1 flex overflow-hidden relative">

                {/* Left Panel: Form */}
                <section
                    className={`
            bg-white overflow-y-auto border-r border-slate-200 w-full md:w-[45%] lg:w-[40%] xl:w-1/3 flex-col print:hidden
            ${mobileView === 'edit' ? 'flex' : 'hidden'} md:flex
          `}
                >
                    <div className="p-6 pb-32">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            Document Setup
                        </h3>

                        <div className="space-y-8">
                            <BusinessDetails />
                            <LineItems />
                            <TaxConfig />
                        </div>

                        {/* Mobile-only action buttons */}
                        <div className="md:hidden flex gap-3 mt-8">
                            <button
                                onClick={handlePrint}
                                className="flex-1 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2"
                            >
                                <Printer size={16} /> Print
                            </button>
                            <button
                                onClick={handleDownloadPdf}
                                disabled={generating}
                                className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {generating ? <><Loader2 size={16} className="animate-spin" /> Wait...</> : <><Download size={16} /> Download</>}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Right Panel: Live Preview */}
                <section
                    className={`
            bg-slate-100 overflow-y-auto p-4 sm:p-8 flex items-start justify-center w-full md:w-[55%] lg:w-[60%] xl:w-2/3
            ${mobileView === 'preview' ? 'block' : 'hidden'} md:flex
          `}
                >
                    <TemplateRenderer />
                </section>

            </main>
        </div>
    );
}
