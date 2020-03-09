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
                            <dropdown-date @changeDate="changeDate"></dropdown-date>
                            <button @click="getList" class="form-btn btn-filter">VIEW</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                    <div class="row">
                        <div class="col-md">
                            <div class="box">
                                <div class="box-item pdr-15" v-if="!list.monthlyReport && !list.quarterReport && !list.finalYearReport">
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
                                    <template v-if="list.monthlyReport && list.monthlyReport.length">
                                        <div class="row"><label class="title-section">MONTHLY</label></div>
                                        <div class="row row-item" v-for="(item, index) in list.monthlyReport" :key="index">
                                            <div class="col-2 align-self-center width-120">
                                                <span class="item-normal">{{ item.monthName.substring(0, 3)}} {{ item.year.toString().substring(2,4)}}</span>
                                            </div>
                                            <div class="col-3 align-self-center">
                                                <span class="item-normal">GST {{ item.monthName }} {{ item.year }}</span>
                                            </div>
                                            <div class="col align-self-center text-right">
                                                <span class="item-normal uppercase grey" v-if="!item.status"> <img style="margin-top: -2px;" src="/images/crunch-icon.svg"/> Cruncher not yet completed </span>
                                            </div>
                                            <div class="col-4 align-self-center text-right">
                                                <div class="btn-group">
                                                    <button :disabled="!item.status" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn-normal grey">download gst summary</button>                     
                                                    <ul class="dropdown-menu" style="max-width: 120px;left: 87px !important;">
                                                        <li @click="exportGst(financial.GST, item)"><a class="dropdown-menu-link"> <img alt="" title="" src="~/assets/images/icon-pdf.svg" >Export as PDF</a></li>
                                                        <li @click="exportGst(financial.GST, item, true)"><a class="dropdown-menu-link"><img alt="" title="" src="~/assets/images/icon-csv.svg">Export as CSV</a></li>
                                                    </ul>
                                                </div>
                                                <div class="btn-group">
                                                    <button :disabled="!item.status" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn-normal grey">download gst detail</button>
                                                    <ul class="dropdown-menu" style="max-width: 120px;left: 87px !important;">
                                                        <li  @click="exportGst(financial.GSTDetail, item)"><a class="dropdown-menu-link"> <img alt="" title="" src="~/assets/images/icon-pdf.svg">Export as PDF</a></li>
                                                        <li  @click="exportGst(financial.GSTDetail, item, true)"><a class="dropdown-menu-link"><img alt="" title="" src="~/assets/images/icon-csv.svg">Export as CSV</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="list.quarterReport && list.quarterReport.length">
                                        <div class="row mt-20"><label class="title-section">QUARTER</label></div>
                                        <div class="row row-item" v-for="(item, index) in list.quarterReport" :key="index + '-s'">
                                            <div class="col-2 align-self-center width-120">
                                                <span class="item-normal">{{ item.startMonthName.substring(0, 3)}} {{ item.startYear.toString().substring(2,4)}} - {{ item.endMonthName.substring(0, 3)}} {{ item.endYear.toString().substring(2,4)}}</span>
                                            </div>
                                            <div class="col-3 align-self-center">
                                                <span class="item-normal">GST {{ item.startMonthName }} {{ item.startYear }} to {{ item.endMonthName }} {{ item.endYear }}</span>
                                            </div>
                                            <div class="col align-self-center text-right">
                                                <span class="item-normal uppercase grey" v-if="!item.status"> <img style="margin-top: -2px;" src="/images/crunch-icon.svg"/> Cruncher not yet completed </span>
                                            </div>
                                            <div class="col-4 align-self-center text-right">
                                                <div class="btn-group">
                                                    <button :disabled="!item.status" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn-normal grey">download gst summary</button>                     
                                                    <ul class="dropdown-menu" style="max-width: 120px;left: 87px !important;">
                                                        <li @click="exportGst(financial.GST, item)"><a class="dropdown-menu-link"> <img alt="" title="" src="~/assets/images/icon-pdf.svg" >Export as PDF</a></li>
                                                        <li @click="exportGst(financial.GST, item, true)"><a class="dropdown-menu-link"><img alt="" title="" src="~/assets/images/icon-csv.svg">Export as CSV</a></li>
                                                    </ul>
                                                </div>
                                                <div class="btn-group">
                                                    <button :disabled="!item.status" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn-normal grey">download gst detail</button>
                                                    <ul class="dropdown-menu" style="max-width: 120px;left: 87px !important;">
                                                        <li  @click="exportGst(financial.GSTDetail, item)"><a class="dropdown-menu-link"> <img alt="" title="" src="~/assets/images/icon-pdf.svg">Export as PDF</a></li>
                                                        <li  @click="exportGst(financial.GSTDetail, item, true)"><a class="dropdown-menu-link"><img alt="" title="" src="~/assets/images/icon-csv.svg">Export as CSV</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="list.finalYearReport && list.finalYearReport.beginYear">
                                        <div class="row mt-20"><label class="title-section">YEAR TO DATE</label></div>
                                            <div class="row row-item">
                                                <div class="col-2 align-self-center width-120">
                                                    <span class="item-normal">{{ beginDate.monthName && beginDate.monthName.substring(0, 3)}} {{ list.finalYearReport && list.finalYearReport.beginYear && list.finalYearReport.beginYear.toString().substring(2,4)}} - {{ endDate.monthName && endDate.monthName.substring(0, 3)}} {{ list.finalYearReport && list.finalYearReport.beginYear && list.finalYearReport.endYear.toString().substring(2,4)}}</span>
                                                </div>
                                                <div class="col-3 align-self-center">
                                                    <span class="item-normal">GST {{ beginDate.monthName }} {{ list.finalYearReport && list.finalYearReport.beginYear }} to {{ endDate.monthName }} {{ list.finalYearReport && list.finalYearReport.endYear }}</span>
                                                </div>
                                                <div class="col align-self-center text-right">
                                                    <span class="item-normal uppercase grey" v-if="!list.finalYearReport || !list.finalYearReport.status"> <img style="margin-top: -2px;" src="/images/crunch-icon.svg"/> Cruncher not yet completed </span>
                                                </div>
                                                <div class="col-4 align-self-center text-right">
                                                    <div class="btn-group">
                                                        <button :disabled="!list.finalYearReport || !list.finalYearReport.status" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn-normal grey">download gst summary</button>                     
                                                        <ul class="dropdown-menu" style="max-width: 120px;left: 87px !important;">
                                                            <li @click="exportGst(financial.GST, {})"><a class="dropdown-menu-link"> <img alt="" title="" src="~/assets/images/icon-pdf.svg" >Export as PDF</a></li>
                                                            <li @click="exportGst(financial.GST, {}, true)"><a class="dropdown-menu-link"><img alt="" title="" src="~/assets/images/icon-csv.svg">Export as CSV</a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="btn-group">
                                                        <button :disabled="!list.finalYearReport || !list.finalYearReport.status" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn-normal grey">download gst detail</button>
                                                        <ul class="dropdown-menu" style="max-width: 120px;left: 87px !important;">
                                                            <li @click="exportGst(financial.GSTDetail, {})"><a class="dropdown-menu-link"> <img alt="" title="" src="~/assets/images/icon-pdf.svg">Export as PDF</a></li>
                                                            <li  @click="exportGst(financial.GSTDetail, {}, true)"><a class="dropdown-menu-link"><img alt="" title="" src="~/assets/images/icon-csv.svg">Export as CSV</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                    </template>
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
import DropdownDate from '~/components/Report/DropdownDate';
import PageTitle from '~/components/PageTitle';
import {RoleCode, Financial} from '~/common/commonType';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import {convertMonthToWord} from '~/helpers/dateHelper';

export default {
    data: () => ({
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
        client: null,
        list: {},
        financial: null
    }),
    components: {
        LookupClient,
        ProductLookup,
        DropdownDate,
        PageTitle,
        VerticalMenu
    },
    async created() {
        this.financial = Financial;
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
            if (data.startMonth.month) {
                this.beginDate.month = data.startMonth.month;
                this.beginDate.monthName = convertMonthToWord(data.startMonth.month);
                if (data.startMonth.month >= data.configMonth)
                    this.beginDate.year = data.financial.begin;
                else
                    this.beginDate.year = data.financial.end;
            }
            if (data.endMonth.month) {
                this.endDate.month = data.endMonth.month;
                this.endDate.monthName = convertMonthToWord(data.endMonth.month);
                if (data.endMonth.month >= data.configMonth)
                    this.endDate.year = data.financial.begin;
                else
                    this.endDate.year = data.financial.end;
            }
        },
        async getList() {
            if (!this.client || !this.beginDate.year || !this.endDate.year) {
                this.$notify({
                    group: 'error',
                    title: 'Failed',
                    text: 'Please select full option'
                });
                return false;
            }
            let {data, error} = await this.$services.reportService.getList(this.client._id, this.beginDate, this.endDate);
            if (error)
                console.log('err', error);
            if (data) {
                this.list = data;
                this.list.monthlyReport.map(item => {
                    item.monthName = convertMonthToWord(item.month);
                });
                this.list.quarterReport.map(item => {
                    item.startMonthName = convertMonthToWord(item.startMonth);
                    item.endMonthName = convertMonthToWord(item.endMonth);
                });
            }
        },
        async exportGst(type, date, isCsv = false) {
            let beginMonth = date.month ? date.month : date.startMonth ? date.startMonth : this.beginDate.month;
            let beginYear = date.year ? date.year : date.startYear ? date.startYear : this.beginDate.year;
            let endMonth = date.month ? date.month : date.endMonth ? date.endMonth : this.endDate.month;
            let endYear = date.year ? date.year : date.endYear ? date.endYear : this.endDate.year;

            let result;
            if (isCsv)
                result = await this.$services.reportService.exportFinancialCSV(type, this.client._id, beginMonth, beginYear, endMonth, endYear);
            else result = await this.$services.reportService.exportFinancial(type, this.client._id, beginMonth, beginYear, endMonth, endYear);

            if (result.error)
                console.log('err', result.error);
            if (result.data)
                window.location = result.data;
        }
    },
    filters: {
        mapUrlGoogleStorage(url) {
            return mapUrlGoogleStorage(url);
        },
        convertMonthToWord(month) {
            return convertMonthToWord(month);
        }
    }
};
</script>
