<template>
    <div class="vertical-bar">
        <ul class="vertical-menu">
            <li
                @click="goTo(index)"
                class="vertical-menu-item"
                v-for="(item, index) in list"
                :key="index"
                :class="{'active': $route.fullPath.startsWith(item.link)}"
            >
                <a>{{item.name}}</a>
            </li>
        </ul>
        <hr class="space-line" />
        <div class="col-12 page-filter">
            <product-lookup
                v-model="condition.product"
                @changeProduct=changeProduct
                :autoSelect="condition.autoSelect"
                :exclude-codes="[this.$store.state.productCode]"
                :queryCode="$route.query.productCode || ''"
            />
            <lookup-client
                ref="lookupClient"
                @change="changeClient"
                :selectOne="true"
                :selectId="$route.query.clientId || ''"
            />
            <dropdown-date @changeDate="changeDate"></dropdown-date>
            <button
                class="form-btn btn-filter"
                @click="view()"
            >VIEW</button>
        </div>
    </div>
</template>

<script>
import LookupClient from '~/components/Report/LookupClientAll';
import ProductLookup from '~/components/product/ProductLookup';
import DropdownDate from '~/components/Report/DropdownDate';
import {changeParam} from '~/helpers/dataHelper';
import {RoleCode} from '~/common/commonType';
import {convertMonthToWord} from '~/helpers/dateHelper';

export default {
    data() {
        return {
            list: [
                {name: 'Balance Sheet', link: '/financial-report/balance-sheet'},
                {name: 'Profit & Loss', link: '/financial-report/profit-loss'},
                {name: 'Trial Balance', link: '/financial-report/trial-balance'},
                {name: 'GST', link: '/financial-report/gst'},
                {name: 'General Journal', link: '/financial-report/general-journal'},
                {name: 'BU - PU', link: '/financial-report/usage-budget'}
            ],
            condition: {
                product: null,
                manager: null,
                role: RoleCode.ProductAdmin,
            },
            beginDate: {
                month: null,
                year: null
            },
            endDate: {
                month: null,
                year: null
            },
            yearSelect: null,
        };
    },
    props: {
        queries: {
            type: Object,
            default: () => { }
        }
    },
    components: {
        LookupClient,
        ProductLookup,
        DropdownDate,
    },
    created() {

    },
    mounted() {
        // this.getQuery();
    },
    watch: {
        'condition.product': {
            async handler(product) {
                if (product) {
                    if (product.code)
                        changeParam('productCode', product.code);
                    let data = {
                        product: this.condition.product,
                    };
                    await this.$refs.lookupClient.open(data);
                }
            },
            deep: true
        },
    },
    methods: {
        changeProduct() { },
        change(item) {
            this.$emit('change', item);
        },
        changeClient(clients) {
            this.client = clients && clients.length && clients[0];
            changeParam('clientId', this.client._id);
        },
        changeDate(data) {
            if (data.startMonth.month) {
                this.beginDate.month = data.startMonth.month;
                changeParam('beginMonth', this.beginDate.month);
                this.beginDate.monthName = convertMonthToWord(data.startMonth.month);
                if (data.startMonth.month >= data.configMonth) {
                    this.beginDate.year = data.financial.begin;
                }
                else {
                    this.beginDate.year = data.financial.end;
                }
            }
            if (data.endMonth.month) {
                this.endDate.month = data.endMonth.month;
                changeParam('endMonth', this.endDate.month);
                this.endDate.monthName = convertMonthToWord(data.endMonth.month);
                if (data.endMonth.month >= data.configMonth) {
                    this.endDate.year = data.financial.begin;
                }
                else {
                    this.endDate.year = data.financial.end;
                }
            }
        },
        view() {
            this.$emit('view');
        },
        goTo(index) {
            // Get from localStorage
            let storage = localStorage.params && JSON.parse(localStorage.params);
            let beginMonth;
            let beginYear;
            let endMonth;
            let endYear;
            let clientId;
            let productCode;

            if (storage && storage.length) {
                beginMonth = storage.find(item => item.name === 'beginMonth') && storage.find(item => item.name === 'beginMonth').value;
                beginYear = storage.find(item => item.name === 'beginYear') && storage.find(item => item.name === 'beginYear').value;
                endMonth = storage.find(item => item.name === 'endMonth') && storage.find(item => item.name === 'endMonth').value;
                endYear = storage.find(item => item.name === 'endYear') && storage.find(item => item.name === 'endYear').value;
                clientId = storage.find(item => item.name === 'clientId') && storage.find(item => item.name === 'clientId').value;
                productCode = storage.find(item => item.name === 'productCode') && storage.find(item => item.name === 'productCode').value;
            }

            this.list[index].link += `?productCode=${productCode || null}&clientId=${clientId || null}&beginMonth=${beginMonth || null}&beginYear=${beginYear || null}&endMonth=${endMonth || null}&endYear=${endYear || null}`;
            this.$router.push(this.list[index].link);
        }
        // getQuery() {
        //     // Get from localStorage
        //     let storage = JSON.parse(localStorage.params);
        //     let beginMonth;
        //     let beginYear;
        //     let endMonth;
        //     let endYear;
        //     let clientId;
        //     let productCode;

        //     if (storage.length) {
        //         beginMonth = storage.find(item => item.name === 'beginMonth').value;
        //         beginYear = storage.find(item => item.name === 'beginYear').value;
        //         endMonth = storage.find(item => item.name === 'endMonth').value;
        //         endYear = storage.find(item => item.name === 'endYear').value;
        //         clientId = storage.find(item => item.name === 'clientId').value;
        //         productCode = storage.find(item => item.name === 'productCode').value;
        //     }
        //     if (beginMonth)
        //         changeParam('beginMonth', beginMonth);
        //     if (beginYear)
        //         changeParam('beginYear', beginYear);
        //     if (endMonth)
        //         changeParam('endMonth', endMonth);
        //     if (endYear)
        //         changeParam('endYear', endYear);
        //     if (clientId)
        //         changeParam('clientId', clientId);
        //     if (productCode)
        //         changeParam('productCode', productCode);
        // },
    }
};
</script>

