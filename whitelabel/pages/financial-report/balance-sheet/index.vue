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
                            <div class="dropdown normal-btn">
                                <a class="btn dropdown-toggle not-arrow" target="_blank" download href="/template.csv">
                                  DOWNLOAD TEMPLATE
                                </a>
                            </div>
                        </div>
                        <div class="col-12 page-filter">
                            <product-lookup v-model="condition.product" :autoSelect="condition.autoSelect" :exclude-codes="[this.$store.state.productCode]"/>  
                            <lookup-client ref="lookupClient" @change="changeClient" :selectOne="true"/>
                            <dropdown-date-one @changeDate="changeDate" :onlyYear="true" :financial="true"></dropdown-date-one>
                            <button class="form-btn btn-filter" @click="getFinancialList()">VIEW</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                    <div class="row">
                        <div class="col-md">
                            <div class="box">
                                <div class="box-item pdr-15" v-if="list.length === 0">
                                    <div class="row row-item">
                                        <div class="col-12 align-self-center">
                                            <div class="no-data text-center">
                                                <img src="~/assets/images/no-data.png" alt="no data">
                                                <p class="text-note">Please select option.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-item pdr-15">
                                    <div class="row row-item" v-for="(item, index) in list" :key="index">
                                        <div class="col-1 align-self-center">
                                            <span class="item-normal">{{ item.name.substring(0, 3) + ' ' + item.year.toString().substring(2,4)}}</span>
                                        </div>
                                        <div class="col-6 align-self-center">
                                            <span class="item-normal">{{'Balance sheet ' + item.name + ' ' +  item.year}}</span>
                                        </div>
                                        <div class="col-5 align-self-center text-right">
                                            <template v-if="item.csv && item.csv.url">
                                                <a class="btn-normal grey" data-toggle="dropdown">DOWNLOAD</a>
                                                <ul class="dropdown-menu" style="max-width: 120px;left: 87px !important;">
                                                    <li><a class="dropdown-menu-link" @click="exportBalanceSheet(item.month, item.year)"> <img alt="" title="" src="~/assets/images/icon-pdf.svg">Download PDF</a></li>
                                                    <li><a class="dropdown-menu-link" :href="item.csv.url | mapUrlGoogleStorage"><img alt="" title="" src="~/assets/images/icon-csv.svg">Download CSV</a></li>
                                                </ul>
                                                <input type="file" @change="updateCSV($event, item._id)" class="hidden input-file" :id="'upload-'+index"/>
                                                <label class="btn-normal grey" :for="'upload-'+index">EDIT</label>
                                            </template>
                                            <template v-else>
                                                 <input type="file" @change="uploadCSV($event, item.month, item.year)" class="hidden input-file" :id="'upload-'+index"/>
                                                <label class="btn-normal grey" :for="'upload-'+index">create balance sheet</label>
                                            </template>
                                            
                                        </div>
                                    </div>
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
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';

export default {
    data: () => ({
        titles: ['Financial Report'],
        condition: {
            product: null,
            manager: null,
            role: RoleCode.ProductAdmin,
        },
        yearSelect: null,
        client: null,
        list: [],
        fileUp: null,
        isUpdate: false,
        params: {id: '', month: '', year: ''}
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
        },
        changeDate(data) {
            this.yearSelect = data;
            console.log('year', data);
        },
        async getFinancialList() {
            if (!this.client || !this.yearSelect) {
                this.$notify({
                    group: 'error',
                    title: 'Failed',
                    text: 'Please select full option'
                });
                return false;
            }

            if (this.yearSelect && this.yearSelect.year) {
                let list = [];
                list[0] = {name: 'July', month: 7, year: this.yearSelect.year};
                list[1] = {name: 'August', month: 8, year: this.yearSelect.year};
                list[2] = {name: 'September', month: 9, year: this.yearSelect.year};
                list[3] = {name: 'October', month: 10, year: this.yearSelect.year};
                list[4] = {name: 'November', month: 11, year: this.yearSelect.year};
                list[5] = {name: 'December', month: 12, year: this.yearSelect.year};
                list[6] = {name: 'January', month: 1, year: this.yearSelect.year + 1};
                list[7] = {name: 'February', month: 2, year: this.yearSelect.year + 1};
                list[8] = {name: 'March', month: 3, year: this.yearSelect.year + 1};
                list[9] = {name: 'April', month: 4, year: this.yearSelect.year + 1};
                list[10] = {name: 'May', month: 5, year: this.yearSelect.year + 1};
                list[11] = {name: 'June', month: 6, year: this.yearSelect.year + 1};
                this.list = list;
            }
            let {data, error} = await this.$services.reportService.getFinancialList(this.client && this.client._id, this.yearSelect.year);

            if (data) {
                data.forEach(item => {
                    let temp = this.list.findIndex(item1 => item1.month === item.month && item1.year === item.year);
                    this.list[temp] = {...this.list[temp], ...item};
                });
                this.$forceUpdate();
            }
            if (error)
                console.log(error);
        },
        async loadHandler(event) {
            var csv = event.target.result;
            this.fileUp = '';

            this.fileUp = csv.trim().replace(/[\r\n]+/g, '\n');
            this.fileUp = this.fileUp.replace(/"/g, '');
            this.fileUp = this.fileUp.replace(/'/g, '');
            // this.fileUp = this.fileUp.split(/\r\n|\n/);

            let formData = new FormData();

            let blob = new Blob([this.fileUp], {type: 'text/csv'});
            formData.append('csv', blob);

            let result;

            if (!this.isUpdate)
                result = await this.$services.reportService.uploadTemplateFinancial(this.client && this.client._id, this.params.month, this.params.year, formData);
            else result = await this.$services.reportService.updateTemplateFinancial(this.params.id, formData);

            if (result.data) {
                $('.input-file').val(null);
                this.$notify({
                    group: 'success',
                    title: 'Completed',
                    text: 'Thank you'
                });
                this.getFinancialList();
                console.log('1', result.data);
            }
            if (result.error)
                this.$notify({
                    group: 'error',
                    title: 'Failed',
                    text: result.error.message
                });
        },
        async uploadCSV(event, month, year) {
            let file = event.target ? event.target.files[0] : event[0];

            let reader = new FileReader();
            // Read file into memory as UTF-8
            reader.readAsText(file);
            // Handle errors load
            this.params.month = month;
            this.params.year = year;
            this.isUpdate = false;
            reader.onload = this.loadHandler;
        },
        async updateCSV(event, id) {
            let file = event.target ? event.target.files[0] : event[0];
            let reader = new FileReader();
            // Read file into memory as UTF-8
            reader.readAsText(file);
            // Handle errors load
            this.params.id = id;
            this.isUpdate = true;
            reader.onload = this.loadHandler;
        },
        async exportBalanceSheet(month, year) {
            let {data, error} = await this.$services.reportService.exportBalanceSheet(this.client && this.client._id, month, year);
            if (data) window.location = data;
            if (error)
                this.$notify({
                    group: 'error',
                    title: 'Update failed',
                    text: error.message
                });
        }
    },
    filters: {
        mapUrlGoogleStorage(url) {
            return mapUrlGoogleStorage(url);
        }
    }
};
</script>
