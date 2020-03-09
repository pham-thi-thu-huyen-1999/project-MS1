<template>
    <section class="transaction bank-statement">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <page-title :titles="['Transactions']"/>
                <div class="row">
                    <div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">
                        <menu-page :listMenu="listMenu" :financialShow="true" @input="handleChangeFinancialYear" @yearSelected="yearSelected($event)"></menu-page>
                    </div>
                    <div class="col-md col-sm-12 col-xs-12">
                        <connect-bank ref="connectBankBox" v-show="showConnectBankBox" :editable="false" :accountType="accountType" :clientId="clientId" @changeStatus="handleConnectedBank($event)"></connect-bank>
                        <transaction-list ref="transactionListBox" v-show="!showConnectBankBox" :accountType="accountType" :clientId="clientId" :yearSelect="yearSelect"></transaction-list>
                    </div>
                    <div class="col-md-auto col-sm-12 col-xs-12">
                        <history-logs></history-logs>
                    </div>
                </div>
            </div>
        </div>
    </section>  
</template>

<script>

import MenuPage from '~/components/MenuPage';
import PageTitle from '~/components/PageTitle';
import HistoryLogs from '~/components/HistoryLogs';
import ConnectBank from '~/components/transaction/ConnectBank';
import TransactionList from '~/components/transaction/TransactionList';
import {convertToCurrency} from '~/helpers/dataHelper.js';
import {convertMonthToWord, convertToString} from '~/helpers/dateHelper';

export default {
    components: {
        MenuPage,
        PageTitle,
        HistoryLogs,
        ConnectBank,
        TransactionList,
    },
    data: () => ({
        message: 'We could not find any bank statements.',
        showConnectBankBox: true,
        financialYear: null,
        accountType: null,
        clientId: null,
        listMenu: null,
        yearSelect: null
    }),
    created() {
        this.accountType = this.$route.query.type ? Number(this.$route.query.type) : 1;
        this.clientId = this.$route.params.id || this.$store.state.client._id;
        this.listMenu = this.$services.commonService.getMenuTransactions(this.$route.params.id);
    },
    watch: {
        '$route.query.type': function(newValue) {
            if (!newValue)
                return;
            this.showConnectBankBox = true;
            this.accountType = Number(newValue);
        },
        '$route.params._id': function(newValue) {
            if (!newValue)
                return;
            this.showConnectBankBox = true;
            this.clientId = newValue;
        }
    },
    methods: {
        yearSelected(year) {
            this.yearSelect = year;
        },
        handleConnectedBank(event) {
            if (!event)
                return;

            if (event.message === 'userConnectAccountSuccess') {
                this.showConnectBankBox = false;
                this.$refs.transactionListBox.getStatementByFinancialYear(this.clientId, this.accountType, this.financialYear);
            }
        },
        handleChangeFinancialYear(event) {
            if (!event)
                return;

            this.financialYear = event;
            // Quan trong, dung delete
            this.$refs.transactionListBox.getStatementByFinancialYear(this.clientId, this.accountType, this.financialYear);
        },
    },
    filters: {
        convertMonthToWord(month) {
            return convertMonthToWord(month);
        },
        convertToCurrency(value) {
            return convertToCurrency(value);
        },
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