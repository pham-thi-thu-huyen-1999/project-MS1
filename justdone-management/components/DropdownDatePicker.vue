<template>
    <div class="filter-box-two picker">
        <template v-if="!multiple">
            <div class="dropdown">
                <div class="dropdown-toggle">
                    <div class="filter-box">
                        <label class="filter-title">{{title || 'Date'}}</label>
                        <a class="icon-btn"><i class="i-con icon-date"></i></a>
                        <client-only>
                            <date-picker
                                placeholder="Date"
                                class="filter-value"
                                v-model="data"
                                :config="config"
                                @dp-change="changeDate"
                            />
                        </client-only>
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="data">
            <div class="dropdown">
                <div class="dropdown-toggle">
                    <div class="filter-box">
                        <label class="filter-title">{{title && title.length ? title[0] : 'Start'}}</label>
                        <a class="icon-btn"><i class="i-con icon-date"></i></a>
                        <client-only>
                            <date-picker
                                placeholder="Date"
                                class="filter-value"
                                v-model="data.start"
                                :config="config"
                                @dp-change="changeStartDate"
                            />
                        </client-only>
                    </div>
                </div>
            </div>
            <div class="dropdown">
                <div class="dropdown-toggle">
                    <div class="filter-box">
                        <label class="filter-title">{{title && title.length > 1 ? title[1] : 'End'}}</label>
                        <client-only>
                            <date-picker
                                placeholder="Date"
                                class="filter-value"
                                v-model="data.end"
                                :config="config"
                                @dp-change="changeEndDate"
                            />
                        </client-only>
                        <a class="icon-btn"><i class="i-con icon-date"></i></a>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Object
        },
        multiple: {
            type: Boolean,
            default: false
        },
        title: {
            type: String
        }
    },
    data() {
        return {
            data: null,
            config: {
                format: 'L',
                useCurrent: false,
                widgetPositioning: {vertical: 'bottom'},
                focusOnShow: false,
            }
        };
    },
    created() {
        this.data = this.value && JSON.parse(JSON.stringify(this.value));
    },
    methods: {
        changeDate({oldDate, date}) {
            this.data = date && date._d;
            this.$emit('input', this.data);
        },
        changeStartDate({oldDate, date}) {
            if (!this.data)
                this.data = {};
            this.data.start = date && date._d;
            this.$emit('input', this.data);
        },
        changeEndDate({oldDate, date}) {
            if (!this.data)
                this.data = {};
            this.data.end = date && date._d;
            this.$emit('input', this.data);
        }
    }
};
</script>

