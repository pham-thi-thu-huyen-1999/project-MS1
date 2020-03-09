import Project from '../../../config/Project';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import DateHelper from 'justdone-system-package/dest/helpers/DateHelper';
import moment = require('moment');

class TemplateBalanceSheetPdf {
    dataTemplate: any;
    isPreview: boolean;

    constructor(dataTemplate: any, isPreview: boolean) {
        this.dataTemplate = dataTemplate;
        this.isPreview = isPreview;
    }

    renderHtml() {
        return `<html>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="initial-scale=1.0">
        <meta name="format-detection" content="telephone=no">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <title>Balance Sheet</title>
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
                font-size: ${this.isPreview ? '12px' : '8px'};
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
                font-size: 8px;
                font-family: 'CircularStd-Book';
                font-weight: 400;
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
                padding: 7px 10px;
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
            .main-group td {
                border-top: 40px solid #ffffff;
            }
            .main-group td,
            .total-main-group td {
                font-size: 10px;
                font-family: 'CircularStd-Bold';
                font-weight: 700;
            }
            .sub-group td {
                padding-left: 25px;
                font-family: 'CircularStd-Bold';
                font-weight: 700;
                font-size: 9px;
                border-top: 20px solid #ffffff;
            }
            .main-group + .sub-group td {
                border-top: 0 solid #ffffff;
            }
            .children-sub-group td {
                padding-left: 45px;
                font-family: 'CircularStd-Medium';
                font-weight: 500;
                font-size: 9px;
            }
            .total-sub-group td:first-child {
                padding-left: 25px;
            }
            .total-children-sub-group td:first-child {
                padding-left: 45px;
            }
            .main-group ~ .item-coa td:first-child {
                padding-left: 25px;
            }
            .main-group ~ .sub-group ~ .item-coa td:first-child {
                padding-left: 45px;
            }
            .main-group ~ .sub-group ~ .children-sub-group ~ .item-coa td:first-child {
                padding-left: 65px;
            }
            .equity ~ .item-coa td:first-child {
                padding-left: 25px !important;
            }
            .total-main-group,
            .total-sub-group,
            .total-children-sub-group {
                border-top: 1px solid #000000;
            }
            .total-sub-group td {
                font-family: 'CircularStd-Bold';
                font-weight: 700;
                font-size: 9px;
            }
            .total-children-sub-group td {
                font-size: 9px;
                font-weight: 500;
            }
            .item-coa td:last-child,
            .total-children-sub-group td:last-child,
            .total-sub-group td:last-child,
            .total-main-group td:last-child {
                text-align: right;
            }
        </style>
        </head>
            <body>
            <div class="title">
                <h1>BALANCE SHEET</h1>
                <h2>${this.dataTemplate.user && this.dataTemplate.user.businessInfo.entityName}</h2>
                <h2>ABN: ${this.dataTemplate.user && this.dataTemplate.user.businessInfo.abnCode}</h2>
                <h3>01/${this.dataTemplate.filter.beginMonth < 10 ? '0' + this.dataTemplate.filter.beginMonth : this.dataTemplate.filter.beginMonth}/${this.dataTemplate.filter.beginYear} through ${DateHelper.getDateEndMonth(Number(this.dataTemplate.filter.endMonth), Number(this.dataTemplate.filter.endYear))}/${this.dataTemplate.filter.endMonth < 10 ? '0' + this.dataTemplate.filter.endMonth : this.dataTemplate.filter.endMonth}/${this.dataTemplate.filter.endYear}</h3>
            </div>
            <div class="content">
                <table><tbody>
                    ${this.render()}
                </tbody></table>
            </div>
            </body>
        </html>`;
    }

    render() {
        if (!this.dataTemplate || !this.dataTemplate.items || !this.dataTemplate.items.length)
            return '';

        let str = '';
        this.dataTemplate.items.forEach(item => {
            str += this.renderByGroup(item, 0);
        });
        return str;
    }

    renderByGroup(data, decentralized) {
        if (!data)
            return '';
        let str = `
        <tr class="${this.addClassStyleGroup(data, decentralized)}">
            <td>${data.name}</td>
            <td></td>
        </tr>`;

        (data.coas || []).forEach(item => {
            str += `<tr class="item-coa">
                <td>${item.name}</td>
                <td>${DataHelper.convertToCurrency(item.total, {format: 'en-US', currency: 'USD'})}</td>
            </tr>`;
        });

        (data.items || []).forEach(item => {
            str += this.renderByGroup(item, 1);
        });

        if (data.total || data.total === 0) {
            str += `<tr class="total-item ${this.addClassTotal(data, decentralized)}">
                <td>Total ${data.name}</td>
                <td>${DataHelper.convertToCurrency(data.total, {format: 'en-US', currency: 'USD'})}</td>
            </tr>`;
        }
        return str;
    }

    addClassStyleGroup(data, decentralized) {
        if (decentralized === 0) {
            if (data.name === 'Equity')
                return 'main-group equity';
            else
                return 'main-group';
        }
        else if (decentralized === 1 && (data.items || data.name === 'Current Asset')) {
            return 'sub-group';
        }
        else {
            return 'children-sub-group';
        }
    }

    addClassTotal(data, decentralized) {
        if (decentralized === 0) {
            return 'total-main-group';
        }
        else if (decentralized === 1 && (data.items || data.name === 'Current Asset')) {
            return 'total-sub-group';
        }
        else {
            return 'total-children-sub-group';
        }
    }
}

Object.seal(TemplateBalanceSheetPdf);
export default TemplateBalanceSheetPdf;
