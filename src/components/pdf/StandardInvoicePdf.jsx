import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { calculateTotals } from '../../utils/calculations';
import { numberToWords } from '../../utils/numberToWords';

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 9, fontFamily: 'Helvetica', color: '#1e293b' },
    header: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#1e293b', paddingBottom: 16, marginBottom: 16 },
    senderName: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#0f172a', marginBottom: 2 },
    lightText: { color: '#64748b', marginBottom: 1 },
    boldText: { fontFamily: 'Helvetica-Bold' },
    invoiceTitle: { fontSize: 28, color: '#cbd5e1', letterSpacing: 4, marginBottom: 8, textAlign: 'right' },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', width: 140, marginBottom: 2 },
    metaLabel: { fontFamily: 'Helvetica-Bold', color: '#64748b' },
    billTo: { marginBottom: 20 },
    billToLabel: { fontFamily: 'Helvetica-Bold', color: '#0f172a', marginBottom: 4, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 2, paddingRight: 20, alignSelf: 'flex-start' },
    clientName: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
    table: { marginBottom: 20 },
    tableHeader: { flexDirection: 'row', backgroundColor: '#1e293b', color: '#ffffff', paddingVertical: 6, paddingHorizontal: 8 },
    tableHeaderCell: { fontFamily: 'Helvetica-Bold', fontSize: 8 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 8, paddingHorizontal: 8 },
    colNum: { width: '6%' },
    colDesc: { width: '40%' },
    colHsn: { width: '14%' },
    colQty: { width: '12%', textAlign: 'right' },
    colRate: { width: '14%', textAlign: 'right' },
    colAmt: { width: '14%', textAlign: 'right' },
    colDescWide: { width: '54%' },
    totalsContainer: { alignItems: 'flex-end', marginBottom: 20 },
    totalsBox: { width: 220 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, marginTop: 4, borderTopWidth: 2, borderTopColor: '#1e293b', backgroundColor: '#f8fafc', paddingHorizontal: 8 },
    grandTotalText: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
    wordsSection: { marginBottom: 20 },
    wordsLabel: { fontFamily: 'Helvetica-Bold', color: '#64748b', marginBottom: 4 },
    wordsText: { fontStyle: 'italic', color: '#1e293b' },
    footer: { marginTop: 'auto', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 16, flexDirection: 'row', gap: 30 },
    footerCol: { flex: 1 },
    footerLabel: { fontFamily: 'Helvetica-Bold', color: '#0f172a', marginBottom: 4, fontSize: 8 },
    footerText: { color: '#64748b', fontSize: 8 },
    redText: { color: '#dc2626' }
});

const fmt = (amount, currency) => {
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
    } catch { return `${currency} ${Number(amount).toFixed(2)}`; }
};

export default function StandardInvoicePdf({ data }) {
    const totals = calculateTotals(data.items, data.taxConfig, data.discount);
    const cur = data.currency || 'USD';
    const showHsn = data.taxConfig.mode === 'india_gst';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.senderName}>{data.sender.name || 'Your Business Name'}</Text>
                        <Text style={styles.lightText}>{data.sender.address}</Text>
                        {data.sender.email ? <Text style={styles.lightText}>{data.sender.email}</Text> : null}
                        {data.sender.phone ? <Text style={styles.lightText}>{data.sender.phone}</Text> : null}
                        {data.sender.taxId ? <Text style={[styles.lightText, styles.boldText]}>{data.sender.taxIdLabel || 'Tax ID'}: {data.sender.taxId}</Text> : null}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <View style={styles.metaRow}><Text style={styles.metaLabel}>Invoice No:</Text><Text>{data.invoiceNumber}</Text></View>
                        <View style={styles.metaRow}><Text style={styles.metaLabel}>Date:</Text><Text>{data.date}</Text></View>
                        {data.dueDate ? <View style={styles.metaRow}><Text style={styles.metaLabel}>Due Date:</Text><Text>{data.dueDate}</Text></View> : null}
                    </View>
                </View>

                {/* Bill To */}
                <View style={styles.billTo}>
                    <Text style={styles.billToLabel}>BILL TO:</Text>
                    <Text style={styles.clientName}>{data.receiver.name || 'Client Name'}</Text>
                    <Text style={styles.lightText}>{data.receiver.address || 'Client Address'}</Text>
                    {data.receiver.email ? <Text style={styles.lightText}>{data.receiver.email}</Text> : null}
                    {data.receiver.phone ? <Text style={styles.lightText}>{data.receiver.phone}</Text> : null}
                    {data.receiver.taxId ? <Text style={[styles.lightText, styles.boldText]}>{data.receiver.taxIdLabel || 'Tax ID'}: {data.receiver.taxId}</Text> : null}
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, styles.colNum]}>#</Text>
                        <Text style={[styles.tableHeaderCell, showHsn ? styles.colDesc : styles.colDescWide]}>Description</Text>
                        {showHsn && <Text style={[styles.tableHeaderCell, styles.colHsn]}>HSN/SAC</Text>}
                        <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
                        <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate</Text>
                        <Text style={[styles.tableHeaderCell, styles.colAmt]}>Amount</Text>
                    </View>
                    {data.items.map((item, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={styles.colNum}>{idx + 1}</Text>
                            <Text style={showHsn ? styles.colDesc : styles.colDescWide}>{item.description || 'Item'}</Text>
                            {showHsn && <Text style={[styles.colHsn, styles.lightText]}>{item.hsnSac}</Text>}
                            <Text style={[styles.colQty, styles.lightText]}>{item.quantity}</Text>
                            <Text style={[styles.colRate, styles.lightText]}>{fmt(item.rate, cur)}</Text>
                            <Text style={[styles.colAmt, styles.boldText]}>{fmt(item.quantity * item.rate, cur)}</Text>
                        </View>
                    ))}
                </View>

                {/* Totals */}
                <View style={styles.totalsContainer}>
                    <View style={styles.totalsBox}>
                        <View style={styles.totalRow}><Text style={[styles.boldText, styles.lightText]}>Subtotal:</Text><Text>{fmt(totals.subTotal, cur)}</Text></View>
                        {totals.discountAmount > 0 && <View style={styles.totalRow}><Text style={[styles.boldText, styles.redText]}>Discount:</Text><Text style={styles.redText}>-{fmt(totals.discountAmount, cur)}</Text></View>}
                        {totals.taxBreakdown.map((tax, i) => (
                            <View key={i} style={styles.totalRow}><Text style={[styles.boldText, styles.lightText]}>{tax.label} ({tax.rate}%):</Text><Text>{fmt(tax.amount, cur)}</Text></View>
                        ))}
                        <View style={styles.grandTotalRow}><Text style={styles.grandTotalText}>Grand Total:</Text><Text style={styles.grandTotalText}>{fmt(totals.grandTotal, cur)}</Text></View>
                    </View>
                </View>

                {/* Amount in words */}
                <View style={styles.wordsSection}>
                    <Text style={styles.wordsLabel}>Amount in Words:</Text>
                    <Text style={styles.wordsText}>{numberToWords(totals.grandTotal, data.taxConfig.mode === 'india_gst')} {cur} Only</Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerCol}><Text style={styles.footerLabel}>Notes:</Text><Text style={styles.footerText}>{data.notes || 'Thank you for your business.'}</Text></View>
                    <View style={styles.footerCol}><Text style={styles.footerLabel}>Terms & Conditions:</Text><Text style={styles.footerText}>{data.terms || 'Payment is due within 30 days.'}</Text></View>
                </View>
            </Page>
        </Document>
    );
}
