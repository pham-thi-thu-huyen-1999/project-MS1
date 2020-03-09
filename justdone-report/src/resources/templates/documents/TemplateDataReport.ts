import Project from '../../../config/Project';

export default class TemplateDataReport {
    templateDateReport: string;
    client: any;
    date: {
        beginYear: '',
        beginMonth: '',
        endYear: '',
        endMonth: ''
    }
    groups: any;
    users: any;
    dataReports: any;
    types: any;
    product: any;
    clients: any;

    constructor(clients: any, date: any, dataReports: any, types: any, product: any) {
        this.clients = clients;
        this.client = clients[0];
        this.date = date;
        this.types = types;
        this.product = product;
        this.dataReports = this.handleGetDataReport(dataReports);
        this.templateDateReport = `
        <html>
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="initial-scale=1.0">
            <meta name="format-detection" content="telephone=no">
            <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
            <meta name="x-apple-disable-message-reformatting">
            <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville" rel="stylesheet">
            <title>Report Data</title>
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
                .page {
                    position: relative;
                    display: block;
                }

                @media print {
                    body {
                        padding:0px 40px;
                    }
                    .pageBreak {
                        page-break-before: always;
                    }
                }

                .page.first {
                    border-left: 5px solid green;
                }
                .center {
                    text-align: center;
                }
                .titleReport{
                    font-size: 8px;
                    text-align:right;
                    font-weight: bold;
                    color:#000;
                    margin-top: 5px;
                    font-family: 'Baskerville-SemiBold';
                }
                .titleProduct{
                    font-size: 7px;
                    text-align:right;
                    font-weight: bold;
                    color:#000;
                    font-family: 'Baskerville-SemiBold';
                }
                .img-responsive {
                    width: 20%;
                    float: left;
                    display: inline-block;
                    height: auto;
                    margin-top: 20px;
                    margin-bottom: 60px;
                }
                .clientName{
                    text-align:right;
                    margin-bottom:5px;
                    font-size: 14px;
                    padding-top: 20px;
                }
                .name-label{
                    font-size: 10px;
                    color: #a3aab1;
                }
                table{
                    border-collapse: collapse;
                    width: 100%;
                }
                .table-category{

                }
                .table-category .item{
                    font-size: 8px;
                    font-family: 'CircularStd-Bold';
                    height: 30px;
                    border: 1px solid #f0f0f0;
                    padding: 9px;
                    text-align: left;
                    vertical-align: top;
                }
                .table-category .item:nth-child(8n+4), .table-category .item:nth-child(8n+6){
                    width: 72px;
                }
                .table-category .item:nth-child(8n+3), .table-category .item:nth-child(8n+5){
                    width: 42px;
                }
                .table-category .item:nth-child(8n+7){
                    width: 52px;
                }
                .table-category .item:nth-child(8n+8){
                    width: 53px;
                }
                .table-category .item.grey{
                    background-color: rgba(241, 241, 241, 0.63);
                }
                .table-category .item.title{
                    width: 123px;
                }
                .table-category .item.title span{
                    padding-left: 10px;
                }
                .table-category .item.center{
                    text-align: center;
                }
                .table-content{

                }
                .table-category .item.space-left span{
                    padding-left: 0;
                    margin-left: -5px;
                }
                .table-content .item-title{
                    width: 123px;
                    padding: 9px;
                    border: 1px solid #f0f0f0;
                    height: 30px;
                    font-size: 8px;
                }
                .table-content .item-title.bold{
                    font-family: CircularStd-Bold;
                    font-weight: 700;
                }
                .table-content .item-title.space-left{
                    padding-left: 4px;
                }
                .table-content .item-title span{
                    padding-left: 10px;
                    display: inline-block;
                }
                .table-content .item-value{
                    padding: 9px;
                    border: 1px solid #f0f0f0;
                    height: 30px;
                    font-size: 8px;
                }
                .table-content .item-value:nth-child(8n+4),.table-content .item-value:nth-child(8n+6){
                    width: 72px;
                }
                .table-content .item-value:nth-child(8n+3), .table-content .item-value:nth-child(8n+5){
                    width: 42px;
                }
                .table-content .item-value:nth-child(8n+7){
                    width: 52px;
                }
                .table-content .item-value:nth-child(8n+8){
                    width: 53px;
                }
                .box-head{
                    width: 250px;
                } 
                .box-content{
                    margin-top: 20px;
                }
            </style>
            </head>

            <body>
                <div class="page">
                    <div class="group">
                        <img class="img-responsive" src="${this.product.code === 1 ? this.product.config.domain + '/images/logo.svg' : Project.GOOGLE_STORAGE.BASE_URL + this.product.logo}">
                        <!--<div class="clientName"><span class="name-label">Client Name:</span></div>-->
                        <div class="clientName">${this.client.businessInfo && this.client.businessInfo.entityName ? this.client.businessInfo.entityName : this.client.fullName}</div>
                        <div class="titleReport">CASH REPORT SUMMARY FOR ${this.date.beginMonth}/${this.date.beginYear}-${this.date.endMonth}/${this.date.endYear}</div>
                        <div class="titleReport">Product: ${this.product.name}</div>
                    </div>
                    <!-- <div class="box-head">
                        <table class="table-category">
                            <tr>
                                <th class="item grey title">Current Month Cash Inflows</th>
                                <th class="item grey">$ 100,000.00</th>
                            </tr>
                        </table>
                        <table class="table-content">
                            <tr>
                                <td class="item-title">YTD Cash Inflows</td>
                                <td class="item-value">$ 270,000.00</td>
                            </tr>
                            <tr>
                                <td class="item-title">Cash Inflows Goal for the Year</td>
                                <td class="item-value">$ 1,000,000.00</td>
                            </tr>
                        </table>
                    </div> -->
                    <div class="box-content">
                        <table class="table-content">
                            ${this.dataReports}
                            <!-- <tr>
                                <td class="item-title bold">Employee Expense</td>
                                <td class="item-value"></td>
                                <td class="item-value"></td>
                                <td class="item-value"></td>
                                <td class="item-value"></td>
                                <td class="item-value"></td>
                                <td class="item-value"></td>
                                <td class="item-value"></td>
                            </tr>
                            <tr>
                                <td class="item-title"><span>Staff Salaries</span></td>
                                <td class="item-value"> $ 50,000.00 </td>
                                <td class="item-value">50.00%</td>
                                <td class="item-value"> $ 125,000.00 </td>
                                <td class="item-value">46.30%</td>
                                <td class="item-value"> $ 400,000.00 </td>
                                <td class="item-value">40.00%</td>
                                <td class="item-value">6.30%</td>
                            </tr>
                            <tr>
                                <td class="item-title"><span>Staff Super</span></td>
                                <td class="item-value"> $ 4,750.00 </td>
                                <td class="item-value">4.75%</td>
                                <td class="item-value"> $ 11,875.00 </td>
                                <td class="item-value">4.40%</td>
                                <td class="item-value"> $ 38,000.00 </td>
                                <td class="item-value">3.80%</td>
                                <td class="item-value">0.60%</td>
                            </tr> -->
                        </table>
                    </div>

                    <!-- <div class="group pageBreak">
                        <div class="clientName"><span class="name-label">Client Name:</span> Chuan Dentistry</div>
                        <div class="titleReport">CASH REPORT SUMMARY FOR THE MONTH OF OCTOBER 2017</div>
                    </div> -->
                </div>
            </body>
            </html>
        `;
    }

    public getTemplate() {
        return this.templateDateReport;
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

    public handleGetDataReport(dataReports) {
        if (!dataReports || !dataReports.crunchs) {
            return;
        }
        let crunchs = dataReports.crunchs;
        let budgets = dataReports.budgets;
        let template = '';
        this.users = [];

        // let budgets = dataReports.budgets;

        for (let i = 0; i < crunchs.length; i++) {
            // get group.
            if (crunchs[i].data && crunchs[i].data.length) {
                for (let y = 0; y < crunchs[i].data.length; y++) {
                    let coas = crunchs[i].data[y].coaAmounts;
                    if (coas && coas.length) {
                        for (let j = 0; j < coas.length; j++) {
                            if (coas[j].group) {
                                if (!this.groups)
                                    this.groups = [];
                                let group = this.groups.find(g => g._id.toString() === coas[j].group._id.toString());
                                if (group) {
                                    if (!group.coas.find(c => c._id.toString() === coas[j].coaId._id.toString()))
                                        group.coas.push(coas[j].coaId);
                                }
                                else
                                    this.groups.push({
                                        _id: coas[j].group._id,
                                        name: coas[j].group.name,
                                        code: coas[j].group.code,
                                        order: coas[j].group.order,
                                        coas: [coas[j].coaId]
                                    });
                            }
                        }
                    }
                }
            }

            // get user

            if (!crunchs[i].data || !crunchs[i].data.length) {
                let user = this.users.find(u => u._id.toString() === crunchs[i].userId.toString());
                if (!user) {
                    this.users.push({_id: crunchs[i].userId,
                        coaAmounts: [],
                        totalCoaAmounts: [],
                        income: null,
                        totalIncome: null,
                        budgets: {
                            totalCoaAmount: [],
                            totalCoaAmountRange: []
                        }
                    });
                }
            }
            else {
                for (let x = 0; x < crunchs[i].data.length; x++) {
                    let position;
                    for (let y = 0; y < this.users.length; y++) {
                        if (this.users[y]._id.toString() === crunchs[i].userId.toString()) {
                            position = y;
                            break;
                        }
                    }
                    if (typeof (position) !== 'number') {
                        this.users.push({_id: crunchs[i].userId,
                            coaAmounts: crunchs[i].data[x] ? crunchs[i].data[x].coaAmounts : [],
                            totalCoaAmounts: crunchs[i].data.length ? crunchs[i].data[x].totalCoaAmounts : [],
                            income: crunchs[i].data.length ? crunchs[i].data[x].income : null,
                            totalIncome: crunchs[i].data.length ? crunchs[i].data[x].totalIncome : null,
                            budgets: {
                                totalCoaAmount: [],
                                totalCoaAmountRange: []
                            }
                        });
                    }
                    else if (typeof (position) === 'number') {
                        if (crunchs[i].data[x]) {
                            if (crunchs[i].data[x].coaAmounts)
                                this.users[position].coaAmounts = this.users[position].coaAmounts.concat(crunchs[i].data[x].coaAmounts);
                            if (crunchs[i].data[x].totalCoaAmounts)
                                this.users[position].totalCoaAmounts = crunchs[i].data[x].totalCoaAmounts;
                            if (crunchs[i].data[x].income)
                                this.users[position].income += crunchs[i].data[x].income;
                            if (crunchs[i].data[x].totalIncome)
                                this.users[position].totalIncome = crunchs[i].data[x].totalIncome;
                        }
                    }
                }
            }
        }

        if (budgets && budgets.length) {
            for (let i = 0; i < budgets.length; i++) {
                let user = this.users.find(u => u._id.toString() === budgets[i].userId.toString());
                if (user) {
                    if (budgets[i].data && budgets[i].data.totalAmount) {
                        budgets[i].data.totalAmount.forEach(coa => {
                            user.budgets.totalCoaAmount.push(coa);
                        });
                    }
                    else {
                        user.budgets.totalCoaAmount = [];
                    }

                    if (budgets[i].data && budgets[i].data.totalCoaAmountRange) {
                        budgets[i].data.totalCoaAmountRange.forEach(coa => {
                            user.budgets.totalCoaAmountRange.push(coa);
                        });
                    }
                    else {
                        user.budgets.totalCoaAmountRange = [];
                    }
                }
            }
        }
        if (this.users && Array.isArray(this.users) && this.users.length > 1) {
            template += `<tr class="table-category">
                <th class="item grey title center"> Client Name</th>`;
            for (let i = 0; i < this.types.length; i++) {
                this.users.forEach(user => {
                    let userInfo = this.clients.find(client => {
                        return user._id.toString() === client._id.toString();
                    });
                    let clientName = userInfo && userInfo.fullName ? userInfo.fullName : '';
                    template += `
                        <th class="item grey center">${clientName}</th>
                    `;
                });
            }
        }
        template += `<tr class="table-category">
        <th class="item grey title center"></th>`;
        for (let i = 0; i < this.types.length; i++) {
            let numberUser = this.users.length;
            template += `
                <th class="item grey center"  colspan=${numberUser}>${this.types[i].name}</th>
            `;
        }

        template += `</tr>`;
        this.groups = this.groups.sort((a, b) => {
            return parseInt(b.order) - parseInt(a.order);
        });
        console.log(this.groups);
        // render group
        for (let i = 0; i < this.groups.length; i++) {
            template += `
                <tr>
                    <td class="item-title bold">${this.groups[i].name}</td>
            `;
            for (let i = 0; i < this.types.length; i++) {
                for (let j = 0; j < this.users.length; j++) {
                    template += `
                <td class="item-value"></td>
                `;
                }
            }
            template += `</tr>`;
            this.groups[i].coas.sort((a, b) => {
                let codeA = a && a.code ? a.code : '';
                let codeB = b && b.code ? b.code : '';
                return codeA > codeB;
            });

            for (let j = 0; j < this.groups[i].coas.length; j++) {
                template += `
                    <tr>
                        <td class="item-title"><span>${this.groups[i].coas[j].name}</span></td>
                `;

                for (let k = 0; k < this.types.length; k++) {
                    this.users.forEach(user => {
                        if (this.types[k].code === 1) {
                            let coa = user.coaAmounts.filter(coa => coa.coaId._id.toString() === this.groups[i].coas[j]._id.toString());

                            let amount = 0;

                            if (coa.length) {
                                coa.forEach(c => {
                                    amount += c.amount;
                                });
                            }
                            template += `<td class="item-value">${this.formatMoney(amount)}</td>`;
                        }
                        else if (this.types[k].code === 2) {
                            let coa = user.coaAmounts.filter(coa => coa.coaId._id.toString() === this.groups[i].coas[j]._id.toString());
                            let income = user.income;
                            let result = 0;
                            let amount = 0;

                            if (coa.length) {
                                coa.forEach(c => {
                                    amount += c.amount;
                                });

                                if (income)
                                    result = parseFloat(((amount / income) * 100).toFixed(2));
                                else
                                    result = 0;
                            }
                            template += `<td class="item-value">${result} %</td>`;
                        }
                        else if (this.types[k].code === 3) {
                            let totalCoa = user.totalCoaAmounts.filter(coa => coa.coaId._id.toString() === this.groups[i].coas[j]._id.toString());
                            let amount = 0;
                            if (totalCoa && totalCoa.length) {
                                totalCoa.forEach(c => {
                                    amount = c.amount;
                                });
                            }
                            template += `<td class="item-value">${this.formatMoney(amount)}</td>`;
                        }
                        else if (this.types[k].code === 4) {
                            let totalCoa = user.totalCoaAmounts.filter(coa => coa.coaId._id.toString() === this.groups[i].coas[j]._id.toString());
                            let amount = 0;
                            if (totalCoa && totalCoa.length) {
                                totalCoa.forEach(c => {
                                    amount = c.amount;
                                });
                            }

                            let totalIncome = user.totalIncome;
                            if (amount && totalIncome)
                                template += `<td class="item-value">${parseFloat(((amount / totalIncome) * 100).toFixed(2))} %</td>`;
                            else
                                template += `<td class="item-value">0</td>`;
                        }
                        else if (this.types[k].code === 5) {
                            let coa = user.budgets.totalCoaAmountRange.filter(c => c.coaId.toString() === this.groups[i].coas[j]._id.toString());
                            let amount = 0;
                            if (coa && coa.length) {
                                coa.forEach(c => {
                                    amount += c.amount;
                                });
                            }
                            template += `<td class="item-value">${this.formatMoney(amount)}</td>`;
                        }
                        else if (this.types[k].code === 6) {
                            let coaBudget = user.budgets.totalCoaAmountRange.find(coa => coa.coaId.toString() === this.groups[i].coas[j]._id.toString());
                            let totalCoaBudget = user.budgets.totalCoaAmount.find(coa => coa.coaId.toString() === this.groups[i].coas[j]._id.toString());
                            if (coaBudget && totalCoaBudget && totalCoaBudget.amount)
                                template += `<td class="item-value">${parseFloat(((coaBudget.amount / totalCoaBudget.amount) * 100).toFixed(2))} %</td>`;
                            else
                                template += `<td class="item-value">0</td>`;
                        }
                        else if (this.types[k].code === 7) {
                            let totalCoa = user.totalCoaAmounts.find(coa => coa.coaId._id === this.groups[i].coas[j]._id);
                            let totalIncome = user.totalIncome;
                            let coaBudget = user.budgets.totalCoaAmountRange.find(coa => coa.coaId.toString() === this.groups[i].coas[j]._id.toString());
                            let totalCoaBudget = user.budgets.totalCoaAmount.find(coa => coa.coaId.toString() === this.groups[i].coas[j]._id.toString());

                            if (totalCoa && totalIncome && coaBudget && totalCoaBudget && totalCoaBudget.amount) {
                                let result = ((totalCoa.amount / totalIncome) * 100) - ((coaBudget.amount / totalCoaBudget.amount) * 100) + '%';
                                template += `<td class="item-value">${parseFloat(result).toFixed(2)} %</td>`;
                            }
                            else
                                template += `<td class="item-value">0</td>`;
                        }
                    });
                }
                template += `</tr>`;
            }
        }
        return template;
    }
}
