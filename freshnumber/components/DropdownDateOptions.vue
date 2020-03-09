<template>
    <div class="row">
        <div v-if="day" class="col-4 form-group">
            <label class="form-label hidden-xs">&nbsp;</label>
            <div class="dropdown btn-input">
                <button class="dropdown-toggle form-input" type="button" v-on:keydown="checkDayKey" data-toggle="dropdown">{{data.chosenDay}}
                    <i aria-hidden="true" class="fa fa-angle-up"></i>
                    <i aria-hidden="true" class="fa fa-angle-down"></i>
                </button>
                <ul  class="dropdown-menu at-day">
                    <li v-for="(i, index) in numberDay" :key="index" @click="changeDay(i)" class="dropdown-menu-link" ><a>{{i}}</a></li>
                </ul>
            </div>
        </div>
        <div v-if="month" class="col-4 form-group">
            <label class="form-label hidden-xs">&nbsp;</label>
            <div class="dropdown btn-input">
                <button class="dropdown-toggle form-input" type="button" v-on:keydown="checkMonthKey" data-toggle="dropdown">{{data.chosenMonth}}
                    <i aria-hidden="true" class="fa fa-angle-up"></i>
                    <i aria-hidden="true" class="fa fa-angle-down"></i>
                </button>
                <ul class="dropdown-menu at-month">
                    <li v-for="(i, index) in numberMonth" @click="changeMonth(i)" class="dropdown-menu-link" :key="index"><a>{{i}}</a></li>
                </ul>
            </div>
        </div>
        <div v-if="year" class="col-4 form-group">
                <label class="form-label hidden-xs">&nbsp;</label>
                <div class="dropdown btn-input">
                    <button class="dropdown-toggle form-input" type="button" v-on:keydown="checkYearKey" data-toggle="dropdown">{{data.chosenYear}}
                        <i aria-hidden="true" class="fa fa-angle-up"></i>
                        <i aria-hidden="true" class="fa fa-angle-down"></i>
                    </button>
                    <ul class="dropdown-menu at-year">
                        <li v-for="(i, index) in numberYear" @click="changeYear(currentYear - i)" class="dropdown-menu-link" :key="index"><a>{{currentYear - i}}</a></li>
                    </ul>
                </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String
        },
        multiple: {
            type: Boolean,
            default: false
        },
        title: {
            type: String
        },
        day: {
            type: Boolean,
            default: false
        },
        month: {
            type: Boolean,
            default: false
        },
        year: {
            type: Boolean,
            default: false
        },
    },
    data: () => ({
        data: {
            chosenDay: 1,
            chosenMonth: 1,
            // chosenYear: new Date().getYear() - 150 + 1900,
            chosenYear: new Date().getFullYear() - 1,
        },
        // currentYear: new Date().getYear() - 150 + 1900 - 1,
        currentYear: new Date().getFullYear(),
        chooseDay: 4,
        chooseMonth: 4,
        chooseYear: 0,
        numberDay: 31,
        numberMonth: 12,
        numberYear: 100,
    }),
    mounted() {
        // this.data = this.value && JSON.parse(JSON.stringify(this.value));
        // this.data.chosenDay = '5';
        $(`.at-day li:nth-child(${this.data.chosenDay})`).css('background-color', '#f8fbfe');
        $(`.at-month li:nth-child(${this.data.chosenMonth})`).css('background-color', '#f8fbfe');
        $(`.at-year li:nth-child(${this.data.chosenYear - this.currentYear})`).css('background-color', '#f8fbfe');
        this.emitDate();
    },
    watch: {
        'data.chosenDay': {
            handler(value) {
                this.emitDate();
            }
        },
        'data.chosenMonth': {
            handler(value) {
                this.emitDate();
            }
        },
        'data.chosenYear': {
            handler(value) {
                this.emitDate();
            }
        },
    },
    methods: {
        changeDay(day) {
            $(`.at-day li:nth-child(${this.data.chosenDay})`).css('background-color', '');
            this.data.chosenDay = day;
            $(`.at-day li:nth-child(${this.data.chosenDay})`).css('background-color', '#f8fbfe');
        },
        changeMonth(month) {
            $(`.at-month li:nth-child(${this.data.chosenMonth})`).css('background-color', '');
            this.data.chosenMonth = month;
            $(`.at-month li:nth-child(${this.data.chosenMonth})`).css('background-color', '#f8fbfe');
        },
        changeYear(year) {
            $(`.at-year li:nth-child(${this.data.chosenYear - this.currentYear})`).css('background-color', '');
            this.data.chosenYear = year;
            $(`.at-year li:nth-child(${this.data.chosenYear - this.currentYear})`).css('background-color', '#f8fbfe');
        },
        emitDate() {
            if (this.data.chosenMonth < 8) {
                if (this.data.chosenMonth % 2 === 0) {
                    if (this.data.chosenDay > 30) {
                        this.data.chosenDay = 30;
                    }
                    if (this.data.chosenMonth === 2) {
                        if (this.data.chosenYear % 4 === 0) {
                            this.numberDay = 29;
                            if (this.data.chosenDay > 29)
                                this.data.chosenDay = 29;
                        }
                        else {
                            if (this.data.chosenDay > 28)
                                this.data.chosenDay = 28;
                            this.numberDay = 28;
                        }
                    }
                    else {
                        this.numberDay = 30;
                    }
                }
                else {
                    this.numberDay = 31;
                }
            }
            else {
                if (this.data.chosenMonth % 2 === 0)
                    this.numberDay = 31;
                else
                    this.numberDay = 30;
            }
            let currentChoose = new Date(this.data.chosenYear, this.data.chosenMonth, this.data.chosenDay);
            this.$emit('input', currentChoose.toString());
        },
        selectedValue(key) {
            if (key === 'upDay') {
                if (this.data.chosenDay > 1) {
                    this.data.chosenDay -= 1;
                    $(`.at-day li:nth-child(${this.data.chosenDay + 1})`).css('background-color', '');
                    $(`.at-day li:nth-child(${this.data.chosenDay})`).css('background-color', '#f8fbfe');
                    if (this.data.chosenDay > this.chooseDay) {
                        if (this.chooseDay > 0)
                            this.chooseDay--;
                        $(`.at-day li:nth-child(${this.data.chosenDay - this.chooseDay})`)[0].scrollIntoView();
                    }
                }
            }
            if (key === 'downDay') {
                if (this.data.chosenDay < this.numberDay) {
                    this.data.chosenDay += 1;
                    $(`.at-day li:nth-child(${this.data.chosenDay - 1})`).css('background-color', '');
                    $(`.at-day li:nth-child(${this.data.chosenDay})`).css('background-color', '#f8fbfe');
                    if (this.data.chosenDay > this.chooseDay) {
                        if (this.chooseDay < 4)
                            this.chooseDay++;
                        $(`.at-day li:nth-child(${this.data.chosenDay - this.chooseDay})`)[0].scrollIntoView();
                    }
                }
            }
            if (key === 'upMonth') {
                if (this.data.chosenMonth > 1) {
                    this.data.chosenMonth -= 1;
                    $(`.at-month li:nth-child(${this.data.chosenMonth + 1})`).css('background-color', '');
                    $(`.at-month li:nth-child(${this.data.chosenMonth})`).css('background-color', '#f8fbfe');
                    if (this.data.chosenMonth > this.chooseMonth) {
                        if (this.chooseMonth > 0)
                            this.chooseMonth--;
                        $(`.at-month li:nth-child(${this.data.chosenMonth - this.chooseMonth})`)[0].scrollIntoView();
                    }
                }
            }
            if (key === 'downMonth') {
                if (this.data.chosenMonth < this.numberMonth) {
                    this.data.chosenMonth += 1;
                    $(`.at-month li:nth-child(${this.data.chosenMonth - 1})`).css('background-color', '');
                    $(`.at-month li:nth-child(${this.data.chosenMonth})`).css('background-color', '#f8fbfe');
                    if (this.data.chosenMonth > this.chooseMonth) {
                        if (this.chooseMonth < 4)
                            this.chooseMonth++;
                        $(`.at-month li:nth-child(${this.data.chosenMonth - this.chooseMonth})`)[0].scrollIntoView();
                    }
                }
            }
            if (key === 'upYear') {
                if (this.data.chosenYear < this.currentYear - 1) {
                    this.data.chosenYear += 1;
                    $(`.at-year li:nth-child(${this.currentYear - this.data.chosenYear + 1})`).css('background-color', '');
                    $(`.at-year li:nth-child(${this.currentYear - this.data.chosenYear})`).css('background-color', '#f8fbfe');
                    if (this.data.chosenYear > 0) {
                        if (this.chooseYear > 0)
                            this.chooseYear--;
                        $(`.at-year li:nth-child(${this.currentYear - this.data.chosenYear - this.chooseYear})`)[0].scrollIntoView();
                    }
                }
            }
            if (key === 'downYear') {
                if (this.data.chosenYear > this.currentYear - this.numberYear) {
                    this.data.chosenYear -= 1;
                    $(`.at-year li:nth-child(${this.currentYear - this.data.chosenYear - 1})`).css('background-color', '');
                    $(`.at-year li:nth-child(${this.currentYear - this.data.chosenYear})`).css('background-color', '#f8fbfe');
                    if (this.data.chosenYear < this.currentYear) {
                        if (this.chooseYear < 4)
                            this.chooseYear++;
                        $(`.at-year li:nth-child(${this.currentYear - this.data.chosenYear - this.chooseYear})`)[0].scrollIntoView();
                    }
                }
            }
        },
        checkDayKey(event) {
            if (event.key === 'ArrowDown')
                this.selectedValue('downDay');
            if (event.key === 'ArrowUp')
                this.selectedValue('upDay');
            // if (Number.isInteger(parseInt(event.key)))
            //     console.log(event.key);
        },
        checkMonthKey(event) {
            if (event.key === 'ArrowDown')
                this.selectedValue('downMonth');
            if (event.key === 'ArrowUp')
                this.selectedValue('upMonth');
        },
        checkYearKey(event) {
            if (event.key === 'ArrowDown')
                this.selectedValue('downYear');
            if (event.key === 'ArrowUp')
                this.selectedValue('upYear');
        },
    }
};

</script>

