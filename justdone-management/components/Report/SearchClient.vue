<template>
    <div class="filter-box">
        <div class="dropdown dropdown-client">
            <div
                class="dropdown-toggle"
                data-toggle="dropdown"
            >
                <label class="filter-title">Client</label>
                <span
                    class="filter-value"
                    v-if="selected"
                >{{ selected.fullname}}</span>
                <span
                    class="filter-value"
                    v-else
                >Client</span>
                <a class="icon-btn"><i class="i-con icon-client"></i></a>
            </div>
            <i
                v-if="selected"
                class="fa fa-times"
                aria-hidden="true"
            ></i>
            <ul class="dropdown-menu">
                <li class="dropdown-menu-item">
                    <input
                        class="dropdown-input"
                        placeholder="Search"
                        type="text"
                        v-model="keyword"
                    >
                </li>
                <li
                    class="dropdown-menu-item"
                    v-if="!list"
                >
                    <a class="dropdown-link">
                        <span class="dropdown-link-title">
                            No data!
                        </span>
                    </a>
                </li>
                <li
                    v-else
                    v-for="(item, index) in list"
                    :key="index"
                    class="dropdown-menu-item"
                    @click="selectClient(item)"
                >
                    <a class="dropdown-link">
                        <span class="dropdown-link-title">
                            {{ item.fullname }}
                        </span>
                        <span class="dropdown-link-notifi">
                            {{ item.email }}
                        </span>
                        <span class="dropdown-link-abn">
                            <span class="dropdown-link-abn-title">ABN</span>
                            <span class="dropdown-link-abn-value">{{ item.abn }}</span>
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
            client: null,
            product: null,
            selected: null,
            list: [],
            keyword: '',
            page: 0,
            limit: 5,
            total: 0,
            timeout: null
        };
    },
    watch: {
        'keyword': async function(keyword) {
            if (this.product && this.product.code) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(async () => {
                    this.list = [];
                    this.page = 0;
                    this.total = 0;
                    this.selected = null;

                    await this.getCountClientsByProduct(this.product.code, keyword);
                    await this.getClientsByProduct(this.product.code, this.page, this.limit, keyword);
                }, 1000);
            }
        }
    },
    created() {
        this.reset();
    },
    methods: {
        async open(data) {
            this.reset();
            this.product = data;
            await this.getClientsByProduct(this.product.code, this.page, this.limit);
            await this.getCountClientsByProduct(this.product.code);
        },
        reset() {
            this.selected = null;
            this.list = [];
            this.keyword = '';
            this.page = 0;
            this.limit = 5;
            this.total = 0;
            this.timeout = null;
        },
        async getCountClientsByProduct(productCode, keyword) {
            let {data, error} = await this.$services.userService.getCountClientsByProduct(productCode, keyword);
            if (error)
                return false;
            else
                this.total = data;
        },
        async getClientsByProduct(productCode, page, limit, keyword) {
            let {data, error} = await this.$services.userService.getClientsByProduct(productCode, page + 1, limit, keyword);
            if (error)
                return false;
            else {
                this.page = this.page + 1;
                this.list = this.list.concat(data);
            }
        },
        selectClient(client) {
            this.selected = client;
            this.$emit('change', client);
        }
    }
};
</script>

