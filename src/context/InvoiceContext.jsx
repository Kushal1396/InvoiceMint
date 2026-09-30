import React, { createContext, useContext, useState, useEffect } from 'react';

const InvoiceContext = createContext();

const defaultInvoiceState = {
    template: 'standard',
    currency: 'INR',
    documentName: 'Invoice',
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    sender: {
        name: '',
        address: '',
        taxIdLabel: 'Tax ID',
        taxId: '',
        email: '',
        phone: ''
    },
    receiver: {
        name: '',
        address: '',
        taxIdLabel: 'Tax ID',
        taxId: '',
        email: '',
        phone: ''
    },
    items: [
        { id: '1', description: '', hsnSac: '', quantity: 1, rate: 0 }
    ],
    taxConfig: {
        mode: 'none',
        rate: 0,
        label: 'Tax',
        isInterState: false
    },
    discount: 0,
    notes: '',
    terms: ''
};

export const InvoiceProvider = ({ children }) => {
    const [invoiceData, setInvoiceData] = useState(() => {
        try {
            const saved = localStorage.getItem('invoice_draft');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle any new fields added in updates
                return { ...defaultInvoiceState, ...parsed, sender: { ...defaultInvoiceState.sender, ...parsed.sender }, receiver: { ...defaultInvoiceState.receiver, ...parsed.receiver }, taxConfig: { ...defaultInvoiceState.taxConfig, ...parsed.taxConfig } };
            }
        } catch (e) {
            console.warn("Could not load draft", e);
        }
        return defaultInvoiceState;
    });

    useEffect(() => {
        localStorage.setItem('invoice_draft', JSON.stringify(invoiceData));
    }, [invoiceData]);

    const updateField = (field, value) => {
        setInvoiceData(prev => ({ ...prev, [field]: value }));
    };

    const updateNestedField = (parent, field, value) => {
        setInvoiceData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const updateItem = (index, field, value) => {
        setInvoiceData(prev => {
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    const resetInvoice = () => {
        localStorage.removeItem('invoice_draft');
        setInvoiceData({ ...defaultInvoiceState, date: new Date().toISOString().split('T')[0] });
    };

    return (
        <InvoiceContext.Provider value={{
            invoiceData,
            setInvoiceData,
            updateField,
            updateNestedField,
            updateItem,
            resetInvoice
        }}>
            {children}
        </InvoiceContext.Provider>
    );
};

export const useInvoice = () => useContext(InvoiceContext);
