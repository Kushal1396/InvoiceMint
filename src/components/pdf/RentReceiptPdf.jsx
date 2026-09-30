import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { calculateTotals } from '../../utils/calculations';
import { numberToWords } from '../../utils/numberToWords';

const s = StyleSheet.create({
    page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica', color: '#1e293b' },
    watermark: { position: 'absolute', top: 30, right: 30, fontSize: 18, color: '#cbd5e1', letterSpacing: 4, fontFamily: 'Helvetica-Bold', opacity: 0.3 },
    titleSection: { textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#cbd5e1', paddingBottom: 12, marginBottom: 20 },
    title: { fontSize: 22, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: '#0f172a', marginBottom: 4 },
    receiptNum: { fontSize: 9, color: '#64748b', letterSpacing: 3 },
    dateRow: { flexDirection: 'row', marginBottom: 20, fontFamily: 'Helvetica-Bold' },
    light: { color: '#64748b', fontSize: 10, marginBottom: 1 },
    body: { lineHeight: 2.2, fontSize: 12, marginBottom: 20 },
    bold: { fontFamily: 'Helvetica-Bold' },
    underline: { textDecoration: 'underline' },
    dottedLine: { borderBottomWidth: 1, borderBottomColor: '#94a3b8', borderStyle: 'dashed', flex: 1, marginLeft: 8 },
    bodyRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
    amountBox: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', paddingHorizontal: 16, paddingVertical: 10, fontFamily: 'Helvetica-Bold', fontSize: 18 },
    sigLine: { width: 140, borderTopWidth: 1, borderTopColor: '#1e293b', borderStyle: 'dashed', paddingTop: 6, textAlign: 'center' },
    sigName: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
    sigSub: { fontSize: 7, color: '#64748b' },
    bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 50 }
});

const fmt = (amount, currency) => {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount); }
    catch { return `${currency} ${Number(amount).toFixed(2)}`; }
};

export default function RentReceiptPdf({ data }) {
    const totals = calculateTotals(data.items, data.taxConfig, data.discount);
    const cur = data.currency || 'INR';

    return (
        <Document>
            <Page size="A4" style={s.page}>
                <Text style={s.watermark}>ORIGINAL</Text>

                <View style={s.titleSection}>
                    <Text style={s.title}>Rent Receipt</Text>
                    <Text style={s.receiptNum}>RECEIPT NO: {data.invoiceNumber}</Text>
                </View>

                <View style={s.dateRow}>
                    <Text>Date: </Text><Text style={s.underline}> {data.date} </Text>
                </View>

                <View style={s.body}>
                    <Text>Received with thanks from <Text style={s.bold}>{data.receiver.name || 'Tenant Name'}</Text></Text>
                    <Text> </Text>
                    <Text>the sum of <Text style={[s.bold, s.underline]}>{numberToWords(totals.grandTotal, true)} Only</Text></Text>
                    <Text> </Text>
                    <Text>towards the rent of property located at:</Text>
                    <Text style={s.bold}>{data.notes || 'Property Address'}</Text>
                    <Text> </Text>
                    <Text>For the renting period: <Text style={s.bold}>{data.items[0]?.description || 'Month of...'}</Text></Text>
                </View>

                <View style={s.bottomRow}>
                    <Text style={s.amountBox}>{fmt(totals.grandTotal, cur)}</Text>
                    <View style={s.sigLine}>
                        <Text style={s.sigName}>{data.sender.name || 'Landlord Signature'}</Text>
                        {data.sender.taxId ? <Text style={s.sigSub}>PAN: {data.sender.taxId}</Text> : null}
                    </View>
                </View>
            </Page>
        </Document>
    );
}
