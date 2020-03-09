<template>
    <div class="filter-box-two">
        <div class="dropdown">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <div class="filter-box">
                    <label class="filter-title">Start</label>
                    <span class="filter-value" v-if="!Object.keys(startMonthSelected).length">Select date</span>
                    <span class="filter-value" v-else>{{ startMonthSelected.name }} - {{ startMonthSelected.year }}</span>
                    <a class="icon-btn"><i class="i-con icon-date"></i></a>
                </div>
            </div>
            <ul class="dropdown-menu">
                <li class="financial-year">
                    <div class="financial-btn">Financial Year {{ financialYearSelected.begin }} - {{ financialYearSelected.end }} <i class="fa fa-caret-down" aria-hidden="true"></i></div>
                    <ul class="financial-list">
                        <li class="financial-item" v-for="(item, index) in financialYear" :key="index"><a @click="chooseFinancial(item)" class="financial-link">{{ item.begin }} - {{ item.end }}</a></li>                    
                    </ul>
                </li>
                <li v-for="(item, index) in list" :key="index" @click="chooseMonth('start', item)" class="dropdown-menu-item">
                    <a class="dropdown-link">{{ item.name }} - {{ item.year }}</a>
                </li>
            </ul>
        </div>
        <div class="dropdown">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <div class="filter-box">
                    <label class="filter-title">End</label>
                    <span class="filter-value" v-if="!Object.keys(endMonthSelected).length">Select date</span>                    
                    <span class="filter-value" v-else>{{ endMonthSelected.name }} - {{ endMonthSelected.year }}</span>
                    <a class="icon-btn"><i class="i-con icon-date"></i></a>
                </div>
            </div>
            <ul class="dropdown-menu">
                <li class="financial-year">
                    <a class="financial-btn" @click="Object.keys(financialYearSelected)">Financial Year {{ financialYearSelected.begin }} - {{ financialYearSelected.end }} <i class="fa fa-caret-down" aria-hidden="true"></i></a>
                    <ul class="financial-list">
                        <li class="financial-item" v-for="(item, index) in financialYear" :key="index"><a @click="chooseFinancial(item)" class="financial-link">{{ item.begin }} - {{ item.end }}</a></li>
                    </ul>
                </li>
                <li v-for="(item, index) in list" :key="index" @click="chooseMonth('end', item)" class="dropdown-menu-item">
                    <a class="dropdown-link">{{ item.name }} - {{ item.year }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {getListMonthName, convertMonthToWord} from '~/helpers/dateHelper';
import {getFinancialYears, checkFinancialYear, changeParam} from '~/helpers/dataHelper';// checkFinancialYear

export default {
    data() {
        return {
            list: [],
            financialYear: [],
            startMonthSelected: {},
            endMonthSelected: {},
            financialYearSelected: {},
            configFinancialYear: null,
            date: null,
        };
    },
    created() {
        this.configFinancialYear = this.$store.state.userAuth.permission.product.config.financialYear.beginMonth;
        this.financialYear = getFinancialYears(this.configFinancialYear);
        this.financialYear.sort((a, b) => {
            return b.end - a.end;
        });
        this.financialYearSelected = this.financialYear[0];
        // this.startMonthSelected = {month: this.configFinancialYear};
        // this.date = new Date();
    },
    mounted() {
        this.list = getListMonthName(this.financialYearSelected.begin, this.financialYearSelected.end, this.configFinancialYear);
        $('.financial-year').on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).toggleClass('show-year');
        });

        if (this.$route.query.beginMonth && this.$route.query.beginMonth !== 'null') {
            let item = {};
            item.month = this.$route.query.beginMonth;
            item.year = this.$route.query.beginYear;
            item.name = convertMonthToWord(this.$route.query.beginMonth);
            this.chooseMonth('start', item);
        }
        if (this.$route.query.endMonth && this.$route.query.endMonth !== 'null') {
            let item = {};
            item.month = this.$route.query.endMonth;
            item.year = this.$route.query.endYear;
            item.name = convertMonthToWord(this.$route.query.endMonth);
            this.chooseMonth('end', item);
        }
    },
    methods: {
        resolve() {
            this.$emit('changeDate', {startMonth: this.startMonthSelected, endMonth: this.endMonthSelected, configMonth: this.configFinancialYear, financial: this.financialYearSelected});
            changeParam('beginYear', this.startMonthSelected.year);
            changeParam('endYear', this.endMonthSelected.year);
        },
        initNotify(option, title, text) {
            this.$notify({
                group: option,
                title: title,
                text: text
            });
        },
        chooseFinancial(value) {
            if (value)
                this.financialYearSelected = value;
            this.list = getListMonthName(this.financialYearSelected.begin, this.financialYearSelected.end, this.configFinancialYear);
            this.resolve();
        },
        chooseMonth(key, value) {
            if (key === 'start')
                this.startMonthSelected = value;
            if (key === 'end')
                this.endMonthSelected = value;

            // if (value.month >= (this.date.getMonth() + 1)) {
            //     this.endMonthSelected = {};
            //     return;
            // }

            if (Object.keys(this.startMonthSelected).length && Object.keys(this.endMonthSelected).length) {
                if (!checkFinancialYear(this.configFinancialYear, this.startMonthSelected.month, this.endMonthSelected.month)) {
                    this.initNotify('error', 'Error', 'Start date and end date must not be exceeded six month!!!!!');
                    this.endMonthSelected = {};
                    return false;
                }
            }
            this.resolve();
        },
    }
};
</script>

