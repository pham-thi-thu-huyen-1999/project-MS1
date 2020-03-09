<template>
    <div class="filter-box-two picker">
        <template>
            <div class="dropdown">
                <div class="dropdown-toggle">
                    <div class="filter-box">
                        <!-- <label class="filter-title">{{title || 'Select Date'}}</label> -->
                        <a class="icon-btn"><i
                                class="i-con icon-date"
                                style="margin-top:8px"
                            ></i></a>
                        <client-only>
                            <date-picker
                                placeholder="Date"
                                class="filter-value"
                                :config="options"
                                v-model="data"
                                @dp-change="changeDate"
                            />
                        </client-only>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    props: {
        // title: {
        //     type: String
        // },
        year: {
            type: String,
            default: ''
        },
        month: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            data: null,
            options: {
                format: 'DD/MM/YYYY',
                useCurrent: false,
                widgetPositioning: {vertical: 'bottom'},
                focusOnShow: false,
                minDate: moment(),
                maxDate: false,
                defaultDate: ''
            },
        };
    },
    created() {
        this.data = this.value && JSON.parse(JSON.stringify(this.value));
        this.options.minDate = `${this.month}/1/${this.year}`;
        this.options.maxDate = `${this.month}/31/${this.year}`;
        this.options.defaultDate = `${this.month}/1/${this.year}`;
    },
    watch: {
    },
    methods: {
        changeDate({oldDate, date}) {
            this.data = date && date._d;
            this.$emit('input', this.data);
        },
    }
};
</script>

