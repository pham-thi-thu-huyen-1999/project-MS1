<template>
    <div class="filter-box">
        <div class="dropdown search" :class="classPlus">
            <div class="dropdown-toggle">
                <label class="filter-title">{{title}}</label>
                <form @submit.prevent="submitKeyword" autocomplete="off">
                    <input type="text" name="ip-search" class="ip-search" :placeholder="placeholder" v-model="keyword">
                    <a class="icon-btn"><i class="i-con icon-search"></i></a>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            keyword: this.value
        };
    },
    props: {
        title: {
            type: String,
            default: 'Search'
        },
        placeholder: {
            type: String,
            default: 'Search'
        },
        value: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: 'icon-search'
        },
        classPlus: {
            type: String,
            default: ''
        }
    },
    watch: {
        keyword: function(data) {
            this.$emit('input', data);
        }
    },
    methods: {
        submitKeyword() {
            this.$emit('input', this.keyword);
        }
    }
};
</script>
