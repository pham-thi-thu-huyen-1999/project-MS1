<template>
    <div class="modal fade box-popup expense" :id="id" role="dialog" data-backdrop="static">
        <loading :isShowLoading="showLoading" />
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body"> 
                    <div class="form-group">
                        <label class="form-label">Select chart of account </label>
                        <div class="box-select-coa">
                            <div class="dropdown-toggle" data-toggle="dropdown">
                                <input class="form-input search-coa" type="text" @keyup="search" v-model="keyword" @click="search(chartAccount.page, chartAccount.limit)"/>
                                <i class="fa fa-search" aria-hidden="true"></i>
                            </div>
                            <ul class="dropdown-menu" >
                                <li  v-if="chartAccount && chartAccount.list && chartAccount.list.length > 0" class="dropdown-menu-link" v-for="(item, index) in chartAccount.list" :key="index" @click.stop="addCoa(item.coa[0], index)">
                                    <span class="dropdown-link-title">{{ item.coa[0].code }} {{ item.coa[0].name }}</span>
                                </li>
                                <li class="dropdown-menu-link" v-if="chartAccount.list.length === 0">
                                    <span class="dropdown-link-title">No Chart Account</span>
                                </li>
                            </ul>
                            <div class="list-coa-select">
                                <h5 class="group-name">Discretionary Expense </h5>
                                <ul class="list-coa" >
                                    <li v-if="groupInfo && groupInfo.coas && groupInfo.coas.length > 0" class="coa-item" v-for="(item, index) in groupInfo.coas" :key="index" >
                                        <span class="coa-id">{{ item.code }}</span><span class="coa-name"> {{ item.name }}</span>
                                        <span class="delete" @click="deleteCoa(item._id, index)">Delete</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 two-btn text-center">
                            <button @click="close" class="form-btn grey">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import Loading from '~/components/Loading';
export default {
    props: ['id'],
    data: () => ({
        groupInfo: null,
        keyword: null,
        timeoutKey: null,
        chartAccount: null,
        showLoading: false,
    }),
    components: {
        Loading,
    },
    created() {
        this.reset();
    },
    methods: {
        reset() {
            this.groupInfo = {};
            this.keyword = '';
            this.chartAccount = {
                list: [],
                page: 0,
                limit: 5
            };
        },
        open(data) {
            $(`#${this.id}`).modal('show');
            this.reset();
            this.groupInfo = data;
        },
        close() {
            $(`#${this.id}`).modal('hide');
        },
        async search() {
            this.showLoading = true;
            this.chartAccount = {
                list: [],
                page: 0,
                limit: 5
            };
            clearTimeout(this.timeoutKey);
            this.timeoutKey = setTimeout(async () => {
                let {data} = await this.$services.groupExpenseService.getChartAccountByProduct(this.chartAccount.page + 1, this.chartAccount.limit, this.keyword);
                this.chartAccount.list = data || [];
                this.showLoading = false;
            }, 800);
        },
        async addCoa(item, index) {
            this.hideItem(index);
            if (!item || !item._id)
                return;

            let coas = [];
            coas.push(item._id);

            let dataCoa = {
                coas: coas
            };

            let {data} = await this.$services.groupExpenseService.addCoA(this.groupInfo._id, dataCoa);
            if (data)
                this.groupInfo.coas.push(item);
        },
        async deleteCoa(coaId, index) {
            if (!coaId)
                return;

            let {data} = await this.$services.groupExpenseService.removeCoa(this.groupInfo._id, coaId);
            if (data) {
                this.groupInfo.coas.splice(index, 1);
                this.$emit('deleteCoaInGroup', this.groupInfo._id, coaId);
            }
        },
        hideItem(index) {
            $(`#${this.id} .dropdown-menu .dropdown-menu-link:nth-child(${index + 1})`).hide();
        }
    }
};
</script>

