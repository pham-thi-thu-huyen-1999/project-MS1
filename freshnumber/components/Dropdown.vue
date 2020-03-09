<template>
    <div class="filter-box">
        <div class="dropdown" :class="classDrop">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">{{title}}</label>
                <span v-if="!search" class="filter-value">{{value}}</span>
                <input v-else type="text" class="ip-search" :placeholder="value">
                <a class="icon-btn"><i class="i-con" :class="icon"></i></a>
            </div>
            <ul class="dropdown-menu" :style="styleDrop">
                <li v-if="ipSearch" class="dropdown-menu-item">
                    <input class="dropdown-input" :placeholder="ipSearchPlaceholder" type="text">
                </li>
                <li class="dropdown-menu-item" v-for="(item, index) in list" :key="index">
                    <a v-if="ipCheck" class="dropdown-link" @click.stop>
                        <span class="dropdown-link-title">
                            <input v-if="ipCheck" @click="tickChoose='Bank account'" type="checkbox"/>
                            {{item.name}}
                        </span>
                        <span class="dropdown-link-notifi">
                            <template v-if="item.misscrunch">
                                <img class="dropdown-link-notifi-img" src="~/assets/images/noti-misscrunch.svg" alt="" title="">MISS CRUNCHER
                            </template>
                        </span>
                        <span v-if="item.abn" class="dropdown-link-abn">
                            <span class="dropdown-link-abn-title">ABN</span>
                            <span class="dropdown-link-abn-value">{{item.abn}}</span>
                        </span>
                    </a>
                    <a v-else class="dropdown-link">
                        <span class="dropdown-link-title">
                            <input v-if="ipCheck" @click="tickChoose='Bank account'" type="checkbox"/>
                            {{item.name}}
                        </span>
                        <span class="dropdown-link-notifi">
                            <template v-if="item.misscrunch">
                                <img class="dropdown-link-notifi-img" src="~/assets/images/noti-misscrunch.svg" alt="" title="">MISS CRUNCHER
                            </template>
                        </span>
                        <span v-if="item.abn" class="dropdown-link-abn">
                            <span class="dropdown-link-abn-title">ABN</span>
                            <span class="dropdown-link-abn-value">{{item.abn}}</span>
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
            tickChoose: ''
        };
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        list: {
            type: Array,
            default: []
        },
        icon: {
            type: String,
            default: ''
        },
        styleDrop: {
            type: String,
            default: ''
        },
        classDrop: {
            type: String,
            default: ''
        },
        ipSearch: {
            type: Boolean,
            default: false
        },
        ipSearchPlaceholder: {
            type: String,
            default: ''
        },
        ipCheck: {
            type: Boolean,
            default: false
        },
        search: {
            type: Boolean,
            default: false
        }
    },
    components: {

    },
    methods: {

    }
};
</script>

