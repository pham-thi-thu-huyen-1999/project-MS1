<template>
    <div class="filter-box">
        <div class="dropdown normal">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">Year</label>
                <span class="filter-value">{{yearSelected ? yearSelected : 'Select year'}}</span>
                <a class="icon-btn"><i class="i-con icon-arr-topbot"></i></a>
            </div>
            <i class="fa fa-times" aria-hidden="true" @click="reset"></i>
            <ul class="dropdown-menu">
                <li class="dropdown-menu-item" v-for="(item, index) in years" :key="index">
                    <a class="dropdown-link" @click="selectYear(item)">
                        <span class="dropdown-link-title">
                            {{item}}
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            years: [2017, 2018, 2019],
            yearSelected: ''
        };
    },
    props: [],
    methods: {
        selectYear(value) {
            this.yearSelected = value;
            this.$emit('yearSelected', value);
        },
        reset() {
            this.yearSelected = null;
            this.$emit('yearSelected', this.yearSelected);
        }
    }
};
</script>
