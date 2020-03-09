<template>
    <section class="table-report">  
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles"/>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                        <div class="dropdown normal-btn">
                            <nuxt-link class="btn dropdown-toggle not-arrow" to="/data-report/budget">
                                    BUDGET
                            </nuxt-link>
                        </div>
                        <div class="dropdown normal-btn">
                            <nuxt-link class="btn dropdown-toggle not-arrow" to="/data-report/group-expense">
                                    GROUP EXPENSE
                            </nuxt-link>
                        </div>
                        <div class="dropdown normal-btn">
                            <button class="btn dropdown-toggle" type="button" data-toggle="dropdown">
                                    EXPORT
                            </button>
                            <ul class="dropdown-menu">
                                <li><a @click="exportPDF()" class="dropdown-menu-link"><img src="~/assets/images/icon-pdf.svg" class="img-sub"/><span>Export as PDF</span></a></li>
                                <li><a @click="exportCSV()" class="dropdown-menu-link"><img src="~/assets/images/icon-csv.svg" class="img-sub"/><span>Export as CSV</span></a></li>
                            </ul>
                        </div>
                        <!-- <div class="dropdown normal-btn">
                            <button class="btn dropdown-toggle" type="button" data-toggle="dropdown">
                                    FILTER
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-menu-link">Export 1</a></li>
                                <li><a class="dropdown-menu-link">Export 2</a></li>
                            </ul>
                        </div> -->
                    </div>
                    <div class="col-12 page-filter">
                        <dropdown-date @changeDate="changeDate"></dropdown-date>
                        <lookup-account @changeTypeBank="changeTypeBank"/>
                        <lookup-client @changeClient="changeClient"/>
                        <lookup-type @changeType="changeType"/>
                        <button class="form-btn btn-filter" @click="getDataCrunchsReports">Filter</button>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="box-report" v-if="reportTable.length" >
                    <table class="table-head" v-if="false">
                        <tbody>
                            <tr class="table-head-item">
                                <th class="table-head-title" style="width:60%">Client Name: ABC</th>
                                <th class="table-head-title" style="width:25%">
                                    Current Month Cash Inflows
                                </th>
                                <th class="table-head-title" style="width:15%;text-align:right">
                                    $ 100,000.00
                                </th>
                            </tr>
                            <tr class="table-head-item">
                                <th class="table-head-row" style="width:60%">CASH REPORT SUMMARY FOR THE MONTH OF OCTOBER 2017</th>
                                <th class="table-head-row" style="width:25%">
                                    YTD Cash Inflows
                                </th>
                                <th class="table-head-row" style="width:15%;text-align:right">
                                    40.00%
                                </th>
                            </tr>
                            <tr class="table-head-item">
                                <th class="table-head-row" style="width:60%"></th>
                                <th class="table-head-row" style="width:25%">
                                    Cash Inflows Goal for the Year
                                </th>
                                <th class="table-head-row" style="width:15%;text-align:right">
                                    $ 1,000,000.00
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    <div :class="['report-detail', {'four-data': users.length * type.length > 10}, {'one-data': users.length * type.length <= 10}]">
                        <template v-if="users.length * type.length > 10">
                            <a class="arrow-right arrow">
                                <span class="inner">
                                    <img src="~/assets/images/icon-arrow-right.svg">
                                </span>
                            </a>
                            <a class="arrow-left arrow">
                                <span class="inner">
                                    <img src="~/assets/images/icon-arrow-right.svg">
                                </span>
                            </a>
                        </template>
                        <table class="table-client">
                            <tbody>
                                <tr v-for="(items, index1) in reportTable" :key="index1">
                                    <td v-for="(item, index2) in items" :class="item.class" style="" :key="index2" :colspan="item.cols">{{ item.text }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="box-report" v-else>
                    <div class="no-data text-center">
                        <img src="~/assets/images/no-data.png" alt="no data">
                        <p class="text-note">No data available.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import {convertToCurrency} from '~/helpers/dataHelper';
import LookupAccount from '~/components/Report/LookupAccount';
import LookupClient from '~/components/Report/LookupClient';
import LookupType from '~/components/Report/LookupType';
import DropdownDate from '~/components/Report/DropdownDate';
import PageTitle from '~/components/PageTitle';
import EventBus from '~/plugins/event-bus';

export default {
    data() {
        return {
            titles: ['Data report'],
            labelsSelected: [],
            clients: [],
            typeBank: null,
            beginDate: {
                month: null,
                year: null
            },
            endDate: {
                month: null,
                year: null
            },
            type: [],
            groups: [],
            users: [],
            reportTable: []
        };
    },
    components: {
        LookupAccount,
        LookupClient,
        DropdownDate,
        PageTitle,
        LookupType
    },
    methods: {
        srcollHorizontal() {
            $('.arrow').click(function() {
                let box = $('.four-data');
                let x;
                if ($(this).hasClass('arrow-right')) {
                    x = ((box.width() / 2)) + box.scrollLeft();
                    // if (x >= 1600) {
                    //     $(this).addClass('hide');
                    //     $(this).removeClass('show');
                    // }
                    if (x >= 500) {
                        $('.arrow-left').addClass('show');
                        $('.arrow-left').removeClass('hide');
                    }
                    box.animate({
                        scrollLeft: x,
                    });
                }
                else {
                    x = ((box.width() / 2)) - box.scrollLeft();
                    if (x > 500) {
                        $(this).addClass('hide');
                        $(this).removeClass('show');
                        $('.arrow-right').addClass('show');
                        $('.arrow-right').removeClass('hide');
                    }
                    box.animate({
                        scrollLeft: -x,
                    });
                }
            });
        },
        initNotify(option, title, text) {
            this.$notify({
                group: option,
                title: title,
                text: text
            });
        },
        async getDataCrunchsReports() {
            this.$loading.show();
            this.reportTable = [];
            this.users = [];
            this.type = this.labelsSelected;
            let clientIds = [];
            let body = {};
            this.clients.forEach(client => {
                clientIds.push(client._id);
            });

            if (!this.beginDate.year || !this.beginDate.month) {
                EventBus.$emit('NOTIFICATION_WARNING', {title: 'warning', description: 'Check condition Month and Year!'});
                this.$loading.hide();
                return false;
            }

            if (clientIds.length === 0) {
                EventBus.$emit('NOTIFICATION_WARNING', {title: 'warning', description: 'Check condition Client!'});
                this.$loading.hide();
                return false;
            }

            if (this.type.length === 0) {
                EventBus.$emit('NOTIFICATION_WARNING', {title: 'warning', description: 'Check condition Type!'});
                this.$loading.hide();
                return false;
            }

            body = {
                userIds: clientIds,
                beginYear: this.beginDate.year,
                beginMonth: this.beginDate.month,
                endYear: this.endDate.year ? this.endDate.year : this.beginDate.year,
                endMonth: this.endDate.month ? this.endDate.month : this.beginDate.month,
                type: this.typeBank ? this.typeBank : null

            };

            let {data, error} = await this.$services.crunchService.getDataCrunchsReports(body);
            if (error) {
                this.$loading.hide();
                if (error.message)
                    EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: error.message});

                else
                    EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: error});

                return false;
            }
            else {
                this.$loading.hide();
                if (!data.crunchs.length || !data.budgets.length)
                    return;
                let crunchs = data.crunchs;
                let budgets = data.budgets;

                for (let i = 0; i < crunchs.length; i++) {
                    // get group.
                    if (crunchs[i].data.length) {
                        for (let y = 0; y < crunchs[i].data.length; y++) {
                            let coas = crunchs[i].data[y].coaAmounts;
                            for (let j = 0; j < coas.length; j++) {
                                if (coas[j].group) {
                                    let group = this.groups.find(g => g._id === coas[j].group._id);
                                    if (group) {
                                        if (!group.coas.find(c => c._id === coas[j].coaId._id))
                                            group.coas.push(coas[j].coaId);
                                    }
                                    else
                                        this.groups.push({_id: coas[j].group._id,
                                            name: coas[j].group.name,
                                            code: coas[j].group.code,
                                            coas: [coas[j].coaId]
                                        });
                                }
                                else {
                                    this.reportTable = [];
                                    EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: 'Chart account not in any Group-expense'});
                                    return;
                                }
                            }
                        }
                    }

                    this.groups.sort((a, b) => b.order - a.order);
                    // get user
                    if (!crunchs[i].data.length) {
                        let user = this.users.find(u => u._id === crunchs[i].userId);
                        if (!user) {
                            this.users.push({_id: crunchs[i].userId,
                                email: this.clients.find(u => u._id === crunchs[i].userId).email,
                                fullName: this.clients.find(u => u._id === crunchs[i].userId).fullName,
                                entityName: this.clients.find(u => u._id === crunchs[i].userId).businessInfo.entityName,
                                typeBank: crunchs[i].data.length ? crunchs[i].type : this.typeBank,
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
                                if (this.users[y]._id === crunchs[i].userId) {
                                    position = y;
                                    break;
                                }
                            }
                            if (typeof (position) !== 'number') {
                                this.users.push({_id: crunchs[i].userId,
                                    email: this.clients.find(u => u._id === crunchs[i].userId).email,
                                    fullName: this.clients.find(u => u._id === crunchs[i].userId).fullName,
                                    entityName: this.clients.find(u => u._id === crunchs[i].userId).businessInfo.entityName,
                                    typeBank: crunchs[i].data.length ? crunchs[i].type : this.typeBank,
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
                                        this.users[position].totalCoaAmounts = this.users[position].totalCoaAmounts.concat(crunchs[i].data[x].totalCoaAmounts);
                                    if (crunchs[i].data[x].income)
                                        this.users[position].income += crunchs[i].data[x].income;
                                    if (crunchs[i].data[x].totalIncome)
                                        this.users[position].totalIncome += crunchs[i].data[x].totalIncome;
                                }
                            }
                        }
                    }
                }

                if (budgets && budgets.length) {
                    for (let i = 0; i < budgets.length; i++) {
                        let user = this.users.find(u => u._id === budgets[i].userId);
                        if (user) {
                            if (budgets[i].data.totalAmount) {
                                budgets[i].data.totalAmount.forEach(coa => {
                                    user.budgets.totalCoaAmount.push(coa);
                                });
                            }
                            else {
                                user.budgets.totalCoaAmount = [];
                            }

                            if (budgets[i].data.totalCoaAmountRange) {
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

                await this.calculator();
            }
            setTimeout(() => {
                this.srcollHorizontal();
                let height = $('.default-height').outerHeight();
                $('.auto-height').outerHeight(height);
            }, 0);
        },
        calculator() {
            // calculator length-Y
            this.reportTable = [];
            let partOneLengthY;
            let lengthX;
            let arrayGroup = [];
            let tempArrayPartOne = [];
            let tempArrayPartTwo = [];
            let lengthUser = this.users.length;
            if (this.clients.length > 1)
                partOneLengthY = 2;
            else
                partOneLengthY = 1;

            for (let i = 0; i < this.groups.length; i++) {
                arrayGroup.push({group: this.groups[i], coa: null});
                this.groups[i].coas.forEach(c => {
                    arrayGroup.push({group: null, coa: c});
                });
            }

            // calculator length-X
            lengthX = 1 + this.type.length * this.clients.length;
            for (let i = 0; i < partOneLengthY; i++) {
                let tempArray = [];
                if (this.clients.length > 1) {
                    if (i === 0) {
                        tempArray.push({text: 'Client Name', class: 'item-client-title auto-height', cols: 1});
                        for (let j = 0; j < this.type.length; j++) {
                            this.users.forEach(user => {
                                tempArray.push({text: user.businessInfo && user.businessInfo.entityName ? user.businessInfo.entityName : user.fullName, class: 'item-client-title default-height', cols: 1});
                            });
                        }
                    }
                    else {
                        tempArray.push({text: '', class: 'item-line-title', cols: 1});
                        for (let j = 0; j < this.type.length; j++) {
                            for (let y = 0; y < this.users.length; y++) {
                                if (y === 0) {
                                    tempArray.push({text: this.type[j].name, class: 'item-line-title', cols: lengthUser});
                                }
                            }
                        }
                    }
                }
                else {
                    if (i === 0) {
                        tempArray.push({text: '', class: 'item-line-title', cols: 1});
                        this.type.forEach(label => {
                            tempArray.push({text: label.name, class: 'item-line-title', cols: lengthUser});
                        });
                    }
                }
                tempArrayPartOne.push(tempArray);
            }

            if (arrayGroup && arrayGroup.length) {
                for (let i = 0; i < arrayGroup.length; i++) {
                    let tempArray = [];
                    if (arrayGroup[i].group) {
                        for (let j = 0; j < lengthX; j++) {
                            if (j === 0)
                                tempArray.push({text: arrayGroup[i].group.name, class: 'item-category grey', cols: 1});
                            else
                                tempArray.push({text: '', class: 'item-category grey', cols: 1});
                        }
                    }
                    else if (arrayGroup[i].coa) {
                        tempArray.push({text: arrayGroup[i].coa.name, class: 'item-title', cols: 1});
                        for (let j = 0; j < this.type.length; j++) {
                            this.users.forEach(user => {
                                if (this.type[j].code === 1) {
                                    let coa = user.coaAmounts.filter(coa => coa.coaId._id === arrayGroup[i].coa._id);
                                    console.log('coa', coa);
                                    let amount = 0;
                                    if (coa.length) {
                                        coa.forEach(c => {
                                            amount += c.amount;
                                            console.log('amount', amount);
                                        });
                                    }
                                    tempArray.push({text: this.convertToCurrency(amount), class: 'item-value', cols: 1});
                                }
                                else if (this.type[j].code === 2) {
                                    let coa = user.coaAmounts.filter(coa => coa.coaId._id === arrayGroup[i].coa._id);
                                    let income = user.income;
                                    let result = 0;

                                    if (coa.length) {
                                        let amount = 0;
                                        coa.forEach(c => {
                                            amount += c.amount;
                                        });

                                        if (income)
                                            result = parseFloat((amount / income) * 100).toFixed(2);
                                        else
                                            result = 0;
                                    }
                                    tempArray.push({text: result + '%', class: 'item-value', cols: 1});
                                }
                                else if (this.type[j].code === 3) {
                                    let totalCoa = user.totalCoaAmounts.filter(coa => coa.coaId._id === arrayGroup[i].coa._id);
                                    let amount = 0;
                                    if (totalCoa && totalCoa.length) {
                                        totalCoa.forEach(c => {
                                            amount = c.amount;
                                        });
                                    }
                                    tempArray.push({text: this.convertToCurrency(amount), class: 'item-value', cols: 1});
                                }
                                else if (this.type[j].code === 4) {
                                    let totalCoa = user.totalCoaAmounts.filter(coa => coa.coaId._id === arrayGroup[i].coa._id);
                                    let amount = 0;
                                    if (totalCoa && totalCoa.length) {
                                        totalCoa.forEach(c => {
                                            amount = c.amount;
                                        });
                                    }

                                    let totalIncome = user.totalIncome;
                                    if (amount && totalIncome)
                                        tempArray.push({text: parseFloat((amount / totalIncome) * 100).toFixed(2) + '%', class: 'item-value', cols: 1});
                                    else
                                        tempArray.push({text: 0, class: 'item-value', cols: 1});
                                }
                                else if (this.type[j].code === 5) {
                                    let coa = user.budgets.totalCoaAmountRange.filter(coa => coa.coaId === arrayGroup[i].coa._id);
                                    let amount = 0;

                                    if (coa && coa.length) {
                                        coa.forEach(c => {
                                            amount += c.amount;
                                        });
                                    }
                                    tempArray.push({text: this.convertToCurrency(amount), class: 'item-value', cols: 1});
                                }
                                else if (this.type[j].code === 6) {
                                    let coaBudget = user.budgets.totalCoaAmountRange.find(coa => coa.coaId === arrayGroup[i].coa._id);
                                    let totalCoaBudget = user.budgets.totalCoaAmount.find(coa => coa.coaId === arrayGroup[i].coa._id);
                                    if (coaBudget)
                                        tempArray.push({text: parseFloat((coaBudget.amount / totalCoaBudget.amount) * 100).toFixed(2) + '%', class: 'item-value', cols: 1});
                                    else
                                        tempArray.push({text: 0, class: 'item-value', cols: 1});
                                }
                                else if (this.type[j].code === 7) {
                                    let totalCoa = user.totalCoaAmounts.find(coa => coa.coaId._id === arrayGroup[i].coa._id);
                                    let totalIncome = user.totalIncome;
                                    let coaBudget = user.budgets.totalCoaAmountRange.find(coa => coa.coaId === arrayGroup[i].coa._id);
                                    let totalCoaBudget = user.budgets.totalCoaAmount.find(coa => coa.coaId === arrayGroup[i].coa._id);

                                    if (totalCoa && totalIncome && coaBudget && totalCoaBudget) {
                                        let result = ((totalCoa.amount / totalIncome) * 100) - ((coaBudget.amount / totalCoaBudget.amount) * 100) + '%';
                                        tempArray.push({text: parseFloat(result).toFixed(2) + '%', class: 'item-value', cols: 1});
                                    }
                                    else
                                        tempArray.push({text: 0, class: 'item-value', cols: 1});
                                }
                            });
                        }
                    }
                    tempArrayPartTwo.push(tempArray);
                }
            }
            this.reportTable = tempArrayPartOne.concat(tempArrayPartTwo);
        },
        convertToCurrency(value) {
            return convertToCurrency(value);
        },
        changeClient(client) {
            this.clients = client;
        },
        changeType(labels) {
            this.labelsSelected = labels;
        },
        changeTypeBank(typeBank) {
            this.typeBank = typeBank.value;
        },
        changeDate(data) {
            if (data.startMonth.month) {
                this.beginDate.month = data.startMonth.month;
                if (data.startMonth.month >= data.configMonth)
                    this.beginDate.year = data.financial.begin;
                else
                    this.beginDate.year = data.financial.end;
            }
            if (data.endMonth.month) {
                this.endDate.month = data.endMonth.month;
                if (data.endMonth.month > data.configMonth)
                    this.endDate.year = data.financial.begin;
                else
                    this.endDate.year = data.financial.end;
            }
        },
        async exportPDF() {
            let clientIds = [];
            this.clients.forEach(client => {
                clientIds.push(client._id);
            });
            let numberType = this.type && Array.isArray(this.type) ? this.type.length : 0;
            let numberClolumn = numberType * clientIds.length;
            console.log('number column', numberClolumn);
            if (numberClolumn >= 8)
                EventBus.$emit('NOTIFICATION_WARNING', {title: 'warning', description: 'Can not export over 7 column'});

            let body = {
                userIds: clientIds,
                beginYear: this.beginDate.year,
                beginMonth: this.beginDate.month,
                endYear: this.endDate.year ? this.endDate.year : this.beginDate.year,
                endMonth: this.endDate.month ? this.endDate.month : this.beginDate.month,
                type: this.typeBank ? this.typeBank : null,
                types: this.type ? this.type : []
            };
            let {data, error} = await this.$services.reportService.exportDataReportPDF(body);
            if (error)
                this.initNotify('error', 'Error', error.message);
            if (data) {
                window.location = data;
            }
        },
        async exportCSV() {
            let clientIds = [];
            this.clients.forEach(client => {
                clientIds.push(client._id);
            });

            let body = {
                userIds: clientIds,
                beginYear: this.beginDate.year,
                beginMonth: this.beginDate.month,
                endYear: this.endDate.year ? this.endDate.year : this.beginDate.year,
                endMonth: this.endDate.month ? this.endDate.month : this.beginDate.month,
                type: this.typeBank ? this.typeBank : null,
                types: this.type ? this.type : []
            };
            let {data, error} = await this.$services.reportService.exportDataReportCSV(body);
            if (error)
                this.initNotify('error', 'Error', error.message);
            if (data) {
                window.location = data;
            }
        }
    }
};
</script>

