import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { calculateTotals } from '../../utils/calculations';

const s = StyleSheet.create({
    page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1e293b' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 },
    title: { fontSize: 32, fontFamily: 'Helvetica-Bold', color: '#1e293b', marginBottom: 4 },
    invNum: { color: '#64748b', fontFamily: 'Helvetica-Bold' },
    senderName: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#0f172a', marginBottom: 2 },
    light: { color: '#64748b', fontSize: 9, marginBottom: 1 },
    grid: { flexDirection: 'row', gap: 40, marginBottom: 30 },
    gridCol: { flex: 1 },
    sectionLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
    clientName: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 4 },
    detailLabel: { color: '#64748b' },
    detailValue: { fontFamily: 'Helvetica-Bold' },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#e2e8f0', paddingBottom: 8, marginBottom: 4 },
    th: { fontFamily: 'Helvetica-Bold', color: '#475569', fontSize: 9 },
    tr: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    colDesc: { width: '50%' },
    colQty: { width: '15%', textAlign: 'right' },
    colRate: { width: '17%', textAlign: 'right' },
    colTotal: { width: '18%', textAlign: 'right' },
    totalsWrap: { alignItems: 'flex-end', marginTop: 20, marginBottom: 40 },
    totalsBox: { width: 240 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    grandRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#e2e8f0', marginTop: 6 },
    grandText: { fontSize: 14, fontFamily: 'Helvetica-Bold' },
    footer: { marginTop: 'auto', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 16 },
    footerLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
    footerText: { color: '#64748b', fontSize: 8 }
});

const fmt = (amount, currency) => {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount); }
    catch { return `${currency} ${Number(amount).toFixed(2)}`; }
};

export default function FreelanceInvoicePdf({ data }) {
    const totals = calculateTotals(data.items, data.taxConfig, data.discount);
    const cur = data.currency || 'USD';

    return (
        <Document>
            <Page size="A4" style={s.page}>
                <View style={s.headerRow}>
                    <View>
                        <Text style={s.title}>Invoice</Text>
                        <Text style={s.invNum}>{data.invoiceNumber}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={s.senderName}>{data.sender.name || 'Your Name'}</Text>
                        <Text style={s.light}>{data.sender.address}</Text>
                        {data.sender.email ? <Text style={s.light}>{data.sender.email}</Text> : null}
                        {data.sender.phone ? <Text style={s.light}>{data.sender.phone}</Text> : null}
                    </View>
                </View>

                <View style={s.grid}>
                    <View style={s.gridCol}>
                        <Text style={s.sectionLabel}>Billed To</Text>
                        <Text style={s.clientName}>{data.receiver.name || 'Client Name'}</Text>
                        <Text style={s.light}>{data.receiver.address}</Text>
                        {data.receiver.email ? <Text style={s.light}>{data.receiver.email}</Text> : null}
                        {data.receiver.phone ? <Text style={s.light}>{data.receiver.phone}</Text> : null}
                    </View>
                    <View style={s.gridCol}>
                        <Text style={s.sectionLabel}>Invoice Details</Text>
                        <View style={s.detailRow}><Text style={s.detailLabel}>Date of Issue</Text><Text style={s.detailValue}>{data.date}</Text></View>
                        <View style={s.detailRow}><Text style={s.detailLabel}>Due Date</Text><Text style={s.detailValue}>{data.dueDate}</Text></View>
                    </View>
                </View>

                {/* Table */}
                <View style={s.tableHeader}>
                    <Text style={[s.th, s.colDesc]}>Service Description</Text>
                    <Text style={[s.th, s.colQty]}>Hours/Qty</Text>
                    <Text style={[s.th, s.colRate]}>Rate</Text>
                    <Text style={[s.th, s.colTotal]}>Total</Text>
                </View>
                {data.items.map((item, idx) => (
                    <View key={idx} style={s.tr}>
                        <Text style={s.colDesc}>{item.description || 'Consulting Services'}</Text>
                        <Text style={[s.colQty, s.light]}>{item.quantity}</Text>
                        <Text style={[s.colRate, s.light]}>{fmt(item.rate, cur)}</Text>
                        <Text style={[s.colTotal, { fontFamily: 'Helvetica-Bold' }]}>{fmt(item.quantity * item.rate, cur)}</Text>
                    </View>
                ))}

                {/* Totals */}
                <View style={s.totalsWrap}>
                    <View style={s.totalsBox}>
                        <View style={s.totalRow}><Text style={s.light}>Subtotal</Text><Text>{fmt(totals.subTotal, cur)}</Text></View>
                        {totals.taxBreakdown.map((tax, i) => (
                            <View key={i} style={s.totalRow}><Text style={s.light}>{tax.label}</Text><Text>{fmt(tax.amount, cur)}</Text></View>
                        ))}
                        <View style={s.grandRow}><Text style={s.grandText}>Amount Due</Text><Text style={s.grandText}>{fmt(totals.grandTotal, cur)}</Text></View>
                    </View>
                </View>

                <View style={s.footer}>
                    <Text style={s.footerLabel}>Payment Info</Text>
                    <Text style={s.footerText}>{data.notes || 'Please pay via wire transfer to...'}</Text>
                </View>
            </Page>
        </Document>
    );
}
