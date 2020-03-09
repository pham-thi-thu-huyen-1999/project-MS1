import Project from '../../../config/Project';

class TemplateTrialBalancePdf {
    htmlString: string;
    result: string;
    transactions: any[];
    beginMonth:number;
    beginYear: number;
    endMonth: number;
    endYear: number;
    listCoa;
    constructor(transactions: any[], beginMonth:number, beginYear:number, endMonth:number, endYear:number) {
        this.beginMonth = beginMonth;
        this.beginYear = beginYear;
        this.endMonth = endMonth;
        this.endYear = endYear;
        this.transactions = transactions;
        this.filterTransaction(transactions, beginMonth, beginYear, endMonth, endYear);
    }

    renderBody() {
        let bodyRender = '';
        let totalMonthlyDebit = 0;
        let totalMonthlyCredit = 0;
        let totalYtdDebit = 0;
        let totalYtdCredit = 0;
        this.listCoa.forEach(item => {
            let monthlyDebit = item.name.length % 2 ? this.convertCurence(item.monthly) : '';
            let monthlyCredit = !(item.name.length % 2) ? this.convertCurence(item.monthly) : '';
            let ytdDebit = item.name.length % 2 ? this.convertCurence(item.ytd) : '';
            let ytdCredit = !(item.name.length % 2) ? this.convertCurence(item.ytd) : '';
            totalMonthlyDebit += (monthlyDebit ? item.monthly : 0);
            totalMonthlyCredit += (monthlyCredit ? item.monthly : 0);
            totalYtdDebit += (ytdDebit ? item.ytd : 0);
            totalYtdCredit += (ytdCredit ? item.ytd : 0);
            bodyRender += `<tr>
            <td>${item.name}</td>
            <td>${monthlyDebit}</td>
            <td>${monthlyCredit}</td>
            <td>${ytdDebit}</td>
            <td>${ytdCredit}</td>
        </tr>`;
        });

        bodyRender += `<tr class="bold border-top">
        <td>Total:</td>
        <td>${this.convertCurence(totalMonthlyDebit)}</td>
        <td>${this.convertCurence(totalMonthlyCredit)}</td>
        <td>${this.convertCurence(totalYtdDebit)}</td>
        <td>${this.convertCurence(totalYtdCredit)}</td>
    </tr>`;
        return bodyRender;
    }

    renderHtml() {
        console.log(this.listCoa);
        return `
        <html>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="initial-scale=1.0">
        <meta name="format-detection" content="telephone=no">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <title>TrialBalance</title>
        <style>
        @font-face {
            font-family: 'CircularStd-Book';
            src: url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Book/CircularStd-Book.eot');
            src: url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Book/CircularStd-Book.eot?#iefix') format('embedded-opentype'),
            url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Book/CircularStd-Book.woff2') format('woff2'),
            url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Book/CircularStd-Book.woff') format('woff'),
            url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Book/CircularStd-Book.ttf') format('truetype'),
            url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Book/CircularStd-Book.svg#svgFontName') format('svg');
            font-weight: normal !important;
            }

            @font-face {
                font-family: 'CircularStd-Medium';
                src: url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Medium/CircularStd-Medium.eot');
                src: url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Medium/CircularStd-Medium.eot?#iefix') format('embedded-opentype'),
                url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Medium/CircularStd-Medium.woff2') format('woff2'),
                url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Medium/CircularStd-Medium.woff') format('woff'),
                url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Medium/CircularStd-Medium.ttf') format('truetype'),
                url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Medium/CircularStd-Medium.svg#svgFontName') format('svg');
                font-weight: normal !important;
            }
            
            @font-face {
                font-family: 'CircularStd-Bold';
                src: url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Bold/CircularStd-Bold.eot');
                src: url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Bold/CircularStd-Bold.eot?#iefix') format('embedded-opentype'),
                url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Bold/CircularStd-Bold.woff2') format('woff2'),
                url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Bold/CircularStd-Bold.woff') format('woff'),
                url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Bold/CircularStd-Bold.ttf') format('truetype'),
                url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/CircularStd-Bold/CircularStd-Bold.svg#svgFontName') format('svg');
                font-weight: normal !important;
            }

            @font-face {
                font-family: 'Baskerville-SemiBold';
                src: url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/Baskerville-SemiBold/Baskerville-SemiBold.eot');
                src: url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/Baskerville-SemiBold/Baskerville-SemiBold.woff2') format('woff2'),
                    url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/Baskerville-SemiBold/Baskerville-SemiBold.woff') format('woff'),
                    url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/Baskerville-SemiBold/Baskerville-SemiBold.ttf') format('truetype'),
                    url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/Baskerville-SemiBold/Baskerville-SemiBold.svg#Baskerville-SemiBold') format('svg'),
                    url('${Project.SERVER.MANAGEMENT.PROTOTYPE}://${Project.SERVER.MANAGEMENT.DOMAIN}/fonts/Baskerville-SemiBold/Baskerville-SemiBold.eot?#iefix') format('embedded-opentype');
                font-weight: normal !important;
            }
                    
            html,
            body {
                margin: 0;
                font-weight: 500;
                font-size: 8px;
                background: #fff;
                -webkit-print-color-adjust: exact;
                box-sizing: border-box;
                font-family: 'CircularStd-Book';
            }
        
            @media print {
                body {
                    padding:0px 40px;
                }
                .pageBreak {
                    page-break-before: always;
                }
            }
            .bold{
                font-family: 'CircularStd-Bold';
            }
            table{
                width: 100%;
            }
            table, th, td {
                border-collapse: collapse;
                font-size: 7px;
            }
            table tr:nth-child(even) {
                background-color: #eee;
            }
            table tr:nth-child(odd) {
                background-color: #fff;
            }
            table tr>td:last-child, table tr>th:last-child{
                width: 20%
            }
            .head-logo, .head-info{
                width: 49%;
                display: inline-block;
                vertical-align: middle;
            }
            .head-img{
                max-width: 100px;
                margin-top: -5px;
            }
            .title{
                text-align: center;
            }
            td, th {
                padding: 5px 10px;
                text-align: left;
            }
            h1{
                font-size: 12px;
                line-height: 10px;
                margin-bottom: 0px;
                margin-top: 30px;
                font-weight: 700;
                font-family: 'CircularStd-Bold';
            }
            h3{
                font-size: 9px;
                font-weight: 300;
            }
            .border-top{
                border-top: 1px solid #000;
            }
        </style>
        </head>
        <body>
           <div class="head">
               <div class="head-logo">
                   <img class="head-img" src="https://ms-stag.precis.systems/images/logo.svg"/>
               </div>
               <div class="head-info">
                   <p>Client Name: SELBY CONTRACTING PTY LTD</p>
                   <P>Bank - xxxx02s1</P>
               </div>
           </div>
           <div class="title">
               <h1>Trial Balance</h1>
               <h3>September 2018</h3>
           </div>
           <div class="content">
                <table>
                    <tbody>
                        <tr class="bold">
                            <th>Account</th>
                            <th>Debit</th>
                            <th>Credit</th>
                            <th>YTD Debit</th>
                            <th>YTD Credit</th>
                        </tr>
                        ${this.renderBody()}
                    </tbody>
                </table>
           </div>
        </body>
        </html>
        `;
    }

    filterTransaction(transactions:any[], beginMonth:number, beginYear:number, endMonth:number, endYear:number) {
        const listCoa:any[] = [];
        transactions.forEach(transaction => {
            if (transaction.coaId && transaction.coaId.name && transaction.coaId.code && transaction.coaId._id) {
                let value = transaction.baseType === 'DEBIT' ? - parseFloat(transaction.amount.amount) : parseFloat(transaction.amount.amount);
                const isMonthly = (parseInt(transaction.month) >= beginMonth && parseInt(transaction.year) === beginYear) || (parseInt(transaction.month) <= endMonth && parseInt(transaction.year) === endYear) ? true : false;
                const index = listCoa.findIndex(item => item.code === transaction.coaId.code);
                if (index === -1) {
                    listCoa.push({...transaction.coaId, monthly: isMonthly ? value : 0, ytd: value});
                }
                else {
                    listCoa[index].monthly = isMonthly ? listCoa[index].monthly + value : listCoa[index].monthly;
                    listCoa[index].ytd = listCoa[index].monthly + value;
                }
            }
        });
        this.listCoa = listCoa;
    }

    public getTemplate() {
        return this.result;
    }

    convertCurence(number:number) {
        return number >= 0 ? `$${number.toFixed(2)}` : `$(${Math.abs(number).toFixed(2)})`;
    }
}

Object.seal(TemplateTrialBalancePdf);
export default TemplateTrialBalancePdf;
