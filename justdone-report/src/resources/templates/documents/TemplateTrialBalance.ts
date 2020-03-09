import Project from '../../../config/Project';
import DateHelper from 'justdone-system-package/dest/helpers/DateHelper';

class TemplateTrialBalancePdf {
    dataTemplate: any;
    isPreview: boolean;
    constructor(dataTemplate: any, isPreview: boolean) {
        this.dataTemplate = dataTemplate;
        this.isPreview = isPreview;
    }

    renderBody() {
        let bodyRender = '';
        let totalMonthlyDebit = 0;
        let totalMonthlyCredit = 0;
        let totalYtdDebit = 0;
        let totalYtdCredit = 0;
        let softCoa = this.softArrayByCode(this.dataTemplate.listCoa);
        let comPareData = this.comPareTrialBalance(softCoa);
        comPareData.forEach(item => {
            let monthlyDebit = item.total.isCredit ? '' : this.convertCurence(item.total.amount);
            let monthlyCredit = item.total.isCredit ? this.convertCurence(item.total.amount) : '';
            let ytdDebit = item.totalYTD.isCredit ? '' : this.convertCurence(item.totalYTD.amount);
            let ytdCredit = item.totalYTD.isCredit ? this.convertCurence(item.totalYTD.amount) : '';
            totalMonthlyDebit += (monthlyDebit ? item.total.amount : 0);
            totalMonthlyCredit += (monthlyCredit ? item.total.amount : 0);
            totalYtdDebit += (ytdDebit ? item.totalYTD.amount : 0);
            totalYtdCredit += (ytdCredit ? item.totalYTD.amount : 0);
            if ((item.total.amount || item.totalYTD.amount)) {
                bodyRender += `<tr>
                    <td>${item.coa.name}</td>
                    <td class="text-right">${monthlyDebit}</td>
                    <td class="text-right">${monthlyCredit}</td>
                    <td class="text-right">${ytdDebit}</td>
                    <td class="text-right">${ytdCredit}</td>
                </tr>`;   
            }
        });

        bodyRender += `<tr class="bold border-top">
        <td>Total:</td>
        <td class="text-right">${this.convertCurence(totalMonthlyDebit)}</td>
        <td class="text-right">${this.convertCurence(totalMonthlyCredit)}</td>
        <td class="text-right">${this.convertCurence(totalYtdDebit)}</td>
        <td class="text-right">${this.convertCurence(totalYtdCredit)}</td>
    </tr>`;
        console.log("body...", bodyRender)
        return bodyRender;
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
        <title>Trial Balance</title>
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
                font-size: ${this.isPreview ? '16px' : '8px'};
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
                font-size: ${this.isPreview ? '20px' : '12px'};
                line-height: 10px;
                margin-bottom: 0px;
                margin-top: 30px;
                font-weight: 700;
                font-family: 'CircularStd-Bold';
            }
            h3{
                font-size: ${this.isPreview ? '17px' : '9px'};
                font-weight: 300;
                margin-bottom: 60px;
            }
            .border-top {
                border-top: 1px solid #000000;
            }
            .header-title th{
                font-size: ${this.isPreview ? '17px' : '9px'}
            }
            .bold td {
                font-size: ${this.isPreview ? '17px' : '9px'};
                font-family: 'CircularStd-Bold';
                font-weight: 700;
            }
            .text-right {
                text-align: right;
            }
            .text-center {
                text-align: center;
            }
        </style>
        </head>
        <body>
           <div class="title">
                <h1>TRIAL BALANCE</h1>
                <h2>${this.dataTemplate.user && this.dataTemplate.user.businessInfo.entityName}</h2>
                <h2>ABN: ${this.dataTemplate.user && this.dataTemplate.user.businessInfo.abnCode}</h2>
                <h3>As of ${this.convertMonth(this.dataTemplate.filter.endMonth)} ${this.dataTemplate.filter.endYear}</h3>
            </div>
           <div class="content">
                <table>
                    <tbody>
                        <tr class="header-title">
                            <th>Account</th>
                            <th class="text-center">Debit</th>
                            <th class="text-center">Credit</th>
                            <th class="text-center">YTD Debit</th>
                            <th class="text-center">YTD Credit</th>
                        </tr>
                        ${this.renderBody()}
                    </tbody>
                </table>
           </div>
        </body>
        </html>
        `;
    }

    convertCurence(number:number) {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });
        return number >= 0 ? `${formatter.format(number)}` : `(${Math.abs(number).toFixed(2)})`;
    }

    convertMonth(number:number) {
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

    softArrayByCode(arrayList){
        let array = arrayList
        array.forEach(element => {
            let coaCode = element.coa.coaCode;
            if (coaCode !== undefined) {
                let coaSplit = coaCode.replace('-', ''); 
                let newcoaCode = Number(coaSplit);
                element.coa.coaCode = newcoaCode;
            } else {
                element.coa.coaCode = 11200;
            }
        });
        array = array.sort((a, b) => {
            if(a.coa.coaCode< b.coa.coaCode) return -1;
            if(a.coa.coaCode >b.coa.coaCode) return 1;
            return 0;
        //  return a.coa.coaCode - b.coa.coaCode
        });
        return array;
    }

    comPareTrialBalance(value){
        let res = value.reduce((res, cur) => {
          if(res.indexOf(cur.coa.name) === -1) {
            res.push(cur.coa.name);
          }
          return res;
        }, [])
        .map((name: any) => {
          let amount = 0;
          let amountYTD = 0;
          let coa:any = {};
          let total:any = {};
          let totalYTD:any= {};
          let coaCode = 0;
          value.filter(_el => {
            return _el.coa.name === name
          })
          .map(_el => {
            amount += _el.total.amount;
            coaCode = _el.coaCode;
            amountYTD += _el.totalYTD.amount;
            coa.name = name;
            coa.coaCode = _el.coa.coaCode;
      
            total.isCredit = _el.total.isCredit;
            total.amount = amount
      
            totalYTD.isCredit = _el.totalYTD.isCredit;
            totalYTD.amount = amountYTD;
          })
          return {
            coa,
            total,
            totalYTD
          }
        })
        return res;
      }
}

Object.seal(TemplateTrialBalancePdf);
export default TemplateTrialBalancePdf;
