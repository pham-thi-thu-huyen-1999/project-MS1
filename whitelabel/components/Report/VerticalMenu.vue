<template>
    <div class="vertical-bar">
        <ul class="vertical-menu">
            <li class="vertical-menu-item" :class="{active: $route.path.startsWith(item.link)}" v-for="(item, index) in list" :key="index"><a :href="item.link">{{item.name}}</a></li>
        </ul>
    </div>
</template>

<script>
export default {
    data: () => ({
        list: [{
            name: 'Balance Sheet', link: '/financial-report/balance-sheet'
        }, {
            name: 'Profit & Loss', link: '/financial-report/profit-loss'
        }, {
            name: 'Trial Balance', link: '/financial-report/trial-balance'
        }, {
            name: 'GST', link: '/financial-report/gst'
        }, {
            name: 'General Journal', link: '/financial-report/general-journal'
        }, {
            name: 'BU - PU', link: '/financial-report/usage-budget'
        } ]
    }),
    created() {

    },
    methods: {
        change(item) {
            this.$emit('change', item);
        }
    }
};
</script>

