<template>
    <div>
        <vertical-menu/>
        <section class="financial-template">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <page-title :titles="titles"/>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                          
                        </div>
                        <div class="col-12 page-filter">
                            <product-lookup v-model="condition.product" :autoSelect="condition.autoSelect" :exclude-codes="[this.$store.state.productCode]"/>  
                            <lookup-client ref="lookupClient" @change="changeClient" :selectOne="true"/>
                            <dropdown-date-one @changeDate="changeDate" :onlyYear="true" :financial="true"></dropdown-date-one>
                            <button class="form-btn btn-filter" @click="getUsageBudget()">VIEW</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                    <div class="row">
                        <div class="col-md">
                            <div class="box">
                                <div class="box-item pdr-15 mt-0 pt-0" v-if="listCoaDefault.length === 0">
                                    <div class="row row-item">
                                        <div class="col-12 align-self-center">
                                            <div class="no-data text-center">
                                                <img src="~/assets/images/no-data.png" alt="no data">
                                                <p class="text-note">Please select option.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-item pdr-15 mt-0 pt-0">
                                    <div class="row row-item" v-for="(item, index) in listCoaDefault" :key="index">
                                        <div class="col-2 align-self-center width-100">
                                            <span class="item-normal">{{item.code}}</span>
                                        </div>
                                        <div class="col-md align-self-center">
                                            <span class="item-normal">{{item.name}}</span>
                                        </div>
                                        <div class="col-2 align-self-center text-right">
                                            <input type="number" min="0" max="100" v-model="item.percentUsage" class="input-enter"/><span></span>
                                        </div>
                                    </div>
                                    <div class="row row-item" v-if="listCoaDefault.length !== 0">
                                        <div class="col-md">
                                             <button class="btn min-140 bolder mr-15" @click="save()">SAVE</button>
                                             <nuxt-link to="/financial-report/balance-sheet" class="btn min-140 bolder bg-grey">CANCEL</nuxt-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-auto">
                            <div class="box-history-logs box-right">
                                <h3 class="section-title">PRIVATE USAGE</h3>
                                <div class="dropdown btn-input mt-20">
                                    <button class="dropdown-toggle form-input text-left tranparent" data-toggle="dropdown" :disabled="privateSelect && privateSelect.entityName"> {{privateSelect && privateSelect.name ? privateSelect.name : 'Select'}}
                                        <i class="fa fa-angle-up" aria-hidden="true"></i>
                                        <i class="fa fa-angle-down" aria-hidden="true"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li v-for="(item, index) in listPrivate" @click="selectPrivate(item)" :key="index" class="dropdown-menu-link">
                                            {{item.name}}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import LookupClient from '~/components/Report/LookupClientAll';
import VerticalMenu from '~/components/Report/VerticalMenu';
import ProductLookup from '~/components/product/ProductLookup';
import DropdownDateOne from '~/components/Report/DropdownDateOneCus';
import PageTitle from '~/components/PageTitle';
import {RoleCode} from '~/common/commonType';

export default {
    data: () => ({
        titles: ['Financial Report / Usage Budget'],
        condition: {
            product: null,
            manager: null,
            role: RoleCode.ProductAdmin,
        },
        yearSelect: null,
        client: null,
        list: [],
        listCoaDefault: [],
        listCoaExist: [],
        listPrivate: [
            {name: 'Partnership Loan', type: 1},
            {name: 'Director Loan', type: 2},
            {name: "Owner's Drawing", type: 3},
        ],
        privateSelect: {},
        dataCreate: {},
        dataUpdate: []
    }),
    components: {
        LookupClient,
        ProductLookup,
        DropdownDateOne,
        PageTitle,
        VerticalMenu
    },
    async created() {

    },
    watch: {
        'condition.product': {
            async handler(product) {
                if (product) {
                    let data = {
                        product: this.condition.product,
                    };
                    await this.$refs.lookupClient.open(data);
                }
            },
            deep: true
        },
    },
    methods: {
        changeClient(clients) {
            this.client = clients && clients.length && clients[0];
            // this.getFinancialList();
        },
        changeDate(data) {
            this.yearSelect = data;
            // this.getFinancialList();
        },
        changePage(page) {
            this.page = page;
        },
        async getCoaUsageBudget() {
            let {data, error} = await this.$services.usageBudgetService.getCoaUsageBudget();
            if (error)
                console.log('error', error);
            if (data)
                this.listCoaDefault = data;
        },
        async getCoaByBeginYear() {
            let {data, error} = await this.$services.usageBudgetService.getByBeginYear(this.client && this.client._id, this.yearSelect.year);
            if (error)
                console.log('error', error);
            if (data)
                this.listCoaExist = data;
        },
        async getUsageBudget() {
            if (!this.client || !this.client._id || !this.yearSelect || !this.yearSelect.year) {
                this.$notify({
                    group: 'error',
                    title: 'Get failed',
                    text: 'Please select option.'
                });
                return false;
            }

            await this.getCoaUsageBudget();
            await this.getCoaByBeginYear();
            await this.getUserBusinessInfo();

            this.listCoaExist.forEach(item => {
                let temp = this.listCoaDefault.findIndex(item1 => item1._id === item.coaId._id);
                this.listCoaDefault[temp] = {...this.listCoaDefault[temp], ...item};
            });
            this.$forceUpdate();
        },
        async getUserBusinessInfo() {
            let {data, error} = await this.$services.userService.getUserBusinessInfo(this.client && this.client._id);
            if (error)
                console.log('error', error);
            if (data) {
                this.privateSelect = this.listPrivate.find(item => item.type === data.type);
                if (this.privateSelect)
                    this.privateSelect.entityName = data && data.entityName;
            }
        },
        async createUsageBudget() {
            let result = await this.$services.usageBudgetService.createUsageBudget(this.dataCreate);
            if (result.error)
                console.log('error', result.error);
            if (result.data)
                this.$notify({
                    group: 'success',
                    title: 'Update success',
                    text: 'Thank you'
                });
        },
        async updateUsageBudget() {
            let result = await this.$services.usageBudgetService.updateUsageBudget(this.dataUpdate);
            if (result.error)
                console.log('error', result.error);
            if (result.data)
                this.$notify({
                    group: 'success',
                    title: 'Update success',
                    text: 'Thank you'
                });
        },
        async selectPrivate(item) {
            let data = {};
            data.userId = this.client && this.client._id;
            data.type = item.type;
            console.log('data', data);
            this.privateSelect = item;
            let result = await this.$services.userService.changePrivate(data);
            if (result.error)
                console.log('err', result.error);
            if (result.data)
                this.$notify({
                    group: 'success',
                    title: 'Change success',
                    text: 'Thank you'
                });
        },
        save() {
            // Create
            this.dataCreate = {};
            this.dataCreate.userId = this.client && this.client._id;
            this.dataCreate.beginYear = this.yearSelect && this.yearSelect.year;
            this.dataCreate.coas = [];

            this.listCoaDefault.find(item => {
                if (item.percentUsage && !item.coaId)
                    this.dataCreate.coas.push(item);
            });

            // Update
            this.dataUpdate = [];
            this.listCoaDefault.find(item => {
                if (item.coaId)
                    this.dataUpdate.push(item);
            });

            if (!this.dataCreate.coas.length && !this.dataUpdate.length) {
                this.$notify({
                    group: 'error',
                    title: 'Update failed',
                    text: 'Data not change'
                });
                return false;
            }

            // Action
            if (this.dataCreate.coas.length)
                this.createUsageBudget();

            if (this.dataUpdate.length)
                this.updateUsageBudget();

            this.getUsageBudget();
        }
    },
};
</script>
