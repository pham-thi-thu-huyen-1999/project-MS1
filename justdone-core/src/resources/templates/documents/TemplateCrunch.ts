import {BankType} from 'justdone-system-package/dest/app/model/common/CommonType';
import Project from '../../../config/Project';

export default class TemplateCrunch {
    templateCrunch: string;
    crunchItemDatas: string;
    openingBalance: number;
    closingBalance: number;
    report: any;
    crunch: any;
    totalExpenses: any;
    yodleeAccount: any;
    infoAccount: string;
    container: string;
    drawingTemplates: string;
    expensesTemplates: string;
    incomeTemplates: string;
    otherTemplates: string;
    expensesReportTemplates: string;
    bankAccountNumber: string;
    fullName: string

    constructor(crunch: any, yodleeAccount: any, fullName: string) {
        this.fullName = fullName;
        this.bankAccountNumber = yodleeAccount.accountNumber;
        this.container = yodleeAccount.CONTAINER;
        this.crunch = crunch;
        this.totalExpenses = handlerExpensesTotal(crunch.expenses);
        this.yodleeAccount = yodleeAccount;
        this.infoAccount = '';
        this.openingBalance = crunch.openBalance ? crunch.openBalance : 0;
        this.closingBalance = this.openingBalance;
        this.report = {income: 0, drawing: 0, other: 0, totalExpenses: 0};
        // this.report.income = caculatorTotal(crunch.income);
        // this.report.drawing = caculatorTotal(crunch.drawings);
        // this.report.other = caculatorTotal(crunch.other);
        // this.report.totalExpenses = caculatorTotal(crunch.expenses);

        this.drawingTemplates = ``;
        this.expensesTemplates = ``;
        this.incomeTemplates = ``;
        this.otherTemplates = ``;
        this.expensesReportTemplates = ``;
        this.makeDataTemplates();
        this.templateCrunch = `
        <html>
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="initial-scale=1.0">
            <meta name="format-detection" content="telephone=no">
            <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
            <meta name="x-apple-disable-message-reformatting">
            <title>Cruncher Report</title>
            <style>
                @font-face {
                font-family: 'CircularStd-Book';
                src: url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Book/CircularStd-Book.eot');
                src: url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Book/CircularStd-Book.eot?#iefix') format('embedded-opentype'),
                url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Book/CircularStd-Book.woff2') format('woff2'),
                url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Book/CircularStd-Book.woff') format('woff'),
                url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Book/CircularStd-Book.ttf') format('truetype'),
                url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Book/CircularStd-Book.svg#svgFontName') format('svg');
                font-weight: normal !important;
                }

                @font-face {
                    font-family: 'CircularStd-Medium';
                    src: url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Medium/CircularStd-Medium.eot');
                    src: url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Medium/CircularStd-Medium.eot?#iefix') format('embedded-opentype'),
                    url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Medium/CircularStd-Medium.woff2') format('woff2'),
                    url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Medium/CircularStd-Medium.woff') format('woff'),
                    url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Medium/CircularStd-Medium.ttf') format('truetype'),
                    url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Medium/CircularStd-Medium.svg#svgFontName') format('svg');
                    font-weight: normal !important;
                }
                
                @font-face {
                    font-family: 'CircularStd-Bold';
                    src: url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Bold/CircularStd-Bold.eot');
                    src: url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Bold/CircularStd-Bold.eot?#iefix') format('embedded-opentype'),
                    url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Bold/CircularStd-Bold.woff2') format('woff2'),
                    url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Bold/CircularStd-Bold.woff') format('woff'),
                    url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Bold/CircularStd-Bold.ttf') format('truetype'),
                    url('${Project.SERVER.FRESH_NUMBER.PROTOTYPE}://${Project.SERVER.FRESH_NUMBER.DOMAIN}/fonts/CircularStd-Bold/CircularStd-Bold.svg#svgFontName') format('svg');
                    font-weight: normal !important;
                }
                        
                html,
                body {
                    margin: 0;
                    font-weight: 500;
                    font-size: 7px;
                    background: rgb(241, 241, 241);
                    -webkit-print-color-adjust: exact;
                    box-sizing: border-box;
                    
                }
                .page {
                    position: relative;
                    display: block;
                    background: white;
                    // page-break-after: auto;
                    // margin: 50px;
                    // display: table-header-group;
                }

                @media print {
                    body {
                        background: white;
                        padding: 40px;
                        padding-top:10px;
                    }
                    .pageBreak {
                        page-break-before: always;
                    }
                }

                .page.first {
                    border-left: 5px solid green;
                }

                .bottom {
                    position: absolute;
                    left: 5mm;
                    right: 5mm;
                    bottom: 5mm;
                }

                .group {
                    
                }

                .line {
                    color: black;
                    position: relative;
                }

                .center {
                    text-align: center;
                }

                .tb-font {
                    font-weight: 500;
                    font-size: 7px;
                    border-collapse: collapse;
                }

                th, td {
                    text-align: left;
                    width: 20%;
                    padding: 5px;
                }
                
                
                .change_pd th, .change_pd td{
                    padding: 10px 0px;
                }
                .contentTable tr{
                    height: 20px;
                    border-bottom: 0.5px solid #eee;
                }
                .contentTable tr:nth-child(even){
                    background-color: #f9f9f9;
                }
                .contentTable tr:nth-child(odd){
                    background-color: #ffffff;
                }
                .contentTable tr:first-child{
                    background-color: #ffffff;
                }
                .contentTable tr:last-child{
                    background-color: #ffffff;
                }
                .contentTable th{
                    font-weight: 400;
                    padding-top: 15px;
                    padding-bottom: 15px;
                    // font-style: italic;
                }
                .contentTable th:first-child{
                    padding-left: 0px;
                }
                .td-padding{
                    padding-left: 15px;
                }
                .titleReport{
                    font-size: 7px;
                    text-align:right;
                    font-weight: bold;
                    color:#000;
                    margin-bottom: 5mm;
                }
                .cashReceipts{
                    font-size: 9px;
                    font-weight: bold;
                }
                .cruncherReport{ 
                margin-bottom: 3mm;
                text-align: right;
                font-size: 6px;
                color:#000;
                text-transform: uppercase;}
                .cashReceipts {
                    margin-bottom: 3mm;
                }
                .CashInflow{font-size: 11px;font-weight: bold;text-align: right;}
                .titleTable{
                    // margin-left: 3.7mm;
                    font-size: 8px;
                    font-weight: bold;
                }
                .contentTable{
                    // margin-left: 6mm;
                    // margin-right: 6mm;
                }
                .borderTop{
                    border-top: 1px solid;
                    padding-top: 15px;
                    padding-bottom: 10px;
                    font-weight: bold;
                }
                .img-responsive {
                    width: 20%;
                    float: left;
                    display: inline-block;
                    height: auto;
                }
                .contentHeader {
                    width: 100%;                                        
                }
                .contentHeader .tb-font{
                    width: 100% !important;
                }
                .contentHeader .group:nth-child(even) table{
                    background-color: #ffffff;
                }
                .contentHeader .group:nth-child(odd) table{
                    background-color: #f9f9f9;
                }
                .contentHeader .lessExpense tr:nth-child(odd){
                    background-color: #f9f9f9;
                }
                .contentHeader .lessExpense tr:nth-child(even){
                    background-color: #ffffff;
                }
                .contentHeader .lessExpense tr:first-child{
                    background-color: #ffffff;
                }
                .noneColor tr, .noneColor th{
                    background-color: #ffffff;
                }
                .bg-white{
                    background-color: #ffffff !important;
                }
                
                .change_pd th:nth-child(even),.change_pd td:nth-child(even){
                    text-align: right;
                }
                .change_pd td:nth-child(odd){color:#000}
                .line-group{
                        margin-top: 5mm;
                }
                .line-group th,.lessExpense th{
                font-size: 6px;
                color:#000;
                text-transform: uppercase;
                font-weight: normal;
                }
                .line-group td{
                    font-size: 11px;font-weight: bold;color:#000 !important;
                }
                .imgLogo{
                    background-image: url("${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/img/precis-logo.svg");
                }
                .clientName{
                    text-align:right;
                    margin-bottom:5px;
                }   
                .info-open th{
                    padding-top: 10px;
                    padding-bottom: 10px;
                }   
            </style>
            </head>
            
            <body>
            <div class="page">
                <div class="group">
                    <img class="img-responsive" src="${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/img/precis-logo.svg">
                    <div class="clientName">${this.fullName}</div>
                    <div class="line cruncherReport">Cruncher report</div>
                    <div class="line titleReport">${this.crunch.date}  Cash Movement Report - ${this.crunch.type === BankType.Bank ? 'Bank' : 'Credit Card'} - ${this.bankAccountNumber}</div>
                    <div class="line cruncherReport">Cash Inflow</div>
                    <div class="line CashInflow">${this.formatMoney(this.report['income'])}</div>
                    <div class="contentHeader change_pd">                      
                        
                        <div class="group">
                            <table class="tb-font lessExpense bg-white">
                                <tr>
                                    <th>Less Cash Outflow</th><th></th>
                                </tr>
                               
                                ${this.expensesReportTemplates}
                            </table>
                        </div>
                        
                        <div class ="line-group" style="margin-top:10mm">
                             <table class="tb-font noneColor bg-white">
                                <tr>
                                    <th style="width:35%">Net Cash Movement EXD Drawings</th>
                                    <th style="width:40%;text-align:left">Less Drawings</th>
                                    <th style="width:25%;text-align:right">Net Cash Movements</th>
                                </tr>
                                <tr>
                                    <td>${this.formatMoney(this.report.income + this.report.totalExpenses)}</td>
                                    <td style="text-align:left">${this.formatMoney(this.report.drawing)}</td>
                                    <td style="text-align:right">${this.formatMoney(this.closingBalance - this.openingBalance)}</td>
                                </tr>
                            </table>   
                        </div>
                       
                    </div>
            
                    
                    <div class="group pageBreak">
                        <table class="tb-font" style="width:100%;">
                            <tr>
                                <th></th>
                                <th style="width:15%"></th>
                                <th style="width:25%">${this.fullName}</th>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr class="info-open">
                                <th></th>
                                <th></th>
                                <th>${this.infoAccount}</th>
                                <th>Opening Balance</th>
                                <th style="text-align:right">${this.formatMoney(this.openingBalance)} *</th>
                            </tr>
                        </table>
                    </div>
            
                    <div class="line titleTable">Cash Inflow</div>
                    <div class="group contentTable">
                        <table class="tb-font" style="width:100%;">
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Outgoing</th>
                                <th>Incoming</th>
                                <th>Total</th>
                            </tr>
                            ${this.incomeTemplates}
                        </table>
                    </div>
            
                    
            
                    <div class="line titleTable">Drawings</div>
                    <div class="group contentTable">
                        <table class="tb-font" style="width:100%;">
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Outgoing</th>
                                <th>Incoming</th>
                                <th>Total</th>
                            </tr>
                            ${this.drawingTemplates}
                        </table>
                    </div>
                    
                    <div class="line titleTable">Others</div>
                    <div class="group contentTable">
                        <table class="tb-font" style="width:100%;">
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Outgoing</th>
                                <th>Incoming</th>
                                <th>Total</th>
                            </tr>
                            ${this.otherTemplates}
                        </table>
                    </div>
                    
                    ${this.expensesTemplates}
                    
                    <div class="group">
                        <table class="tb-font" style="width:100%;">
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th style="text-align:right">Closing Balance</th>
                                <th style="text-align:right">${this.formatMoney(this.closingBalance)} *</th>
                            </tr>
                        </table>
                    </div>
                </div>
                <div style="margin-top:30px;font-weight: bold;">* The opening and closing balance would vary depending on when the report is generated. Balances may not match with your statements due to timing difference of the transactions imported from the bank/other financial institution.</div>
            </div>
            </body>
            </html>
        `;
    }

    public getTemplate() {
        return this.templateCrunch;
    }

    public formatDate(date) {
        let dateObj = new Date(date);
        let day = dateObj.getDate();
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getFullYear();

        return (month <= 9 ? '0' + month : month) + '/' + (day <= 9 ? '0' + day : day) + '/' + year;
    }

    public formatMoney(money) {
        money = typeof money === 'number' ? money.toFixed(2) : parseFloat(money).toFixed(2);
        return (money < 0 ? '-$' : '$') + Number(Math.abs(parseFloat(money)));
    }

    public makeTemplate(data: Array<any>, name: string) {
        let template = '';
        let outputTotal = {
            outgoing: 0,
            incoming: 0,
            total: 0,
        };
        data = data.sort(function(First, Two) {
            if (new Date(First.date) < new Date(Two.date)) {
                return 1;
            }
            else {
                return -1;
            }
        });
        for (let i = 0; i < data.length; i++) {
            let debit = 0;
            let credit = 0;
            if (data[i].baseType === 'DEBIT')
                debit = data[i].amount.amount;
            else
                credit = data[i].amount.amount;

            outputTotal.outgoing += debit;
            outputTotal.incoming += credit;

            template += `
                <tr>
                    <td>${this.formatDate(data[i].date)}</td>
                    <td>${data[i].description.original}</td>
                    <td>\$${debit}</td>
                    <td>\$${credit}</td>
                    <td></td>
                </tr>`;
        };

        outputTotal.total += outputTotal.incoming - outputTotal.outgoing;
        this.closingBalance = this.closingBalance + outputTotal.total;
        this.report[name] = outputTotal.total;
        template += `
            <tr>
                <td></td>
                <td></td>
                <td class="borderTop">${this.formatMoney(outputTotal.outgoing)}</td>
                <td class="borderTop">${this.formatMoney(outputTotal.incoming)}</td>
                <td class="borderTop">${this.formatMoney(outputTotal.total)}</td>
            </tr>`;

        return template;
    }

    public makeTemplateComplex(data, total, name = 'Expenses') {
        let template = '';
        data = data.sort(function(First, Two) {
            if (new Date(First.date) < new Date(Two.date)) {
                return 1;
            }
            else {
                return -1;
            }
        });
        // sort coa code
        total.sort((first, two) => {
            let codeFirst = first.coa.code.split('-');
            let codeTwo = two.coa.code.split('-');
            let result = compareWithCode(codeFirst, codeTwo);
            if (result !== 0)
                return result;
            else
                first.coa.name.toLowerCase().localeCompare(two.coa.name.toLowerCase());
        });
        for (let i = 0; i < total.length; i++) {
            let templateItemData = '';
            let outputTotal = {
                outgoing: 0,
                incoming: 0,
                total: 0,
            };
            for (let j = 0; j < data.length; j++) {
                let debit:any = 0;
                let credit:any = 0;
                if (data[j].baseType === 'DEBIT')
                    debit = parseFloat(data[j].amount.amount.toFixed(2));
                else
                    credit = parseFloat(data[j].amount.amount.toFixed(2));

                if (data[j].coaId && data[j].coaId.name === total[i].coa.name) {
                    outputTotal.outgoing += Number(debit);
                    outputTotal.incoming += Number(credit);
                    templateItemData += `
                        <tr>
                            <td>${this.formatDate(data[j].date)}</td>
                            <td>${data[j].description.original}</td>
                            <td>\$${debit}</td>
                            <td>\$${credit}</td>
                            <td></td>
                        </tr>`;
                }
            };

            outputTotal.total += outputTotal.incoming - outputTotal.outgoing;
            this.closingBalance = this.closingBalance + outputTotal.total;
            this.report.totalExpenses += outputTotal.total;

            this.expensesReportTemplates += `
                <tr>
                    <td class="td-padding">${total[i].coa.name}</td>
                    <td>${this.formatMoney(outputTotal.total)}</td>
                </tr>`;

            let templateItem = `
                <div class="line titleTable">${name} - ${total[i].coa.name}</div>
                <div class="group contentTable">
                    <table class="tb-font" style="width:100%;">
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Outgoing</th>
                            <th>Incoming</th>
                            <th>Total</th>
                        </tr>
                        ${templateItemData}
                        <tr>
                            <td></td>
                            <td></td>
                            <td class="borderTop">${this.formatMoney(outputTotal.outgoing)}</td>
                            <td class="borderTop">${this.formatMoney(outputTotal.incoming)}</td>
                            <td class="borderTop">${this.formatMoney(outputTotal.total)}</td>
                        </tr>
                    </table>
                </div>`;

            template += templateItem;
        }

        // Other
        this.expensesReportTemplates += `
            <tr>
                <td class="td-padding">Other</td>
                <td>${this.formatMoney(this.report.other)}</td>
            </tr>`;
        this.report.totalExpenses += this.report.other;

        this.expensesReportTemplates += `
            <tr>
                <td class="td-padding">Total Cash Outflow</td>
                <td>${this.formatMoney(this.report.totalExpenses)}</td>
            </tr>`;

        return template;
    }

    public makeDataTemplates() {
        this.incomeTemplates += this.makeTemplate(this.crunch.income, 'income');
        this.drawingTemplates += this.makeTemplate(this.crunch.drawings, 'drawing');
        this.otherTemplates += this.makeTemplate(this.crunch.other, 'other');
        this.expensesTemplates += this.makeTemplateComplex(this.crunch.expenses, this.totalExpenses, 'Cash Outflow');

        // this.infoAccount = this.yodleeAccount[this.crunch.type] && this.yodleeAccount[this.crunch.type].id ? (this.yodleeAccount[this.crunch.type].accountName + ' account ' + this.yodleeAccount[this.crunch.type].accountNumber) : '';
        this.infoAccount = this.yodleeAccount && this.yodleeAccount.id ? (this.yodleeAccount.accountName + ' account ' + this.yodleeAccount.accountNumber) : '';
    }
}

function handlerExpensesTotal(expenses: Array<any>, result: Array<any> = []) {
    if (expenses.length === 0)
        return result;
    let temp: Array<any> = [];
    let coa = expenses[0].coaId;
    let coaId = coa._id ? coa._id : coa;
    let total = 0;
    for (let index = 0; index < expenses.length; index++) {
        let transaction = expenses[index];
        let id = transaction.coaId._id ? transaction.coaId._id : transaction.coaId;
        if (id === coaId) {
            let value = transaction.amount.amount;
            total = transaction.baseType === 'DEBIT' ? total - value.toFixed(2) : total + value.toFixed(2);
            total = Number(total);
        }
        else
            temp.push(transaction);
    }
    result.push({
        coa: coa,
        total: total
    });
    return handlerExpensesTotal(temp, result);
}

// function caculatorTotal(transactions: Array<any>): number {
//     let total = 0;
//     transactions.forEach(transaction => {
//         let value = transaction.amount.amount.toFixed(2);

//         total = transaction.baseType === 'DEBIT' ? total - parseFloat(value) : total + parseFloat(value);
//     });
//     // console.log(total);
//     return Number(total);
// }

function compareWithCode(first, two) {
    if (first[0] === '') {
        if (two[0] === '')
            return 0;
        if (two[0] !== '')
            return 1;
    }
    else {
        if (two[0] === '')
            return -1;
    }
    if (first[0] - two[0] > 0) {
        return 1;
    }

    if (first[0] - two[0] < 0)
        return -1;

    if (first.length > two.length) {
        return 1;
    }

    if (first.length < two.length)
        return -1;
    if (first.length === 1)
        return 0;
    if (first.length === 2) {
        if (first[1] - two[1] > 0)
            return 1;
        if (first[1] - two[1] < 0)
            return -1;
        return 0;
    }
}
