<template>
    <div class="filter-box">
        <div class="dropdown normal">
            <div
                class="dropdown-toggle"
                data-toggle="dropdown"
            >
                <label class="filter-title">{{label}}</label>
                <span class="filter-value">{{ selected ? selected.name : 'None' }}</span>
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
            default: 'File types'
        },
        list: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            selected: null
        };
    },
    methods: {
        changeItem(item) {
            this.selected = item;
            this.$emit('select', item);
        },
        reset() {
            this.selected = null;
            this.$emit('select', '');
        }
    }
};
</script>

