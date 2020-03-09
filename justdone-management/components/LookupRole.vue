<template>
    <div class="filter-box">
        <div class="dropdown normal">
            <div
                class="dropdown-toggle"
                data-toggle="dropdown"
            >
                <label class="filter-title">Role</label>
                <span class="filter-value">{{ selected ? selected.name : 'Select role' }}</span>
                <a class="icon-btn"><i class="i-con icon-arr-topbot"></i></a>
            </div>
            <i
                class="fa fa-times"
                aria-hidden="true"
                v-if="selected"
                @click="clearSelection()"
            ></i>
            <ul class="dropdown-menu">
                <li
                    class="dropdown-menu-item"
                    v-if="list.length < 1"
                >
                    <a class="dropdown-link">
                        <span class="dropdown-link-title">
                            No item
                        </span>
                    </a>
                </li>
                <li
                    class="dropdown-menu-item"
                    v-else
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
import {RoleCode} from '~/common/commonType';

export default {
    props: {
        product: null,
        queryCode: {
            type: String
        },
        isSelectAll: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            list: [],
            selected: null
        };
    },
    created() {
        this.reset();
    },
    watch: {
        product(value) {
            this.reset();
        }
    },
    methods: {
        changeItem(role) {
            this.$emit('input', role);
            this.selected = role;
        },
        async reset() {
            this.list = [];
            this.selected = null;

            await this.getRoles(this.product && this.product.code);
            if (this.queryCode)
                this.selected = this.list.find(item => item.code.toString() === this.queryCode);
            this.$emit('input', this.selected);
        },
        clearSelection() {
            this.selected = null;
            this.$emit('input', this.selected);
        },
        async getRoles(productCode) {
            if (!productCode && !this.isSelectAll) {
                this.list = [];
                return;
            }
            let {data, error} = await this.$services.roleService.getRoles(productCode);
            if (error)
                return false;
            if (data && data.length > 0) {
                if (productCode !== this.$store.state.productCode) {
                    data.forEach((item, index) => {
                        if (item.code === RoleCode.Client)
                            data.splice(index, 1);
                    });
                }
                this.list = data;
            }
        }
    }
};
</script>

