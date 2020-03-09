<template>
    <div class="filter-box-two">
        <div class="dropdown">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <div class="filter-box">
                    <label class="filter-title">Start</label>
                    <span class="filter-value">December 17</span>
                    <a class="icon-btn"><i class="i-con icon-date"></i></a>
                </div>
            </div>
            <ul class="dropdown-menu">
                <li class="financial-year" @click="financial==!financial">
                    <a class="financial-btn" @click="financial=!financial">Financial Year {{financialValue}} <i class="fa fa-caret-down" aria-hidden="true"></i></a>
                    <ul class="financial-list" v-if="financial">
                        <li class="financial-item"><a @click="financial=!financial;financialValue='2017-2018'" class="financial-link">2017-2018</a></li>
                        <li class="financial-item"><a @click="financial=!financial;financialValue='2018-2019'" class="financial-link">2018-2019</a></li>
                    </ul>
                </li>
                <li v-for="(item, index) in listMonth" :key="index" class="dropdown-menu-item">
                    <a class="dropdown-link"> {{item}} </a>
                </li>
            </ul>
        </div>
        <div class="dropdown">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <div class="filter-box">
                    <label class="filter-title">End</label>
                    <span class="filter-value">November 17</span>
                    <a class="icon-btn"><i class="i-con icon-date"></i></a>
                </div>
            </div>
            <ul class="dropdown-menu">
                <li class="financial-year" @click="financial=!financial">
                    <a class="financial-btn" @click="financial=!financial">Financial Year {{financialValue}} <i class="fa fa-caret-down" aria-hidden="true"></i></a>
                    <ul class="financial-list" v-if="financial">
                        <li class="financial-item"><a @click="financial=!financial;financialValue='2017-2018'" class="financial-link">2017-2018</a></li>
                        <li class="financial-item"><a @click="financial=!financial;financialValue='2018-2019'" class="financial-link">2018-2019</a></li>
                    </ul>
                </li>
                <li v-for="(item, index) in listMonth" :key="index" class="dropdown-menu-item">
                    <a class="dropdown-link"> {{item}} </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            listMonth: ['July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June'],
            financial: false,
            financialValue: '2017-2018'
        };
    }
};
</script>

