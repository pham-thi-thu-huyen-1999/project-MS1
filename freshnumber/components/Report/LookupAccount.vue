<template>
    <div class="filter-box">
        <div class="dropdown">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">Account</label>
                <span class="filter-value">{{ typeSelected }}</span>
                <a class="icon-btn"><i class="i-con icon-bank"></i></a>
            </div>
            <i class="fa fa-times" aria-hidden="true"></i>
            <ul class="dropdown-menu">
                <li class="dropdown-menu-item" v-for="(value, key, index) in list" :key="index">
                    <a class="dropdown-link"  @click="resolve(value, key)">
                        <span class="dropdown-link-title">
                            {{ key }}
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {BankType} from '~/common/commonType';

export default {
    data() {
        return {
            list: {},
            typeSelected: 'Select',
        };
    },
    props: {

    },
    components: {

    },
    mounted() {
        this.list = BankType;
    },
    methods: {
        resolve(value, key) {
            this.typeSelected = key;
            this.$emit('changeTypeBank', {value: value});
        }
    }
};
</script>

