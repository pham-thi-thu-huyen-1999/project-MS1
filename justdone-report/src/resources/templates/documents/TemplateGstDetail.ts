import * as moment from 'moment';
import Project from '../../../config/Project';

class TemplateGstDetailPdf {
    dataTemplate: any;
    isPreview: boolean;
    constructor(dataTemplate: any, isPreview: boolean) {
        this.dataTemplate = dataTemplate;
        this.isPreview = isPreview;
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
        <title>Gst Detail</title>
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
                font-weight: 400;
                font-size: ${this.isPreview ? '20px' : '8px'};
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
                font-size: ${this.isPreview ? '18px' : '8px'};
                font-family: 'CircularStd-Book';
                font-weight: 400;
            }
            table tr:nth-child(even) {
                background-color: #eee;
            }
            table tr:nth-child(odd) {
                background-color: #fff;
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
                padding: 5px 5px;
                text-align: left;
                width: auto;
            }
            h1 {
                font-size: ${this.isPreview ? '20px': '12px'};
                line-height: 10px;
                margin-bottom: 0px;
                margin-top: 30px;
                font-weight: 700;
                font-family: 'CircularStd-Bold';
            }
            h3 {
                font-size: ${this.isPreview ? '18px': '9px'};
                font-weight: 300;
                margin-bottom: 60px;
            }
            h4 {
                margin-top: 30px;
                margin-bottom: 10px;
                font-size: ${this.isPreview ? '18px': '9px'};
            }
            .border-top {
                border-top: 1px solid #000000;
            }
            .bold th {
                font-size: ${this.isPreview ? '18px': '9px'};
            },
            .bold td {
                font-size: ${this.isPreview ? '18px': '9px'};
                font-family: 'CircularStd-Bold';
                font-weight: 700;
            }
            .text-center {
                text-align: center;
            }
            .text-right {
                text-align: right;
            }
        </style>
        </head>
        <body>
           <div class="title">
                <h1>GST [DETAIL - CASH]</h1>
                <h2>${this.dataTemplate.user && this.dataTemplate.user.businessInfo.entityName}</h2>
                <h2>ABN: ${this.dataTemplate.user && this.dataTemplate.user.businessInfo.abnCode}</h2>
                <h3>01/${this.dataTemplate.filter.beginMonth < 10 ? '0' + this.dataTemplate.filter.beginMonth : this.dataTemplate.filter.beginMonth}/${this.dataTemplate.filter.beginYear} through ${this.daysInMonth(this.dataTemplate.filter.endMonth, this.dataTemplate.filter.endYear)}/${this.dataTemplate.filter.endMonth < 10 ? '0' + this.dataTemplate.filter.endMonth : this.dataTemplate.filter.endMonth}/${this.dataTemplate.filter.endYear}</h3>
            </div>
           <div class="content">
                ${this.renderBody()}
           </div>
        </body>
        </html>`;
    }

    renderBody() {
        let htmlRender = '';
        this.dataTemplate.data.totalGroup.forEach(item => {
            htmlRender += `<h4>${item.code === 4400 ? 'GST Free (FRE)' : item.code === 4600 ? 'Goods & Services Tax (GST)' : item.code === 4700 ? 'Not Reportable (N-T)' : 'GST on Capital Acquisiti (CAP)'}</h4>
            <table>
                <tbody>
                    <tr class="bold">
                        <th class="text-center">Date</th>
                        <th class="text-center">Code</th>
                        <th class="text-center">Name</th>
                        <th class="text-center">Rate</th>
                        <th class="text-center">Sale Value</th>
                        <th class="text-center">Purchase Value</th>
                        <th class="text-center">Tax Collected</th>
                        <th class="text-center">Tax Paid</th>
                    </tr>
                    ${this.renderInnerBody(item.transactions, item.type)}
                    <tr class="bold border-top">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Total:</td>
                        <td class="text-right">${this.convertCurence(item.saleValue)}</td>
                        <td class="text-right">${this.convertCurence(item.purchaseValue)}</td>
                        <td class="text-right">${parseFloat(item.taxCollected.toFixed(2))}</td>
                        <td class="text-right">${parseFloat(item.taxPaid.toFixed(2))}</td>
                    </tr>
                </tbody>
            </table> `;
        });
        return htmlRender;
    }

    renderInnerBody(transactions, type) {
        let htmlRender = '';
        transactions.forEach(transaction => {
            let saleValue = transaction.baseType === 'CREDIT' && type === 'GST' ? transaction.amount.amount : transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0;
            let purchaseValue = transaction.baseType === 'DEBIT' && type === 'GST' ? transaction.amount.amount : transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0;
            let taxCollected = transaction.baseType === 'CREDIT' && (type === 'GST' || type === 'GCA') ? transaction.amount.amount / 11 : 0;
            let taxPaid = transaction.baseType === 'DEBIT' && (type === 'GST' || type === 'GCA') ? transaction.amount.amount / 11 : 0;
            htmlRender += `<tr>
            <td>${moment(transaction.date).format('DD/MM/YYYY')}</td>
            <td class="text-center">${type}</td>
            <td>${transaction.description.original}</td>
            <td class="text-center">${type === 'GST' || type === 'GCA' ? '10.00%' : '0.00%'}</td>
            <td class="text-right">${this.convertCurence(saleValue)}</td>
            <td class="text-right">${this.convertCurence(purchaseValue)}</td>
            <td class="text-right">${parseFloat(taxCollected.toFixed(2))}</td>
            <td class="text-right">${parseFloat(taxPaid.toFixed(2))}</td>
            </tr>`;
        });
        return htmlRender;
    }

    convertCurence(number:number) {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });
        return number >= 0 ? `${formatter.format(number)}` : `(${Math.abs(number).toFixed(2)})`;
    }

    daysInMonth(month:number, year:number) {
        return new Date(year, month, 0).getDate();
    }
}

Object.seal(TemplateGstDetailPdf);
export default TemplateGstDetailPdf;
