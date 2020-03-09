
class TemplateTrialBalanceCsv {
    csvContent :string;
    constructor(data:{user:any, listCoa:any[], filter:any}) {
        this.csvContent = '';
        const user = data.user;
        const filter = data.filter;
        const items = data.listCoa ? data.listCoa : [];
        this.csvContent += this.generateHeader(user.fullName, user.abnCode, filter);
        this.csvContent += this.renderCoaItem(items);
    }

    renderCsvContent() {
        return this.csvContent;
    }

    renderCoaItem(coas) {
        const listCoa = coas && Array.isArray(coas) ? coas : [];
        let data = '';
        data += `"Account","Debit","Credit","YTD Debit","YTD Credit",\n`;
        let totalMonthlyDebit = 0;
        let totalMonthlyCredit = 0;
        let totalYtdDebit = 0;
        let totalYtdCredit = 0;
        listCoa.forEach(item => {
            const coaName = item.coa && item.coa.name ? item.coa.name : '';
            let countTotalCoaDebit = !item.total.isCredit && item.total.amount ? item.total.amount : 0;
            let countTotalCoaCredit = item.total.isCredit && item.total.amount ? item.total.amount : 0;
            let countTotalYTDDebit = !item.totalYTD.isCredit && item.totalYTD.amount ? item.totalYTD.amount : 0;
            let countTotalYTDCredit = item.totalYTD.isCredit && item.totalYTD.amount ? item.totalYTD.amount : 0;

            totalMonthlyDebit += countTotalCoaDebit || 0;
            totalMonthlyCredit += countTotalCoaCredit || 0;
            totalYtdDebit += countTotalYTDDebit || 0;
            totalYtdCredit += countTotalYTDCredit || 0;

            const totalCoaDebit = this.convertCurence(countTotalCoaDebit);
            const totalCoaCredit = this.convertCurence(countTotalCoaCredit);
            const totalYTDDebit = this.convertCurence(countTotalYTDDebit);
            const totalYTDCredit = this.convertCurence(countTotalYTDCredit);

            data += `"${coaName}",${totalCoaDebit},${totalCoaCredit},${totalYTDDebit},${totalYTDCredit},\n`;
        });
        data += `Total ,${totalMonthlyDebit},${totalMonthlyCredit},${totalYtdDebit},${totalYtdCredit}`;

        return data;
    }

    generateHeader(fullName:string, abnCode: string, filter:any) {
        let header = `,,Trial Balance,\n`;
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

    convertCurence(number: number) {
        return number >= 0 ? `${number.toFixed(2)}` : `(${Math.abs(number).toFixed(2)})`;
    }
}

export default TemplateTrialBalanceCsv;
