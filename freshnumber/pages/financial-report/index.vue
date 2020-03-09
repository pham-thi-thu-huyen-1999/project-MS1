<template>
    <section class="table-report">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles"/>
                    </div>
                    <div class="col-12 page-filter">
                        <product-lookup v-model="condition.product" :claims="extendClaims" :autoSelect="condition.autoSelect" :exclude-codes="[this.$store.state.productCode]"/>  
                        <dropdown-date @changeDate="changeDate"></dropdown-date>
                        <lookup-client ref="lookupClient" @change="changeClient" :selectOne="true"/>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="box-report text-center">
                    <button class="btn mr-15 min-180" @click="exportFinancial(1)" :disabled="!beginDate.month || !beginDate.year || !client">Export Balance Sheet</button>
                    <button class="btn mr-15 min-180" @click="exportFinancial(2)" :disabled="!beginDate.month || !beginDate.year || !client">Export Profit & Loss</button>
                    <button class="btn mr-15 min-180" @click="exportFinancial(3)" :disabled="!beginDate.month || !beginDate.year || !client">Export Trial Balance</button>
                    <button class="btn mr-15 min-180" @click="exportFinancial(4)" :disabled="!beginDate.month || !beginDate.year || !client">Export GST</button>
                    <button class="btn mr-15 min-180" @click="exportFinancial(5)" :disabled="!beginDate.month || !beginDate.year || !client">Export GST Detail</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import LookupClient from '~/components/Report/LookupClient';
import ProductLookup from '~/components/product/ProductLookup';
import DropdownDate from '~/components/Report/DropdownDate';
import PageTitle from '~/components/PageTitle';
import {RoleCode} from '~/common/commonType';

export default {
    data() {
        return {
            titles: ['Financial Report'],
            condition: {
                product: null,
                manager: null,
                role: RoleCode.ProductAdmin,
            },
            beginDate: {
                month: null,
                year: null
            },
            endDate: {
                month: null,
                year: null
            },
            extendClaims: [this.$module.REPORT.claim.GET.code],
            client: null,
        };
    },
    components: {
        LookupClient,
        ProductLookup,
        DropdownDate,
        PageTitle,
    },
    watch: {
        'condition.product': {
            async handler(product) {
                if (product)
                    await this.getManagers();
            },
            deep: true
        },
        'condition.manager': {
            async handler(value) {
                let data = {
                    product: this.condition.product,
                    manager: this.$store.state.userAuth
                };
                await this.$refs.lookupClient.open(data);
            }
        }
    },
    methods: {
        async getManagers() {
            let productCodes = this.condition.product ? [this.condition.product.code] : [];
            let roleCodes = this.condition.role ? [this.condition.role] : [];
            this.list = [];
            let {data, error} = await this.$services.userService.getManagers(productCodes, roleCodes, '', false, 1, 10);
            if (error)
                return false;
            if (data && data.length)
                this.list = data;

            this.condition.manager = this.list[0];
        },
        changeClient(clients) {
            this.client = clients && clients.length && clients[0];
        },
        changeDate(data) {
            if (data.startMonth.month) {
                this.beginDate.month = data.startMonth.month;
                if (data.startMonth.month >= data.configMonth)
                    this.beginDate.year = data.financial.begin;
                else
                    this.beginDate.year = data.financial.end;
            }
            if (data.endMonth.month) {
                this.endDate.month = data.endMonth.month;
                if (data.endMonth.month >= data.configMonth)
                    this.endDate.year = data.financial.begin;
                else
                    this.endDate.year = data.financial.end;
            }
        },
        async exportFinancial(type) {
            let result = await this.$services.reportService.exportFinancial(type, this.client._id, this.beginDate.month, this.beginDate.year, this.endDate.month, this.endDate.year);
            if (result.data)
                window.location = result.data;
        }
    }
};
</script>

