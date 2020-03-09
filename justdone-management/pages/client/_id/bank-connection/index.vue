<template>
    <section class="bank-connection">
        <div class="row">
            <div class="col-auto">
                <bank-list-connect
                    ref="listAccountConnect"
                    @reTryConnect="handlerReTryConnect"
                    @toggleConnected="handlerToggleConnected"
                    @accountSelected="handlerAccountSelected"
                    @addBank="handlerAddBank"
                    @refreshList="handlerRefresh"
                    :list="listAccountConnect"
                    :listManual="listAccountManual"
                    :is-manager-view="true"
                />
            </div>
            <div class="pt-35 transaction position-relative">
                <page-title />
                <connect-bank
                    v-show="isConnect"
                    ref="connectBankBox"
                    :editable="true"
                    :accountType="accountType"
                    :clientId="clientId"
                    @showTransaction="handlerShowTransaction"
                />
                <div
                    v-show="!isConnect"
                    class="transaction-box"
                >
                    <div
                        class="list-connected"
                        v-if="showListConnected"
                    >
                        <div
                            class="row"
                            v-if="Object.keys(listConnected).length"
                        >
                            <div
                                class="col-6"
                                v-for="(item, index) in listConnected"
                                :key="index"
                            >
                                <list-connected :data="item" />
                            </div>
                        </div>
                        <div
                            v-else
                            class="wrapper-list"
                        >
                            <div class="no-data text-center">
                                <img
                                    src="~/assets/images/no-data.png"
                                    alt="no data"
                                >
                                <p class="text-note">No data available.</p>
                            </div>
                        </div>
                    </div>
                    <template v-else-if="accountSelected">
                        <div
                            v-if="!showDetail"
                            class="transaction-list"
                        >
                            <div class="row">
                                <div class="col-4">
                                    <div class="select-financial pdl-10">
                                        <h3 class="select-title">SELECT FINANCIAL YEAR</h3>
                                        <div class="dropdown">
                                            <a
                                                class="dropdown-toggle"
                                                data-toggle="dropdown"
                                            >
                                                {{showFinancialYear(financialYearSelected)}}
                                                <i class="fa fa-angle-down"></i>
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li
                                                    v-for="(year, index) in financialYears"
                                                    :key="index"
                                                    @click="financialYearSelected = year"
                                                    class="dropdown-menu-link"
                                                >
                                                    <a>{{ showFinancialYear(year) }}</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-8 text-right d-flex align-items-center justify-content-end">
                                    <button v-if="accountSelected.isManual === true && roleAdmin === 1" class="btn outline mr-10" @click="confirmDeleteAccount()">Delete Account</button>
                                    <div>
                                        <label class="btn btn-import-csv outline mb-0">
                                            <input
                                                type="file"
                                                accept=".csv"
                                                @change="processCSVFiles"
                                            />
                                            Import .CSV
                                        </label>
                                    </div>
                                    <!-- <div>
                                        <label class="btn btn-import-csv">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                @change="processPDFFiles"
                                            />
                                            Import .PDF
                                        </label>
                                    </div> -->
                                    <!-- <P
                                        class="connect-item"
                                        v-if="accountSelected"
                                    >
                                        <span class="connect-bank-logo"><img
                                                class="connect-bank-img"
                                                :src="accountSelected.favicon || '/images/default-avatar.jpg'"
                                            /></span>
                                        <span class="connect-bank-name">{{accountSelected.accountName}}</span>
                                        <span class="connect-bank-number">{{convertToSecret(accountSelected.accountNumber) || ''}}</span>
                                        <span class="connect-bank-btn"><span class="btn-small normal-point">{{accountSelected.type === bankType.Bank ? 'Bank' : 'CC'}}</span></span>
                                    </P> -->
                                    <button class="btn outline" data-toggle="modal" data-target="#modal-initial-ob">Initial OB</button>
                                </div>
                            </div>
                            <template v-if="statements.length">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <td>Date</td>
                                            <td>Status</td>
                                            <td>Transactions</td>
                                            <td>OB</td>
                                            <td>CB</td>
                                            <td class="text-right">Actions</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="(statement, index) in statements"
                                            :key="index"
                                        >
                                            <td class="align-self-center transaction-name">
                                                {{statement.month | convertMonthToWord}} - {{statement.year}}
                                            </td>
                                            <td
                                                class="align-self-center crunch-status color-grey"
                                                :class="{red: !statement.completedAt}"
                                            >
                                                {{statement.completedAt ? 'Finished' : 'Not crunched yet'}}
                                            </td>
                                            <td>{{statement.totalTransactions || 0}}</td>
                                            <td>
                                                <span
                                                    class=text-success
                                                    v-if="statement.openBalance > 0"
                                                >+</span>
                                                <span
                                                    class="text-danger"
                                                    v-else
                                                >-</span>{{formatMoney($get(statement, "openBalance", 0))}}
                                            </td>
                                            <td>
                                                <span
                                                    class=text-success
                                                    v-if="statement.closeBalance > 0"
                                                >+</span>
                                                <span
                                                    class="text-danger"
                                                    v-else
                                                >-</span>{{formatMoney($get(statement, "closeBalance", 0))}}
                                            </td>
                                            <td class="align-self-center text-right">
                                                <a
                                                    class="btn-normal grey fz-9 max-140 pd-l-r-10"
                                                    @click="showDetailStatement(statement)"
                                                >
                                                    View
                                                </a>
                                                <a
                                                    v-if="$auth.checkPermission($module.CRUNCHER.claim.UPDATE.code, roleClient)"
                                                    @click="getLinkCrunch(statement.month, statement.year)"
                                                    class="btn-normal grey fz-9 max-140 pd-l-r-10"
                                                >
                                                    Crunch
                                                </a>
                                                <a
                                                    :class="{disabled: !statement.completedAt}"
                                                    class="btn-normal grey fz-9 max-140 pd-l-r-10 mr-0"
                                                    data-toggle="dropdown"
                                                >
                                                    Download
                                                </a>
                                                <ul
                                                    class="dropdown-menu"
                                                    style="max-width: 120px;left: 87px !important;"
                                                >
                                                    <li @click="exportPDF(statement.month, statement.year)"><a class="dropdown-menu-link"><img
                                                                alt=""
                                                                title=""
                                                                src="~/assets/images/icon-pdf.svg"
                                                            >Export as PDF</a></li>
                                                    <li @click="exportCSV(statement.month, statement.year)"><a class="dropdown-menu-link"><img
                                                                alt=""
                                                                title=""
                                                                src="~/assets/images/icon-csv.svg"
                                                            >Export as CSV</a></li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="text-right pd-10">
                                    <span class="mr-10 color-grey">Export year to date</span>
                                    <div
                                        class="btn-normal fz-9 blue"
                                        @click="exportPDFYear(financialYearSelected.begin)"
                                    >Export PDF</div>
                                    <div
                                        class="btn-normal fz-9 blue"
                                        @click="exportCSVYear(financialYearSelected.begin)"
                                    >Export CSV</div>
                                </div>
                            </template>
                            <div
                                v-else
                                class="wrapper-list"
                            >
                                <div class="no-data text-center">
                                    <img
                                        src="~/assets/images/no-data.png"
                                        alt="no data"
                                    >
                                    <p class="text-note">No data available.</p>
                                </div>
                            </div>
                        </div>
                        <div
                            v-else
                            class="transaction-detail"
                        >
                            <div class="box-title pd-10">
                                <h6>{{statementSelected.month | convertMonthToWord}} / {{statementSelected.year}} - Transactions</h6>
                                <a
                                    @click="showDetail = !showDetail"
                                    class="float-right font-big"
                                > <i
                                        class="fa fa-long-arrow-left mr-10"
                                        aria-hidden="true"
                                    ></i> Go Back</a>
                            </div>
                            <transaction-list
                                :transactions="statementSelected.transactions"
                                @reload="showDetailStatement"
                            />
                        </div>
                    </template>
                    <div
                        v-else
                        class="wrapper-list"
                    >
                        <div class="no-data text-center">
                            <img
                                src="~/assets/images/no-data.png"
                                alt="no data"
                            >
                            <p class="text-note">No data available.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ModalImportCSV
            v-if="showModal"
            :closeModal="closeModal"
            :groupedTransactions="groupedTransactions"
        />

        <ModalInitialOB 
            :financialYears="financialYears" 
            :accountSelected="accountSelected" 
            @reload="getListAccountConnect"
        />

        <popup-confirm
            :id="'popup-confirm'"
            ref="popupConfirm"
            @success="handlerConfirm"
        />

    </section>
</template>

<script>
import BankListConnect from '~/components/bank/BankListConnect';
import PopupConfirm from '~/components/PopupConfirm';
import ConnectBank from '~/components/bank/ConnectBank';
import ListConnected from '~/components/bank/ListConnected';
import HistoryLogs from '~/components/HistoryLogs';
import PageTitle from '~/components/PageTitle';
import {getFinancialYearsNew, convertToSecret, convertToCurrency} from '~/helpers/dataHelper.js';
import {convertMonthToWord, formatDate} from '~/helpers/dateHelper.js';
import {StatusConnectBank, BankType} from '~/common/commonType';
import EventBus from '~/plugins/event-bus';
import Pagination from '~/components/Pagination';
import {changeParam, formatMoney} from '~/helpers/dataHelper';
import ModalImportCSV from './ImportCSV';
import ModalInitialOB from './InitialOB';
import TransactionList from './TransactionList';
import moment from 'moment';

export default {
    data() {
        return {
            accountType: null,
            clientId: null,
            financialYears: [],
            financialYearSelected: this.value && JSON.parse(JSON.stringify(this.value)),
            isConnect: false,
            showDetail: false,
            showListConnected: false,
            accountSelected: null,
            listAccountConnect: [],
            listAccountManual: [],
            statements: [],
            statementSelected: [],
            listConnected: [],
            bankType: BankType,
            roleClient: 0,
            user: {},
            bankId: null,
            showModal: false,
            groupedTransactions: {},
            modifyIndex: -1,
            addIndex: -1,
            roleAdmin: 9
        };
    },
    async created() {
        this.clientId = this.$route.params.id || this.$store.state.client._id;
        this.accountType = this.$route.query.type ? Number(this.$route.query.type) : 1;
        this.roleClient = this.$store.state.client.permission.role.code;
        this.roleAdmin = this.$store.state.userAuth ? this.$store.state.userAuth.permission.role.code : 9;
        this.user = await this.$services.userService.getUserById(this.clientId);
        this.financialYears = getFinancialYearsNew(this.user.data.financialStart);

        if (this.$route.query.begin && this.$route.query.end) {
            let queryDate = {};
            queryDate.begin = this.$route.query.begin;
            queryDate.end = this.$route.query.end;
            this.financialYearSelected = queryDate;
        }
        else
            this.financialYearSelected = this.financialYears[0];
    },
    mounted() {
        this.getListAccountConnect();
    },
    watch: {
        financialYearSelected: function(newFinancialYear) {
            if (!newFinancialYear)
                return;

            changeParam('begin', newFinancialYear.begin);
            changeParam('end', newFinancialYear.end);
            this.getStatementByFinancialYear(this.clientId, this.accountSelected && this.accountSelected.accountId, this.accountType, newFinancialYear);
        },

    },
    components: {
        BankListConnect,
        ConnectBank,
        ListConnected,
        HistoryLogs,
        Pagination,
        PageTitle,
        ModalImportCSV,
        TransactionList,
        ModalInitialOB,
        PopupConfirm
    },
    methods: {
        initNotify(option, title, text) {
            this.$notify({
                group: option,
                title: title,
                text: text
            });
        },
        formatMoney,
        confirmDeleteAccount() {
            this.$refs.popupConfirm.open({type: 'account', title: 'Are you sure to delete this account ?'});
        },
        async handlerConfirm(confirm) {
            let result;
            if (confirm.type === 'account') {
                result = await this.$services.userService.deleteManualAccount(this.accountSelected._id);
            }

            if (!result.error) {
                await this.handlerRefresh();
                this.$notify({
                    type: 'success',
                    title: 'Create completed',
                    text: 'Thank you'
                });
            }
            else {
                this.$notify({
                    type: 'error',
                    title: 'Delete error',
                    text: 'Please check again'
                });
            }
        },
        closeModal() {
            this.showModal = false;
        },
        clickImport() {
            this.showModal = true;
        },
        handlerRefresh() {
            this.listAccountConnect = [];
            this.listAccountManual = [];
            this.getListAccountConnect();
        },
        processCSVFiles: async function(event) {
            event.preventDefault();
            const {target = {}} = event;
            const {files = {}} = target;
            const fileList = Object.values(files);
            if (fileList.length > 0) {
                fileList.forEach(file => {
                    this.readCSV(file)
                        .then(lines => {
                            const groupedTransactions = this.groupTransaction(lines);
                            this.groupedTransactions = groupedTransactions;
                            this.showModal = true;
                        }).catch(() => {
                        });
                });
            }
        },
        processPDFFiles(event) {
            event.preventDefault();
            const {target = {}} = event;
            const {files = {}} = target;
            const fileList = Object.values(files);
            if (fileList.length > 0) {
                // fileList.forEach(file => {
                //     this.readPDF(file)
                //         .then(data => {
                //             pdfReader.getDocument(data).then(function(pdf) {
                //                 const totalPage = pdf.numPages;
                //                 for (let i = 0; i < totalPage; i++) {
                //                     pdf.getPage(i).then((page) => {
                //                         page.getTextContent().then((content) => {
                //                         });
                //                     });
                //                 }
                //             });
                //         }).catch(() => {
                //         });
                // });
            }
        },
        async readCSV(csvFile) {
            return new Promise((resolve, reject) => {
                var fileReader = new FileReader();
                fileReader.onload = (event) => {
                    const content = fileReader.result || '';
                    const lines = content.split('\n');
                    resolve(lines);
                };
                fileReader.onerror = (error) => {
                    reject(error);
                };
                fileReader.readAsText(csvFile);
            });
        },
        async readPDF(pdfFile) {
            return new Promise((resolve, reject) => {
                var fileReader = new FileReader();
                fileReader.onload = (event) => {
                    const content = fileReader.result || '';
                    resolve(new Uint8Array(content));
                };
                fileReader.onerror = (error) => {
                    reject(error);
                };
                fileReader.readAsArrayBuffer(pdfFile);
            });
        },

        groupTransaction(transactions) {
            let result = {};
            transactions.forEach(transaction => {
                if (transaction) {
                    const formattedRecord = this.readLine(transaction);
                    const timestamp = moment(formattedRecord.date).date(1).unix();
                    result[timestamp] = [...result[timestamp] || [], formattedRecord];
                }
            });
            return result;
        },

        readLine: function(line) {
            const arr = line.split(',');
            const date = arr[0] || '';
            const amount = parseFloat(arr[1] || 0);
            const baseType = amount < 0 ? 'DEBIT' : 'CREDIT';
            const description = [arr[5], arr[4]].map(element => element).join(' ');
            const formmatedDate = moment(date).toISOString();
            const {accountId, userId, type} = this.accountSelected;

            return {
                amount: {
                    amount: Math.abs(amount),
                    currency: 'AUD'
                },
                accountId,
                baseType,
                category: 'Service Charges/Fees',
                categoryType: 'EXPENSE',
                categoryId: 24,
                categorySource: 'SYSTEM',
                description: {
                    original: description,
                },
                date: formmatedDate,
                highLevelCategoryId: 10000011,
                isManual: true,
                postDate: formmatedDate,
                runningBalance: {
                    currency: 'AUD',
                    amount: 0
                },
                status: 'POSTED',
                userId,
                type,
                month: moment(date).month() + 1,
                year: moment(date).year(),
                index: 1,
            };
        },
        async getListAccountConnect() {
            this.listAccountConnect = [];
            this.listAccountManual = [];
            let result = await this.$services.yodleeService.getBanksConnected(this.clientId);
            if (result && result.data) {
                result.data.map(item => {
                    if (item.isManual === true) {
                        this.listAccountManual.push(item);
                    }
                    else {
                        this.listAccountConnect.push(item);
                    }
                });
                // this.listAccountConnect = result.data;
            }
            else {
                this.listAccountConnect = [];
            }

            if (this.$route.query.itemBank && this.$route.query.itemBank !== 'null') {
                let accountSelected = this.listAccountConnect.find(item => item._id === this.$route.query.itemBank);
                this.$refs.listAccountConnect.selectAccount(accountSelected);
            }
            else
                for (let i = 0; i < this.listAccountConnect.length; i++) {
                    if (this.listAccountConnect[i].status === StatusConnectBank.Connected) {
                        this.$refs.listAccountConnect.selectAccount(this.listAccountConnect[i]);
                        this.isConnect = false;
                        break;
                    }
                }
        },
        async getStatementByFinancialYear(userId, accountId, bankType, financialYear) {
            if (!userId || !accountId || !bankType || !financialYear)
                return;
            if (this.$route.query.yearBegin && this.$route.query.yearBegin !== 'null' && this.$route.query.yearEnd && this.$route.query.yearEnd !== 'null') {
                let itemYear = {};
                itemYear.begin = this.$route.query.yearBegin;
                itemYear.end = this.$route.query.yearEnd;
                this.financialYear = itemYear;
                let {dataQuery, errorQuery} = await this.$services.statementService.getStatementsByFinancialYear(userId, accountId, bankType, financialYear.begin, financialYear.end);
                if (errorQuery)
                    EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: errorQuery.message});
                this.statements = dataQuery || [];
            }
            let {data, error} = await this.$services.statementService.getStatementsByFinancialYear(userId, accountId, bankType, financialYear.begin, financialYear.end);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            // else if (data) {
            //     data.forEach(item => {
            //         item.page = 1;
            //         item.limit = 10;
            //         item.total = 0;
            //     });
            // }
            this.statements = data || [];
        },
        getLinkAddTransaction(month, year) {
            let storage = localStorage.params && JSON.parse(localStorage.params);
            if (storage && storage.length) {
                this.bankId = storage.find(item => item.name === 'itemBank') && storage.find(item => item.name === 'itemBank').value;
            }
            this.$router.push(`/client/${this.$store.state.client._id}/transaction/add-transaction?bankId=${this.bankId}&type=${this.accountType}&accountId=${this.accountSelected.accountId}&month=${month}&year=${year}`);
        },
        getLinkCrunch(month, year) {
            this.$router.push(`/client/${this.$store.state.client._id}/transaction/crunch?type=${this.accountType}&accountId=${this.accountSelected.accountId}&month=${month}&year=${year}`);
        },

        async showDetailStatement(statement = this.statementSelected) {
            this.$setLoading();
            this.statementSelected = statement;
            let {data, error} = await this.$services.transactionService.getTransactions(this.clientId, this.accountSelected && this.accountSelected.accountId, statement.type, statement.year, statement.month, 1, 100000);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});

            this.statementSelected.transactions = data || [];
            this.$forceUpdate();
            this.showDetail = true;
            this.$setLoading(false);
        },
        async exportPDF(month, year) {
            let {data} = await this.$services.reportService.exportCruncherPDF(this.clientId, this.$store.state.productCode, this.accountSelected && this.accountSelected.accountId, this.accountType, month, year);
            if (data) {
                window.location = data;
            }
        },
        async exportPDFYear(year) {
            let {data, error} = await this.$services.reportService.exportCruncherYearPDF(this.clientId, this.$store.state.productCode, this.accountSelected && this.accountSelected.accountId, this.accountType, year);
            if (error)
                this.initNotify('error', 'Error', error.message);
            else
                window.location = data;
        },
        async exportCSV(month, year) {
            let {data, error} = await this.$services.reportService.exportCruncherCSV(this.clientId, this.$store.state.productCode, this.accountSelected && this.accountSelected.accountId, this.accountType, month, year);
            if (error)
                this.initNotify('error', 'Error', error.message);
            else
                window.location = data;
        },
        async exportCSVYear(year) {
            let {data, error} = await this.$services.reportService.exportCruncherYearCSV(this.clientId, this.$store.state.productCode, this.accountSelected && this.accountSelected.accountId, this.accountType, year);
            if (error) {
                this.initNotify('error', 'Error', error.message);
            }
            else {
                window.location = data;
            }
        },
        showFinancialYear(financialYear) {
            if (!financialYear || !financialYear.begin || !financialYear.end)
                return '';

            return financialYear.begin + ' / ' + financialYear.end;
        },
        async handlerToggleConnected() {
            this.showListConnected = !this.showListConnected;
            this.isConnect = false;

            if (this.showListConnected) {
                let result = await this.$services.yodleeService.getAllConnectBank(this.clientId);
                if (result.data) {
                    let allConnect = result.data.reduce(function(r, a) {
                        r[a.providerName] = r[a.providerName] || [];

                        r[a.providerName].push(a);
                        return r;
                    }, Object.create(null));
                    this.listConnected = allConnect;
                }
            }
        },
        handlerAccountSelected(data) {
            if (data.status === StatusConnectBank.Connected)
                this.isConnect = false;
            this.accountSelected = data;
            this.accountType = data.type;
            this.showDetail = false;
            this.getStatementByFinancialYear(this.clientId, this.accountSelected && this.accountSelected.accountId, this.accountType, this.financialYearSelected);
        },
        handlerAddBank() {
            this.isConnect = true;
        },
        handlerShowTransaction() {
            this.getListAccountConnect();
            this.isConnect = false;
        },
        handlerReTryConnect(data) {
            this.$refs.connectBankBox.reTryConnect(data);
        },
        convertToSecret(value) {
            return convertToSecret(value);
        },
    },
    filters: {
        convertMonthToWord(month) {
            return convertMonthToWord(month);
        },
        formatDate(date) {
            return formatDate(date);
        },
        convertToCurrency(value) {
            return convertToCurrency(value);
        },
    },
};
</script>
