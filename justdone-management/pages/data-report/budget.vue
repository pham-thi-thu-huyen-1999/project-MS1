<template>
    <section class="data-report budget">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles" />
                    </div>
                    <!--<div class="col-md-6 col-sm-6 col-xs-12 text-right">
                        <div class="dropdown normal-btn">
                            <button class="btn dropdown-toggle not-arrow" type="button">
                                SAVE
                            </button>
                        </div>
                    </div>-->
                    <div class="col-12 page-filter">
                        <product-lookup
                            id="productLookup"
                            v-model="productSelected"
                        />
                        <search-client
                            ref="searchClient"
                            @change="changeClient($event)"
                        />
                        <search-financial-year
                            ref="searchFinancial"
                            @change="changeFinancial($event)"
                        />
                        <Lookup-keyword
                            :title="'Search'"
                            :placeholder="'Search chart of account'"
                            v-model="keyword"
                        />
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="box-report">
                    <div class="report-detail">
                        <table
                            class="table-line"
                            v-if="list.length"
                        >
                            <tbody>
                                <tr class="table-line-title">
                                    <td class="item">COA Name</td>
                                    <td
                                        class="item"
                                        v-for="(item, index) in monthFinancialYear"
                                        :key="index"
                                    >{{item.month | convertMonthToWord}}-{{item.year}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table-content">
                            <tbody>
                                <tr v-if="!list.length">
                                    <td class="no-data text-center">
                                        <img
                                            src="~/assets/images/no-data.png"
                                            alt="no data"
                                        >
                                        <p class="text-note">No data available.</p>
                                    </td>
                                </tr>
                                <tr
                                    v-else
                                    v-for="(item, index) in list"
                                    :key="index"
                                    :id="'budget-' + item.coa._id"
                                >
                                    <td class="item-title">{{ item.coa.name }}</td>
                                    <td
                                        class="item-value"
                                        v-for="(financial, indexMonth) in monthFinancialYear"
                                        :key="indexMonth"
                                    >
                                        <input
                                            class="ip-value"
                                            type="text"
                                            :value="getAmount(index, financial.month, financial.year) | convertToCurrency"
                                            @change="updatedBudget(item.coa._id, financial.month, financial.year, index, indexMonth)"
                                        />
                                        <!--placeholder="$ 125,000.00"-->
                                        <span class="arrow-box">
                                            <span
                                                class="icon-arr-box i-con"
                                                @click="autoSimilar(item.coa._id, indexMonth,  financial.month, financial.year)"
                                            ></span>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="paginate">
                    <pagination
                        id="team-pagination"
                        :page="page"
                        :limit="limit"
                        :total="total"
                        @change="changePage"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {getAllMonthByFinancialYear, convertToCurrency} from '~/helpers/dataHelper';
import {convertMonthToWord} from '~/helpers/dateHelper';
import SearchClient from '~/components/BudgetFinancial/SearchClient';
import ProductLookup from '~/components/product/ProductLookup';
import LookupKeyword from '~/components/LookupKeyword';
import SearchFinancialYear from '~/components/BudgetFinancial/SearchFinancialYear';
import Pagination from '~/components/Pagination';
import PageTitle from '~/components/PageTitle';

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
            titles: ['Budget for Year']
        };
    },
    components: {
        SearchClient,
        ProductLookup,
        LookupKeyword,
        SearchFinancialYear,
        Pagination,
        PageTitle
    },
    watch: {
        keyword: function(keyword) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.search(), 1200);
        },
        productSelected: {
            handler(product) {
                if (!product)
                    return;

                this.productSelected = product;
                this.$refs.searchFinancial.open(this.financeYear);
                this.$refs.searchClient.open(product);
            },
            deep: true
        },
    },
    created() {
        this.reset();
    },
    methods: {
        reset() {
            this.productSelected = null;
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
                group: option || 'success',
                title: title,
                text: text
            });
        },
        search() {
            if (!this.productSelected || !this.clientSelected || !this.financeYear) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'Error';
            }

            this.page = 1;
            this.getBudgets();
            this.getCountBudgets();
        },
        async getBudgets() {
            let {data, error} = await this.$services.budgetService.getBudgetFinancial(this.productSelected.code, this.clientSelected._id, this.financeYear.beginYear, this.productSelected.config.financialYear.beginMonth, this.financeYear.endYear, this.productSelected.config.financialYear.endMonth, this.page, this.limit, this.keyword);
            if (error) {
                this.initNotify('error', 'Error', 'Miss Data!');
                return error;
            }

            this.list = data || [];
        },
        async getCountBudgets() {
            let {data, error} = await this.$services.budgetService.getCountBudget(this.productSelected.code, this.clientSelected._id, this.keyword);
            if (error) {
                this.initNotify('error', 'Error', 'Miss Data!');
                return error;
            }

            this.total = data || 0;
        },
        changePage(page) {
            this.page = page;
            this.getBudgets();
        },
        async changeFinancial(data) {
            if (!data || !data.beginYear || !data.endYear) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'Error';
            }

            this.financeYear = data;
            this.monthFinancialYear = getAllMonthByFinancialYear(data.beginYear, data.endYear, this.productSelected.config.financialYear.beginMonth);
            this.search();
        },
        async changeClient(user) {
            if (!user) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'Error';
            }

            this.clientSelected = user;
            this.search();
        },
        async createAndUpdateBudgets(productCode, clientId, coaId, budgets) {
            if (!clientId) {
                this.initNotify('error', 'Error', 'Check condition again!');
                return 'Error';
            }

            let body = {
                productCode,
                clientId: clientId,
                coaId: coaId,
                budgets: []
            };
            body.budgets = budgets;

            let result = await this.$services.budgetService.createAndUpdateBudgets(body);
            if (result.error || !result.data) {
                this.initNotify('error', 'Error', 'Process failed!');
                return result.error || result.data;
            }
            else
                this.initNotify('success', 'Done', 'Process completed!');
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
        async autoSimilar(coaId, positionMonth, month, year) {
            let inputEls = document.querySelectorAll(`#budget-${coaId} input`);
            let i = positionMonth + 1;
            let budgets = [];

            if (!inputEls[positionMonth].value || !inputEls[positionMonth].value.length || isNaN(this.removeCharactersSpecial(inputEls[positionMonth].value))) {
                this.initNotify('error', 'Error', 'Not in number!');
                return 'Error';
            }

            let amount = Number(this.convertNumber(inputEls[positionMonth].value));

            while (i < inputEls.length) {
                inputEls[i].value = convertToCurrency(parseFloat(Number(this.convertNumber(inputEls[positionMonth].value))));
                budgets.push({year: this.monthFinancialYear[i].year, month: this.monthFinancialYear[i].month, amount: amount});
                i++;
            }
            await this.createAndUpdateBudgets(this.productSelected.code, this.clientSelected._id, coaId, budgets);
        },
        async updatedBudget(coaId, month, year, indexCoa, indexMonth) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(async () => {
                let amount = document.querySelectorAll(`#budget-${coaId} input`)[indexMonth].value;

                if (!amount || !amount.length || isNaN(this.removeCharactersSpecial(amount))) {
                    this.initNotify('error', 'Error', 'Not in number!');
                    return;
                }

                let data = {
                    year: year,
                    month: month,
                    amount: Number(this.convertNumber(amount))
                };
                await this.createAndUpdateBudgets(this.productSelected.code, this.clientSelected._id, coaId, [data]);
                document.querySelectorAll(`#budget-${coaId} input`)[indexMonth].value = convertToCurrency(parseFloat(Number(this.convertNumber(amount))));
            }, 2200);
        },
        removeCharactersSpecial(data) {
            return data.replace(/[&.\;/\\#,+()$~%'":*?<>{}_^]/g, ''); //eslint-disable-line
        },
        convertNumber(data) {
            return data.replace(/[^0-9\.-]+/g, ""); //eslint-disable-line
        }
    },
    filters: {
        convertMonthToWord(month) {
            return convertMonthToWord(month);
        },
        convertToCurrency(data) {
            return convertToCurrency(data);
        },
    }
};
</script>


