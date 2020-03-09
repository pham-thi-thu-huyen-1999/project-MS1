<template>
    <div class="filter-box">
        <div class="dropdown">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">Type</label>
                <span class="filter-value">{{ typeSelected.length }} Type</span>
                <a class="icon-btn"><i class="i-con icon-bank"></i></a>
            </div>
            <i class="fa fa-times" aria-hidden="true" @click="clearSelection()"></i>
            <ul class="dropdown-menu scroll">
                <li class="dropdown-menu-item" v-for="(item, index) in labels" :key="index" @click.stop="resolve(item)">
                    <a class="dropdown-link not-point">
                        <span class="dropdown-link-title">
                            <input :id="`type-${item.code}`" type="checkbox" /> 
                            <label class="label-check">{{ item.name }}</label>
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
            labels: [{code: 1, name: 'Monthly Amount'},
                {code: 2, name: 'Monthly Percentage'},
                {code: 3, name: 'YTD Amount'},
                {code: 4, name: 'YTD Percentage'},
                {code: 5, name: 'Budget for the Year'},
                {code: 6, name: 'Budget Percentage'},
                {code: 7, name: 'Variance'}],
            typeSelected: [],
        };
    },
    props: {

    },
    components: {

    },
    mounted() {
        this.checkAll();
    },
    methods: {
        checkAll() {
            this.labels.forEach(item => {
                this.typeSelected.push(item);
                document.querySelector(`#type-` + item.code).checked = true;
                this.$emit('changeType', this.typeSelected);
            });
        },
        resolve(type) {
            let position;
            for (let i = 0; i < this.typeSelected.length; i++) {
                if (type.code === this.typeSelected[i].code) {
                    position = i;
                    this.typeSelected.splice(i, 1);
                    document.querySelector(`#type-${type.code}`).checked = false;
                }
            }

            if (typeof (position) !== 'number' || position < 0) {
                this.typeSelected.push(type);
                document.querySelector(`#type-${type.code}`).checked = true;
            }

            this.$emit('changeType', this.typeSelected);
        },
        clearSelection() {
            for (let i = 0; i < this.typeSelected.length; i++) {
                document.querySelector(`#type-${this.typeSelected[i].code}`).checked = false;
            }
            this.typeSelected = [];
            this.$emit('changeType', this.typeSelected);
        }
    }
};
</script>

