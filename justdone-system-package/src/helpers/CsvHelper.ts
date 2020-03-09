import {ErrorCommon} from '../app/model/common/Error';

export default class CsvHelper {
    constructor() {
    }

    private static getTitleRow() {
        return 'Date,Title,Debit,Credit,Balance\r\n';
    }

    private static getUniqueCoa(expenseTransactions) {
        let result : any = [];
        expenseTransactions.forEach(item => {
            if (item.coaId) {
                result.push({
                    _id: item.coaId._id,
                    name: item.coaId.name,
                    show: false
                });
            }
        });
        let a : any = result.concat();
        for (let i = 0; i < a.length; ++i) {
            for (let j = i + 1; j < a.length; ++j) {
                if (a[i].name === a[j].name)
                    a.splice(j--, 1);
            }
        }
        a.sort((a, b) => {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
        return a;
    }

    private static getDataRow(transaction) {
        let date = transaction.date.getDate() + '/' + (transaction.date.getMonth() + 1) + '/' + transaction.date.getFullYear();
        let title = transaction.description.original;
        let debit = transaction.baseType === 'DEBIT' ? transaction.amount.amount : '';
        let credit = transaction.baseType === 'CREDIT' ? transaction.amount.amount : '';
        let balance = transaction.runningBalance.amount;
        return date + ',' + title + ',' + debit + ',' + credit + ',' + balance + '\r\n';
    }

    private static calculateTotal(transactions) {
        let result = 0;
        transactions.forEach(t => {
            if (t.baseType === 'DEBIT')
                result -= t.amount.amount;
            else
                result += t.amount.amount;
        });
        return result;
    }

    static createCsvCrunch(cruncher) {
        if (!cruncher || (cruncher.expenses.length === 0) && (cruncher.drawings.length === 0) && (cruncher.income.length === 0) && (cruncher.other.length === 0)) {
            throw new ErrorCommon(102, 'Crunch data');
        }

        let csvContent = '';
        // csvContent += ',,,';
        // csvContent += 'User Name:,' + cruncher.userName + '\r\n';
        csvContent += ',,,';
        csvContent += 'Opening Balance:,' + cruncher.openBalance + '\r\n';
        csvContent += ',,,';
        csvContent += 'Date Created:,' + cruncher.date + '\r\n\r\n';

        csvContent += 'Drawings,,,,' + this.calculateTotal(cruncher.drawings) + '\r\n';
        csvContent += this.getTitleRow();
        cruncher.drawings.forEach(item => {
            csvContent += this.getDataRow(item);
        });

        csvContent += 'Expenses,,,,' + this.calculateTotal(cruncher.expenses) + '\r\n';
        csvContent += this.getTitleRow();
        let uniqueCoas = this.getUniqueCoa(cruncher.expenses);
        uniqueCoas.forEach(coa => {
            csvContent += coa.name + '\r\n';
            cruncher.expenses.forEach(item => {
                if (item && item.coaId && item.coaId.name && item.coaId.name === coa.name) {
                    csvContent += this.getDataRow(item);
                }
            });
        });

        csvContent += 'Incomes,,,,' + this.calculateTotal(cruncher.income) + '\r\n';
        csvContent += this.getTitleRow();
        cruncher.income.forEach(item => {
            csvContent += this.getDataRow(item);
        });

        csvContent += 'Others,,,,' + this.calculateTotal(cruncher.other) + '\r\n';
        csvContent += this.getTitleRow();
        cruncher.other.forEach(item => {
            csvContent += this.getDataRow(item);
        });

        return csvContent;
    }
}
