    
class TemplateProfitLossCsv {
    csvContent :string;
    constructor(data:{user:any, items:any[], filter:any}) {
        this.csvContent = '';
        const user = data.user;
        const filter = data.filter;
        const items = data.items ? data.items : [];
        this.csvContent += this.generateHeader(user.fullName, user.abnCode, filter);
        this.csvContent += this.render(items);
    }

    renderCsvContent() {
        return this.csvContent;
    }

    render(items) {
        let data = '';
        items.forEach(item => {
            if (item.isNotHeader)
                data += this.renderIsNotHeader(item);
            else
                data += this.renderItem(item);
        });
        return data;
    }
    renderIsNotHeader(item) {
        const name = item.name ? item.name : '';
        const total = item.total ? item.total : 0;
        let data = '';
        data += `"${name}",\n`;
        data += `"${name}",${total}\n`;
        return data;
    }

    renderItem(item) {
        const name = item.name ? item.name : '';
        const total = item.total ? item.total : 0;
        let data = '';
        data += `"${name}",\n`;
        if (item.items && Array.isArray(item.items))
            item.items.forEach(element => {
                data += this.renderItem(element);
            });

        if (item.coas && Array.isArray(item.coas))
            data += this.renderCoas(item.coas);
        let amount = this.convertCurence(total);
        data += `"Total ${name}",${amount},\n`;
        return data;
        
    }

    renderCoas(listCoa) {
        const coas = listCoa && Array.isArray(listCoa) ? listCoa : [];
        let data = '';
        coas.forEach(coa => {
            const coaName = coa.name ? coa.name : '';
            const coaTotal = coa.total ? coa.total : 0;
            data += `"${coaName}",${coaTotal}\n`;
        });
        return data;
    }

    generateHeader(fullName:string, abnCode: string, filter:any) {
        let header = `,,Profit And Loss,\n`;
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

export default TemplateProfitLossCsv;
