<template>
    <div class="filter-box">
        <div class="dropdown search">
            <div
                class="dropdown-toggle"
                data-toggle="dropdown"
            >
                <label class="filter-title">{{title}}</label>
                <input
                    type="text"
                    class="ip-search"
                    :placeholder="placeholder"
                    v-model="keyword"
                    @input="search()"
                >
                <a class="icon-btn"><i class="i-con icon-search"></i></a>
            </div>
            <i
                class="fa fa-times"
                aria-hidden="true"
                @click="reset"
            ></i>
            <ul
                class="dropdown-menu"
                v-show="list.length"
            >
                <li
                    class="dropdown-menu-item"
                    v-for="(item, index) in list"
                    :key="index"
                >
                    <a
                        class="dropdown-link"
                        @click="changeItem(item)"
                    >
                        <span class="dropdown-link-title">
                            {{item.fullName}}
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
            code: null
        };
    },
    props: {
        arrProduct: null,
        title: {
            type: String,
            default: 'Search'
        },
        placeholder: {
            type: String,
            default: 'Search'
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
    methods: {
        reset() {
            this.keyword = null;
        },
        changeItem(client) {
            this.$emit('input', client);
            this.keyword = client.fullName;
        },
        search() {
            this.getClient();
        },
        open(arrProduct) {
            this.code = arrProduct && arrProduct.code;
            this.getClient();
        },
        async getClient(code) {
            let {data, error} = await this.$services.userService.getClients([this.code], [], this.keyword, false, 1, 10);
            if (error)
                return false;

            this.list = data;
        }
    }
};
</script>
