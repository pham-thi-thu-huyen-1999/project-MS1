<template>
    <div
        class="box-left"
        v-if="isShow"
    >
        <div
            class="select-financial"
            v-if="isFinancialYear"
        >
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
        <ul class="page-menu">
            <li
                class="page-menu-item"
                v-for="(item, index) in listMenu"
                :key="index"
                :class="{active: $route.fullPath === item.link || `${$route.fullPath}?type=1` === item.link || `${$route.fullPath}?tab=1` === item.link}"
            >
                <nuxt-link
                    class="page-menu-link"
                    :to="item.link"
                >{{ item.title }}</nuxt-link>
            </li>
        </ul>
    </div>
</template>

<script>
import {getFinancialYears} from '~/helpers/dataHelper.js';

export default {
    props: {
        isShow: {
            type: Boolean,
            default: true
        },
        listMenu: {
            type: Array,
            default: null
        }
    },
    data() {
        return {
            financialYears: [],
            financialYearSelected: this.value && JSON.parse(JSON.stringify(this.value)),
            isFinancialYear: false,
        };
    },
    async created() {
        let path = this.$route.path.split('/');
        if (path[3] === 'transaction')
            this.isFinancialYear = true;
        if (this.$store.state.client)
            this.financialYears = getFinancialYears(this.$store.state.client.permission.product.config.financialYear.beginMonth);
        if (!this.financialYearSelected || !this.financialYears.find(y => y.begin === this.financialYearSelected.begin && y.end === this.financialYearSelected.end))
            this.financialYearSelected = this.financialYears[0];
    },
    watch: {
        financialYearSelected: function(newData) {
            this.$emit('input', newData);
            this.$emit('yearSelected', newData.begin);
        }
    },
    methods: {
        showFinancialYear(financialYear) {
            if (!financialYear || !financialYear.begin || !financialYear.end)
                return '';

            return financialYear.begin + ' / ' + financialYear.end;
        }
    }
};
</script>
