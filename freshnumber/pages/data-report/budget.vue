<template>
    <section class="data-report budget">
        <loading :isShowLoading="showLoading"/>    
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles"/>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                        <div class="dropdown normal-btn">
                            <nuxt-link class="btn dropdown-toggle not-arrow" to="/data-report">
                                    BACK
                            </nuxt-link>
                        </div>
                    </div>
                    <div class="col-12 page-filter">
                        <lookup-client ref="searchClient" @change="changeClient($event)"/>
                        <lookup-financial-year ref="searchFinancial" @change="changeFinancial($event)"/>
                        <lookup-keyword :title="'Search'" :value="'Search COA Name'" v-model="keyword"/>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="box-report">
                    <div class="report-detail" :class="{'no-data': !list.length}">
                        <table class="table-line" v-if="list.length">
                            <tbody>
                                <tr class="table-line-title">
                                    <td class="item" >COA Name</td>
                                    <td class="item" v-for="(item, index) in monthFinancialYear" :key="index">{{item.month | convertMonthToWord}}-{{item.year}}</td>
                                    <td class="item" >Total</td>                                    
                                </tr>
                            </tbody>
                        </table>
                        <table class="table-content">
                            <tbody>
                                <tr v-if="!list.length">
                                    <td class="item-title" >
                                        <div class="no-data text-center">
                                            <img src="~/assets/images/no-data.png" alt="no data">
                                            <p class="text-note">No data available.</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else v-for="(item, index) in list" :key="index" :id="'budget-' + item.coa._id">
                                    <td class="item-title" >{{ item.coa.name }}</td>
                                    <td class="item-value" v-for="(financial, indexMonth) in monthFinancialYear" :key="indexMonth">
                                        <input class="ip-value" type="text" :value="getAmount(index, financial.month, financial.year) | convertToCurrency" @change="updatedBudget(item.coa._id, financial.month, financial.year, index, indexMonth)"/> <!--placeholder="$ 125,000.00"-->
                                        <span class="arrow-box">
                                            <span class="icon-arr-box i-con" @click="autoSimilar(item.coa._id, indexMonth,  financial.month, financial.year, index)"></span>
                                        </span>
                                    </td>
                                    <td class="item-value" >{{ totalByChartAccount(index) | convertToCurrency }}</td>                                    
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="paginate">
                    <pagination id="team-pagination" :page="page" :limit="limit" :total="total" @change="changePage" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {getAllMonthByFinancialYear, convertToCurrency} from '~/helpers/dataHelper';
import {convertMonthToWord} from '~/helpers/dateHelper';
import LookupFinancialYear from '~/components/Budget/LookupFinancialYear';
import LookupClient from '~/components/Budget/LookupClient';
import LookupKeyword from '~/components/LookupKeyword';
import Pagination from '~/components/Pagination';
import PageTitle from '~/components/PageTitle';
import Loading from '~/components/Loading';
import EventBus from '~/plugins/event-bus';

export default {
    data() {
        return {
            listFilter: [{name: 'Monthly amount', checked: false}, {name: 'Monthly percentage', checked: false}, {name: 'YTD amount', checked: false}, {name: 'YTD percentage', checked: false}, {name: 'Budget for year', checked: false}, {name: 'Budget for percentag', checked: false}, {name: 'Variance', checked: false}],
            check: false,
            productSelected: null,
            clientSelected: null,
            financeYear: null,
            monthFinancialYear: null,
            keyword: null,
            budgets: null,
            timeout: null,
            list: [],
            page: 1,
            limit: 10,
            total: 0,
            titles: ['Budget for Year'],
            showLoading: false
        };
    },
    components: {
        LookupClient,
        LookupKeyword,
        LookupFinancialYear,
        Pagination,
        PageTitle,
        Loading
    },
    watch: {
        keyword: function(keyword) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.search(), 800);
        }
    },
    created() {
        this.reset();
    },
    methods: {
        reset() {
            this.productSelected = this.$store.state.userAuth.permission.product;
            this.clientSelected = null;
            this.financeYear = null;
            this.monthFinancialYear = [];
            this.keyword = '';
            this.list = [];
            this.page = 1;
            this.limit = 10;
            this.total = 0;
        },
        initNotify(option, title, text) {
            this.$notify({
                group: option,
                title: title,
                text: text
            });
        },
        search() {
            if (!this.productSelected || !this.clientSelected || !this.financeYear)
                return;

            this.page = 1;
            this.getBudgets();
            this.getCountBudgets();
        },
        async getBudgets() {
            this.showLoading = true;
            let {data, error} = await this.$services.budgetService.getBudgetFinancial(this.productSelected.code, this.clientSelected._id, this.financeYear.begin, this.productSelected.config.financialYear.beginMonth, this.financeYear.end, this.productSelected.config.financialYear.endMonth, this.page, this.limit, this.keyword);
            if (error)
                this.initNotify('error', 'Error', 'Get budget failed');

            this.list = data || [];
            this.showLoading = false;
        },
        async getCountBudgets() {
            let {data, error} = await this.$services.budgetService.getCountBudget(this.productSelected.code, this.clientSelected._id, this.keyword);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: error});
            this.total = data || 0;
        },
        changePage(page) {
            this.page = page;
            this.getBudgets();
        },
        async changeFinancial(data) {
            if (!data || !data.begin || !data.end)
                return;
            this.financeYear = data;
            this.monthFinancialYear = getAllMonthByFinancialYear(data.begin, data.end, this.productSelected.config.financialYear.beginMonth);
            this.search();
        },
        async changeClient(user) {
            if (!user)
                return;

            this.clientSelected = user;
            this.search();
        },
        async createAndUpdateBudgets(productCode, clientId, coaId, budgets) {
            if (!clientId)
                return;

            let body = {
                productCode,
                clientId: clientId,
                coaId: coaId,
                budgets: []
            };
            body.budgets = budgets;

            let result = await this.$services.budgetService.createAndUpdateBudgets(body);
            if (result.error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: result.error});
            else
                return result.data;
        },
        getAmount(index, month, year) {
            if (!month || !year)
                return 0;

            if (this.list[index].budgets.length) {
                let budget = this.list[index].budgets.find(item => {
                    if (item.month === month && item.year === year)
                        return item;
                });

                if (budget)
                    return budget.amount;
                else
                    return 0;
            }
            else
                return 0;
        },
        totalByChartAccount(index) {
            if (this.list[index].budgets.length) {
                let amount = 0;
                this.list[index].budgets.forEach(budget => {
                    amount = amount + budget.amount;
                });
                return amount;
            }
            return 0;
        },
        async autoSimilar(coaId, positionMonth, month, year, indexCoa) {
            let inputEls = document.querySelectorAll(`#budget-${coaId} input`);
            let i = positionMonth;
            let budgets = [];

            if (!inputEls[positionMonth].value || !inputEls[positionMonth].value.length || isNaN(this.removeCharactersSpecial(inputEls[positionMonth].value))) {
                EventBus.$emit('NOTIFICATION_WARNING', {title: 'Warning', description: 'Not in number'});
                return;
            }

            let amount = Number(this.convertNumber(inputEls[positionMonth].value));

            while (i < inputEls.length) {
                inputEls[i].value = convertToCurrency(parseFloat(Number(this.convertNumber(inputEls[positionMonth].value))));
                budgets.push({year: this.monthFinancialYear[i].year, month: this.monthFinancialYear[i].month, amount: amount});
                i++;
            }

            let result = await this.createAndUpdateBudgets(this.productSelected.code, this.clientSelected._id, coaId, budgets);

            if (result.length) {
                for (let item of result) {
                    if (this.list[indexCoa].budgets.length) {
                        let budget = this.list[indexCoa].budgets.find(element => {
                            if (element.coaId === item.coaId && element.month === item.month && element.year === item.year)
                                return element;
                        });
                        if (budget)
                            budget.amount = Number(this.convertNumber(amount));
                        else
                            this.list[indexCoa].budgets.push(item);
                    }
                    else
                        this.list[indexCoa].budgets.push(item);
                }
            }
        },
        async updatedBudget(coaId, month, year, indexCoa, indexMonth) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(async () => {
                let amount = document.querySelectorAll(`#budget-${coaId} input`)[indexMonth].value;

                if (!amount || !amount.length || isNaN(this.removeCharactersSpecial(amount))) {
                    EventBus.$emit('NOTIFICATION_WARNING', {title: 'Warning', description: 'Not in number'});
                    return;
                }

                let body = {
                    year: year,
                    month: month,
                    amount: Number(this.convertNumber(amount))
                };
                let result = await this.createAndUpdateBudgets(this.productSelected.code, this.clientSelected._id, coaId, [body]);

                // document.querySelectorAll(`#budget-${coaId} input`)[indexMonth].value = convertToCurrency(parseFloat(Number(this.convertNumber(amount))));

                if (result.length) {
                    for (let item of result) {
                        if (this.list[indexCoa].budgets.length) {
                            let budget = this.list[indexCoa].budgets.find(element => {
                                if (element.coaId === item.coaId && element.month === item.month && element.year === item.year)
                                    return element;
                            });
                            if (budget)
                                budget.amount = Number(this.convertNumber(amount));
                            else
                                this.list[indexCoa].budgets.push(item);
                        }
                        else
                            this.list[indexCoa].budgets.push(item);
                    }
                }
            }, 2200);
        },
        removeCharactersSpecial(data) {
            return data.replace(/[&.\;/\\#,+()$~%'":*?<>{}_^]/g, ''); //eslint-disable-line
        },
        convertNumber(data) {
            return data.toString().replace(/[^0-9\.-]+/g,""); //eslint-disable-line
        }
    },
    filters: {
        convertMonthToWord,
        convertToCurrency
    }
};
</script>


