<template>
    <div class="filter-box">
        <div class="dropdown normal">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">Month</label>
                <span class="filter-value">{{mounthSelected ? mounthSelected : 'Select month'}}</span>
                <a class="icon-btn"><i class="i-con icon-arr-topbot"></i></a>
            </div>
            <i class="fa fa-times" aria-hidden="true" @click="reset"></i>
            <ul class="dropdown-menu">
                <li class="dropdown-menu-item" v-for="(item, index) in 12" :key="index">
                    <a class="dropdown-link" @click="selectMounth(item)">
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
            mounthSelected: ''
        };
    },
    props: [],
    methods: {
        selectMounth(value) {
            this.mounthSelected = value;
            this.$emit('mounthSelected', value);
        },
        reset() {
            this.mounthSelected = null;
            this.$emit('mounthSelected', this.mounthSelected);
        }
    }
};
</script>
