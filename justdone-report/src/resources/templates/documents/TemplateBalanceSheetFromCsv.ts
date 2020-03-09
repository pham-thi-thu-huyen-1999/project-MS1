import Project from '../../../config/Project';
// import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';

class TemplateBalanceSheetFromCsv {
    data: any;
    isPreview: boolean;
    constructor(data: any, isPreview: boolean) {
        this.data = data;
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

            .font-bold td{
                font-family: 'CircularStd-Bold';
                font-weight: 700;
                font-size: ${this.isPreview ? '20px' : '8px'};
            }
    
            .title{
                text-align: center;
                font-size: ${this.isPreview ? '24px' : '12px'};
            }

            .title h1{
                font-size: ${this.isPreview ? '24px' : '12px'};
                line-height: 15px;
                text-transform: uppercase;
                font-family: 'CircularStd-Bold';
                font-weight: 700;

            }
            .title h2{
                font-size: ${this.isPreview ? '18px' : '10px'};
                line-height: 15px;
                text-transform: uppercase;
                font-family: 'CircularStd-Bold';
                font-weight: 700;

            }
            .title h3{
                font-size: ${this.isPreview ? '20px' : '9px'};
                font-weight: 300;
                margin-top: 8px;
                margin-bottom: 20px;
            }
    
            .bold{
                font-family: 'CircularStd-Bold';
                font-weight: 700;
            }
            table{
                width: 100%;
            }
            table, th, td {
                border-collapse: collapse;
                font-size: ${this.isPreview ? '20px' : '8px'};
                font-family: 'CircularStd-Book';
                font-weight: 400;
            }
            table tr:nth-child(even) {
                background-color: #f3f3f3;
            }
            table tr:nth-child(odd) {
                background-color: #fff;
            }
            table tr>td:last-child, table tr>th:last-child{
                width: 20%
            }
            td, th {
                padding: 5px 0px;
                padding-right: 10px;
                text-align: left;
                font-size: ${this.isPreview ? '18px' : '8px'}
            }
            tr{
                height: 25px;
            }
            tr.underlined{
                border-top: 1px solid #0b0b0b;
                font-size: ${this.isPreview ? '18px' : '8px'},
            }

            .text-right{
                text-align: right;
            }
            
        </style>
        </head>
            <body>
                <div class="title">
                    <h1>BALANCE SHEET</h1>
                    <h2>${this.data.user && this.data.user.businessInfo.entityName} <br /> ABN: ${this.data.user && this.data.user.businessInfo.abnCode} </h2>
                    <h3>As of ${this.converMonthToWord(this.data.years.month)}  ${this.data.years.year}</h3>
                </div>
                <div class="content">
                    <table>
                        <tbody>
                            ${this.renderTable()}
                        </tbody>
                    </table>
                </div>
            </body>
        </html>`;
    }

    renderTable() {
        let data = this.data.templateData;

        if (!data)
            return '';
        let str = '';

        if (data.asset && data.asset.type) {
            str += `
                <tr  class="${this.addStyleTr(data.asset)}">
                    <td style="padding-left: ${data.asset.type.spacing * 10}px; font-size: ${+data.asset.type.fontSize !== 0 ? this.isPreview ? 20 : data.asset.type.fontSize : ''}px; padding-top: ${+data.asset.type.paddingTop !== 0 ? data.asset.type.paddingTop : ''}px;">${data.asset.name}</td>
                    <td style="font-size: ${+data.asset.type.fontSize !== 0 ? this.isPreview ? 18 : data.asset.type.fontSize : ''}px; padding-top: ${+data.asset.type.paddingTop !== 0 ? data.asset.type.paddingTop : ''}px;" class="text-right"></td>
                </tr>
                <tr  class="${this.addStyleTr(data.asset.currentAsset)}">
                    <td style="padding-left: ${data.asset.currentAsset.type.spacing * 10}px; font-size: ${+data.asset.currentAsset.type.fontSize !== 0 ? this.isPreview ? 18 : data.asset.currentAsset.type.fontSize : ''}px; padding-top: ${+data.asset.currentAsset.type.paddingTop !== 0 ? data.asset.currentAsset.type.paddingTop : ''}px;">${data.asset.currentAsset.name}</td>
                    <td style="font-size: ${+data.asset.currentAsset.type.fontSize !== 0 ? this.isPreview ? 18 : data.asset.currentAsset.type.fontSize : ''}px; padding-top: ${+data.asset.currentAsset.type.paddingTop !== 0 ? data.asset.currentAsset.type.paddingTop : ''}px;" class="text-right"></td>
                </tr>
            `;
            const dataCoa = this.compareFilterCoa(data.asset.currentAsset.dataCoa);
            dataCoa.forEach(item => {
                str += `
                <tr  class="${this.addStyleTr(item)}">
                    <td style="padding-left: ${item.type.spacing * 10}px; font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 20 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;">${item.name}</td>
                    <td style="font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(item.total)}</td>
                </tr>
                `;
            });
            if (data.asset.currentAsset || data.asset.nonCurrentAsset)
                str += `
                <tr  class="${this.addStyleTr(data.asset.currentAsset.totalCurrentAsset)}">
                    <td style="padding-left: ${data.asset.currentAsset.totalCurrentAsset.type.spacing * 10}px; font-size: ${+data.asset.currentAsset.totalCurrentAsset.type.fontSize !== 0 ? this.isPreview ? 18 : data.asset.currentAsset.totalCurrentAsset.type.fontSize : ''}px; padding-top: ${+data.asset.currentAsset.totalCurrentAsset.type.paddingTop !== 0 ? data.asset.currentAsset.totalCurrentAsset.type.paddingTop : ''}px;">${data.asset.currentAsset.totalCurrentAsset.name}</td>
                    <td style="font-size: ${+data.asset.currentAsset.totalCurrentAsset.type.fontSize !== 0 ? this.isPreview ? 18 : data.asset.currentAsset.totalCurrentAsset.type.fontSize : ''}px; padding-top: ${+data.asset.currentAsset.totalCurrentAsset.type.paddingTop !== 0 ? data.asset.currentAsset.totalCurrentAsset.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(data.asset.currentAsset.totalCurrentAsset.total)}</td>
                </tr>
                <tr  class="${this.addStyleTr(data.asset.nonCurrentAsset)}">
                    <td style="padding-left: ${data.asset.nonCurrentAsset.type.spacing * 10}px; font-size: ${+data.asset.nonCurrentAsset.type.fontSize !== 0 ? this.isPreview ? 18 : data.asset.nonCurrentAsset.type.fontSize : ''}px; padding-top: ${+data.asset.nonCurrentAsset.type.paddingTop !== 0 ? data.asset.nonCurrentAsset.type.paddingTop : ''}px;">${data.asset.nonCurrentAsset.name}</td>
                    <td style="font-size: ${+data.asset.nonCurrentAsset.type.fontSize !== 0 ? this.isPreview ? 18 : data.asset.nonCurrentAsset.type.fontSize : ''}px; padding-top: ${+data.asset.nonCurrentAsset.type.paddingTop !== 0 ? data.asset.nonCurrentAsset.type.paddingTop : ''}px;" class="text-right"></td>
                </tr>
                `;
            const dataNonCurrentAsset = data.asset.nonCurrentAsset.data.filter(item => item.total !== 0 && item.total !== -0);
            dataNonCurrentAsset.forEach(item => {
                str += `
                <tr  class="${this.addStyleTr(item)}">
                    <td style="padding-left: ${item.type.spacing * 5}px; font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;">${item.name}</td>
                    <td style="font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;" class="text-right"></td>
                </tr>
                `;
                if (item.dataCoa.length) {
                    const itemDataCoa = this.compareFilterCoa(item.dataCoa);
                    itemDataCoa.forEach(itemCoa => {
                        str += `
                        <tr  class="${this.addStyleTr(itemCoa)}">
                            <td style="padding-left: ${itemCoa.type.spacing * 10}px; font-size: ${+itemCoa.type.fontSize !== 0 ? this.isPreview ? 18 : itemCoa.type.fontSize : ''}px; padding-top: ${+itemCoa.type.paddingTop !== 0 ? itemCoa.type.paddingTop : ''}px;">${itemCoa.name}</td>
                            <td style="font-size: ${+itemCoa.type.fontSize !== 0 ? this.isPreview ? 18 : itemCoa.type.fontSize : ''}px; padding-top: ${+itemCoa.type.paddingTop !== 0 ? itemCoa.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(itemCoa.total)}</td>
                        </tr>
                        `;
                    });
                }
                str += `
                        <tr  class="${this.addStyleTr(item)}">
                            <td style="padding-left: ${item.type.spacing * 10}px; font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;">Total ${item.name}</td>
                            <td style="font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(item.total)}</td>
                        </tr>
                    `;
            });
            if (data.asset.nonCurrentAsset.totalNonCurrentAsset || data.asset.totalAsset)
                str += `
                <tr  class="${this.addStyleTr(data.asset.nonCurrentAsset.totalNonCurrentAsset)}">
                    <td style="padding-left: ${data.asset.nonCurrentAsset.totalNonCurrentAsset.type.spacing * 10}px; font-size: ${+data.asset.nonCurrentAsset.totalNonCurrentAsset.type.fontSize !== 0 ? this.isPreview ? 18 : data.asset.nonCurrentAsset.totalNonCurrentAsset.type.fontSize : ''}px; padding-top: ${+data.asset.nonCurrentAsset.totalNonCurrentAsset.type.paddingTop !== 0 ? data.asset.nonCurrentAsset.totalNonCurrentAsset.type.paddingTop : ''}px;">${data.asset.nonCurrentAsset.totalNonCurrentAsset.name}</td>
                    <td style="font-size: ${+data.asset.nonCurrentAsset.totalNonCurrentAsset.type.fontSize !== 0 ? this.isPreview ? 18 : data.asset.nonCurrentAsset.totalNonCurrentAsset.type.fontSize : ''}px; padding-top: ${+data.asset.nonCurrentAsset.totalNonCurrentAsset.type.paddingTop !== 0 ? data.asset.nonCurrentAsset.totalNonCurrentAsset.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(data.asset.nonCurrentAsset.totalNonCurrentAsset.total)}</td>
                </tr>
                <tr  class="${this.addStyleTr(data.asset.totalAsset)}">
                    <td style="padding-left: ${data.asset.totalAsset.type.spacing * 10}px; font-size: ${+data.asset.totalAsset.type.fontSize !== 0 ? this.isPreview ? 18 : data.asset.totalAsset.type.fontSize : ''}px; padding-top: ${+data.asset.totalAsset.type.paddingTop !== 0 ? data.asset.totalAsset.type.paddingTop : ''}px;">${data.asset.totalAsset.name}</td>
                    <td style="font-size: ${+data.asset.totalAsset.type.fontSize !== 0 ? this.isPreview ? 18 : data.asset.totalAsset.type.fontSize : ''}px; padding-top: ${+data.asset.totalAsset.type.paddingTop !== 0 ? data.asset.totalAsset.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(data.asset.totalAsset.total)}</td>
                </tr>
                `;
        }
        console.log('log ================>', JSON.stringify(data.liabilities))
        if (data.liabilities && data.liabilities.type) {
            str += `
                <tr  class="${this.addStyleTr(data.liabilities)}">
                    <td style="padding-left: ${data.liabilities.type.spacing * 10}px; font-size: ${+data.liabilities.type.fontSize !== 0 ? this.isPreview ? 18 : data.liabilities.type.fontSize : ''}px; padding-top: ${+data.liabilities.type.paddingTop !== 0 ? data.liabilities.type.paddingTop : ''}px;">${data.liabilities.name}</td>
                    <td style="font-size: ${+data.liabilities.type.fontSize !== 0 ? this.isPreview ? 18 : data.liabilities.type.fontSize : ''}px; padding-top: ${+data.liabilities.type.paddingTop !== 0 ? data.liabilities.type.paddingTop : ''}px;" class="text-right"></td>
                </tr>
                <tr  class="${this.addStyleTr(data.liabilities.currentLiabilities)}">
                    <td style="padding-left: ${data.liabilities.currentLiabilities.type.spacing * 10}px; font-size: ${+data.liabilities.currentLiabilities.type.fontSize !== 0 ? this.isPreview ? 18 : data.liabilities.currentLiabilities.type.fontSize : ''}px; padding-top: ${+data.liabilities.currentLiabilities.type.paddingTop !== 0 ? data.liabilities.currentLiabilities.type.paddingTop : ''}px;">${data.liabilities.currentLiabilities.name}</td>
                    <td style="font-size: ${+data.liabilities.currentLiabilities.type.fontSize !== 0 ? this.isPreview ? 18 : data.liabilities.currentLiabilities.type.fontSize : ''}px; padding-top: ${+data.liabilities.currentLiabilities.type.paddingTop !== 0 ? data.liabilities.currentLiabilities.type.paddingTop : ''}px;" class="text-right"></td>
                </tr>
            `;
            const dataCurrentLiabilitiesTemp = data.liabilities.currentLiabilities.data.filter(item => item.total !== 0 && item.total !== -0);
            const dataCurrentLiabilities = this.comPareDataCoa(dataCurrentLiabilitiesTemp);
            dataCurrentLiabilities.forEach(item => {
                item.type = {
                    spacing: 2,
                    bold: 0,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: this.isPreview ? 18 : 9,
                };
                str += `
                <tr  class="${this.addStyleTr(item)}">
                    <td style="padding-left: ${item.type.spacing * 5}px; font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;">${item.name}</td>
                    <td style="font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;" class="text-right"></td>
                </tr>
                `;
                if (item.dataCoa.length) {
                    const itemDataCoa = this.compareFilterCoa(item.dataCoa)
                    itemDataCoa.forEach(itemCoa => {
                        itemCoa.type = {
                            spacing: 3,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: this.isPreview ? 18 : 9
                        };
                        str += `
                        <tr  class="${this.addStyleTr(itemCoa)}">
                            <td style="padding-left: ${itemCoa.type.spacing * 10}px; font-size: ${+itemCoa.type.fontSize !== 0 ? this.isPreview ? 18 : itemCoa.type.fontSize : ''}px; padding-top: ${+itemCoa.type.paddingTop !== 0 ? itemCoa.type.paddingTop : ''}px;">${itemCoa.name}</td>
                            <td style="font-size: ${+itemCoa.type.fontSize !== 0 ? this.isPreview ? 18 : itemCoa.type.fontSize : ''}px; padding-top: ${+itemCoa.type.paddingTop !== 0 ? itemCoa.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(itemCoa.total)}</td>
                        </tr>
                        `;
                    });
                    str += `
                        <tr  class="${this.addStyleTr(item)}">
                            <td style="padding-left: ${item.type.spacing * 10}px; font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;">Total ${item.name}</td>
                            <td style="font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(item.total)}</td>
                        </tr>
                    `;
                }
            });
            if (data.liabilities.currentLiabilities.totalCurrentLiabilities || data.liabilities.nonCurrentLiabilities)
                str += `
                <tr  class="${this.addStyleTr(data.liabilities.currentLiabilities.totalCurrentLiabilities)}">
                    <td style="padding-left: ${data.liabilities.currentLiabilities.totalCurrentLiabilities.type.spacing * 10}px; font-size: ${+data.liabilities.currentLiabilities.totalCurrentLiabilities.type.fontSize !== 0 ? this.isPreview ? 18 : data.liabilities.currentLiabilities.totalCurrentLiabilities.type.fontSize : ''}px; padding-top: ${+data.liabilities.currentLiabilities.totalCurrentLiabilities.type.paddingTop !== 0 ? data.liabilities.currentLiabilities.totalCurrentLiabilities.type.paddingTop : ''}px;">${data.liabilities.currentLiabilities.totalCurrentLiabilities.name}</td>
                    <td style="font-size: ${+data.liabilities.currentLiabilities.totalCurrentLiabilities.type.fontSize !== 0 ? this.isPreview ? 18 : data.liabilities.currentLiabilities.totalCurrentLiabilities.type.fontSize : ''}px; padding-top: ${+data.liabilities.currentLiabilities.totalCurrentLiabilities.type.paddingTop !== 0 ? data.liabilities.currentLiabilities.totalCurrentLiabilities.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(data.liabilities.currentLiabilities.totalCurrentLiabilities.total)}</td>
                </tr>
                <tr  class="${this.addStyleTr(data.liabilities.nonCurrentLiabilities)}">
                    <td style="padding-left: ${data.liabilities.nonCurrentLiabilities.type.spacing * 10}px; font-size: ${+data.liabilities.nonCurrentLiabilities.type.fontSize !== 0 ? this.isPreview ? 18 : data.liabilities.nonCurrentLiabilities.type.fontSize : ''}px; padding-top: ${+data.liabilities.nonCurrentLiabilities.type.paddingTop !== 0 ? data.liabilities.nonCurrentLiabilities.type.paddingTop : ''}px;">${data.liabilities.nonCurrentLiabilities.name}</td>
                    <td style="font-size: ${+data.liabilities.nonCurrentLiabilities.type.fontSize !== 0 ? this.isPreview ? 18 : data.liabilities.nonCurrentLiabilities.type.fontSize : ''}px; padding-top: ${+data.liabilities.nonCurrentLiabilities.type.paddingTop !== 0 ? data.liabilities.nonCurrentLiabilities.type.paddingTop : ''}px;" class="text-right"></td>
                </tr>
                `;
            const dataNonCurrentLiabilities = data.liabilities.nonCurrentLiabilities.data.filter(item => item.total !== 0 && item.total !== -0)
            dataNonCurrentLiabilities.forEach(item => {
                item.type = {
                    spacing: 2,
                    bold: 0,
                    underlined: 0,
                    paddingTop: 0,
                    fontSize: this.isPreview ? 18 : 9
                };
                str += `
                <tr  class="${this.addStyleTr(item)}">
                    <td style="padding-left: ${item.type.spacing * 5}px; font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;">${item.name}</td>
                    <td style="font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;" class="text-right"></td>
                </tr>
                `;
                if (item.dataCoa.length) {
                    const itemDataCoa = this.compareFilterCoa(item.dataCoa);
                    itemDataCoa.forEach(itemCoa => {
                        itemCoa.type = {
                            spacing: 3,
                            bold: 0,
                            underlined: 0,
                            paddingTop: 0,
                            fontSize: this.isPreview ? 18 : 9
                        };
                        str += `
                        <tr  class="${this.addStyleTr(itemCoa)}">
                            <td style="padding-left: ${itemCoa.type.spacing * 10}px; font-size: ${+itemCoa.type.fontSize !== 0 ? this.isPreview ? 18 : itemCoa.type.fontSize : ''}px; padding-top: ${+itemCoa.type.paddingTop !== 0 ? itemCoa.type.paddingTop : ''}px;">${itemCoa.name}</td>
                            <td style="font-size: ${+itemCoa.type.fontSize !== 0 ? this.isPreview ? 18 : itemCoa.type.fontSize : ''}px; padding-top: ${+itemCoa.type.paddingTop !== 0 ? itemCoa.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(itemCoa.total)}</td>
                        </tr>
                        `;
                    });
                    str += `
                    <tr  class="${this.addStyleTr(item)}">
                        <td style="padding-left: ${item.type.spacing * 10}px; font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;">Total ${item.name}</td>
                        <td style="font-size: ${+item.type.fontSize !== 0 ? this.isPreview ? 18 : item.type.fontSize : ''}px; padding-top: ${+item.type.paddingTop !== 0 ? item.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(item.total)}</td>
                    </tr>
                `;
                }
            });
            if (data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities || data.liabilities.totalLiabilities)
                str += `
                <tr  class="${this.addStyleTr(data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities)}">
                    // <td style="padding-left: ${data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.type.spacing * 10}px; font-size: ${+data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.type.fontSize !== 0 ? this.isPreview ? 18 : data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.type.fontSize : ''}px; padding-top: ${+data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.type.paddingTop !== 0 ? data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.type.paddingTop : ''}px;">Total ${data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.name}</td>
                    <td style="font-size: ${+data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.type.fontSize !== 0 ? this.isPreview ? 18 : data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.type.fontSize : ''}px; padding-top: ${+data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.type.paddingTop !== 0 ? data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(data.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities.total)}</td>
                </tr>
                <tr  class="${this.addStyleTr(data.liabilities.totalLiabilities)}">
                    <td style="padding-left: ${data.liabilities.totalLiabilities.type.spacing * 10}px; font-size: ${+data.liabilities.totalLiabilities.type.fontSize !== 0 ? this.isPreview ? 18 : data.liabilities.totalLiabilities.type.fontSize : ''}px; padding-top: ${+data.liabilities.totalLiabilities.type.paddingTop !== 0 ? data.liabilities.totalLiabilities.type.paddingTop : ''}px;">${data.liabilities.totalLiabilities.name}</td>
                    <td style="font-size: ${+data.liabilities.totalLiabilities.type.fontSize !== 0 ? this.isPreview ? 18 : data.liabilities.totalLiabilities.type.fontSize : ''}px; padding-top: ${+data.liabilities.totalLiabilities.type.paddingTop !== 0 ? data.liabilities.totalLiabilities.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(data.liabilities.totalLiabilities.total)}</td>
                </tr>
                `;
        }

        if (data.netAssets && data.netAssets.type) {
            str += `
                <tr  class="${this.addStyleTr(data.netAssets)}">
                    <td style="padding-left: ${data.netAssets.type.spacing * 10}px; font-size: ${+data.netAssets.type.fontSize !== 0 ? this.isPreview ? 18 : data.netAssets.type.fontSize : ''}px; padding-top: ${+data.netAssets.type.paddingTop !== 0 ? data.netAssets.type.paddingTop : ''}px;">${data.netAssets.name}</td>
                    <td style="font-size: ${+data.netAssets.type.fontSize !== 0 ? this.isPreview ? 18 : data.netAssets.type.fontSize : ''}px; padding-top: ${+data.netAssets.type.paddingTop !== 0 ? data.netAssets.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(data.netAssets.totalNetAssets)}</td>
                </tr>
                `;
        }

        if (data.equity && data.equity.type) {
            str += `
                <tr  class="${this.addStyleTr(data.equity)}">
                    <td style="padding-left: ${data.equity.type.spacing * 10}px; font-size: ${+data.equity.type.fontSize !== 0 ? this.isPreview ? 18 : data.equity.type.fontSize : ''}px; padding-top: ${+data.equity.type.paddingTop !== 0 ? data.equity.type.paddingTop : ''}px;">${data.equity.name}</td>
                    <td style="font-size: ${+data.equity.type.fontSize !== 0 ? this.isPreview ? 18 : data.equity.type.fontSize : ''}px; padding-top: ${+data.equity.type.paddingTop !== 0 ? data.equity.type.paddingTop : ''}px;" class="text-right"></td>
                </tr>
            `;

            if (data.equity.dataCoa.length) {
                const dataEquity = this.compareFilterCoa(data.equity.dataCoa);
                dataEquity.forEach(itemCoa => {
                    itemCoa.type = {
                        spacing: 1,
                        bold: 0,
                        underlined: 0,
                        paddingTop: 0,
                        fontSize: this.isPreview ? 18 : 9
                    };
                    str += `
                    <tr  class="${this.addStyleTr(itemCoa)}">
                        <td style="padding-left: ${itemCoa.type.spacing * 10}px; font-size: ${+itemCoa.type.fontSize !== 0 ? this.isPreview ? 18 : itemCoa.type.fontSize : ''}px; padding-top: ${+itemCoa.type.paddingTop !== 0 ? itemCoa.type.paddingTop : ''}px;">${itemCoa.name}</td>
                        <td style="font-size: ${+itemCoa.type.fontSize !== 0 ? this.isPreview ? 18 : itemCoa.type.fontSize  : ''}px; padding-top: ${+itemCoa.type.paddingTop !== 0 ? itemCoa.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(itemCoa.total)}</td>
                    </tr>
                    `;
                });
            }
            if (data.equity.totalEquity)
                str += `
                <tr  class="${this.addStyleTr(data.equity.totalEquity)}">
                    <td style="padding-left: ${data.equity.totalEquity.type.spacing * 10}px; font-size: ${+data.equity.totalEquity.type.fontSize !== 0 ? this.isPreview ? 18 : data.equity.totalEquity.type.fontSize : ''}px; padding-top: ${+data.equity.totalEquity.type.paddingTop !== 0 ? data.equity.totalEquity.type.paddingTop : ''}px;">${data.equity.totalEquity.name}</td>
                    <td style="font-size: ${+data.equity.totalEquity.type.fontSize !== 0 ? this.isPreview ? 18 : data.equity.totalEquity.type.fontSize : ''}px; padding-top: ${+data.equity.totalEquity.type.paddingTop !== 0 ? data.equity.totalEquity.type.paddingTop : ''}px;" class="text-right">${this.convertCurence(data.equity.totalEquity.total)}</td>
                </tr>
                `;
        }

        return str;
    }

    addStyleTr(item) {
        let style = '';
        if (item && item.type && +item.type.underlined === 1)
            style += 'underlined ';
        if (item && item.type && +item.type.bold === 1)
            style += 'font-bold';
        return style;
    }

    converMonthToWord(value) {
        let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return month[value - 1];
    }

    convertCurence(number:number) {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });
        return number ? `${formatter.format(number)}` : `${Math.abs(number).toFixed(2)}`;
    }

    /*
    / VI: Function gop COA roi tinh tong loai tru nhung COA 0$
    / EN: Function compare COA and remove COA have balance 0$
    */
    compareFilterCoa(arr: any){
        let tempArr = arr.filter(item => item.total !== 0 && item.total !== -0)
        let obj:any = [];
        let newArr:any = [];

        tempArr.forEach((item: { name: string | number; total: string | number; }) => {
            item.name = item.name.toString()
            if(obj[item.name] === undefined) {
                obj[item.name] = item.total;
            } else {
                obj[item.name] += item.total;
            }
        })
        for(const [key, value] of Object.entries(obj)) {
            newArr = [...newArr, { name: key, total: value, type: {
                spacing: 2,
                bold: 0,
                underlined: 0,
                paddingTop: 0,
                fontSize: this.isPreview ? 12 : 9
            } } ];
        }
        return newArr.filter(item => item.total !== 0);
    }

    comPareDataCoa(value) {
        let res = value.reduce(function(res, currentValue) {
            if (res.indexOf(currentValue.name) === -1) {
                res.push(currentValue.name);
            }
            return res;
        }, []).map((name) => {
            let total = 0
            let temp: any = []
            let type = null;
            value.filter(function(_el) {
                return _el.name === name;
            }).map(function(_el) {
                total += _el.total
                type = _el.type
                let typeCoa = null
                let res = _el.dataCoa.reduce((res, cur) => {
                    if (res.indexOf(cur.name) === -1) {
                        res.push(cur.name)
                    }
                    return res
                }, []).map((name) => {
                    let total = 0;
                    _el.dataCoa.filter((_el) => {
                        return _el.name === name
                    }).map((_el) => {
                        total += _el.total
                        typeCoa = _el.type
                    })
                    return {
                        total: total,
                        name: name,
                        type: typeCoa
                    }
                })
                res.map((item) => {
                    temp = [...temp, item]
                })
            })
            return {
                name: name,
                total: total,
                dataCoa: temp,
                type: type
            }
        });
        for (let index in res) {
            let data = res[index].dataCoa.reduce((res, cur) => {
                if (res.indexOf(cur.name) === -1) {
                    res.push(cur.name);
                }
                return res;
            }, []).map((name) => {
                let total = 0;
                let type = null
                res[index].dataCoa.filter((_el) => {
                        return _el.name === name
                    })
                    .map(_el => {
                        total += _el.total;
                        type = _el.type
                    })
                return {
                    name: name,
                    total: total,
                    type: type
                }
            })
            res[index].dataCoa = []
            data.map(item => {
                res[index].dataCoa.push(item)
            })
        }
        return res;
    }
}

Object.seal(TemplateBalanceSheetFromCsv);
export default TemplateBalanceSheetFromCsv;
