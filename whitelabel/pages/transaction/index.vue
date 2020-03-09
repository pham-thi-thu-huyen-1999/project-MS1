<template>
    <section class="transaction bank-statement">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <page-title :titles="['Transactions']"/>
                <div class="row">
                    <div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">
                        <menu-page :listMenu="listMenu" :financialShow="true" @input="handleChangeFinancialYear"></menu-page>
                    </div>
                    <div class="col-md col-sm-12 col-xs-12">
                        <connect-bank ref="connectBankBox" v-show="showConnectBankBox" :accountType="accountType" :clientId="clientId" @changeStatus="handleConnectedBank($event)"></connect-bank>
                        <transaction-list ref="transactionListBox" v-show="!showConnectBankBox" :accountType="accountType" :clientId="clientId"></transaction-list>
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
    }),
    created() {
        this.accountType = this.$route.query.type ? Number(this.$route.query.type) : 1;
        this.clientId = this.$store.state.userAuth._id;
        this.listMenu = this.$services.commonService.getMenuTransactions();
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
    }
};
</script>