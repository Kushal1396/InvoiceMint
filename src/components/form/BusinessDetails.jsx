import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { Building2, UserCircle2, Settings2 } from 'lucide-react';

export default function BusinessDetails() {
    const { invoiceData, updateNestedField, updateField } = useInvoice();

    const handleSenderChange = (e) => {
        updateNestedField('sender', e.target.name, e.target.value);
    };

    const handleReceiverChange = (e) => {
        updateNestedField('receiver', e.target.name, e.target.value);
    };

    const topCurrencies = [
        { code: 'USD', label: 'US Dollar ($)' },
        { code: 'EUR', label: 'Euro (€)' },
        { code: 'GBP', label: 'British Pound (£)' },
        { code: 'INR', label: 'Indian Rupee (₹)' },
        { code: 'AUD', label: 'Australian Dollar (A$)' },
        { code: 'CAD', label: 'Canadian Dollar (C$)' },
        { code: 'JPY', label: 'Japanese Yen (¥)' },
        { code: 'AED', label: 'UAE Dirham (د.إ)' },
        { code: 'ZAR', label: 'South African Rand (R)' },
        { code: 'CNY', label: 'Chinese Yuan (¥)' }
    ];

    return (
        <div className="space-y-6">
            {/* Template & Currency Selector */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-2">
                            <Settings2 size={16} /> Select Template Style
                        </label>
                        <select
                            value={invoiceData.template || 'standard'}
                            onChange={(e) => updateField('template', e.target.value)}
                            className="w-full border-blue-300 bg-white rounded p-2 text-sm border text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
                        >
                            <option value="standard">Standard Tax Invoice</option>
                            <option value="freelance">Freelance / Service</option>
                            <option value="rent">Rent Receipt</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-blue-900 mb-2">Currency</label>
                        <select
                            value={invoiceData.currency || 'USD'}
                            onChange={(e) => updateField('currency', e.target.value)}
                            className="w-full border-blue-300 bg-white rounded p-2 text-sm border text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
                        >
                            {topCurrencies.map(c => (
                                <option key={c.code} value={c.code}>{c.code} - {c.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Sender Info (Your Business) */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Building2 size={18} className="text-blue-500" /> {invoiceData.template === 'rent' ? 'Landlord Details' : 'Billed By (Your Details)'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm text-slate-600 mb-1">{invoiceData.template === 'rent' ? 'Landlord Name' : 'Business/Your Name'}</label>
                        <input type="text" name="name" value={invoiceData.sender.name} onChange={handleSenderChange} className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none" placeholder={invoiceData.template === 'rent' ? 'Jane Doe' : 'Acme Corp'} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm text-slate-600 mb-1">Address</label>
                        <textarea name="address" value={invoiceData.sender.address} onChange={handleSenderChange} className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none h-20" placeholder="123 Street Name" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Email <span className="text-slate-400 text-xs">(Optional)</span></label>
                        <input type="email" name="email" value={invoiceData.sender.email} onChange={handleSenderChange} className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Phone <span className="text-slate-400 text-xs">(Optional)</span></label>
                        <input type="text" name="phone" value={invoiceData.sender.phone} onChange={handleSenderChange} className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none" placeholder="+1..." />
                    </div>
                    <div className="col-span-2 grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                            <label className="block text-sm text-slate-600 mb-1">ID Type</label>
                            <input type="text" name="taxIdLabel" value={invoiceData.sender.taxIdLabel || 'Tax ID'} onChange={handleSenderChange} className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none" placeholder="GSTIN/PAN/Tax ID" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm text-slate-600 mb-1">ID Number <span className="text-slate-400 text-xs">(Optional)</span></label>
                            <input type="text" name="taxId" value={invoiceData.sender.taxId} onChange={handleSenderChange} className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Receiver Info (Client) */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <UserCircle2 size={18} className="text-blue-500" /> {invoiceData.template === 'rent' ? 'Tenant Details' : 'Billed To (Client Details)'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm text-slate-600 mb-1">{invoiceData.template === 'rent' ? 'Tenant Name' : 'Client Name'}</label>
                        <input type="text" name="name" value={invoiceData.receiver.name} onChange={handleReceiverChange} className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Client Name" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm text-slate-600 mb-1">{invoiceData.template === 'rent' ? 'Tenant Address' : 'Client Address'}</label>
                        <textarea name="address" value={invoiceData.receiver.address} onChange={handleReceiverChange} className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none h-20" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Email <span className="text-slate-400 text-xs">(Optional)</span></label>
                        <input type="email" name="email" value={invoiceData.receiver.email} onChange={handleReceiverChange} className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none" placeholder="client@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Phone <span className="text-slate-400 text-xs">(Optional)</span></label>
                        <input type="text" name="phone" value={invoiceData.receiver.phone} onChange={handleReceiverChange} className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none" placeholder="+1..." />
                    </div>
                    <div className="col-span-2 grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                            <label className="block text-sm text-slate-600 mb-1">ID Type</label>
                            <input type="text" name="taxIdLabel" value={invoiceData.receiver.taxIdLabel || 'Tax ID'} onChange={handleReceiverChange} className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none" placeholder="GSTIN/PAN/Tax ID" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm text-slate-600 mb-1">ID Number <span className="text-slate-400 text-xs">(Optional)</span></label>
                            <input type="text" name="taxId" value={invoiceData.receiver.taxId} onChange={handleReceiverChange} className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
