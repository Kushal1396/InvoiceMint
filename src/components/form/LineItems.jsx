import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { Trash2, Plus, FileSpreadsheet, ListTodo, FileText } from 'lucide-react';

export default function LineItems() {
    const { invoiceData, setInvoiceData, updateItem, updateField } = useInvoice();

    const handleAddItem = () => {
        setInvoiceData(prev => ({
            ...prev,
            items: [...prev.items, { id: Date.now().toString(), description: '', hsnSac: '', quantity: 1, rate: 0 }]
        }));
    };

    const handleRemoveItem = (index) => {
        setInvoiceData(prev => {
            const newItems = [...prev.items];
            newItems.splice(index, 1);
            return { ...prev, items: newItems.length ? newItems : [{ id: Date.now().toString(), description: '', hsnSac: '', quantity: 1, rate: 0 }] };
        });
    };

    const showHsn = invoiceData.taxConfig.mode === 'india_gst';

    return (
        <div className="space-y-6">
            {/* Invoice Meta Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FileSpreadsheet size={18} className="text-blue-500" /> Invoice Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Invoice Number</label>
                        <input
                            type="text"
                            value={invoiceData.invoiceNumber}
                            onChange={(e) => updateField('invoiceNumber', e.target.value)}
                            className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="INV-001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Invoice Date</label>
                        <input
                            type="date"
                            value={invoiceData.date}
                            onChange={(e) => updateField('date', e.target.value)}
                            className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Due Date <span className="text-slate-400 text-xs">(Optional)</span></label>
                        <input
                            type="date"
                            value={invoiceData.dueDate}
                            onChange={(e) => updateField('dueDate', e.target.value)}
                            className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div>
                <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                    <ListTodo size={18} className="text-blue-500" /> Line Items
                </h4>

                {/* Column labels */}
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium mb-2 px-1">
                    <span className="flex-1 min-w-[200px]">{invoiceData.template === 'rent' ? 'Renting Period / Description' : 'Description'}</span>
                    {showHsn && <span className="w-20">HSN/SAC</span>}
                    {invoiceData.template !== 'rent' && <span className="w-20">Qty</span>}
                    <span className="w-28">{invoiceData.template === 'rent' ? 'Amount' : 'Rate / Price'}</span>
                    <span className="w-8"></span>
                </div>

                <div className="space-y-3">
                    {/* For rent template we only need 1 item. For others, map all */}
                    {(invoiceData.template === 'rent' ? [invoiceData.items[0] || invoiceData.items[1] || { id: 'r1', description: '', rate: 0, quantity: 1 }] : invoiceData.items).map((item, index) => (
                        <div key={item.id || index} className="flex flex-wrap md:flex-nowrap items-start gap-2 bg-slate-50 p-3 rounded border border-slate-200 group">
                            <div className="flex-1 min-w-[200px]">
                                <input
                                    type="text"
                                    placeholder={invoiceData.template === 'rent' ? 'Month of...' : 'Item description...'}
                                    value={item.description}
                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            {showHsn && invoiceData.template !== 'rent' && (
                                <div className="w-20">
                                    <input
                                        type="text"
                                        placeholder="HSN/SAC"
                                        value={item.hsnSac || ''}
                                        onChange={(e) => updateItem(index, 'hsnSac', e.target.value)}
                                        className="w-full p-2 text-sm border border-slate-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            )}
                            {invoiceData.template !== 'rent' && (
                                <div className="w-20">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Qty"
                                        value={item.quantity === 0 ? '' : item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full p-2 text-sm border border-slate-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            )}
                            <div className="w-28">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Amount"
                                    value={item.rate === 0 ? '' : item.rate}
                                    onChange={(e) => updateItem(index, 'rate', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full p-2 text-sm border border-slate-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            {invoiceData.template !== 'rent' && (
                                <button
                                    onClick={() => handleRemoveItem(index)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                                    title="Remove Item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {invoiceData.template !== 'rent' && (
                    <button
                        onClick={handleAddItem}
                        className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded transition-colors mt-3"
                    >
                        <Plus size={16} /> Add Line Item
                    </button>
                )}
            </div>

            {/* Notes & Terms */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-blue-500" /> Notes & Terms
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Notes <span className="text-slate-400 text-xs">(Appears on invoice)</span></label>
                        <textarea
                            value={invoiceData.notes}
                            onChange={(e) => updateField('notes', e.target.value)}
                            className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none h-20"
                            placeholder="Thank you for your business."
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Terms & Conditions <span className="text-slate-400 text-xs">(Optional)</span></label>
                        <textarea
                            value={invoiceData.terms}
                            onChange={(e) => updateField('terms', e.target.value)}
                            className="w-full border-slate-300 rounded p-2 text-sm border focus:ring-1 focus:ring-blue-500 outline-none h-20"
                            placeholder="Payment is due within 30 days."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
