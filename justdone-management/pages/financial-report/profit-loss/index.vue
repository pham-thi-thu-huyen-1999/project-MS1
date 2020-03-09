<template>
    <div>
        <vertical-menu @view="handlerView" />
        <section class="financial-template">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                    <div class="row">
                        <div class="col-md">
                            <div class="box">
                                <div
                                    class="box-item pdr-15"
                                    v-if="!list.monthlyReport && !list.quarterReport && !list.finalYearReport"
                                >
                                    <div class="row row-item">
                                        <div class="col-12 align-self-center">
                                            <div class="no-data text-center">
                                                <img
                                                    src="~/assets/images/no-data.png"
                                                    alt="no data"
                                                >
                                                <p class="text-note">Please select option.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-item pdr-15">
                                    <template v-if="list.monthlyReport && list.monthlyReport.length">
                                        <div class="row"><label class="title-section">MONTHLY</label></div>
                                        <div
                                            class="row row-item"
                                            v-for="(item, index) in list.monthlyReport"
                                            :key="index"
                                        >
                                            <div class="col-2 align-self-center width-120">
                                                <span class="item-normal">{{ item.monthName.substring(0, 3)}} {{ item.year.toString().substring(2,4)}}</span>
                                            </div>
                                            <div class="col-3 align-self-center">
                                                <span class="item-normal">Profit & Loss {{ item.monthName }} {{ item.year }}</span>
                                            </div>
                                            <div class="col align-self-center text-right">
                                                <span
                                                    class="item-normal uppercase grey"
                                                    v-if="!item.status"
                                                > <img
                                                        style="margin-top: -2px;"
                                                        src="/images/crunch-icon.svg"
                                                    /> Cruncher not yet completed </span>
                                            </div>
                                            <div class="col-4 align-self-center text-right">
                                                <div class="btn-group">
                                                    <button
                                                        @click="previewFinancial(financial.ProfitLoss, item)"
                                                        :disabled="!item.status"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                        class="btn-normal grey"
                                                    >preview</button>
                                                    <button
                                                        :disabled="!item.status"
                                                        data-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                        class="btn-normal grey"
                                                    >download</button>
                                                    <ul
                                                        class="dropdown-menu"
                                                        style="max-width: 120px;left: 87px !important;"
                                                    >
                                                        <li @click="exportFile(financial.ProfitLoss, item)"><a class="dropdown-menu-link"> <img
                                                                    alt=""
                                                                    title=""
                                                                    src="~/assets/images/icon-pdf.svg"
                                                                >Export as PDF</a></li>
                                                        <li @click="exportFile(financial.ProfitLoss, item, true)"><a class="dropdown-menu-link"><img
                                                                    alt=""
                                                                    title=""
                                                                    src="~/assets/images/icon-csv.svg"
                                                                >Export as CSV</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="list.quarterReport && list.quarterReport.length">
                                        <div class="row mt-20"><label class="title-section">QUARTER</label></div>
                                        <div
                                            class="row row-item"
                                            v-for="(item, index) in list.quarterReport"
                                            :key="index + '-s'"
                                        >
                                            <div class="col-2 align-self-center width-120">
                                                <span class="item-normal">{{ item.startMonthName.substring(0, 3)}} {{ item.startYear.toString().substring(2,4)}} - {{ item.endMonthName.substring(0, 3)}} {{ item.endYear.toString().substring(2,4)}}</span>
                                            </div>
                                            <div class="col-3 align-self-center">
                                                <span class="item-normal">Profit & Loss {{ item.startMonthName }} {{ item.startYear }} to {{ item.endMonthName }} {{ item.endYear }}</span>
                                            </div>
                                            <div class="col align-self-center text-right">
                                                <span
                                                    class="item-normal uppercase grey"
                                                    v-if="!item.status"
                                                > <img
                                                        style="margin-top: -2px;"
                                                        src="/images/crunch-icon.svg"
                                                    /> Cruncher not yet completed </span>
                                            </div>
                                            <div class="col-4 align-self-center text-right">    
                                                <div class="btn-group">
                                                    <button
                                                        :disabled="!item.status"
                                                        @click="previewFinancial(financial.ProfitLoss, item)"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                        class="btn-normal grey"
                                                    >preview</button>
                                                    <button
                                                        :disabled="!item.status"
                                                        data-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                        class="btn-normal grey"
                                                    >download</button>
                                                    <ul
                                                        class="dropdown-menu"
                                                        style="max-width: 120px;left: 87px !important;"
                                                    >
                                                        <li @click="exportFile(financial.ProfitLoss, item)"><a class="dropdown-menu-link"> <img
                                                                    alt=""
                                                                    title=""
                                                                    src="~/assets/images/icon-pdf.svg"
                                                                >Export as PDF</a></li>
                                                        <li @click="exportFile(financial.ProfitLoss, item, true)"><a class="dropdown-menu-link"><img
                                                                    alt=""
                                                                    title=""
                                                                    src="~/assets/images/icon-csv.svg"
                                                                >Export as CSV</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="list.finalYearReport && list.finalYearReport.beginYear">
                                        <div class="row mt-20"><label class="title-section">FINANCIAL YEAR</label></div>
                                        <div 
                                            class="row row-item"
                                        >
                                            <div class="col-2 align-self-center width-120">
                                                <span 
                                                    class="item-normal"
                                                >
                                                {{ yearSelect.beginDate.month && convertMonthToWord(yearSelect.beginDate.month).substring(0, 3)}} {{ list.finalYearReport && list.finalYearReport.beginYear && list.finalYearReport.beginYear.toString().substring(2,4)}} - {{ yearSelect.endDate.month && convertMonthToWord(yearSelect.endDate.month).substring(0, 3)}} {{ list.finalYearReport && list.finalYearReport.beginYear && list.finalYearReport.endYear.toString().substring(2,4)}}</span>
                                            </div>
                                            <div class="col-3 align-self-center">
                                                <span class="item-normal">Profit & Loss {{ yearSelect.beginDate.month && convertMonthToWord(yearSelect.beginDate.month) }} {{ list.finalYearReport && list.finalYearReport.beginYear }} to {{ yearSelect.endDate.month && convertMonthToWord(yearSelect.endDate.month) }} {{ list.finalYearReport && list.finalYearReport.endYear }}</span>
                                            </div>
                                            <div class="col align-self-center text-right">
                                                <span
                                                    class="item-normal uppercase grey"
                                                    v-if="!list.finalYearReport || !list.finalYearReport.status"
                                                > <img
                                                        style="margin-top: -2px;"
                                                        src="/images/crunch-icon.svg"
                                                    /> Cruncher not yet completed </span>
                                            </div>
                                            <div class="col-4 align-self-center text-right">
                                                <div class="btn-group">
                                                    <button
                                                        @click="previewFinancial(financial.ProfitLoss, list.finalYearReport)"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                        class="btn-normal grey"
                                                    >preview</button>
                                                    <button
                                                        :disabled="!list.finalYearReport || !list.finalYearReport.status"
                                                        data-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                        class="btn-normal grey"
                                                    >download</button>
                                                    <ul
                                                        class="dropdown-menu"
                                                        style="max-width: 120px;left: 87px !important;"
                                                    >
                                                        <li @click="exportFile(financial.ProfitLoss, {})"><a class="dropdown-menu-link"> <img
                                                                    alt=""
                                                                    title=""
                                                                    src="~/assets/images/icon-pdf.svg"
                                                                >Export as PDF</a></li>
                                                        <li @click="exportFile(financial.ProfitLoss, {}, true)"><a class="dropdown-menu-link"><img
                                                                    alt=""
                                                                    title=""
                                                                    src="~/assets/images/icon-csv.svg"
                                                                >Export as CSV</a></li>
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
import VerticalMenu from '~/components/Report/VerticalMenu';
import PageTitle from '~/components/PageTitle';
import {Financial} from '~/common/commonType';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import {convertMonthToWord} from '~/helpers/dateHelper';

export default {
    data() {
        return {
            titles: ['Profit & Loss'],
            client: null,
            yearSelect: null,
            list: {},
            financial: null
        };
    },
    components: {
        PageTitle,
        VerticalMenu
    },
    async mounted() {
        this.financial = Financial;
        this.handlerView();
    },
    methods: {
        async handlerView() {
            this.$setLoading();
            await this.getList();
            this.$setLoading(false);
        },
        convertMonthToWord(month) {
            return convertMonthToWord(month);
        },
        async getList() {
            // Get from localStorage
            let storage = localStorage.params && JSON.parse(localStorage.params);
            let beginMonth;
            let beginYear;
            let endMonth;
            let endYear;
            let clientId;

            if (storage && storage.length) {
                beginMonth = storage.find(item => item.name === 'beginMonth') && storage.find(item => item.name === 'beginMonth').value;
                beginYear = storage.find(item => item.name === 'beginYear') && storage.find(item => item.name === 'beginYear').value;
                endMonth = storage.find(item => item.name === 'endMonth') && storage.find(item => item.name === 'endMonth').value;
                endYear = storage.find(item => item.name === 'endYear') && storage.find(item => item.name === 'endYear').value;
                clientId = storage.find(item => item.name === 'clientId') && storage.find(item => item.name === 'clientId').value;
            }
            this.clientId = clientId || this.$route.query.clientId;
            this.userId = this.$store && this.$store.state && this.$store.state.userAuth._id;
            this.yearSelect = {
                beginDate: {
                    month: beginMonth || this.$route.query.beginMonth,
                    year: beginYear || this.$route.query.beginYear
                },
                endDate: {
                    month: endMonth || this.$route.query.endMonth,
                    year: endYear || this.$route.query.endYear
                },
            };
            // End get
            if (!this.clientId || !this.yearSelect.beginDate.year || !this.yearSelect.endDate.year) {
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select full option'
                });
                return false;
            }
            let {data} = await this.$services.reportService.getList(this.clientId, this.yearSelect.beginDate, this.yearSelect.endDate);
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
        async previewFinancial(type, date, isCsv = false) {
            let beginMonth = date.month ? date.month : date.startMonth ? date.startMonth : this.yearSelect.beginDate.month;
            let beginYear = date.year ? date.year : date.startYear ? date.startYear : this.yearSelect.beginDate.year;
            let endMonth = date.month ? date.month : date.endMonth ? date.endMonth : this.yearSelect.endDate.month;
            let endYear = date.year ? date.year : date.endYear ? date.endYear : this.yearSelect.endDate.year;

            let result;
            if (isCsv) {
                result = await this.$services.reportService.exportFinancialCSV(type, this.clientId, this.userId, beginMonth, beginYear, endMonth, endYear);
            }
            else {
                result = await this.$services.reportService.previewFinancial(type, this.clientId, this.userId, beginMonth, beginYear, endMonth, endYear);
            }
            if (result.data) {
                let myWindow = window.open('', '', 'width=1000,height=1000');
                myWindow.document.write(result.data);
                myWindow.focus();
            }
        },
        async exportFile(type, date, isCsv = false) {
            let beginMonth = date.month ? date.month : date.startMonth ? date.startMonth : this.yearSelect.beginDate.month;
            let beginYear = date.year ? date.year : date.startYear ? date.startYear : this.yearSelect.beginDate.year;
            let endMonth = date.month ? date.month : date.endMonth ? date.endMonth : this.yearSelect.endDate.month;
            let endYear = date.year ? date.year : date.endYear ? date.endYear : this.yearSelect.endDate.year;

            let result;
            if (isCsv) {
                result = await this.$services.reportService.exportFinancialCSV(type, this.clientId, this.userId, beginMonth, beginYear, endMonth, endYear);
            }
            else {
                result = await this.$services.reportService.exportFinancial(type, this.clientId, this.userId, beginMonth, beginYear, endMonth, endYear);
            }
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
