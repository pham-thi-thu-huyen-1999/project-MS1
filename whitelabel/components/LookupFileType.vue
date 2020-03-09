<template>
    <div class="filter-box">
        <div class="dropdown normal">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">{{label}}</label>
                <span class="filter-value">{{ selected ? selected.name : 'None' }}</span>
                <a class="icon-btn"><i class="i-con icon-arr-topbot"></i></a>
            </div>
            <i class="fa fa-times" aria-hidden="true" @click="reset"></i>
            <ul class="dropdown-menu">
                <li class="dropdown-menu-item" v-for="(item, index) in list" :key="index">
                    <a  class="dropdown-link" @click="changeItem(item)">
                        <span class="dropdown-link-title">
                            {{item.name}}
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: 'File types'
        },
        productCodes: {
            type: Array,
        },
        queryCode: {
            type: String
        },
        autoSelect: {
            type: Boolean,
            default: false
        },
        claims: {
            type: Array,
        },
        isSelectAll: {
            type: Boolean,
            default: true
        },
        excludeCodes: {
            type: Array
        }
    },
    data: () => ({
        list: [],
        selected: null
    }),
    methods: {
        reset() {
        },
        changeItem(product) {
        },
        async getlookup() {
        }
    }
};
</script>

