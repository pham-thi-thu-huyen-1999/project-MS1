<template>
    <div class="filter-box search-financial">
        <div class="dropdown normal">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">Start-End</label>
                <span class="filter-value" v-if="!selected">finance Year</span>
                <span class="filter-value" v-else>{{ selected.begin }} - {{ selected.end }}</span>
                <a class="icon-btn"><i class="i-con icon-date"></i></a>
            </div>
            <i v-if="selected" class="fa fa-times" aria-hidden="true"></i>
            <ul class="dropdown-menu text-center">
                <li class="dropdown-menu-item" v-if="!years.length">
                    <a  class="dropdown-link">
                        <span class="dropdown-link-title">
                            No data!
                        </span>
                    </a>
                </li>
                <li class="dropdown-menu-item" v-else v-for="(year, index) in years" :key="index" @click="selectedYear(year)">
                    <a  class="dropdown-link">
                        <span class="dropdown-link-title">
                          {{ year.begin }} - {{ year.end}}
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {getFinancialYears} from '~/helpers/dataHelper';
export default {
    data() {
        return {
            years: null,
            selected: null,
            configFinancialYear: null
        };
    },
    created() {
        this.open();
    },
    methods: {
        reset() {
            this.years = [];
            this.selected = null;
        },
        open(data) {
            this.reset();
            this.financeYear = data;
            this.configFinancialYear = this.$store.state.userAuth.permission.product.config.financialYear.beginMonth;
            this.years = getFinancialYears(this.configFinancialYear);
            this.years.sort((a, b) => {
                return b.end - a.end;
            });
        },
        selectedYear(year) {
            this.selected = year;
            this.$emit('change', year);
        }
    }
};
</script>

