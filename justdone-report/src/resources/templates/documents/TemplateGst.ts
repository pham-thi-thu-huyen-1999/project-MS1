import Project from '../../../config/Project';

class TemplateGstPdf {
    dataTemplate: any;
    isPreview: boolean;
    constructor(dataTemplate: any, isPreview: boolean) {
        this.dataTemplate = dataTemplate;
        this.isPreview = isPreview;
    }

    renderHtml() {
        console.log('end month==>', this.dataTemplate.data);
        return `
        <html>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="initial-scale=1.0">
        <meta name="format-detection" content="telephone=no">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <title>Gst</title>
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
                font-size: ${this.isPreview ? '20px': '8px'};
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
                font-size: ${this.isPreview ? '16px' : '8px'};
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
                padding: 7px 10px;
                text-align: left;
                width: auto;
            }
            h1{
                font-size: ${this.isPreview ? '20px': '12px'};
                line-height: 10px;
                margin-bottom: 0px;
                margin-top: 30px;
                font-weight: 700;
                font-family: 'CircularStd-Bold';
            }
            h3{
                font-size: ${this.isPreview ? '18px': '9px'};
                font-weight: 300;
                margin-bottom: 60px;
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
        </style>
        </head>
        <body>
           <div class="title">
                <h1>GST [SUMMARY - CASH]</h1>
                <h2>${this.dataTemplate.user && this.dataTemplate.user.businessInfo.entityName}</h2>
                <h2>ABN: ${this.dataTemplate.user && this.dataTemplate.user.businessInfo.abnCode}</h2>
                <h3>01/${this.dataTemplate.filter.beginMonth < 10 ? '0' + this.dataTemplate.filter.beginMonth : this.dataTemplate.filter.beginMonth}/${this.dataTemplate.filter.beginYear} through ${this.daysInMonth(this.dataTemplate.filter.endMonth, this.dataTemplate.filter.endYear)}/${this.dataTemplate.filter.endMonth < 10 ? '0' + this.dataTemplate.filter.endMonth : this.dataTemplate.filter.endMonth}/${this.dataTemplate.filter.endYear}</h3>
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
                        ${this.renderBody()}
                        <tr class="bold border-top">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Total:</td>
                            <td>$${parseFloat(this.dataTemplate.data.taxCollected.toFixed(2))}</td>
                            <td>$${parseFloat(this.dataTemplate.data.taxPaid.toFixed(2))}</td>
                        </tr>
                    </tbody>
                </table>
           </div>
        </body>
        </html>
        `;
    }

    renderBody() {
        let htmlRender = '';
        this.dataTemplate.data.totalGroup.forEach(item => {
            htmlRender += `<tr>
                        <td>${item.code === 4400 ? 'FRE' : item.code === 4600 ? 'GST' : item.code === 4700 ? 'N-T' : 'GCA'}</td>
                        <td>${item.name}</td>
                        <td>${item.code === 4600 || item.code === 4500 ? '10.00%' : '0.00%'}</td>
                        <td>${this.convertCurence(item.saleValue)}</td>
                        <td>${this.convertCurence(item.purchaseValue)}</td>
                        <td>${item.code === 4600 || item.code === 4500 ? '$' + parseFloat(item.taxCollected.toFixed(2)) : ''}</td>
                        <td>${item.code === 4600 || item.code === 4500 ? '$' + parseFloat(item.taxPaid.toFixed(2)) : ''}</td>
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

    convertMonth(number:number, year:number) {
        let month:any = [];
        month[0] = 'January';
        month[1] = 'February';
        month[2] = 'March';
        month[3] = 'April';
        month[4] = 'May';
        month[5] = 'June';
        month[6] = 'July';
        month[7] = 'August';
        month[8] = 'September';
        month[9] = 'October';
        month[10] = 'November';
        month[11] = 'December';

        return month[number - 1];
    }

    daysInMonth(month:number, year:number) {
        return new Date(year, month, 0).getDate();
    }
}

Object.seal(TemplateGstPdf);
export default TemplateGstPdf;
