<template>
    <section class="add-transaction">
        <div class="page-head row">
            <h1 class="page-title col-11">Add Transansaction - {{month}} - {{year}}</h1>
            <button
                class="btn btn-small text-right"
                type="button"
                @click="backToHis()"
            >Back</button>
        </div>
        <ul
            class="nav-tab"
            role="tablist"
        >
            <li
                class="nav-item"
                :class="{'active' : tab === 'view'}"
                @click="changeTab('view')"
            >
                <a class="nav-link">View</a>
            </li>
            <li
                class="nav-item"
                :class="{'active' : tab === 'add'}"
                @click="changeTab('add')"
            >
                <a class="nav-link">Add Transactions</a>
            </li>
        </ul>
        <div class="page-list bg-white container-fluid">
            <div class="tab-content">
                <div v-if="tab === 'add'">
                    <div class="header-title mb-17 mt-30 row">
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">DATE</div>
                        <div class="col-lg-4 col-md-3 col-sm-3 col-xs-3">DESCRIPTION</div>
                        <div class="col-lg-2 col-md-3 col-sm-3 col-xs-3">AMOUNT</div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">BASETYPE</div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">RUNNING BALANCE</div>

                    </div>
                    <div
                        class="body-transactions"
                        v-for="(x, index) in transactions"
                        :key="index"
                    >
                        <div class="transaction-item mb-10 row">
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                <date-picker-add-trans
                                    :month="numMonth"
                                    :multiple="false"
                                    :year="year"
                                    v-model="transactions[index].date"
                                />
                            </div>
                            <div class="col-lg-4 col-md-3 col-sm-3 col-xs-3 mt-10">
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="transactions[index].description.original"
                                    autocomplete="off"
                                    required
                                />
                            </div>
                            <div class="col-lg-2 col-md-3 col-sm-3 col-xs-3 mt-10">
                                <div class="input-group mb-2">
                                    <input
                                        type="number"
                                        class="form-control aud-amount"
                                        v-model="transactions[index].amount.amount"
                                        autocomplete="off"
                                        required
                                    />
                                    <span class="type-money-amount"> AUD </span>
                                </div>
                            </div>
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 mt-10">
                                <div
                                    class="btn-group"
                                    role="group"
                                >
                                    <button
                                        type="button"
                                        class="btn-test"
                                        :class="{'active' : transactions[index].baseType === 'credit'}"
                                        @click="changeBaseType(index, 'credit')"
                                    >Credit</button>
                                    <button
                                        type="button"
                                        class="btn-test"
                                        :class="{'active' : transactions[index].baseType === 'debit'}"
                                        @click="changeBaseType(index, 'debit')"
                                    >Debit</button>
                                </div>
                            </div>
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 mt-10">
                                <div class="input-group">
                                    <input
                                        type="number"
                                        class="form-control aud-running"
                                        v-model="transactions[index].runningBalance.amount"
                                        autocomplete="off"
                                        required
                                    />
                                    <span class="type-money "> AUD </span>
                                </div>
                            </div>

                            <div class="">
                                <span
                                    class="icon-delete grey mt-20"
                                    @click="deleteFiel(index)"
                                > </span>
                            </div>
                        </div>
                    </div>
                    <button
                        class="ml-89 add-feild"
                        @click="addField()"
                    >+ ADD FIELD</button>
                    <div class="col-11 text-right mt-20 ml-8">
                        <button
                            class="btn-save col-2"
                            @click="saveTransaction()"
                        > SAVE </button>
                    </div>
                </div>
                <div
                    v-else
                    class="transaction-detail"
                >
                    <div class="box-title pd-10">
                        <h6>{{month}} / {{year}} - Manual Transactions </h6>
                    </div>
                    <div class="row font-medium color-grey pd-10">
                        <div class="col-2">DATE</div>
                        <div class="col-6">TITLE</div>
                        <div class="col text-right">DEBIT</div>
                        <div class="col text-right">CREDIT</div>
                        <div class="col text-right">OPTION</div>
                    </div>
                    <template v-if="dataManuals && dataManuals.length">
                        <div
                            class="row pd-10"
                            v-for="(transaction, index) in dataManuals"
                            :key="index"
                        >
                            <div class="col-2 color-grey">{{transaction.date | formatDate}}</div>
                            <div class="col-6">{{transaction.description.original}}</div>
                            <div class="col text-right"><span v-if="transaction.baseType === 'DEBIT'"><span class="sub">-$</span>{{transaction.amount.amount}}</span></div>
                            <div class="col text-right"><span v-if="transaction.baseType !== 'DEBIT'"><span class="add">+$</span>{{transaction.amount.amount}}</span></div>
                            <div class="col text-right">
                                <span>
                                    <a
                                        class="icon-delete grey fix-ml"
                                        @click="deleteTransaction(transaction._id)"
                                    ></a>
                                </span>
                                <span>
                                    <a
                                        hef="#modal_update_transaction"
                                        data-toggle='modal'
                                        data-target='#modal_update_transaction'
                                        @click="setUpdatingTransaction(transaction)"
                                    >
                                        <i class="fa fa-edit btn-edit"></i>
                                    </a>
                                </span>
                            </div>
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
                    <!-- <div class="paginate text-right" :id="statementSelected.total">
                  <pagination :page="statementSelected.page" :limit="statementSelected.limit" :total="statementSelected.total" @change="changePage($event, this.statementSelected)"/>
              </div> -->

                </div>
            </div>
        </div>
    </section>
</template>
<script>
import {convertMonthToWord, formatDate} from '~/helpers/dateHelper.js';
import {convertToCurrency} from '~/helpers/dataHelper.js';
import DatePickerAddTrans from '~/components/DatePickerAddTrans';
import LookupFileType from '~/components/bank/LookupFileType';

// import moment from 'moment';

export default {
    data() {
        return {
            transactions: [],
            month: null,
            year: null,
            bankId: null,
            numMonth: null,
            category: null,
            categoryType: null,
            categoryId: null,
            categorySource: null,
            highLevelCategoryId: null,
            status: null,
            isManual: false,
            postDate: null,
            userSearch: null,
            accountSearch: null,
            typeSearch: null,
            tab: 'view',
            dataManuals: [],
            manualTransaction: true,
            getTrans: [],
            buttonAddStatement: false,
            transactionToBeUpdated: {
            },
            showModalUpdate: false
        };
    },
    components: {
        DatePickerAddTrans,
        LookupFileType,
    },
    async created() {
        this.numMonth = this.$route.query.month ? this.$route.query.month : null;
        this.month = convertMonthToWord(this.numMonth);
        this.year = this.$route.query.year ? this.$route.query.year : null;
        this.userSearch = this.$store.state.client._id ? this.$store.state.client._id : null; //eslint-disable-line
        this.accountSearch = this.$route.query.accountId ? this.$route.query.accountId : null; // eslint-disable-line
        this.typeSearch = this.$route.query.type ? this.$route.query.type : null; // eslint-disable-line
        this.getManualTransactions();
    },

    async getManualTransactions() {
        this.getTrans = await this.$services.transactionService.getManualTransaction(this.manualTransaction, this.userSearch, this.accountSearch, this.typeSearch, this.year, this.numMonth); // eslint-disable-line
        this.dataManuals = this.getTrans.data;
    },
    async mounted() {
        let itemTransactions = {
            date: '',
            amount: {
                currency: 'AUD',
                amount: '',
            },
            baseType: 'credit',
            runningBalance: {
                currency: 'AUD',
                amount: '0',
            },
            description: {
                original: '',
            },
            userId: this.$store.state.client._id ? this.$store.state.client._id : null,
            accountId: this.$route.query.accountId ? this.$route.query.accountId : null,
            type: this.$route.query.type ? this.$route.query.type : null,
            month: this.numMonth,
            year: this.year,
            category: 'Service Charges/Fees',
            categoryType: 'EXPENSE',
            categoryId: 24,
            categorySource: 'SYSTEM',
            status: 'POSTED',
            highLevelCategoryId: 10000009,
            isManual: this.isManual,
            index: 1
        };

        // convert and push to transactions[]
        let item = JSON.stringify(itemTransactions);
        this.transactions.push(JSON.parse(item));
        this.changeTab('view');
        this.checkTransaction();
    },
    methods: {
        setUpdatingTransaction(transaction) {
            this.transactionToBeUpdated = JSON.parse(JSON.stringify(transaction));
        },
        async createFullStatements() {
            let dataCreateStatement = {
                month: 7,
                year: 2016,
                userId: this.userSearch,
                accountId: this.accountSearch,
                type: 2,
            };
            let dataDone = await this.$services.transactionService.createFullStatement(dataCreateStatement);

            if (dataDone)
                this.buttonAddStatement = false;
        },
        async checkTransaction() {
            let dataCheck = {
                userId: this.userSearch,
                accountId: this.accountSearch,
                type: this.typeSearch
            };
            let resultData = await this.$services.transactionService.checkTransactionByMonth(dataCheck);

            if (resultData.data)
                this.buttonAddStatement = true;
        },
        changeTab(name) {
            if (name === 'add') {
                this.tab = 'add';
            }
            if (name === 'view') {
                this.tab = 'view';
            }
        },
        changeBaseType(index, name) {
            if (name === 'credit') {
                this.transactions[index].baseType = 'credit';
            }
            if (name === 'debit') {
                this.transactions[index].baseType = 'debit';
            }
        },
        async checkData() {
            for (let i = 0; i < this.transactions.length; i++) {
                if (this.transactions[i].date === '')
                    return true;
                if (this.transactions[i].amount.amount === '')
                    return true;
                if (this.transactions[i].description.original === '')
                    return true;
            }
        },
        async convertDateData() {
            let dataTrans = [];
            for (let i = 0; i < this.transactions.length; i++) {
                // this.transactions[i].date = formatDateCover(this.transactions[i].date, this.numMonth, this.year);
                this.transactions[i].postDate = this.transactions[i].date;
                dataTrans.push(this.transactions[i]);
            }
            return dataTrans;
        },
        async getManualTransactions() {
            this.getTrans = await this.$services.transactionService.getManualTransaction(this.manualTransaction, this.userSearch, this.accountSearch, this.typeSearch, this.year, this.numMonth); // eslint-disable-line
            this.dataManuals = this.getTrans.data;
        },
        async saveTransaction() {
            let check = await this.checkData();

            if (check) {
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Please fill all input'
                });
                return false;
            }

            let data = await this.convertDateData();

            // Call API save Transactions

            try {
                await this.$services.transactionService.createTransactionWithoutId(data);
                this.$notify({
                    type: 'success',
                    title: 'Success',
                    text: 'Save transactions success !'
                });
            }
            catch (error) {
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Save transactions failed !'
                });
            }
            return false;
        },
        async addField() {
            let itemTransactions = {
                date: '',
                amount: {
                    currency: 'AUD',
                    amount: '',
                },
                baseType: 'credit',
                runningBalance: {
                    currency: 'AUD',
                    amount: '0',
                },
                description: {
                    original: '',
                },
                userId: this.$store.state.client._id ? this.$store.state.client._id : null,
                accountId: this.$route.query.accountId ? this.$route.query.accountId : null,
                type: this.$route.query.type ? this.$route.query.type : null,
                month: this.numMonth,
                year: this.year,
                category: 'Service Charges/Fees',
                categoryType: 'EXPENSE',
                categoryId: 24,
                categorySource: 'SYSTEM',
                status: 'POSTED',
                highLevelCategoryId: 10000009,
                isManual: this.isManual, // true
                index: 1
            };
            let item = JSON.stringify(itemTransactions);
            this.transactions.push(JSON.parse(item));
        },
        async deleteFiel(index) {
            this.transactions.splice(index, 1);
        },
        async deleteTransaction(id) {
            let dataDelete = {
                transactionId: id,
                userId: this.userSearch,
                accountId: this.accountSearch,
                type: this.typeSearch,
                year: this.year,
                month: this.numMonth
            };
            let {data, error} = await this.$services.transactionService.deleteAndUpdateStatement(dataDelete);

            if (error) {
                this.initNotify('error', 'Error', 'Remove Duplicate id is false!');

                return error;
            }

            if (data) {
                this.getManualTransactions();
                this.$notify({
                    type: 'success',
                    title: 'Delete transaction completed',
                    text: 'Thank you!'
                });
            }
        },
        async backToHis() {
            let storage = localStorage.params && JSON.parse(localStorage.params);
            let beginYear;
            let endYear;
            let itemBank;
            if (storage && storage.length) {
                beginYear = await storage.find(item => item.name === 'begin') && storage.find(item => item.name === 'begin').value;
                endYear = await storage.find(item => item.name === 'end') && storage.find(item => item.name === 'end').value;
                itemBank = await storage.find(item => item.name === 'itemBank') && storage.find(item => item.name === 'itemBank').value;
            }
            this.$router.push(`/client/${this.$store.state.client._id}/bank-connection?begin=${beginYear}&end=${endYear}&itemBank=${itemBank}`);
        }
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
    }
};
</script>
