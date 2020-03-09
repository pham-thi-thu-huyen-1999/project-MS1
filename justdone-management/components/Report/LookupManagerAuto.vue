<template>
    <div class="filter-box">
        <div class="dropdown search">
            <div
                class="dropdown-toggle"
                data-toggle="dropdown"
            >
                <label class="filter-title">Product Admin</label>
                <input
                    type="text"
                    class="ip-search"
                    v-model="keyword"
                    placeholder="Search Product Admin"
                    @input="search()"
                >
                <a class="icon-btn"><i class="i-con icon-search"></i></a>
            </div>
            <i
                class="fa fa-times"
                aria-hidden="true"
                @click="init()"
            ></i>
            <ul class="dropdown-menu">
                <li
                    class="dropdown-menu-item"
                    v-for="(item, index) in list"
                    :key="index"
                    v-if="!isLoading && list && list.length > 0"
                >
                    <a
                        class="dropdown-link"
                        @click="changeItem(item)"
                    >
                        <span class="dropdown-link-title">
                            {{ item.fullName }}
                        </span>
                    </a>
                </li>
                <li
                    class="dropdown-menu-item"
                    v-if="list && !list.length"
                >
                    <a class="dropdown-link">
                        <span class="dropdown-link-title">
                            Not found.
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
            list: [],
            keyword: '',
            page: 1,
            limit: 20,
            total: 0,
            role: null,
            product: {},
            isLoading: false
        };
    },
    methods: {
        async open(data) {
            this.list = [];
            this.keyword = '';
            this.page = 1;
            this.limit = 20;
            this.total = 0;
            this.role = null;
            this.product = data.product;
            this.role = data.role;
            // this.init();/
            this.init();
        },
        changeItem(value) {
            this.keyword = value.fullName;
            this.$emit('input', value);
        },
        async init() {
            this.keyword = '';
            this.$emit('input', '');
            await this.getManagers();
            // await this.getCountManagers();
        },
        async getManagers() {
            let productCodes = this.product ? [this.product.code] : [];
            let roleCodes = this.role ? [this.role] : [];
            this.list = [];

            let {data, error} = await this.$services.userService.getManagers(productCodes, roleCodes, this.keyword, this.showDisabled, this.page, this.limit);
            if (error)
                return false;
            if (data && data.length)
                this.list = data;
        },
        // async getCountManagers() {
        //     let productCodes = this.product ? [this.product.code] : [];
        //     let roleCodes = this.role ? [this.role] : [];
        //     let {data, error} = await this.$services.userService.getCountManagers(productCodes, roleCodes, this.keyword);
        //     if (error)
        //         return false;
        //     else
        //         this.list = data;
        // },
        async search() {
            // this.getCountManagers();
            this.init();
        }
    }
};
</script>
