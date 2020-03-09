<template>
    <section class="transaction crunch">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <page-title :titles="titles"/>
                <div class="box-action left">
                    <div class="dropdown normal-btn">
                        <a @click="$router.back()" class="btn dropdown-toggle not-arrow">
                            BACK
                        </a>
                    </div>
                </div>
                <div class="box-action right">
                    <a class="form-btn btn-crunch green" v-show="false">approve</a>
                    <a class="form-btn btn-crunch blue" @click="autoCruncher">AUTO CRUNCH</a>
                    <a class="form-btn btn-crunch" @click="updateCompleted" >Crunch</a>
                </div>
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="section-state section-crunch box-crunch">
                            <div class="title-section">{{ month | convertMonthToWord }} BANK STATEMENT <!--<span class="auto-title">Auto crunch</span>--></div>
                            <div class="list-statement">
                                <div class="open-balance">
                                    Opening Balance: {{ statement ? statement.openBalance : 0 | convertToCurrency }}
                                </div>
                                <div class="row wrapper-title">
                                    <div class="col-md-4 col-sm-4 col-xs-12 title-left">
                                        <div class="row">
                                            <div class="col-md-4 col-sm-12 col-xs-12"><h4>Date</h4></div>
                                            <div class="col-md-8 col-sm-12 col-xs-12"><h4>Title</h4></div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-4 col-xs-12 title-center text-center">
                                        <div class="row">
                                            <div class="col-md-3 col-sm-3 col-xs-12"><h4>Expense</h4></div>
                                            <div class="col-md-3 col-sm-3 col-xs-12"><h4>Drawing</h4></div>
                                            <div class="col-md-3 col-sm-3 col-xs-12"><h4>Income</h4></div>
                                            <div class="col-md-3 col-sm-3 col-xs-12"><h4>Other</h4></div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-4 col-xs-12">
                                        <div class="row">
                                            <div class="col-md-4 col-sm-4 col-xs-12"><h4>Debit</h4></div>
                                            <div class="col-md-4 col-sm-4 col-xs-12"><h4>Credit</h4></div>
                                            <div class="col-md-4 col-sm-4 col-xs-12"><h4>Balance</h4></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="wrapper-item">
                                    <div class="item" v-for="(item, index) in transaction.list" :key="index">
                                        <div class="row">
                                            <div class="col-md-4 col-sm-4 col-xs-12 align-self-center">
                                                <div class="row">
                                                    <div class="col-md-4 col-sm-12 col-xs-12 align-self-center"><p class="txtDate">{{ item.date | moment }}</p></div>
                                                    <div class="col-md-8 col-sm-12 col-xs-12 align-self-center">
                                                        <p class="txtTitle">{{ item.description ? item.description.original : 'No title' }}</p>
                                                        <p v-if="item.isWarningDuplicate && item.duplicateId" class="txt-title controls">
                                                            <span class="yellow d-block">Duplicate id: {{item.duplicateId}}</span>
                                                            <a class="red" @click="openModalConfirm(item)">Remove</a>
                                                            <a class="text-primary text-uppercase mr-3" @click="approveAll">Approve all</a>
                                                            <a class="green" @click="removeWarning(item._id)">Approve</a>
                                                        </p>
                                                        <p v-else class="txt-title controls green">Transaction id: {{item.transactionId}}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-4 col-xs-12 text-center align-self-center">
                                                <div class="row">
                                                    <div v-for="(crunchType, index) in crunchTypes" class="col-md-3 col-sm-3 col-xs-3" :key="index"><input type="button" class="btn-click" @click="updateTransactionCruncher(item._id, crunchType)"/></div>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-4 col-xs-12 space-top align-self-center">
                                                <div class="row">
                                                    <div class="col-md-4 col-sm-4 col-xs-6" ><p>{{ item.baseType === 'DEBIT' ? item.amount.amount : null | convertToCurrency }}</p></div>
                                                    <div class="col-md-4 col-sm-4 col-xs-6"><p>{{ item.baseType === 'CREDIT' ? item.amount.amount : null | convertToCurrency }}</p></div>
                                                    <div class="col-md-4 col-sm-4 col-xs-12"><p class="align-balance">{{ item.runningBalance.amount | convertToCurrency }}</p>
                                                        <span v-show="false" v-if="item.isHaveCoditions" @click="openChoose(index)" class="not-crunch"><img src="~/assets/images/noti-misscrunch.svg"/></span>
                                                        <auto-crunch-choose ref="boxChoose" :id="'auto'+index" :data="item.conditions" :transactionId="item._id"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="close-balance">
                                    <p class="text-right">Closing Balance: <span>{{ statement ? statement.closeBalance : 0 | convertToCurrency }}</span></p>
                                    <p>Total: <span>{{ transaction.total }}</span> Transactions</p>
                                </div>
                            </div>
                        </div>
                        <div class="expenses collapse-group section-state section-crunch">
                            <div class="group-heading">
                                <div class="row">
                                    <div class="col-md-10 col-sm-8 col-xs-12">
                                        <button class="btn-click item-expand" data-toggle="collapse" :data-target="'#crunch_expenses'" aria-expanded="true">
                                            Expenses
                                            <span class="fa-stack">
                                                <i class="fa fa-square-o fa-stack-2x" aria-hidden="true"></i>
                                                <i class="fa fa-arrow-down fa-stack-1x" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div id="crunch_expenses" class="body-content expense collapse show">
                                <div class="box-content list-statement">
                                    <div class="wrapper-title title-padding">
                                        <div class="row">
                                            <div class="col-md-1 col-sm-2 col-xs-12 col-date"><h4>Date</h4></div>
                                            <div class="col-md-4 col-sm-3 col-xs-12"><h4>Title</h4></div>
                                            <div class="col-md-2 col-sm-2 col-xs-12"><h4>Debit</h4></div>
                                            <div class="col-md-2 col-sm-2 col-xs-12"><h4>Credit</h4></div>
                                            <div class="col-md-3 col-sm-3 col-xs-12 pd-0"><h4>Chart of Accounts</h4></div>
                                        </div>
                                    </div>
                                    <div class="wrapper-item">
                                        <div class="item" v-for="(transaction, index) in expenses.list" :key="index">
                                            <div class="row">
                                                <div class="col-md-1 col-sm-2 col-xs-12 align-self-center"><p class="txt-date">{{ transaction.date | moment }}</p></div>
                                                <div class="col-md-4 col-sm-5 col-xs-12 align-self-center">
                                                    <p class="txt-title">{{ transaction.description ? transaction.description.original : 'No title' }}</p>
                                                    {{ transaction._id }}
                                                    <p v-if="transaction.isWarningDuplicate && transaction.duplicateId" class="txt-title controls"><span class="yellow">Duplicate id: {{transaction.duplicateId}}</span> <a class="red" @click="openModalConfirm(transaction)">Remove</a> <a class="green" @click="removeWarning(transaction._id)">Approve</a></p>
                                                    <p v-else class="txt-title controls green">Transaction id: {{transaction.transactionId}}</p>
                                                </div>
                                                <div class="col-md-2 col-sm-2 col-xs-12 align-self-center"><p>{{ transaction.baseType === 'DEBIT' ? transaction.amount.amount : null | convertToCurrency }}</p></div>
                                                <div class="col-md-2 col-sm-2 col-xs-4"><p>{{ transaction.baseType === 'CREDIT' ? transaction.amount.amount : null | convertToCurrency }}</p></div>
                                                <div class="col-md-3 col-sm-3 col-xs-12 text-right align-self-center coa-list">
                                                    <div class="dropdown drop-account">
                                                        <input type="text" data-toggle="dropdown" class="form-input dropdown-toggle input-chart-account"
                                                            :data-id="'transaction-' + transaction._id"
                                                            placeholder="Choose chart of accounts"
                                                            @click="fetchChartAccountByClient()"
                                                            @keyup="searchChartAccount(transaction._id)"
                                                            @blur="resetChartAccount(transaction._id, index)"/>
                                                        <ul class="dropdown-menu">
                                                            <li v-for="(chartAccount, index) in coa.list" :key="index" @click="addChartAccountToTransaction(transaction._id, chartAccount.coaRef._id)"><a>{{ chartAccount.coaRef.code }} - {{ chartAccount.coaRef.name }}</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <span class="icon-delete" @click="deleteTransactionCruncher(transaction._id, 'EXPENSES')"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-expenses">
                                    <div class="item-list" v-for="(item, index) in assginedCoa.list" :key="index">
                                        <div class="group-heading heading-item">
                                            <div class="row">
                                                <div class="col-md-8 col-sm-8 col-xs-12">
                                                    <button  class="btn-click item-expand" data-toggle="collapse" :data-target="`#expenses_${index}`">{{ item.name }}
                                                        <span class="fa-stack" >
                                                            <i class="fa fa-square-o fa-stack-2x" aria-hidden="true"></i>
                                                            <i class="fa fa-arrow-down fa-stack-1x" aria-hidden="true"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                                <div class="col-md-4 col-sm-4 col-xs-12">
                                                    <p class="txt-total">{{ item.totalAmout | convertToCurrency}}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="list-statement collapse show" :id="`expenses_${index}`">
                                            <div class="wrapper-title title-padding">
                                                <div class="row">
                                                    <div class="col-md-1 col-sm-12 col-xs-12 col-date"><h4>Date</h4></div>
                                                    <div class="col-md-4 col-sm-6 col-xs-12"><h4>Title</h4></div>
                                                    <div class="col-md-2 col-sm-2 col-xs-12"><h4>Debit</h4></div>
                                                    <div class="col-md-2 col-sm-2 col-xs-12"><h4>Credit</h4></div>
                                                    <div class="col-md-3 col-sm-2 col-xs-12 pd-0"><h4>Chart of Accounts</h4></div>
                                                </div>
                                            </div>
                                            <div class="wrapper-item"  v-if="item.list.length > 0">
                                                <div class="item" v-for="(transaction, index2) in item.list" :key="index2">
                                                    <div class="row">
                                                        <div class="col-md-1 col-sm-12 col-xs-12 align-self-center"><p class="txt-date">{{ transaction.date | moment }}</p></div>
                                                        <div class="col-md-4 col-sm-6 col-xs-12 align-self-center">
                                                            <p class="txt-title">{{ transaction.description ? transaction.description.original : 'No title' }}</p>
                                                            <p v-if="transaction.isWarningDuplicate && transaction.duplicateId" class="txt-title controls"><span class="yellow">Duplicate id: {{transaction.duplicateId}}</span> <a class="red" @click="openModalConfirm(transaction)">Remove</a> <a class="green" @click="removeWarning(transaction._id)">Approve</a></p>
                                                            <p v-else class="txt-title controls green">Transaction id: {{transaction.transactionId}}</p>
                                                        </div>
                                                        <div class="col-md-2 col-sm-2 col-xs-4"><p>{{ transaction.baseType === 'DEBIT' ? transaction.amount.amount : null | convertToCurrency }}</p></div>
                                                        <div class="col-md-2 col-sm-2 col-xs-4"><p>{{ transaction.baseType === 'CREDIT' ? transaction.amount.amount : null | convertToCurrency }}</p></div>
                                                        <div class="col-md-3 col-sm-2 col-xs-4 text-right align-self-center coa-list">
                                                            <div class="dropdown drop-account">
                                                                <input type="text" data-toggle="dropdown" class="form-input dropdown-toggle input-chart-account" :data-id="'transaction-' + transaction._id" placeholder="Choose chart of accounts"
                                                                    @click="fetchChartAccountByClient()"
                                                                    @keyup="searchChartAccount(transaction._id)"
                                                                    @blur="resetChartAccount(transaction._id, index2)" />
                                                                <ul class="dropdown-menu">
                                                                    <li v-for="(chartAccount, index) in coa.list" @click="addChartAccountToTransaction(transaction._id, chartAccount.coaRef._id, item._id)" :key="index" ><a>{{ chartAccount.coaRef.code }} - {{ chartAccount.coaRef.name }}</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <span class="icon-delete" @click="deleteTransactionCruncher(transaction._id, 'EXPENSES', item._id)"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="drawings collapse-group section-state section-crunch">
                            <div class="group-heading">
                                <div class="row">
                                    <div class="col-md-10 col-sm-8 col-xs-12">
                                        <button class="btn-click item-expand" data-toggle="collapse" :data-target="'#crunch_drawing'" aria-expanded="true">
                                            Drawings
                                            <span class="fa-stack">
                                                <i class="fa fa-square-o fa-stack-2x" aria-hidden="true"></i>
                                                <i class="fa fa-arrow-down fa-stack-1x" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div id="crunch_drawing" class="list-statement body-content collapse show">
                                <div class="wrapper-title title-padding">
                                    <div class="row">
                                        <div class="col-md-1 col-sm-2 col-xs-12 col-date"><h4>Date</h4></div>
                                        <div class="col-md-6 col-sm-6 col-xs-12"><h4>Title</h4></div>
                                        <div class="col-md-3 col-sm-2 col-xs-12"><h4>Debit</h4></div>
                                        <div class="col-md-2 col-sm-2 col-xs-12"><h4>Credit</h4></div>
                                    </div>
                                </div>
                                <div class="wrapper-item">
                                    <div class="item fix-pd" v-for="(transaction, index) in drawings.list" :key="index">
                                        <div class="row">
                                            <div class="col-md-1 col-sm-2 col-xs-12"><p class="txt-date">{{ transaction.date | moment }}</p></div>
                                            <div class="col-md-6 col-sm-6 col-xs-12">
                                                <p class="txt-title">{{ transaction.description ? transaction.description.original : 'No title' }}</p>
                                                <p v-if="transaction.isWarningDuplicate && transaction.duplicateId" class="txt-title controls"><span class="yellow">Duplicate id: {{transaction.duplicateId}}</span> <a class="red" @click="openModalConfirm(transaction)">Remove</a> <a class="green" @click="removeWarning(transaction._id)">Approve</a></p>
                                                <p v-else class="txt-title controls green">Transaction id: {{transaction.transactionId}}</p>
                                            </div>
                                            <div class="col-md-3 col-sm-2 col-xs-4"><p >{{ transaction.baseType === 'DEBIT' ? transaction.amount.amount : 0 | convertToCurrency }}</p></div>
                                            <div class="col-md-2 col-sm-2 col-xs-4"><p >{{ transaction.baseType === 'CREDIT' ? transaction.amount.amount : 0 | convertToCurrency }}</p></div>
                                            <span class="icon-delete" @click="deleteTransactionCruncher(transaction._id, 'DRAWINGS')"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="paginate">
                                    <client-only>
                                        <pagination :page="drawings.page" :limit="drawings.limit" :total="drawings.total" @change="changePage($event, 'DRAWINGS')" />
                                    </client-only>
                                </div>
                            </div>
                        </div>
                        <div class="income collapse-group section-state section-crunch">
                            <div class="group-heading">
                                <div class="row">
                                    <div class="col-md-10 col-sm-8 col-xs-12">
                                        <button class="btn-click item-expand" data-toggle="collapse" :data-target="'#crunch_income'" aria-expanded="true">
                                            Income
                                            <span class="fa-stack">
                                                <i class="fa fa-square-o fa-stack-2x" aria-hidden="true"></i>
                                                <i class="fa fa-arrow-down fa-stack-1x" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div id="crunch_income" class="list-statement body-content collapse show">
                                <div class="wrapper-title title-padding">
                                    <div class="row">
                                        <div class="col-md-1 col-sm-2 col-xs-12 col-date"><h4>Date</h4></div>
                                        <div class="col-md-6 col-sm-6 col-xs-12"><h4>Title</h4></div>
                                        <div class="col-md-3 col-sm-2 col-xs-12"><h4>Debit</h4></div>
                                        <div class="col-md-2 col-sm-2 col-xs-12"><h4>Credit</h4></div>
                                    </div>
                                </div>
                                <div class="wrapper-item">
                                    <div class="item fix-pd" v-for="(transaction, index) in incomes.list" :key="index">
                                        <div class="row">
                                            <div class="col-md-1 col-sm-2 col-xs-12"><p class="txt-date">{{ transaction.date | moment }}</p></div>
                                            <div class="col-md-6 col-sm-6 col-xs-12">
                                                <p class="txt-title">{{ transaction.description ? transaction.description.original : 'No title' }}</p>
                                                <p v-if="transaction.isWarningDuplicate && transaction.duplicateId" class="txt-title controls"><span class="yellow">Duplicate id: {{transaction.duplicateId}}</span> <a class="red" @click="openModalConfirm(transaction)">Remove</a> <a class="green" @click="removeWarning(transaction._id)">Approve</a></p>
                                                <p v-else class="txt-title controls green">Transaction id: {{transaction.transactionId}}</p>
                                            </div>
                                            <div class="col-md-3 col-sm-2 col-xs-4"><p>{{ transaction.baseType === 'DEBIT' ? transaction.amount.amount : null | convertToCurrency }}</p></div>
                                            <div class="col-md-2 col-sm-2 col-xs-4"><p>{{ transaction.baseType === 'CREDIT' ? transaction.amount.amount : null | convertToCurrency }}</p></div>
                                            <span class="icon-delete" @click="deleteTransactionCruncher(transaction._id, 'INCOME')"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="other collapse-group section-state section-crunch">
                            <div class="group-heading">
                                <div class="row">
                                    <div class="col-md-10 col-sm-8 col-xs-12">
                                        <button class="btn-click item-expand" data-toggle="collapse" :data-target="'#crunch_other'" aria-expanded="true">
                                            Other
                                            <span class="fa-stack">
                                                <i class="fa fa-square-o fa-stack-2x" aria-hidden="true"></i>
                                                <i class="fa fa-arrow-down fa-stack-1x" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div id="crunch_other" class="list-statement body-content collapse show">
                                <div class="wrapper-title title-padding">
                                    <div class="row">
                                        <div class="col-md-1 col-sm-2 col-xs-12 col-date"><h4>Date</h4></div>
                                        <div class="col-md-6 col-sm-6 col-xs-12"><h4>Title</h4></div>
                                        <div class="col-md-3 col-sm-2 col-xs-12"><h4>Debit</h4></div>
                                        <div class="col-md-2 col-sm-2 col-xs-12"><h4>Credit</h4></div>
                                    </div>
                                </div>
                                <div class="wrapper-item">
                                    <div class="item fix-pd" v-for="(transaction, index) in others.list" :key="index">
                                        <div class="row">
                                            <div class="col-md-1 col-sm-2 col-xs-12"><p class="txt-date">{{ transaction.date | moment }}</p></div>
                                            <div class="col-md-6 col-sm-6 col-xs-12">
                                                <p class="txt-title">{{ transaction.description ? transaction.description.original : 'No title' }}</p>
                                                <p v-if="transaction.isWarningDuplicate && transaction.duplicateId" class="txt-title controls"><span class="yellow">Duplicate id: {{transaction.duplicateId}}</span> <a class="red" @click="openModalConfirm(transaction)">Remove</a> <a class="green" @click="removeWarning(transaction._id)">Approve</a></p>
                                                <p v-else class="txt-title controls green">Transaction id: {{transaction.transactionId}}</p>
                                            </div>
                                            <div class="col-md-3 col-sm-2 col-xs-4"><p>{{ transaction.baseType === 'DEBIT' ? transaction.amount.amount : null | convertToCurrency }}</p></div>
                                            <div class="col-md-2 col-sm-2 col-xs-4"><p>{{ transaction.baseType === 'CREDIT' ? transaction.amount.amount : null | convertToCurrency }}</p></div>
                                            <span class="icon-delete" @click="deleteTransactionCruncher(transaction._id, 'OTHER')"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {convertToCurrency} from '~/helpers/dataHelper';
import {convertMonthToWord} from '~/helpers/dateHelper';
import {CrunchType} from '~/common/commonType';
import HistoryLogs from '~/components/HistoryLogs';
import Pagination from '~/components/Pagination';
import PageTitle from '~/components/PageTitle';
import AutoCrunchChoose from '~/components/AutoCrunchChoose';
var Enumerable = require('linq-es5');

export default {
    data() {
        return {
            titles: ['Transaction', 'crunch'],
            crunchTypes: [],
            productCode: '',
            userId: '',
            accountId: '',
            type: null,
            year: null,
            month: null,
            statement: {},
            timeout: null,
            transaction: {
                list: [],
                page: 1,
                total: 0,
                limit: 10,
                amount: 0
            },
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
            coa: {
                list: [],
                keyword: '',
                page: 1,
                limit: 10,
                total: 0
            },
        };
    },
    components: {
        HistoryLogs,
        Pagination,
        PageTitle,
        AutoCrunchChoose,
    },
    async created() {
        this.$setLoading();
        this.userId = this.$store.state.client._id;
        this.accountId = this.$route.query.accountId ? this.$route.query.accountId : null;
        this.crunchTypes = CrunchType;
        this.productCode = this.$store.state.client.permission.product.code;
        this.type = this.$route.query.type ? this.$route.query.type : null;
        this.month = this.$route.query.month ? this.$route.query.month : null;
        this.year = this.$route.query.year ? this.$route.query.year : null;
        await this.getTransactionsToCrunch();
        await this.getStatement();
        this.$setLoading(false);
    },
    async mounted() {
        this.$on('updateCrunchType', function(data) {
            let isChange = false;
            if (data.groupId) {
                this.updateTransactionCruncher(data.transactionId, data.groupId, true);
                isChange = true;
            }
            if (data.coaId) {
                this.addChartAccountToTransaction(data.transactionId, data.coaId, true);
                isChange = true;
            }

            if (isChange)
                this.getTransactionsToCrunch();
        });
    },
    methods: {
        async approveAll() {
            this.$setLoading();
            const dupplicateList = this.transaction.list.filter(trans => trans.isWarningDuplicate);
            try {
                while (dupplicateList.length > 0) {
                    const piece = dupplicateList.shift();
                    await this.$services.transactionService.removeWarning(piece._id);
                }
                this.initNotify('success', 'Success', 'Approve success');
                await this.getTransactionsToCrunch();
                await this.getStatement();
            }
            catch (error) {
                this.initNotify('error', 'Error', 'Fail to remove dupplicate!');
            }
            finally {
                this.$setLoading(false);
            }
        },
        initNotify(option, title, text) {
            this.$notify({
                type: option || 'success',
                titleText: title,
                text: text
            });
        },
        async getTransactionsToCrunch(isCrunch) {
            if (!this.userId || !this.year || !this.month) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'Error';
            };
            let {data} = await this.$services.transactionService.getTransactionsToCrunch(this.userId, this.accountId, this.type, this.year, this.month, this.transaction.page, this.transaction.limit);
            if (!data) {
                this.initNotify('error', 'Error', 'Something is wrong!');
            }
            else {
                if (!isCrunch) {
                    let isAllowReaload = true;
                    if (this.transaction.list.length) {
                        let getHaveConditions = this.transaction.list.filter(x => x.isHaveCoditions);
                        if (getHaveConditions && getHaveConditions.length) {
                            isAllowReaload = false;
                            this.autoCruncher();
                        }
                    }
                    if (isAllowReaload) {
                        let listTransactions = data.filter(x => !x.typeCrunch);
                        this.transaction.list = listTransactions;
                    }
                }

                this.transaction.total = this.transaction.list.length;
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
                let listOthers = data.filter(x => x.typeCrunch === 4); // 4
                this.others.list = listOthers;

                this.groupTransacionByCoa();
            }
        },
        async getStatement() {
            if (!this.userId || !this.year || !this.month) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'Error statement';
            }

            let {data, error} = await this.$services.statementService.getStatementOfClient(this.userId, this.accountId, this.type, this.year, this.month);
            if (error) {
                this.initNotify('error', 'Error', 'Miss data');
                return 'Error get statement';
            }
            else {
                this.statement = data;
            }
        },
        groupTransacionByCoa() {
            let transacionHaveCoa = this.expenses.rootList.filter(x => x.coaId);
            let listCoaGroups = Enumerable.asEnumerable(transacionHaveCoa).GroupBy(x => x.coaId && x.coaId.code)
                .Select(function(item) {
                    return {
                        code: item.key,
                        name: item[0].coaId.name,
                        list: item,
                        totalAmout: item.reduce((resultsReturned, element, index, elements) => {
                            if (element.baseType === 'CREDIT') {
                                resultsReturned -= element.amount.amount;
                            }
                            else if (element.baseType === 'DEBIT') {
                                resultsReturned += element.amount.amount;
                            }
                            return resultsReturned;
                        }, 0)
                    };
                }).toArray();
            this.assginedCoa.list = listCoaGroups;
            // get list transaction is there no coa
            let listExpensesNotCoa = this.expenses.rootList.filter(x => !x.coaId);
            this.expenses.list = listExpensesNotCoa;
        },
        async getCoaByClient() {
            if (!this.productCode || !this.userId || !this.coa.page || !this.coa.limit) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'Error';
            }

            let {data, error} = await this.$services.chartAccountService.getCoaByClient(this.productCode, this.userId, this.coa.keyword, this.coa.page, this.coa.limit);
            if (error) {
                this.initNotify('error', 'Error', 'Miss data!');
                return error;
            }
            else {
                this.coa.list = data || [];
            }
        },
        async getCountCoaByClient() {
            if (!this.productCode || !this.userId) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'Error';
            }
            let {data, error} = await this.$services.chartAccountService.getCountCoaByClient(this.productCode, this.userId, this.coa.keyword);
            if (error) {
                this.initNotify('error', 'Error', 'Miss data!');
                return error;
            }
            else {
                this.coa.total = data;
            }
        },
        async updateTransactionCruncher(_id, crunchType, isUnReaload) {
            if (!_id || !crunchType) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'Error';
            }
            this.$setLoading();
            let body = {
                crunchType: crunchType
            };
            let result = await this.$services.transactionService.updateCrunchType(_id, body);
            if (result.error) {
                this.initNotify('error', 'Error', 'Miss data!');
                return result.error;
            }
            else {
                if (!isUnReaload)
                    await this.getTransactionsToCrunch();
            }
            this.$setLoading(false);
        },
        async addChartAccountToTransaction(_id, coaId, isUnReaload) {
            if (!_id || !coaId) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'Error';
            }
            this.$setLoading();
            let body = {
                coaId
            };
            let result = await this.$services.transactionService.addChartAccountToTransaction(_id, body);
            if (result.error) {
                this.initNotify('error', 'Error', 'Miss data!');
                return result.error;
            }
            else {
                if (!isUnReaload)
                    await this.getTransactionsToCrunch();
            }
            this.$setLoading(false);
        },
        async deleteTransactionCruncher(_id, crunchType, coaId) {
            if (!_id) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return;
            }
            this.$setLoading();
            let result = await this.$services.transactionService.deleteCrunchType(_id);
            if (result.error) {
                this.initNotify('error', 'Error', 'Miss data!');
                return result.error;
            }
            else {
                await this.getTransactionsToCrunch();
            }
            this.$setLoading(false);
        },
        async updateCompleted() {
            this.$setLoading();
            if (!this.userId || !this.type || !this.year || !this.month) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'ERROR';
            }

            let result = await this.$services.crunchService.updateCompleted(this.userId, this.accountId, this.type, this.year, this.month);
            if (!result.data || result.error)
                this.initNotify('error', 'Update cruncher', 'Update cruncher has failded!');
            else {
                this.initNotify('success', 'Updated cruncher', 'Update cruncher has completed!');
                setTimeout(() => {
                    this.$router.push(`/client/${this.$store.state.client._id}/transaction/cruncher-preview?type=${this.type}&accountId=${this.accountId}&month=${this.month}&year=${this.year}`);
                }, 1000);
            }
            this.$setLoading(false);
        },
        fetchChartAccountByClient() {
            if (!this.coa.list.length) {
                this.getCountCoaByClient();
                this.getCoaByClient();
            }
        },
        async searchChartAccount(transactionId) {
            this.coa.list = [];
            this.coa.page = 1;
            this.coa.total = 0;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(async () => {
                if (transactionId) {
                    let position;
                    let inputChartAccountEl = document.querySelectorAll('.input-chart-account');
                    let attributeEl = 'transaction-' + transactionId;
                    for (let i = 0; i < inputChartAccountEl.length; i++) {
                        if (inputChartAccountEl[i].getAttribute('data-id') === attributeEl) {
                            position = i;
                            break;
                        }
                    }
                    this.coa.keyword = inputChartAccountEl[position].value;
                    if (!this.coa.keyword.length) {
                        this.coa.keyword = '';
                    }
                }
                else {
                    this.coa.keyword = '';
                }

                await this.getCountCoaByClient();
                await this.getCoaByClient();
            }, 800);
        },
        resetChartAccount(transactionId, index) {
            if (transactionId) {
                let position;
                let inputChartAccountEl = document.querySelectorAll('.input-chart-account');
                let attributeEl = 'transaction-' + transactionId;
                for (let i = 0; i < inputChartAccountEl.length; i++) {
                    if (inputChartAccountEl[i].getAttribute('data-id') === attributeEl) {
                        position = i;
                        break;
                    }
                }
                inputChartAccountEl[position].value = '';
            }
            this.coa.keyword = '';
        },
        async autoCruncher() {
            this.$setLoading();
            if (!this.transaction.list.length) {
                this.initNotify('warning', 'Cruncher', "Don't have data to crunch");
            }
            else {
                let {data, error} = await this.$services.transactionService.crunchAutomation(this.userId, this.accountId, this.type, this.year, this.month);
                if (error) {
                    this.initNotify('error', 'Error', 'Something is wrong!');
                    return error;
                }
                else {
                    this.transaction.list = data ? data.filter(item => item.filters && item.filters.length !== 1).map(item => item.transaction) : [];
                    await this.getTransactionsToCrunch(true);
                }
            }
            this.$setLoading(false);
        },
        async openModalConfirm(item) {
            this
                .$notify({
                    type: 'warning',
                    text: 'Are you sure to delete this transaction?'
                })
                .then(async () => {
                    await this.removeTransaction(item);
                }).catch(() => {
                });
        },
        async removeTransaction({_id, userId, accountId, type, year, month}) {
            this.$setLoading();
            let dataDelete = {
                transactionId: _id,
                userId,
                accountId,
                type,
                year,
                month
            };

            let {data} = await this.$services.transactionService.deleteAndUpdateStatement(dataDelete);
            if (!data) {
                this.$notify({
                    type: 'error',
                    text: 'Fail to remove duplicate item. Please try again!'
                });
                return;
            }
            else {
                this.$notify({
                    type: 'success',
                    text: 'Remove duplicate successfully!'
                });
                await this.getTransactionsToCrunch();
                await this.getStatement();
            }
            this.$setLoading(false);
        },
        async removeWarning(_id) {
            this.$setLoading();
            let {data} = await this.$services.transactionService.removeWarning(_id);
            if (!data) {
                this.$notify({
                    type: 'error',
                    text: 'Fail to approve. Please try again!'
                });
                return;
            }
            else {
                this.$notify({
                    type: 'success',
                    text: 'Approved successfully!'
                });
                await this.getTransactionsToCrunch();
                await this.getStatement();
            }
            this.$setLoading(false);
        },
        openChoose(id) {
            this.$refs.boxChoose.find(b => b.id === 'auto' + id).open();
        }

    },
    filters: {
        moment(data) {
            let date = new Date(data);
            return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
        },
        convertToCurrency(data) {
            return convertToCurrency(data);
        },
        convertMonthToWord,
    }
};
</script>
