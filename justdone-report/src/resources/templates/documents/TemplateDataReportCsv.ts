import * as _ from 'lodash';
import * as Excel from 'exceljs';
const HEADERS = ['Monthly Amount', 'Monthly Percentage', 'YTD Amount', 'YTD Percentage', 'Budget for the Year', 'Budget Percentage', 'Variance'];
enum COLUMN {
    MONTHLYAMOUNT,
    MONTHLYPERCENTAGE,
    YTDAMOUNT,
    YTDPERCENTAGE,
    BUDGETFORTHEYEAR,
    BUDGETPERCENTAGE,
    VARIANCE,
}

export default class TemplateDataReportCsv {
    private workBook:Excel.Workbook;
    private clients:any[];
    private number:any;
    private dataReport:any;
    constructor(dataReport:any, clients:any[]) {
        this.workBook = new Excel.Workbook();
        this.clients = clients;
        this.dataReport = dataReport;
    }

    async exportCsvFile(path:string):Promise<any> {
        let workSheet = this.workBook.addWorksheet('My Sheet');
        let crunchs = this.dataReport.crunchs;
        let budgets = this.dataReport.budgets;
        let listGroup = this.getListGroup(crunchs, budgets);

        let coas = listGroup.coas;
        let groups = listGroup.groups;
        for (let index = 0; index < groups.length; index++) {
            let name = groups[index].name;
            let names = name.split(' ');
            names = names.map(n => {
                return n.charAt(0).toUpperCase() + n.slice(1);
            });
            let newName = '';
            names.forEach( n => {
                newName += ' ' + n;
            });

            groups[index].name = newName.trim();
        }

        this.createHederCsv(workSheet, this.clients, 7);

        this.createBodyCsv(workSheet, groups, coas, this.clients, 7);

        return await this.workBook.csv.writeFile(path);
    }

    private createHederCsv(worksheet:any, clients:any, numberColumn:any) {
        let numberClient = clients.length;
        let headerColumn:any = [{header: '', key: 'coa', width: 10}];
        if (numberClient > 1) {
            headerColumn = [{header: 'Client', key: 'coa', width: 10}];

            if (numberColumn > HEADERS.length)
                numberColumn = HEADERS.length;

            for (let indexColumn = 0; indexColumn < numberColumn; indexColumn++) {
                for (let indexClient = 1; indexClient <= numberClient; indexClient++) {
                    let client = clients[indexClient - 1];
                    let index = indexColumn * numberClient + indexClient;
                    let header = client.businessInfo && client.businessInfo.entityName ? client.businessInfo.entityName : client.fullName;

                    headerColumn.push({header: header, key: index.toString(), width: 20});
                }
            }
        }
        else {
            headerColumn = [{header: '', key: 'coa', width: 10}];
            for (let indexColumn = 0; indexColumn < numberColumn; indexColumn++) {
                let nameColumn = HEADERS[indexColumn];
                headerColumn.push({header: nameColumn, key: indexColumn + 1, width: 20});
            }
        }

        worksheet.columns = headerColumn;
        if (numberClient > 1) {
            let nameColumn = {};
            for (let indexColumn = 0; indexColumn < numberColumn; indexColumn++) {
                for (let indexClient = 1; indexClient <= numberClient; indexClient++) {
                    let index = indexColumn * numberClient + indexClient;
                    nameColumn[index] = HEADERS[indexColumn];
                }
            }
            worksheet.addRow(nameColumn);
        }
    }

    private getListGroup(crunchs:any, budgets:any) {
        let groupCoas:any = [];
        let coas:any = [];
        crunchs.forEach(item => {
            let data = item.data;
            let userId = item.userId.toString();
            let budget = budgets.find(b => b.userId.toString() === userId);
            console.log(budget);
            if (data && Array.isArray(data)) {
                let income = 0;
                data.forEach(item => {
                    if (item && item.income)
                        income += item.income;
                });
                data.forEach(crunch => {
                    let coaAmounts = crunch.coaAmounts;
                    if (coaAmounts && Array.isArray(coaAmounts)) {
                        coaAmounts.forEach(coaAmount => {
                            let group = coaAmount.group;
                            let totalCoaAmount = crunch.totalCoaAmounts.find(item => item.coaId._id.toString() === coaAmount.coaId._id.toString());
                            let totalAmount = totalCoaAmount && totalCoaAmount.amount ? totalCoaAmount.amount : 0;
                            if (coaAmount.coaId && coaAmount.coaId._id && coaAmount.coaId.name) {
                                let indexCoa = coas.findIndex(coa => coa._id.toString() === coaAmount.coaId._id.toString());
                                let budgetCoaRange = budget && budget.data && budget.data.totalCoaAmountRange && Array.isArray(budget.data.totalCoaAmountRange) ? budget.data.totalCoaAmountRange.find(b => b.coaId.toString() === coaAmount.coaId._id.toString()) : null;
                                let budgetCoaTotal = budget && budget.data && budget.data.totalAmount && Array.isArray(budget.data.totalAmount) ? budget.data.totalAmount.find(b => b.coaId.toString() === coaAmount.coaId._id.toString()) : null;
                                budgetCoaRange = budgetCoaRange ? budgetCoaRange.amount : 0;
                                budgetCoaTotal = budgetCoaTotal ? budgetCoaTotal.amount : 0;
                                if (indexCoa >= 0) {
                                    let data = coas[indexCoa].data;
                                    let indexData = data.findIndex(item => item.userId.toString() === userId);

                                    if (indexData >= 0) {
                                        let newAmount = coas[indexCoa].data[indexData].amount + coaAmount.amount;
                                        coas[indexCoa].data[indexData].amount = parseFloat(newAmount.toFixed(2));
                                    }
                                    else {
                                        let data = {
                                            userId: userId,
                                            amount: coaAmount.amount,
                                            income: income,
                                            totalIncome: crunch.totalIncome,
                                            totalAmount: totalAmount,
                                            budgetCoaRange,
                                            budgetCoaTotal
                                        };

                                        coas[indexCoa].data.push(data);
                                    }
                                }
                                else {
                                    let coa = {
                                        _id: coaAmount.coaId._id.toString(),
                                        name: coaAmount.coaId.name,
                                        code: coaAmount.coaId.code,
                                        data: [{
                                            userId: userId,
                                            amount: coaAmount.amount,
                                            income: income,
                                            totalIncome: crunch.totalIncome,
                                            totalAmount: totalAmount,
                                            budgetCoaRange,
                                            budgetCoaTotal
                                        }]
                                    };
                                    coas.push(coa);
                                }
                            }
                            if (group && Array.isArray(group.coas) && group.coas.length > 0) {
                                let indexGroup = groupCoas.findIndex(groupItem =>
                                    groupItem._id.toString() === group._id.toString()
                                );

                                if (indexGroup >= 0) {
                                    let newList = group.coas ? group.coas.map(coa => coa.toString()) : [];
                                    let coaListInGroup = _.difference(newList, group.coas);
                                    groupCoas[indexGroup].coas = groupCoas[indexGroup].coas.concat(coaListInGroup);
                                }
                                else {
                                    group.coas = group.coas.map(coa => coa.toString());
                                    groupCoas.push(group);
                                }
                            }
                        });
                    }
                });
            }
        });

        return {
            groups: groupCoas,
            coas: coas
        };
    }

    private getListCoaInGroup(listCoa: any, coasInGroup:any) {
        let result:any = [];
        coasInGroup.forEach(item => {
            for (let index = 0; index < listCoa.length; index++) {
                const element = listCoa[index];
                if (item === element._id) {
                    result.push(listCoa[index]);
                    break;
                }
            }
        });
        return result;
    }

    private createOneLineCoa(worksheet, numberColumn, clientIds, coa) {
        if (numberColumn > HEADERS.length)
            numberColumn = HEADERS.length;
        let row = {coa: coa.name};
        for (let indexColumn = 0; indexColumn < numberColumn; indexColumn++) {
            for (let indexClient = 1; indexClient <= clientIds.length; indexClient++) {
                let index = indexColumn * clientIds.length + indexClient;
                let IdClient = clientIds[indexClient - 1];
                let data = coa.data.find(item => item.userId === IdClient);
                let monthlyAmount = data && data.amount ? data.amount : 0;
                let ytdAmount = data && data.totalAmount ? data.totalAmount : 0;
                let income = data && data.income ? data.income : 0;
                let totalIncome = data && data.totalIncome ? data.totalIncome : 0;
                let budgetCoaRange = data && data.budgetCoaRange ? data.budgetCoaRange : 0;
                budgetCoaRange = parseFloat(budgetCoaRange.toFixed(2));
                let budgetCoaTotal = data && data.budgetCoaTotal ? data.budgetCoaTotal : 0;
                budgetCoaTotal = parseFloat(budgetCoaTotal.toFixed(2));
                let budgetPercentage = budgetCoaTotal ? budgetCoaRange * 100 / budgetCoaTotal : 0;
                monthlyAmount = parseFloat(monthlyAmount.toFixed(2));
                ytdAmount = parseFloat(ytdAmount.toFixed(2));
                let monthlyPercentage = income ? monthlyAmount * 100 / income : 0;
                monthlyPercentage = parseFloat(monthlyPercentage.toFixed(2));
                let ytdPercentage = totalIncome ? ytdAmount * 100 / totalIncome : 0;
                ytdPercentage = parseFloat(ytdPercentage.toFixed(2));
                switch (indexColumn) {
                case COLUMN.MONTHLYAMOUNT:
                    row[index] = monthlyAmount;
                    break;
                case COLUMN.MONTHLYPERCENTAGE:
                    row[index] = monthlyPercentage;
                    break;
                case COLUMN.YTDAMOUNT:
                    row[index] = ytdAmount;
                    break;
                case COLUMN.YTDPERCENTAGE:
                    row[index] = ytdPercentage;
                    break;
                case COLUMN.BUDGETFORTHEYEAR:
                    row[index] = budgetCoaRange;
                    break;
                case COLUMN.BUDGETPERCENTAGE:
                    row[index] = budgetPercentage;
                    break;
                case COLUMN.VARIANCE:
                    row[index] = budgetPercentage ? ytdPercentage - budgetPercentage : 0;
                    break;
                default:
                    break;
                }
            }
        }

        worksheet.addRow(row);
    }

    private createBodyCsv(worksheet, groups, coas, clients, numberColumn) {
        let clientIds = clients.map(client => client._id);
        groups.sort((a, b) => a.order < b.order);
        groups.forEach(group => {
            worksheet.addRow({coa: group.name});
            let listCoaInGroup = this.getListCoaInGroup(coas, group.coas);
            listCoaInGroup.sort((a, b) => {
                let codeA = a && a.code ? a.code : '';
                let codeB = b && b.code ? b.code : '';
                return codeA > codeB;
            });
            for (let index = 0; index < listCoaInGroup.length; index++) {
                const coa = listCoaInGroup[index];
                this.createOneLineCoa(worksheet, numberColumn, clientIds, coa);
            }
        });
    }

    private toColumnName(num) {
        let ret = '';
        for (let a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
            ret = String.fromCharCode(parseInt(((num % b) / a).toString()) + 65) + ret;
        }
        return ret;
    }
}
