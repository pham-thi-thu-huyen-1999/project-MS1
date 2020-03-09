import Project from '../../../config/Project';

class TemplateGstPdf {
    htmlString: string;
    result: string;
    value1;
    value2;
    value3;
    total1;
    total2;
    constructor(transactions) {
        this.value1 = {
            sale: 0,
            purchase: 0,
            taxColected: 0,
            taxPaid: 0
        };
        this.value2 = {
            sale: 0,
            purchase: 0,
            taxColected: 0,
            taxPaid: 0
        };
        this.value3 = {
            sale: 0,
            purchase: 0,
            taxColected: 0,
            taxPaid: 0
        };
        this.checkDataByTransaction(transactions);
        this.total1 = this.value1.taxColected + this.value2.taxColected + this.value3.taxColected;
        this.total2 = this.value1.taxPaid + this.value2.taxPaid + this.value3.taxPaid;
        this.roundingObject(this.value1);
        this.roundingObject(this.value2);
        this.roundingObject(this.value3);
        console.log(this.value1, this.value2, this.value3);
    }

    public getTemplate() {
        return this.result;
    }

    renderHtml() {
        return `
        <html>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="initial-scale=1.0">
        <meta name="format-detection" content="telephone=no">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <title>GST</title>
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
               <h1>GST [Summary - Cash]</h1>
               <h3>1/09/2018 To 30/09/2018</h3>
           </div>
           <div class="content">
                <table>
                    <tbody>
                        <tr class="bold">
                            <th>Code</th>
                            <th>Description</th>
                            <th>Rate</th>
                            <th>Sale Value</th>
                            <th>Purchase Value</th>
                            <th>Tax Collected</th>
                            <th>Tax Paid</th>
                        </tr>
                        <tr>
                            <td>FRE</td>
                            <td>GST FREE</td>
                            <td>0.00%</td>
                            <td>${this.value1.sale}</td>
                            <td>${this.value1.purchase}</td>
                            <td>${this.value1.taxColected}</td>
                            <td>${this.value1.taxPaid}</td>
                        </tr>
                        <tr>
                            <td>GST</td>
                            <td>Goods & Services Tax</td>
                            <td>10.00%</td>
                            <td>${this.value2.sale}</td>
                            <td>${this.value2.purchase}</td>
                            <td>${this.value2.taxColected}</td>
                            <td>${this.value2.taxPaid}</td>
                        </tr>
                        <tr>
                            <td>N-T</td>
                            <td>Not Reportable</td>
                            <td>0.00%</td>
                            <td>${this.value3.sale}</td>
                            <td>${this.value3.purchase}</td>
                            <td>${this.value3.taxColected}</td>
                            <td>${this.value3.taxPaid}</td>
                        </tr>
                        <tr class="bold border-top">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Total:</td>
                            <td>${this.convertCurence(this.total1)}</td>
                            <td>${this.convertCurence(this.total2)}</td>
                        </tr>
                    </tbody>
                </table>
           </div>
        </body>
        </html>
        `;
    }

    checkDataByTransaction(transactions) {
        if (transactions.length === 0)
            return;
        transactions.forEach(transaction => {
            this.value1.sale += parseFloat(transaction.amount.amount) * 0.11;
            this.value1.purchase += parseFloat(transaction.amount.amount) * 0.292;
            this.value1.taxColected += parseFloat(transaction.amount.amount) * 0.242;
            this.value1.taxPaid += parseFloat(transaction.amount.amount) * 0.236;
            this.value2.sale += parseFloat(transaction.amount.amount) * 0.21;
            this.value2.purchase += parseFloat(transaction.amount.amount) * 0.16;
            this.value2.taxColected += parseFloat(transaction.amount.amount) * 0.257;
            this.value2.taxPaid += parseFloat(transaction.amount.amount) * 0.245;
            this.value3.sale += parseFloat(transaction.amount.amount) * 0.29;
            this.value3.purchase += parseFloat(transaction.amount.amount) * 0.139;
            this.value3.taxColected += parseFloat(transaction.amount.amount) * 0.22;
            this.value3.taxPaid += parseFloat(transaction.amount.amount) * 0.31;
        });
    }

    roundingObject(object) {
        let keys = Object.keys(object);
        keys.forEach(key => {
            object[key] = this.convertCurence(object[key]);
        });
    }
    convertCurence(number) {
        return number >= 0 ? `$${number.toFixed(2)}` : `$(${Math.abs(number).toFixed(2)})`;
    }
}

Object.seal(TemplateGstPdf);
export default TemplateGstPdf;
