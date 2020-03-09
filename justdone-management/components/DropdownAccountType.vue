<template>
    <div class="filter-box">
        <div class="dropdown normal">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">Account Type</label>
                <span class="filter-value">{{accountTypeSelected ? accountTypeSelected : 'Select account type'}}</span>
                <a class="icon-btn"><i class="i-con icon-arr-topbot"></i></a>
            </div>
            <i class="fa fa-times" aria-hidden="true"></i>
            <ul class="dropdown-menu">
                <li class="dropdown-menu-item" v-for="(item, index) in accountTypes" :key="index">
                    <a class="dropdown-link" @click="selectAccontType(item)">
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
            accountTypes: ['Bank', 'CreditCard'],
            accountTypeSelected: ''
        };
    },
    props: [],
    methods: {
        selectAccontType(value) {
            this.accountTypeSelected = value;
            this.$emit('accountTypeSelected', value);
        },
    }
};
</script>