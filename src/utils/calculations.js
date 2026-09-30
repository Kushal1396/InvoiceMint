export function calculateTotals(items, taxConfig, discount) {
    // 1. Calculate raw subtotal from items
    const subTotal = items.reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const rate = parseFloat(item.rate) || 0;
        return sum + (qty * rate);
    }, 0);

    // 2. Apply discount if any (assuming flat monetary discount for simplicity here, or percentage if built-in)
    const discountAmount = parseFloat(discount) || 0;
    const taxableAmount = Math.max(0, subTotal - discountAmount);

    // 3. Tax Calculations
    let totalTax = 0;
    let taxBreakdown = [];

    const taxRate = parseFloat(taxConfig.rate) || 0;

    if (taxConfig.mode === 'single') {
        totalTax = taxableAmount * (taxRate / 100);
        taxBreakdown.push({ label: taxConfig.label || 'Tax', amount: totalTax, rate: taxRate });
    } else if (taxConfig.mode === 'india_gst') {
        if (taxConfig.isInterState) {
            // IGST (Full rate)
            totalTax = taxableAmount * (taxRate / 100);
            taxBreakdown.push({ label: 'IGST', amount: totalTax, rate: taxRate });
        } else {
            // CGST + SGST (Split rate)
            const halfTax = taxableAmount * ((taxRate / 2) / 100);
            totalTax = halfTax * 2;
            taxBreakdown.push({ label: 'CGST', amount: halfTax, rate: taxRate / 2 });
            taxBreakdown.push({ label: 'SGST', amount: halfTax, rate: taxRate / 2 });
        }
    }

    const grandTotal = taxableAmount + totalTax;

    return {
        subTotal,
        discountAmount,
        taxableAmount,
        totalTax,
        taxBreakdown,
        grandTotal
    };
}
