<template>
    <div class="filter-box">
        <div class="dropdown search">
            <div class="dropdown-toggle">
                <label class="filter-title">{{title}}</label>
                <input type="text" class="ip-search" :placeholder="value">
                <a class="icon-btn"><i class="i-con icon-search"></i></a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        };
    },
    props: {
        title: {
            type: String,
            default: 'Search'
        },
        value: {
            type: String,
            default: 'Search...'
        }
    },
    components: {

    },
    methods: {

    }
};
</script>

