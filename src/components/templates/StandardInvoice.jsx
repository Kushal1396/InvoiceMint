import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { calculateTotals } from '../../utils/calculations';
import { numberToWords } from '../../utils/numberToWords';

export default function StandardInvoice() {
    const { invoiceData } = useInvoice();

    // Compute totals
    const totals = calculateTotals(invoiceData.items, invoiceData.taxConfig, invoiceData.discount);

    // Format currency helper
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: invoiceData.currency || 'USD' }).format(amount);
    };

    return (
        <div className="w-full h-full bg-white text-slate-800 flex flex-col font-sans text-[11px] leading-relaxed">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">{invoiceData.sender.name || 'Your Business Name'}</h2>
                    <p className="whitespace-pre-wrap text-slate-600">{invoiceData.sender.address}</p>
                    {invoiceData.sender.email && <p className="text-slate-600 mt-1">{invoiceData.sender.email}</p>}
                    {invoiceData.sender.phone && <p className="text-slate-600 mt-1">{invoiceData.sender.phone}</p>}
                    {invoiceData.sender.taxId && <p className="text-slate-600 font-semibold mt-1">{invoiceData.sender.taxIdLabel || 'Tax ID'}: {invoiceData.sender.taxId}</p>}
                </div>
                <div className="text-right">
                    <h1 className="text-4xl font-light text-slate-300 tracking-widest mb-4">INVOICE</h1>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex justify-between w-40">
                            <span className="font-semibold text-slate-600">Invoice No:</span>
                            <span>{invoiceData.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-between w-40">
                            <span className="font-semibold text-slate-600">Date:</span>
                            <span>{invoiceData.date}</span>
                        </div>
                        {invoiceData.dueDate && (
                            <div className="flex justify-between w-40">
                                <span className="font-semibold text-slate-600">Due Date:</span>
                                <span>{invoiceData.dueDate}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 inline-block pr-6 pb-1">BILL TO:</h3>
                <p className="font-semibold text-base">{invoiceData.receiver.name || 'Client Name'}</p>
                <p className="whitespace-pre-wrap text-slate-600">{invoiceData.receiver.address || 'Client Address'}</p>
                {invoiceData.receiver.email && <p className="text-slate-600 mt-1">{invoiceData.receiver.email}</p>}
                {invoiceData.receiver.phone && <p className="text-slate-600 mt-1">{invoiceData.receiver.phone}</p>}
                {invoiceData.receiver.taxId && <p className="text-slate-600 font-semibold mt-1">{invoiceData.receiver.taxIdLabel || 'Tax ID'}: {invoiceData.receiver.taxId}</p>}
            </div>

            {/* Line Items Table */}
            <table className="w-full mb-8 text-left border-collapse">
                <thead>
                    <tr className="bg-slate-800 text-white text-xs">
                        <th className="py-2 px-3 font-semibold w-12">#</th>
                        <th className="py-2 px-3 font-semibold border-l border-slate-700">Description</th>
                        {invoiceData.taxConfig.mode === 'india_gst' && <th className="py-2 px-3 font-semibold border-l border-slate-700 w-24">HSN/SAC</th>}
                        <th className="py-2 px-3 font-semibold border-l border-slate-700 text-right w-20">Qty</th>
                        <th className="py-2 px-3 font-semibold border-l border-slate-700 text-right w-24">Rate</th>
                        <th className="py-2 px-3 font-semibold border-l border-slate-700 text-right w-28">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceData.items.map((item, idx) => (
                        <tr key={item.id} className="border-b border-slate-200">
                            <td className="py-3 px-3 text-slate-500">{idx + 1}</td>
                            <td className="py-3 px-3 font-medium">{item.description || 'Item Description'}</td>
                            {invoiceData.taxConfig.mode === 'india_gst' && <td className="py-3 px-3 text-slate-500">{item.hsnSac}</td>}
                            <td className="py-3 px-3 text-right text-slate-600">{item.quantity}</td>
                            <td className="py-3 px-3 text-right text-slate-600">{formatCurrency(item.rate)}</td>
                            <td className="py-3 px-3 text-right font-medium text-slate-800">{formatCurrency(item.quantity * item.rate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals Section */}
            <div className="flex justify-end mb-8">
                <div className="w-72">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="font-semibold text-slate-600">Subtotal:</span>
                        <span>{formatCurrency(totals.subTotal)}</span>
                    </div>

                    {totals.discountAmount > 0 && (
                        <div className="flex justify-between py-1.5 border-b border-slate-100 text-red-600">
                            <span className="font-semibold">Discount:</span>
                            <span>-{formatCurrency(totals.discountAmount)}</span>
                        </div>
                    )}

                    {totals.taxBreakdown.map((tax, i) => (
                        <div key={i} className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                            <span className="font-semibold">{tax.label} ({tax.rate}%):</span>
                            <span>{formatCurrency(tax.amount)}</span>
                        </div>
                    ))}

                    <div className="flex justify-between py-3 mt-2 border-t-2 border-slate-800 bg-slate-50 px-3">
                        <span className="font-bold text-sm">Grand Total:</span>
                        <span className="font-bold text-sm text-slate-900">{formatCurrency(totals.grandTotal)}</span>
                    </div>
                </div>
            </div>

            {/* Amount in words */}
            <div className="mb-8">
                <span className="font-semibold text-slate-600 border-b border-slate-200 pb-1">Amount in Words:</span>
                <p className="mt-2 text-slate-800 italic capitalize">
                    {numberToWords(totals.grandTotal, invoiceData.taxConfig.mode === 'india_gst')} {invoiceData.currency} Only
                </p>
            </div>

            {/* Footer Notes */}
            <div className="mt-auto border-t border-slate-200 pt-6">
                <div className="grid grid-cols-2 gap-8 text-slate-600">
                    <div>
                        <span className="font-semibold text-slate-800 block mb-1">Notes:</span>
                        <p className="whitespace-pre-wrap">{invoiceData.notes || 'Thank you for your business.'}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-slate-800 block mb-1">Terms & Conditions:</span>
                        <p className="whitespace-pre-wrap">{invoiceData.terms || 'Payment is due within 30 days.'}</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
