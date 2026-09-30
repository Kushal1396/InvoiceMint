import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { Calculator } from 'lucide-react';

export default function TaxConfig() {
    const { invoiceData, updateField } = useInvoice();
    const { taxConfig, template } = invoiceData;

    if (template === 'rent') return null; // Rent receipts generally do not have tax/discount

    const handleTaxChange = (field, value) => {
        updateField('taxConfig', { ...taxConfig, [field]: value });
    };

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Calculator size={18} className="text-blue-500" /> Tax & Discount
            </h4>

            <div className="space-y-4">
                {/* Tax Mode Selector */}
                <div>
                    <label className="block text-sm text-slate-600 mb-1">Tax System</label>
                    <select
                        value={taxConfig.mode}
                        onChange={(e) => handleTaxChange('mode', e.target.value)}
                        className="w-full border-slate-300 rounded p-2 border bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                        <option value="none">No Tax</option>
                        <option value="single">Single Tax (VAT/Sales Tax)</option>
                        <option value="india_gst">India GST Mode</option>
                    </select>
                </div>

                {/* Dynamic Tax Fields */}
                {taxConfig.mode !== 'none' && (
                    <div className="grid grid-cols-2 gap-4 p-4 border border-blue-100 bg-blue-50/30 rounded">
                        {taxConfig.mode === 'single' && (
                            <div className="col-span-2 flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs text-slate-500 mb-1">Tax Name (e.g. VAT)</label>
                                    <input
                                        type="text"
                                        value={taxConfig.label}
                                        onChange={(e) => handleTaxChange('label', e.target.value)}
                                        className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs text-slate-500 mb-1">Rate (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={taxConfig.rate}
                                        onChange={(e) => handleTaxChange('rate', parseFloat(e.target.value) || 0)}
                                        className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {taxConfig.mode === 'india_gst' && (
                            <div className="col-span-2 space-y-3">
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gstType"
                                            checked={!taxConfig.isInterState}
                                            onChange={() => handleTaxChange('isInterState', false)}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        Intra-State (CGST + SGST)
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gstType"
                                            checked={taxConfig.isInterState}
                                            onChange={() => handleTaxChange('isInterState', true)}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        Inter-State (IGST)
                                    </label>
                                </div>
                                <div className="w-32">
                                    <label className="block text-xs text-slate-500 mb-1">Total GST Rate (%)</label>
                                    <select
                                        value={taxConfig.rate}
                                        onChange={(e) => handleTaxChange('rate', parseFloat(e.target.value))}
                                        className="w-full border-slate-300 rounded p-2 text-sm border bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="0">0%</option>
                                        <option value="5">5%</option>
                                        <option value="12">12%</option>
                                        <option value="18">18%</option>
                                        <option value="28">28%</option>
                                    </select>
                                </div>
                                {!taxConfig.isInterState && (
                                    <p className="text-xs text-slate-500">
                                        Calculates as {taxConfig.rate / 2 || 0}% CGST and {taxConfig.rate / 2 || 0}% SGST.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Global Discount */}
                <div>
                    <label className="block text-sm text-slate-600 mb-1">Discount Amount</label>
                    <input
                        type="number"
                        min="0"
                        value={invoiceData.discount === 0 ? '' : invoiceData.discount}
                        onChange={(e) => updateField('discount', e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-full border-slate-300 rounded p-2 border focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="0.00"
                    />
                </div>
            </div>
        </div>
    );
}
