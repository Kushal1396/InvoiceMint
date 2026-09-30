export function numberToWords(num, isIndianSystem = false) {
    if (num === 0) return "Zero";
    if (!num || isNaN(num)) return "";

    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convertLessThanOneThousand = (n) => {
        let str = "";
        if (n > 99) {
            str += a[Math.floor(n / 100)] + 'Hundred ';
            n %= 100;
        }
        if (n > 19) {
            str += b[Math.floor(n / 10)] + ' ';
            n %= 10;
        }
        if (n > 0) {
            str += a[n];
        }
        return str.trim();
    };

    let str = "";
    const numParsed = Math.floor(num); // Ensure integer

    if (isIndianSystem) {
        if (numParsed > 999999999) return "Amount too large";
        const crore = Math.floor(numParsed / 10000000);
        const lakh = Math.floor((numParsed % 10000000) / 100000);
        const thousand = Math.floor((numParsed % 100000) / 1000);
        const remainder = numParsed % 1000;

        if (crore > 0) { str += convertLessThanOneThousand(crore) + " Crore "; }
        if (lakh > 0) { str += convertLessThanOneThousand(lakh) + " Lakh "; }
        if (thousand > 0) { str += convertLessThanOneThousand(thousand) + " Thousand "; }
        if (remainder > 0) { str += convertLessThanOneThousand(remainder); }
    } else {
        if (numParsed > 999999999999) return "Amount too large";
        const billion = Math.floor(numParsed / 1000000000);
        const million = Math.floor((numParsed % 1000000000) / 1000000);
        const thousand = Math.floor((numParsed % 1000000) / 1000);
        const remainder = numParsed % 1000;

        if (billion > 0) { str += convertLessThanOneThousand(billion) + " Billion "; }
        if (million > 0) { str += convertLessThanOneThousand(million) + " Million "; }
        if (thousand > 0) { str += convertLessThanOneThousand(thousand) + " Thousand "; }
        if (remainder > 0) { str += convertLessThanOneThousand(remainder); }
    }

    return str.trim();
}
