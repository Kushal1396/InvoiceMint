import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { calculateTotals } from '../../utils/calculations';
import { numberToWords } from '../../utils/numberToWords';

export default function RentReceipt() {
    const { invoiceData } = useInvoice();
    const totals = calculateTotals(invoiceData.items, invoiceData.taxConfig, invoiceData.discount);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: invoiceData.currency || 'USD' }).format(amount);
    };

    return (
        <div className="w-full h-full bg-white text-slate-800 font-serif border-[8px] border-slate-100 p-8 flex flex-col relative">
            <div className="absolute top-8 right-8 text-slate-300 font-sans tracking-widest text-2xl font-bold opacity-30 uppercase">
                Original
            </div>

            <div className="text-center mb-10 border-b pb-4">
                <h1 className="text-3xl font-bold text-slate-900 uppercase">Rent Receipt</h1>
                <p className="text-slate-500 mt-2 font-sans tracking-widest text-sm">RECEIPT NO: {invoiceData.invoiceNumber}</p>
            </div>

            <div className="flex justify-between mb-8 font-sans text-sm font-semibold">
                <p>Date: <span className="underline underline-offset-4 decoration-slate-300 ml-2 font-normal">{invoiceData.date}</span></p>
            </div>

            <div className="space-y-8 text-lg leading-10">
                <p>
                    Received with thanks from <span className="font-semibold underline underline-offset-4 decoration-slate-300 mx-2">{invoiceData.receiver.name || 'Tenant Name'}</span>
                </p>
                <p>
                    the sum of Rupees/Amount <span className="font-semibold underline underline-offset-4 decoration-slate-300 mx-2">{numberToWords(totals.grandTotal, true)} Only</span>
                </p>
                <div className="flex items-center gap-4">
                    <span>By Cash / Cheque / Transfer:</span>
                    <span className="flex-1 border-b border-dashed border-slate-400"></span>
                </div>
                <p>
                    towards the rent of property located at:
                </p>
                <p className="font-semibold underline underline-offset-4 decoration-slate-300">
                    {invoiceData.notes || 'Property Address'}
                </p>
                <div className="flex items-center gap-4">
                    <span>For the renting period:</span>
                    <span className="flex-1 border-b border-slate-400 font-semibold text-center">{invoiceData.items[0]?.description || 'Month of...'}</span>
                </div>
            </div>

            <div className="mt-20 flex justify-between items-end">
                <div className="bg-slate-50 border border-slate-300 px-6 py-4 font-bold text-2xl font-sans rounded shadow-sm">
                    {formatCurrency(totals.grandTotal)}
                </div>

                <div className="text-center">
                    <div className="w-48 border-t border-slate-800 border-dashed pt-2">
                        <p className="font-semibold">{invoiceData.sender.name || 'Landlord Signature'}</p>
                        {invoiceData.sender.taxId && <p className="text-xs font-sans text-slate-500 mt-1">PAN: {invoiceData.sender.taxId}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
