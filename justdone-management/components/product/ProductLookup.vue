<template>
    <div class="filter-box">
        <div class="dropdown normal">
            <div
                class="dropdown-toggle"
                data-toggle="dropdown"
            >
                <label class="filter-title">{{label}}</label>
                <span class="filter-value">{{ selected ? selected.name : 'Select product' }}</span>
                <a class="icon-btn"><i class="i-con icon-arr-topbot"></i></a>
            </div>
            <i
                class="fa fa-times"
                aria-hidden="true"
                @click="reset"
            ></i>
            <ul class="dropdown-menu">
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
            default: 'Product'
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
    data() {
        return {
            list: [],
            selected: null
        };
    },
    async created() {
        await this.getlookup();
        this.reset();

        if (this.queryCode)
            this.selected = this.list.find(item => item.code.toString() === this.queryCode);
        this.$emit('input', this.selected);
    },
    methods: {
        reset() {
            if (this.isSelectAll) {
                this.selected = {
                    name: 'All'
                };
                this.$emit('input', this.list);
            }
            else if (this.autoSelect && this.list.length) {
                this.selected = this.list[0];
                this.$emit('input', this.list[0]);
            }
            else {
                this.selected = null;
                this.$emit('input', this.selected);
            }
        },
        changeItem(product) {
            this.$emit('input', product);
            this.selected = product;
        },
        async getlookup() {
            let {data, error} = await this.$services.productService.lookup(this.productCodes, this.claims);
            if (error)
                return false;
            else
                this.list = data || [];

            if (this.excludeCodes && this.excludeCodes.length)
                this.list = this.list.filter(item => !this.excludeCodes.includes(item.code));
        }
    }
};
</script>

