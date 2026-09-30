import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { calculateTotals } from '../../utils/calculations';

export default function FreelanceInvoice() {
    const { invoiceData } = useInvoice();
    const totals = calculateTotals(invoiceData.items, invoiceData.taxConfig, invoiceData.discount);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: invoiceData.currency || 'USD' }).format(amount);
    };

    return (
        <div className="w-full h-full bg-white text-slate-800 flex flex-col font-sans text-sm">
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h1 className="text-5xl font-semibold text-slate-800 tracking-tight mb-2">Invoice</h1>
                    <p className="text-slate-500 font-medium">{invoiceData.invoiceNumber}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-semibold text-slate-900">{invoiceData.sender.name || 'Your Name'}</h2>
                    <p className="text-slate-500 whitespace-pre-wrap mb-1">{invoiceData.sender.address}</p>
                    {invoiceData.sender.email && <p className="text-slate-500 text-xs">{invoiceData.sender.email}</p>}
                    {invoiceData.sender.phone && <p className="text-slate-500 text-xs">{invoiceData.sender.phone}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Billed To</h3>
                    <p className="font-semibold text-base">{invoiceData.receiver.name || 'Client Name'}</p>
                    <p className="text-slate-600 whitespace-pre-wrap mb-1">{invoiceData.receiver.address}</p>
                    {invoiceData.receiver.email && <p className="text-slate-600 text-xs">{invoiceData.receiver.email}</p>}
                    {invoiceData.receiver.phone && <p className="text-slate-600 text-xs">{invoiceData.receiver.phone}</p>}
                </div>
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Invoice Details</h3>
                    <div className="flex justify-between border-b border-slate-100 py-1">
                        <span className="text-slate-500">Date of Issue</span>
                        <span className="font-medium">{invoiceData.date}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-1 mt-1">
                        <span className="text-slate-500">Due Date</span>
                        <span className="font-medium">{invoiceData.dueDate}</span>
                    </div>
                </div>
            </div>

            <table className="w-full mb-12">
                <thead>
                    <tr className="border-b-2 border-slate-200">
                        <th className="text-left font-semibold text-slate-700 pb-3">Service Description</th>
                        <th className="text-right font-semibold text-slate-700 pb-3">Hours/Qty</th>
                        <th className="text-right font-semibold text-slate-700 pb-3">Rate</th>
                        <th className="text-right font-semibold text-slate-700 pb-3">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {invoiceData.items.map((item, idx) => (
                        <tr key={item.id}>
                            <td className="py-4 text-slate-700">{item.description || 'Consulting Services'}</td>
                            <td className="py-4 text-right text-slate-500">{item.quantity}</td>
                            <td className="py-4 text-right text-slate-500">{formatCurrency(item.rate)}</td>
                            <td className="py-4 text-right font-medium text-slate-800">{formatCurrency(item.quantity * item.rate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end mb-16">
                <div className="w-80 space-y-3">
                    <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>{formatCurrency(totals.subTotal)}</span>
                    </div>
                    {totals.taxBreakdown.map((tax, i) => (
                        <div key={i} className="flex justify-between text-slate-600">
                            <span>{tax.label}</span>
                            <span>{formatCurrency(tax.amount)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between text-xl font-semibold text-slate-900 pt-4 border-t border-slate-200 mt-2">
                        <span>Amount Due</span>
                        <span>{formatCurrency(totals.grandTotal)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-auto border-t border-slate-200 pt-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Info</h3>
                <p className="text-slate-600 whitespace-pre-wrap">{invoiceData.notes || 'Please pay via wire transfer to...'}</p>
            </div>
        </div>
    );
}
