
class TemplateGstCsv {
    csvContent :string;
    constructor(template:{user:any, data:{totalGroup:any[], taxCollected:any, taxPaid:any}, filter:any}) {
        this.csvContent = '';
        const user = template.user;
        const filter = template.filter;
        const data = template.data;
        this.csvContent += this.generateHeader(user.fullName, user.abnCode, filter);
        this.csvContent += this.generateContent(data.totalGroup, data.taxCollected, data.taxPaid);
    }

    renderCsvContent() {
        return this.csvContent;
    }

    generateContent(totalGroup:{code: number, name:string, saleValue:number, purchaseValue:number, taxCollected:number, taxPaid:number}[], taxCollected:any, taxPaid) {
        const header = 'Code,Description,Rate,Sale Value,Purchase value,Tax Collected,Tax Paid,\n';
        let body = '';

        const groups = totalGroup ? totalGroup : [];
        groups.forEach(item => {
            const code = item.code === 4400 ? 'FRE' : item.code === 4600 ? 'GST' : item.code === 4700 ? 'N-T' : 'GCA';
            const name = item.name;
            const rate = item.code === 4600 || item.code === 4500 ? '10.00%' : '0.00%';
            const saleValue = parseFloat(item.saleValue.toFixed(2));
            const purchaseValue = parseFloat(item.purchaseValue.toFixed(2));
            const taxCollected = item.code === 4600 || item.code === 4500 ? parseFloat(item.taxCollected.toFixed(2)) : '';
            const taxPaid = item.code === 4600 || item.code === 4500 ? parseFloat(item.taxPaid.toFixed(2)) : '';
            body += `${code},${name},${rate},${saleValue},${purchaseValue},${taxCollected},${taxPaid},\n`;
        });
        const footer = `,,,,Total,${parseFloat(taxCollected.toFixed(2))},${parseFloat(taxPaid.toFixed(2))} \n`;
        return header + body + footer;
    }

    generateHeader(fullName:string, abnCode: string, filter:any) {
        let header = `,,GST [Detail - Cash],\n`;
        header += `,,${fullName},\n`;
        header += `,,ABN: ${abnCode},\n`;
        header += `,,01/${filter.beginMonth < 10 ? '0' + filter.beginMonth : filter.beginMonth}/${filter.beginYear} through ${this.daysInMonth(filter.endMonth, filter.endYear)}/${filter.endMonth < 10 ? '0' + filter.endMonth : filter.endMonth}/${filter.endYear},\n`;
        header += `,,,\n`;
        header += `,,,\n`;
        return header;
    }

    daysInMonth(month:number, year:number) {
        return new Date(year, month, 0).getDate();
    }
}

export default TemplateGstCsv;
