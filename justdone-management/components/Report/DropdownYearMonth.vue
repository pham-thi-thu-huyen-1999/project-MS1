<template>
    <div class="filter-box-two">
        <div class="dropdown">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <div class="filter-box">
                    <label class="filter-title">Year</label>
                    <span class="filter-value" v-if="yearSelect">Select date</span>
                    <span class="filter-value" v-else>{{yearSelect}}</span>
                    <a class="icon-btn"><i class="i-con icon-date"></i></a>
                </div>
            </div>
            <ul class="dropdown-menu scroll pt-10">
                <li v-for="(item, index) in listYear" :key="index" @click="chooseYear('year', item)" class="dropdown-menu-item">
                    <a class="dropdown-link">{{item}}</a>
                </li>
            </ul>
        </div>
        <div class="dropdown">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <div class="filter-box">
                    <label class="filter-title">Month</label>
                    <span class="filter-value" v-if="monthSelect">Select date</span>                    
                    <span class="filter-value" v-else>{{monthSelect | convertMonthToWord}}</span>
                    <a class="icon-btn"><i class="i-con icon-date"></i></a>
                </div>
            </div>
            <ul class="dropdown-menu scroll pt-10">
                <li v-for="(item, index) in listMonth" :key="index" @click="chooseMonth('month', item)" class="dropdown-menu-item">
                    <a class="dropdown-link">{{item | convertMonthToWord}}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {listYear, convertMonthToWord} from '~/helpers/dateHelper';

export default {
    data() {
        return {
            listYear: [],
            listMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yearSelect: '',
            monthSelect: ''
        };
    },
    created() {
        this.listYear = listYear();
    },
    mounted() {
        $('.financial-year').on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).toggleClass('show-year');
        });
    },
    methods: {

    },
    filters: {
        convertMonthToWord(month) {
            return convertMonthToWord(month);
        }
    }
};
</script>

