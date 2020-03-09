<template>
    <div class="filter-box">
        <div class="dropdown normal">
            <div
                class="dropdown-toggle"
                data-toggle="dropdown"
            >
                <label class="filter-title">Case Manager</label>
                <span class="filter-value">{{selected}}</span>
                <a class="icon-btn"><i class="i-con icon-arr-topbot"></i></a>
            </div>
            <i
                class="fa fa-times"
                aria-hidden="true"
                @click="reset()"
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
                            {{item.fullName}}
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
    data() {
        return {
            list: [],
            selected: 'None'
        };
    },
    created() {
        this.getManagers();
    },
    methods: {
        reset() {
            this.selected = 'none';
            this.$emit('input', '');
        },
        changeItem(manager) {
            this.$emit('input', manager);
            this.selected = manager.fullName;
        },
        async getManagers() {
            let {data, error} = await this.$services.userService.getManagers([this.$store.state.productCode], [RoleCode.CaseManager], '', false, '', '');
            if (error)
                return false;
            this.list = data || [];
        }
    }
};
</script>

