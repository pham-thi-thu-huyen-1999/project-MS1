<template>
    <section class="transaction crunch-preview">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <page-title :titles="titles" />
                <div class="box-action">
                    <div class="dropdown normal-btn">
                        <button
                            class="btn dropdown-toggle not-arrow green"
                            type="button"
                        >
                            APPROVE
                        </button>
                        <button
                            class="btn dropdown-toggle not-arrow"
                            type="button"
                        >
                            SAVE
                        </button>
                        <button
                            class="btn dropdown-toggle"
                            type="button"
                            data-toggle="dropdown"
                        >
                            EXPORT
                        </button>
                        <ul class="dropdown-menu">
                            <li><a
                                    class="dropdown-menu-link"
                                    @click="exportPDF()"
                                > <img
                                        alt=""
                                        title=""
                                        src="~/assets/images/icon-pdf.svg"
                                    >Export as PDF</a></li>
                            <li><a
                                    class="dropdown-menu-link"
                                    @click="exportCSV()"
                                ><img
                                        alt=""
                                        title=""
                                        src="~/assets/images/icon-csv.svg"
                                    >Export as CSV</a></li>
                        </ul>
                        <button
                            class="btn dropdown-toggle not-arrow"
                            type="button"
                            @click="showFormInvite()"
                        >
                            EMAIL
                        </button>
                    </div>
                </div>
                <div class="normal-btn">
                    <button
                        @click="$router.back()"
                        class="btn dropdown-toggle not-arrow"
                        type="button"
                    >Back</button>
                </div>
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="box-preview">
                            <div class="row">
                                <!-- <div class="col-md-2 col-sm-2 col-xs-12"><span class="preview-title">Auto crunch</span></div> -->
                                <!-- <div class="col-md-8 col-sm-8 col-xs-12 text-right"><h4 class="op-balance">Opening Balance: </h4></div> -->
                                <div class="col-12 text-right">
                                    <h4 class="op-balance">Opening Balance: {{ statement && statement.openBalance ? statement.openBalance : 0 | convertToCurrency }} </h4>
                                </div>
                            </div>
                            <div
                                class="preview-content"
                                v-if="drawings.list.length"
                            >
                                <div class="row preview-head">
                                    <div class="col-md-10 col-sm-10 col-xs-12">Drawings</div>
                                    <!-- <div class="col-md-2 col-sm-2 col-xs-12">$689.14</div> -->
                                </div>
                                <div class="row preview-label">
                                    <div class="col-md-1 col-sm-1 col-xs-12">Date</div>
                                    <div class="col-md-4 col-sm-4 col-xs-12">Title</div>
                                    <div class="col-md-2 col-sm-2 col-xs-12">Withdrawels</div>
                                    <div class="col-md-2 col-sm-2 col-xs-12 text-center">Deposits</div>
                                    <div class="col-md-2 col-sm-2 col-xs-12 text-right">Balance</div>
                                    <div class="col-md-1 col-sm-1 col-xs-12"></div>
                                </div>
                                <div class="preview-list">
                                    <div class="preview-item">
                                        <div
                                            class="row"
                                            v-for="(transaction, index) in drawings.list"
                                            :key="index"
                                        >
                                            <div class="col-md-1 col-sm-1 col-xs-12 date"><span v-if="index === 0"> {{ transaction.date | moment }} </span></div>
                                            <div class="col-md-4 col-sm-4 col-xs-12">
                                                <span class="name-crunch">{{ transaction.description ? transaction.description.original : 'No title' }}</span>
                                            </div>
                                            <div class="col-md-2 col-sm-2 col-xs-12"><span v-if="transaction.baseType === 'DEBIT'">- {{transaction.amount.amount | convertToCurrency}}</span></div>
                                            <div class="col-md-2 col-sm-2 col-xs-12 text-center"><span v-if="transaction.baseType === 'CREDIT'">+ {{transaction.amount.amount | convertToCurrency}}</span></div>
                                            <div class="col-md-2 col-sm-2 col-xs-12 text-right"><span
                                                    v-if="transaction.runningBalance"
                                                    class="alignBalance"
                                                >{{transaction.runningBalance.amount | convertToCurrency}}</span></div>
                                            <div
                                                class="col-md-1 col-sm-1 col-xs-12 text-right"
                                                v-show="false"
                                            >
                                                <input
                                                    type="checkbox"
                                                    class="auto-check"
                                                >
                                                <span class="miss-img"><img src="~/assets/images/miss-img.svg" /></span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div
                                class="preview-content"
                                v-if="incomes.list.length"
                            >
                                <div class="row preview-head">
                                    <div class="col-md-10 col-sm-10 col-xs-12">Income</div>
                                    <!-- <div class="col-md-2 col-sm-2 col-xs-12">$8,689.14</div> -->
                                </div>
                                <div class="row preview-label">
                                    <div class="col-md-1 col-sm-1 col-xs-12">Date</div>
                                    <div class="col-md-4 col-sm-4 col-xs-12">Title</div>
                                    <div class="col-md-2 col-sm-2 col-xs-12">Withdrawels</div>
                                    <div class="col-md-2 col-sm-2 col-xs-12 text-center">Deposits</div>
                                    <div class="col-md-2 col-sm-2 col-xs-12 text-right">Balance</div>
                                    <div class="col-md-1 col-sm-1 col-xs-12"></div>
                                </div>
                                <div class="preview-list">
                                    <div class="preview-item">
                                        <div
                                            class="row"
                                            v-for="(transaction, index) in incomes.list"
                                            :key="index"
                                        >
                                            <div class="col-md-1 col-sm-1 col-xs-12 date"><span v-if="index === 0"> {{ transaction.date | moment }} </span></div>
                                            <div class="col-md-4 col-sm-4 col-xs-12">
                                                <span class="name-crunch">{{ transaction.description ? transaction.description.original : 'No title' }}</span>
                                            </div>
                                            <div class="col-md-2 col-sm-2 col-xs-12"><span v-if="transaction.baseType === 'DEBIT'">- {{transaction.amount.amount | convertToCurrency}}</span></div>
                                            <div class="col-md-2 col-sm-2 col-xs-12 text-center"><span v-if="transaction.baseType === 'CREDIT'">+ {{transaction.amount.amount | convertToCurrency}}</span></div>
                                            <div class="col-md-2 col-sm-2 col-xs-12 text-right"><span
                                                    v-if="transaction.runningBalance"
                                                    class="alignBalance"
                                                >{{transaction.runningBalance.amount | convertToCurrency}}</span></div>
                                            <div
                                                class="col-md-1 col-sm-1 col-xs-12 text-right"
                                                v-show="false"
                                            >
                                                <input
                                                    type="checkbox"
                                                    class="auto-check"
                                                >
                                                <span class="miss-img"><img src="~/assets/images/miss-img.svg" /></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="preview-content"
                                v-if="assginedCoa.list.length"
                            >
                                <div class="row preview-head">
                                    <div class="col-md-10 col-sm-10 col-xs-12">Expenses</div>
                                    <!-- <div class="col-md-2 col-sm-2 col-xs-12">$8,689.14</div> -->
                                </div>
                                <template>
                                    <div
                                        v-for="(coa, index) in assginedCoa.list"
                                        :key="index"
                                    >
                                        <div class="row preview-child">
                                            <div class="col-md-10 col-sm-10 col-xs-12">{{coa.name}}</div>
                                            <!-- <div class="col-md-2 col-sm-2 col-xs-12">$8,689.14</div> -->
                                        </div>
                                        <div class="row preview-label">
                                            <div class="col-md-1 col-sm-1 col-xs-12">Date</div>
                                            <div class="col-md-4 col-sm-4 col-xs-12">Title</div>
                                            <div class="col-md-2 col-sm-2 col-xs-12">Withdrawels</div>
                                            <div class="col-md-2 col-sm-2 col-xs-12 text-center">Deposits</div>
                                            <div class="col-md-2 col-sm-2 col-xs-12 text-right">Balance</div>
                                            <div class="col-md-1 col-sm-1 col-xs-12"></div>
                                        </div>
                                        <div class="preview-list">
                                            <div class="preview-item">
                                                <div
                                                    class="row"
                                                    v-for="(transaction, index) in coa.list"
                                                    :key="index"
                                                >
                                                    <div class="col-md-1 col-sm-1 col-xs-12 date"><span v-if="index === 0"> {{ transaction.date | moment }} </span></div>
                                                    <div class="col-md-4 col-sm-4 col-xs-12">
                                                        <span class="name-crunch">{{ transaction.description ? transaction.description.original : 'No title' }}</span>
                                                    </div>
                                                    <div class="col-md-2 col-sm-2 col-xs-12"><span v-if="transaction.baseType === 'DEBIT'">- {{transaction.amount.amount | convertToCurrency}}</span></div>
                                                    <div class="col-md-2 col-sm-2 col-xs-12 text-center"><span v-if="transaction.baseType === 'CREDIT'">+ {{transaction.amount.amount | convertToCurrency}}</span></div>
                                                    <div class="col-md-2 col-sm-2 col-xs-12 text-right"><span
                                                            v-if="transaction.runningBalance"
                                                            class="alignBalance"
                                                        >{{transaction.runningBalance.amount | convertToCurrency}}</span></div>
                                                    <div
                                                        class="col-md-1 col-sm-1 col-xs-12 text-right"
                                                        v-show="false"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            class="auto-check"
                                                        >
                                                        <span class="miss-img"><img src="~/assets/images/miss-img.svg" /></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <!-- <template>
                                    <div class="row preview-child">
                                        <div class="col-md-10 col-sm-10 col-xs-12">Motor Vehicle Expense (Repairs, parts, maintenance)</div>
                                        <div class="col-md-2 col-sm-2 col-xs-12">$8,689.14</div>
                                    </div>
                                    <div class="row preview-label">
                                        <div class="col-md-1 col-sm-1 col-xs-12">Date</div>
                                        <div class="col-md-5 col-sm-5 col-xs-12">Title</div>
                                        <div class="col-md-2 col-sm-2 col-xs-12">Withdrawels</div>
                                        <div class="col-md-2 col-sm-2 col-xs-12">Deposits</div>
                                        <div class="col-md-2 col-sm-2 col-xs-12">Balance</div>
                                    </div>
                                    <div class="preview-list">
                                        <div class="preview-item">
                                            <div class="row">
                                                <div class="col-md-1 col-sm-1 col-xs-12 date">31/7/16</div>
                                                <div class="col-md-5 col-sm-5 col-xs-12"><span class="name-crunch">Bunnings Richmond</span></div>
                                                <div class="col-md-2 col-sm-2 col-xs-12"></div>
                                                <div class="col-md-2 col-sm-2 col-xs-12">-$652.94</div>
                                                <div class="col-md-2 col-sm-2 col-xs-12">$9,536.40</div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-1 col-sm-1 col-xs-12 date"></div>
                                                <div class="col-md-5 col-sm-5 col-xs-12"><span class="name-crunch">Bunnings Richmond</span></div>
                                                <div class="col-md-2 col-sm-2 col-xs-12"></div>
                                                <div class="col-md-2 col-sm-2 col-xs-12">-$652.94</div>
                                                <div class="col-md-2 col-sm-2 col-xs-12">$9,536.40</div>
                                            </div>
                                        </div>
                                        <div class="preview-item">
                                            <div class="row">
                                                <div class="col-md-1 col-sm-1 col-xs-12 date">31/7/16</div>
                                                <div class="col-md-5 col-sm-5 col-xs-12"><span class="name-crunch">Bunnings Richmond</span></div>
                                                <div class="col-md-2 col-sm-2 col-xs-12"></div>
                                                <div class="col-md-2 col-sm-2 col-xs-12">-$652.94</div>
                                                <div class="col-md-2 col-sm-2 col-xs-12">$9,536.40</div>
                                            </div>
                                        </div>
                                        <div class="preview-item">
                                            <div class="row">
                                                <div class="col-md-1 col-sm-1 col-xs-12 date">31/7/16</div>
                                                <div class="col-md-5 col-sm-5 col-xs-12"><span class="name-crunch">Bunnings Richmond</span></div>
                                                <div class="col-md-2 col-sm-2 col-xs-12"></div>
                                                <div class="col-md-2 col-sm-2 col-xs-12">-$652.94</div>
                                                <div class="col-md-2 col-sm-2 col-xs-12">$9,536.40</div>
                                            </div>
                                        </div>
                                    </div>
                                </template> -->
                            </div>
                            <div
                                class="preview-content"
                                v-if="others.list.length"
                            >
                                <div class="row preview-head">
                                    <div class="col-md-10 col-sm-10 col-xs-12">Others</div>
                                    <!-- <div class="col-md-2 col-sm-2 col-xs-12">$689.14</div> -->
                                </div>
                                <div class="row preview-label">
                                    <div class="col-md-1 col-sm-1 col-xs-12">Date</div>
                                    <div class="col-md-4 col-sm-4 col-xs-12">Title</div>
                                    <div class="col-md-2 col-sm-2 col-xs-12">Withdrawels</div>
                                    <div class="col-md-2 col-sm-2 col-xs-12 text-center">Deposits</div>
                                    <div class="col-md-2 col-sm-2 col-xs-12 text-right">Balance</div>
                                    <div class="col-md-1 col-sm-1 col-xs-12"></div>
                                </div>
                                <div class="preview-list">
                                    <div class="preview-item">
                                        <div
                                            class="row"
                                            v-for="(transaction, index) in others.list"
                                            :key="index"
                                        >
                                            <div class="col-md-1 col-sm-1 col-xs-12 date"><span v-if="index === 0"> {{ transaction.date | moment }} </span></div>
                                            <div class="col-md-4 col-sm-4 col-xs-12">
                                                <span class="name-crunch">{{ transaction.description ? transaction.description.original : 'No title' }}</span>
                                            </div>
                                            <div class="col-md-2 col-sm-2 col-xs-12"><span v-if="transaction.baseType === 'DEBIT'">- {{transaction.amount.amount | convertToCurrency}}</span></div>
                                            <div class="col-md-2 col-sm-2 col-xs-12 text-center"><span v-if="transaction.baseType === 'CREDIT'">+ {{transaction.amount.amount | convertToCurrency}}</span></div>
                                            <div class="col-md-2 col-sm-2 col-xs-12 text-right"><span
                                                    v-if="transaction.runningBalance"
                                                    class="alignBalance"
                                                >{{transaction.runningBalance.amount | convertToCurrency}}</span></div>
                                            <div class="col-md-1 col-sm-1 col-xs-12 text-right">
                                                <input
                                                    type="checkbox"
                                                    class="auto-check"
                                                >
                                                <span class="miss-img"><img src="~/assets/images/miss-img.svg" /></span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-sm-12 col-xs-12 text-right">
                                    <h4 class="op-balance">Closing Balance: {{ statement && statement.closeBalance ? statement.closeBalance : 0 | convertToCurrency }} </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <invite-client
            ref="inviteClient"
            :image="EmailImage"
            :title="`Invite clients to ${titleInvite} system`"
        ></invite-client>
    </section>
</template>

<script>
import HistoryLogs from '~/components/HistoryLogs';
import Pagination from '~/components/Pagination';
import PageTitle from '~/components/PageTitle';
import {convertToCurrency} from '~/helpers/dataHelper';
import EmailImage from '~/assets/images/icon-email.svg';
import InviteClient from '~/components/InviteClient';
var Enumerable = require('linq-es5');

export default {
    data() {
        return {
            EmailImage: EmailImage,
            titles: ['Transaction', 'Crunch preview'],
            query: {
                userId: null,
                year: null,
                month: null,
                type: null,
                accountId: null,
            },
            statement: null,
            expenses: {
                list: [],
                rootList: []
            },
            drawings: {
                list: []
            },
            incomes: {
                list: []
            },
            others: {
                list: []
            },
            assginedCoa: {
                list: []
            },
            titleInvite: ''
        };
    },
    components: {
        HistoryLogs,
        Pagination,
        PageTitle,
        InviteClient
    },
    async created() {
        this.listMenu = this.$services.commonService.getMenuTransactions(this.$store.state.client._id);
        this.query = {
            userId: this.$store.state.client._id,
            accountId: this.$route.query.accountId,
            year: this.$route.query.year,
            month: this.$route.query.month,
            type: this.$route.query.type,
        };
        await this.loadData();

        if (this.$store.state.client && this.$store.state.client.permission && this.$store.state.client.permission.product)
            this.titleInvite = this.$store.state.client.permission.product.name;
    },
    methods: {
        initNotify(option, title, text) {
            this.$notify({
                group: option || 'success',
                title: title,
                text: text
            });
        },
        async loadData() {
            this.$setLoading();
            await this.getTransactionsToCrunch();
            await this.getStatement();
            this.$setLoading(false);
        },
        async getTransactionsToCrunch() {
            if (!this.query.userId || !this.query.year || !this.query.month) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'Error';
            };

            let {data, error} = await this.$services.transactionService.getTransactionsToCrunch(this.query.userId, this.query.accountId, this.query.type, this.query.year, this.query.month, 1, 1);
            if (error) {
                this.initNotify('error', 'Error', 'Miss data!');
                return error;
            }
            else {
                // let listTransactions = data.filter(x => !x.typeCrunch);
                // this.transaction.list = listTransactions;
                // this.transaction.total = listTransactions.length;
                // list expensee
                let listExpenses = data.filter(x => x.typeCrunch === 1);
                this.expenses.rootList = listExpenses;
                // list drawing
                let listDrawings = data.filter(x => x.typeCrunch === 2);
                this.drawings.list = listDrawings;
                // list income
                let listIncomes = data.filter(x => x.typeCrunch === 3);
                this.incomes.list = listIncomes;
                // other
                let listOthers = data.filter(x => x.typeCrunch === 4);
                this.others.list = listOthers;

                this.groupTransacionByCoa();
            }
        },
        async getStatement() {
            if (!this.query.userId || !this.query.year || !this.query.month) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'Error';
            };

            let {data, error} = await this.$services.statementService.getStatementOfClient(this.query.userId, this.query.accountId, this.query.type, this.query.year, this.query.month);
            if (error) {
                this.initNotify('error', 'Error', 'Miss data');
                return 'Error get statement';
            }
            else
                this.statement = data;
        },
        groupTransacionByCoa() {
            let transacionHaveCoa = this.expenses.rootList.filter(x => x.coaId);
            let listCoaGroups = Enumerable.asEnumerable(transacionHaveCoa).GroupBy(x => x.coaId && x.coaId.code)
                .Select(function(item) {
                    return {
                        code: item.key,
                        name: item[0].coaId.name,
                        list: item,
                        totalAmout: Enumerable.asEnumerable(item).Sum(p => p.amount && p.amount.amount)
                    };
                }).toArray();
            this.assginedCoa.list = listCoaGroups;
            // get list transaction is there no coa
            let listExpensesNotCoa = this.expenses.rootList.filter(x => !x.coaId);
            this.expenses.list = listExpensesNotCoa;
        },
        async exportPDF() {
            let {data, error} = await this.$services.reportService.exportCruncherPDF(this.query.userId, 1, this.query.accountId, this.query.type, this.query.month, this.query.year);
            if (error)
                this.initNotify('error', 'Error', error.message);
            else
                window.location = data;
        },
        async exportCSV() {
            let {data, error} = await this.$services.reportService.exportCruncherCSV(this.query.userId, 1, this.query.accountId, this.query.type, this.query.month, this.query.year);
            if (error)
                this.initNotify('error', 'Error', error.message);
            else
                window.location = data;
        },
        showFormInvite() {
            this.$refs.inviteClient.open();
        },
    },
    filters: {
        moment(data) {
            let date = new Date(data);
            return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
        },
        convertToCurrency(data) {
            return convertToCurrency(data);
        },
    }
};
</script>