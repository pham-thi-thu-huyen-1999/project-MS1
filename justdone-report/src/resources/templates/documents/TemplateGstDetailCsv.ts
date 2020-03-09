import * as moment from 'moment';
import Transaction from 'justdone-system-package/dest/app/model/transaction/Transaction';// eslint-disable-line

class TemplateGstDetailCsv {
    csvContent :string;
    constructor(data:{user:any, totalGroup:any[], filter:any}) {
        this.csvContent = '';
        const user = data.user;
        const filter = data.filter;
        const totalGroup = data.totalGroup;
        this.csvContent += this.generateHeader(user.fullName, user.abnCode, filter);
        this.csvContent += this.generateContent(totalGroup);
    }

    renderCsvContent() {
        return this.csvContent;
    }

    generateItem(item:{code: number, type:string, name:string, transactions:Transaction[], saleValue:number, purchaseValue:number, taxCollected:number, taxPaid:number}) {
        const title = `${item.name} (${item.type}),\n`;
        const header = 'Date,Code,Name,Rate,Sale Value,Purchase value,Tax Collected,Tax Paid,\n';
        let body = '';
        const type = item.type;

        const transactions = item.transactions ? item.transactions : [];
        transactions.forEach(transaction => {
            let saleValue = transaction.baseType === 'CREDIT' && type === 'GST' ? transaction.amount.amount : transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
            let purchaseValue = transaction.baseType === 'DEBIT' && type === 'GST' ? transaction.amount.amount : transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
            let taxCollected = transaction.baseType === 'CREDIT' && (type === 'GST' || type === 'GCA') ? transaction.amount.amount / 11 : 0;
            let taxPaid = transaction.baseType === 'DEBIT' && (type === 'GST' || type === 'GCA') ? transaction.amount.amount / 11 : 0;
            const date = moment(transaction.date).format('DD/MM/YYYY');
            const description = transaction.description && transaction.description.original ? transaction.description.original : '';
            const rate = type === 'GST' || type === 'GCA' ? '10.00%' : '0.00%';
            saleValue = parseFloat(saleValue.toFixed(2));
            purchaseValue = parseFloat(purchaseValue.toFixed(2));
            taxCollected = parseFloat(taxCollected.toFixed(2));
            taxPaid = parseFloat(taxPaid.toFixed(2));
            const line = `${date},${type},${description},${rate},${saleValue},${purchaseValue},${taxCollected},${taxPaid} \n`;
            body = body + line;
        });
        const footer = `,,,Total,${parseFloat(item.saleValue.toFixed(2))},${parseFloat(item.purchaseValue.toFixed(2))},${parseFloat(item.taxCollected.toFixed(2))},${parseFloat(item.taxPaid.toFixed(2))} \n`;
        return title + header + body + footer;
    }

    generateContent(totalGroup:any[]) {
        let content = '';
        totalGroup.forEach(item => {
            content += this.generateItem(item);
        });
        return content;
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

export default TemplateGstDetailCsv;
