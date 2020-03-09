<template>
    <div id="transactionList" class="transaction-list">
        <a class="btn btn-small custom" v-if="data.statements.length" @click="exportPDFYear(yearSelect)">Export PDF</a>
        <a class="btn btn-small custom" v-if="data.statements.length" @click="exportCSVYear(yearSelect)">Export CSV</a>
        <div class="not-connect" v-if="!data.statements.length">
            <div class="row align-self-center">
                <div class="col-md-10 col-sm-10 col-xs-6">
                    <div class="box-text">
                        <span class="icon-success yellow"></span>
                        <p class="text">{{message}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="transaction-item" v-for="(statement, index) in data.statements" :key="index">
            <div class="header-wrapper">
                <div class="row">
                    <div class="col-md-8 col-sm-8 col-xs-6">
                            <p class="month-label">{{statement.month | convertMonthToWord}}</p>
                            <i class="fa fa-angle-down" data-toggle="collapse" :data-target="'#show-item'+index" @click="showDetail(statement);"></i>
                    </div>
                    <div class="col-md-4 col-sm-4 col-xs-6 text-right">
                        <p class="balance"> CURRENT BALANCE</p>
                    </div>
                </div>
            </div>
            <div class="list-wrapper">
                <div class="close-balance">
                    <div class="row">
                        <div class="col-md-9 col-sm-9 col-xs-6">
                            <span class="close-balance-label">{{statement.month | convertMonthToWord}}'S CLOSING BALANCE</span>
                            <a class="btn-normal" style="float: right; background-color: white !important;" data-toggle="dropdown" aria-expanded="true" v-if="statement.completedAt">Export Cruncher</a>
                            <ul class="dropdown-menu custom-size" v-if="statement.completedAt">
                                <li><a class="dropdown-menu-link" @click="exportPDF(statement.month, statement.year)"> <img alt="" title="" src="~/assets/images/icon-pdf.svg">Export as PDF</a></li>
                                <!-- <li><a class="dropdown-menu-link" @click="exportPDFYear(statement.year)"> <img alt="" title="" src="~/assets/images/icon-pdf.svg">Export full Year</a></li> -->
                                <li><a class="dropdown-menu-link" @click="exportCSV(statement.month, statement.year)"><img alt="" title="" src="~/assets/images/icon-csv.svg">Export as CSV</a></li>
                            </ul>
                        </div>
                        <div class="col-md-3 col-sm-3 col-xs-6">
                            <span class="balance-value">{{statement.closeBalance | convertToCurrency}}
                                <span class="unit">AUD</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div :id="'show-item'+index" class="collapse" data-parent="#transactionList">
                    <div class="wrapper-item" v-for="(transaction, index) in statement.transactions" :key="index">
                        <div class="row">
                            <div class="col-md-2 col-sm-1 col-xs-12">
                                <span class="balance-date">{{transaction.date | convertToString}}</span>
                            </div>
                            <div class="col-md-2 col-sm-1 col-xs-12">
                                <span class="balance-name">{{transaction.description.original}}</span>
                            </div>
                            <div class="col-md-2 col-sm-2 col-xs-12">
                                <span class="balance-cate" :title="transaction.category">{{transaction.category}}</span>
                            </div>
                            <div class="col-md-2 col-sm-6 col-xs-12">
                                <span v-if="transaction.baseType === 'DEBIT'" class="balance-value">
                                    <span class="sub">-</span> {{transaction.amount.amount | convertToCurrency}}</span>
                            </div>
                            <div class="col-md-2 col-sm-6 col-xs-12">
                                <span v-if="transaction.baseType !== 'DEBIT'" class="balance-value">
                                    <span class="add">+</span> {{transaction.amount.amount | convertToCurrency}}</span>
                            </div>
                            <div class="col-md-2 col-sm-3 col-xs-12">
                                <span class="balance-value">{{transaction.runningBalance.amount | convertToCurrency}}
                                    <span class="unit">{{transaction.runningBalance.currency}}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="paginate text-right" :id="statement.total">
                        <pagination :page="statement.page" :limit="statement.limit" :total="statement.total" @change="changePage($event, statement)"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Pagination from '~/components/Pagination';
import {convertMonthToWord, convertToString} from '~/helpers/dateHelper';
import {convertToCurrency} from '~/helpers/dataHelper.js';

export default {
    props: ['financialYear', 'clientId', 'accountType', 'yearSelect'],
    data() {
        return {
            data: {
                statements: []
            },
            userId: null,
            message: 'We could not find any bank statements.',
        };
    },
    watch: {
        financialYear: function(newFinancialYear) {
            if (!newFinancialYear)
                return;
            this.getStatementByFinancialYear(this.clientId, this.accountType, newFinancialYear);
        },
        clientId: function(newClientId) {
            if (!newClientId)
                return;
            this.getStatementByFinancialYear(newClientId, this.accountType, this.financialYear);
        },
        accountType: function(newAccountType) {
            if (!newAccountType)
                return;
            this.getStatementByFinancialYear(this.clientId, newAccountType, this.financialYear);
        },
    },
    components: {
        Pagination,
    },
    created() {
        if (this.clientId && this.accountType && this.financialYear)
            this.getStatementByFinancialYear(this.clientId, this.accountType, this.financialYear);
    },
    methods: {
        initNotify(option, title, text) {
            this.$notify({
                group: option,
                title: title,
                text: text
            });
        },
        async getStatementByFinancialYear(userId, bankType, financialYear) {
            if (!userId || !bankType || !financialYear)
                return;

            let {data, error} = await this.$services.statementService.getStatementsByFinancialYear(userId, bankType, financialYear.begin, financialYear.end);
            if (error)
                console.log(error);
            else if (data) {
                data.forEach(item => {
                    item.page = 1;
                    item.limit = 10;
                    item.total = 0;
                });
            }
            this.data.statements = data || [];
        },
        async showDetail(statement) {
            statement.selected = !statement.selected;
            if (statement.selected) {
                let {data, error} = await this.$services.transactionService.getTransactions(this.clientId, statement.type, statement.year, statement.month, statement.page, statement.limit);
                if (error)
                    console.log(error);

                let result = await this.$services.transactionService.getCountTransactions(this.clientId, statement.type, statement.year, statement.month);
                if (result.error)
                    console.log(result.error);

                statement.transactions = data || [];
                statement.total = result.data || 0;
                this.$forceUpdate();
            }
        },
        async changePage(page, statement) {
            statement.page = page;
            let {data} = await this.$services.transactionService.getTransactions(this.clientId, statement.type, statement.year, statement.month, page, statement.limit);
            if (data)
                statement.transactions = data || [];
            this.$forceUpdate();
        },
        async exportPDF(month, year) {
            let {data, error} = await this.$services.reportService.exportCruncherPDF(this.clientId, this.$store.state.productCode, this.accountType, month, year);
            if (error)
                this.initNotify('error', 'Error', error.message);
            else
                window.location = data;
        },
        async exportPDFYear(year) {
            let {data, error} = await this.$services.reportService.exportCruncherYearPDF(this.clientId, this.$store.state.productCode, this.accountType, year);
            if (error)
                this.initNotify('error', 'Error', error.message);
            else
                window.location = data;
        },
        async exportCSV(month, year) {
            let {data, error} = await this.$services.reportService.exportCruncherCSV(this.clientId, this.$store.state.productCode, this.accountType, month, year);
            if (error)
                this.initNotify('error', 'Error', error.message);
            else
                window.location = data;
        },
        async exportCSVYear(year) {
            let {data, error} = await this.$services.reportService.exportCruncherYearCSV(this.clientId, this.$store.state.productCode, this.accountType, year);
            if (error)
                this.initNotify('error', 'Error', error.message);
            else
                window.location = data;
        },
    },
    filters: {
        convertMonthToWord,
        convertToCurrency,
        convertToString(date) {
            if (date) {
                if (typeof date === 'string')
                    date = new Date(date);
                return convertToString(date, {hour: '2-digit', minute: '2-digit', hour12: true});
            }
            return '';
        }
    }
};
</script>
