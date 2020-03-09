<template>
    <div class="filter-box">
        <div class="dropdown search">
            <div class="dropdown-toggle">
                <label class="filter-title">{{title}}</label>
                <input type="text" class="ip-search" :placeholder="placeholder" v-model="keyword">
                <a class="icon-btn"><i class="i-con icon-search"></i></a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        keyword: this.value
    }),
    props: {
        title: {
            type: String,
            default: 'Search'
        },
        placeholder: {
            type: String,
            default: 'Search...'
        },
        value: {
            type: String,
            default: ''
        }
    },
    watch: {
        keyword: function(data) {
            this.$emit('input', data);
        }
    }
};
</script>

