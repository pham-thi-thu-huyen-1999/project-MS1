<template>
    <section class="transaction bank-statement">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <page-title :titles="titles" />
                <div class="row">
                    <div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">
                        <menu-page
                            :listMenu="menuTransactions"
                            v-model="financialYear"
                            @yearSelected="yearSelected($event)"
                        ></menu-page>
                    </div>
                    <div class="col-md col-sm-12 col-xs-12">
                        <connect-bank
                            ref="connectBankBox"
                            v-show="showConnectBankBox"
                            :editable="false"
                            :accountType="accountType"
                            :clientId="clientId"
                            @changeStatus="handleConnectedBank($event)"
                        ></connect-bank>
                        <div
                            class="transaction-list-crunch"
                            v-show="!showConnectBankBox"
                        >
                            <a
                                class="btn btn-small custom"
                                @click="exportPDFYear(yearSelect)"
                            >Export PDF</a>
                            <a
                                class="btn btn-small custom"
                                @click="exportCSVYear(yearSelect)"
                            >Export CSV</a>
                            <template v-if="crunchs.length > 0">
                                <div
                                    class="transaction-item"
                                    v-for="(crunch, index) in crunchs"
                                    :key="index"
                                >
                                    <div class="transaction-box">
                                        <div class="row">
                                            <div class="col-3">
                                                <span class="transaction-name">{{crunch.month | convertMonthToWord}} {{crunch.year}}</span>
                                            </div>
                                            <div class="col-9 text-right">
                                                <!-- <label class="crunch-status blue">Auto crunch</label> -->
                                                <label
                                                    :class="crunch.completedAt ? 'grey' : 'red'"
                                                    class="crunch-status"
                                                > {{crunch.completedAt ? 'Crunch completed' : 'Not crunched yet'}} </label>
                                                <a
                                                    v-if="crunch.completedAt"
                                                    @click="getLinkView(crunch.month, crunch.year)"
                                                    class="btn-normal grey fz-9"
                                                >View</a>
                                                <a
                                                    v-if="crunch.completedAt"
                                                    class="btn-normal grey fz-9"
                                                    data-toggle="dropdown"
                                                >download</a>
                                                <ul
                                                    class="dropdown-menu"
                                                    style="max-width: 120px;left: 87px !important;"
                                                >
                                                    <li><a
                                                            class="dropdown-menu-link"
                                                            @click="exportPDF(crunch.month, crunch.year)"
                                                        > <img
                                                                alt=""
                                                                title=""
                                                                src="~/assets/images/icon-pdf.svg"
                                                            >Export as PDF</a></li>
                                                    <li><a
                                                            class="dropdown-menu-link"
                                                            @click="exportCSV(crunch.month, crunch.year)"
                                                        ><img
                                                                alt=""
                                                                title=""
                                                                src="~/assets/images/icon-csv.svg"
                                                            >Export as CSV</a></li>
                                                </ul>
                                                <a
                                                    v-if="$auth.checkPermission($module.CRUNCHER.claim.UPDATE.code, roleClient)"
                                                    @click="getLinkCrunch(crunch.month, crunch.year)"
                                                    class="btn-normal grey fz-9"
                                                >crunch</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <div
                                v-else
                                class="no-data text-center"
                            >
                                <img
                                    src="~/assets/images/no-data.png"
                                    alt="no data"
                                >
                                <p class="text-note">No data available.</p>
                            </div>
                        </div>
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
import HistoryLogs from '~/components/HistoryLogs';
import ConnectBank from '~/components/ConnectBank';
import MenuPage from '~/components/MenuPage';
import Pagination from '~/components/Pagination';
import PageTitle from '~/components/PageTitle';
import {convertMonthToWord} from '~/helpers/dateHelper';

export default {
    data() {
        return {
            crunchs: [],
            showConnectBankBox: true,
            financialYear: null,
            titles: ['Transactions', 'Credit card'],
            menuTransactions: [],
            type: null,
            accountType: null,
            clientId: null,
            roleClient: 0,
            yearSelect: null
        };
    },
    components: {
        HistoryLogs,
        ConnectBank,
        MenuPage,
        Pagination,
        PageTitle
    },
    watch: {
        financialYear: function(year) {
            this.getCrunch(year.begin);
        },
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
    created() {
        this.accountType = this.$route.query.type ? Number(this.$route.query.type) : 1;
        this.clientId = this.$route.params.id || this.$store.state.client._id;
        this.roleClient = this.$store.state.client.permission.role.code;
        this.menuTransactions = this.$services.commonService.getMenuTransactions(this.$store.state.client._id);
    },
    methods: {
        handleConnectedBank(event) {
            if (!event)
                return;

            if (event.message === 'userConnectAccountSuccess') {
                this.showConnectBankBox = false;
                this.getCrunch(this.financialYear.begin);
            }
        },
        yearSelected(year) {
            this.yearSelect = year;
        },
        async getCrunch(beginYear) {
            let userId = this.$store.state.client._id;
            this.type = parseInt(this.$route.query.type) || 1;
            if (!userId || !beginYear)
                return false;
            else {
                let {data, error} = await this.$services.crunchService.getCrunch(userId, this.type, beginYear);
                if (!data || error)
                    return false;
                else
                    this.crunchs = data || [];
            }
        },
        getLinkView(month, year) {
            this.$router.push(`/client/${this.$store.state.client._id}/transaction/cruncher-preview?type=${this.type}&month=${month}&year=${year}`);
        },
        getLinkCrunch(month, year) {
            this.$router.push(`/client/${this.$store.state.client._id}/transaction/crunch?type=${this.type}&month=${month}&year=${year}`);
        },
        async exportPDF(month, year) {
            let {data, error} = await this.$services.reportService.exportCruncherPDF(this.clientId, 1, this.accountType, month, year);
            if (error)
                this.initNotify('error', 'Error', error.message);
            else
                window.location = data;
        },
        async exportPDFYear(year) {
            let {data, error} = await this.$services.reportService.exportCruncherYearPDF(this.clientId, 1, this.accountType, year);
            if (error)
                this.initNotify('error', 'Error', error.message);
            else
                window.location = data;
        },
        async exportCSV(month, year) {
            let {data, error} = await this.$services.reportService.exportCruncherCSV(this.clientId, 1, this.accountType, month, year);
            if (error)
                this.initNotify('error', 'Error', error.message);
            else
                window.location = data;
        },
        async exportCSVYear(year) {
            let {data, error} = await this.$services.reportService.exportCruncherYearCSV(this.clientId, 1, this.accountType, year);
            if (error)
                this.initNotify('error', 'Error', error.message);
            else
                window.location = data;
        },
    },
    filters: {
        convertMonthToWord(month) {
            if (month) {
                return convertMonthToWord(month);
            }
            return '';
        },
    }
};
</script>

