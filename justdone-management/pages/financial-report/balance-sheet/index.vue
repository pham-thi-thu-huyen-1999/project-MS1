<template>
    <div>
        <vertical-menu @view="handlerView" />
        <section class="financial-template">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <page-title :titles="titles" />
                            <button
                                v-if="list && list.length > 0"
                                @click="openBalanceSheetOpeningBalance()"
                                class="btn btn-small"
                            >Balance Sheet Opening Balance</button>
                            <balance-sheet-opening-balance
                                ref='balanceSheetOpeningBalance'
                                data-toggle="balanceSheetOpeningBalance"
                                @refreshCruncher="handlerView()"
                            />
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                    <div class="row">
                        <div class="col-md">
                            <div class="box">
                                <div
                                    class="box-item pdr-15"
                                    v-if="list.length === 0"
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
                                    <div
                                        class="row row-item"
                                        v-for="(item, index) in list"
                                        :key="index"
                                    >
                                        <div class="col-1 align-self-center">
                                            <span 
                                                class="item-normal"
                                            >
                                                {{`${item.name.substring(0, 3)} ${item.year.toString().substring(2,4)}`}}
                                            </span>
                                        </div>
                                        <div class="col-6 align-self-center">
                                            <span class="item-normal">{{'Balance sheet ' + item.name + ' ' +  item.year}}</span>
                                        </div>
                                        <div class="col-5 align-self-center text-right">
                                            <template>
                                                <a
                                                    :class="yearMonthConcition (item)"
                                                    @click="btnPreviewBalanceSheet(item.month, item.year)"
                                                    class="btn-normal grey"
                                                >preview</a>
                                                <a
                                                    class="btn-normal grey"
                                                    :class="yearMonthConcition (item)"
                                                    data-toggle="dropdown"     
                                                >DOWNLOAD</a>
                                                <ul 
                                                    class="dropdown-menu"
                                                    style="max-width: 120px;left: 87px !important;"
                                                >
                                                    <li><a
                                                            class="dropdown-menu-link"
                                                            @click="exportBalanceSheet(item.month, item.year)"
                                                        > <img
                                                                alt=""
                                                                title=""
                                                                src="~/assets/images/icon-pdf.svg"
                                                            >Export PDF</a></li>
                                                    <li><a
                                                            class="dropdown-menu-link"
                                                            @click="exportBalanceSheetCsv(item.month, item.year)"
                                                        > <img
                                                                alt=""
                                                                title=""
                                                                src="~/assets/images/icon-csv.svg"
                                                            >
                                                            Export CSV</a></li>
                                                </ul>
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
import VerticalMenu from '~/components/Report/VerticalMenu';
import PageTitle from '~/components/PageTitle';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import { convertMonthToWord } from '~/helpers/dateHelper'; // eslint-disable-line
import BalanceSheetOpeningBalance from '~/components/BalanceSheetOpeningBalance';

export default {
    data() {
        return {
            titles: ['Financial Report'],
            yearSelect: null,
            client: null,
            list: [],
            clientId: null,
            fileUp: null,
            isUpdate: false,
            params: {id: '', month: '', year: ''},
            userId: null,
            month: null,
            year: null,
            dataStorage: null,
        };
    },
    mounted() {
        this.getQuery();
        if (this.isAllOptionSlected()) {
            this.handlerView();
        }
        this.getBalanceSheetOpeningBalance();
    },
    components: {
        PageTitle,
        VerticalMenu,
        BalanceSheetOpeningBalance
    },
    methods: {
        yearMonthConcition(item) {
            let flag = true;
            let year = Number(item.year);
            let month = Number(item.month);
            if (year > this.year) {
                flag = true;
            }
            else if (year === this.year) {
                if (month >= this.month) {
                    flag = true;
                }
                else {
                    flag = false;
                }
            }
            else {
                flag = false;
            }
            return (flag === true) ? 'btn-normal grey' : 'disabled';
        },
        isAllOptionSlected() {
            return !!((this.clientId && this.yearSelect.beginDate.month && this.yearSelect.endDate.month));
        },
        async handlerView() {
            this.$setLoading();
            await this.getFinancialList();
            await this.getBalanceSheetOpeningBalance();
            this.$setLoading(false);
        },
        // get date fill
        getQuery() {
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
        },
        async getFinancialList() {
            this.getQuery();
            if (this.isAllOptionSlected()) {
                let {data} = await this.$services.reportService.getCrunchCompleted(this.clientId, this.yearSelect.beginDate.month, this.yearSelect.beginDate.year, this.yearSelect.endDate.month, this.yearSelect.endDate.year);
                if (data) {
                    this.list = [];
                    Object.keys(data).forEach(item => {
                        let temp = {};
                        temp.name = convertMonthToWord(item);
                        temp.month = item;
                        temp.year = (Object.keys(data[item]))[0];
                        this.list.push(temp);
                    });
                    this.list.reverse();
                    this.$forceUpdate();
                }
                this.$forceUpdate();
            }
            else {
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select full option'
                });
            }
        },
         async btnPreviewBalanceSheet(month, year) {
            let {data, error} = await this.$services.reportService.previewBalanceSheet(this.clientId, this.userId, month, year);
            if (data) {
                let myWindow = window.open('', '', 'width=1000,height=1000');
                myWindow.document.write(data);
                myWindow.focus();
            }
            if (error)
                this.$notify({
                    type: 'error',
                    title: 'Update failed',
                    text: error.message
                });
        },
        async exportBalanceSheet(month, year) {
            let {data, error} = await this.$services.reportService.exportBalanceSheet(this.clientId, this.userId, month, year);
            if (data) window.location = data;
            if (error)
                this.$notify({
                    type: 'error',
                    title: 'Update failed',
                    text: error.message
                });
        },
        async exportBalanceSheetCsv(month, year) {
            let {data, error} = await this.$services.reportService.exportBalanceSheetCsv(this.clientId, this.userId, month, year);
            if(data) {
                window.location = data;
                console.log(data);
            }
            if (error) {
                this.$notify({
                    type: 'error',
                    title: 'Update failed',
                    text: error.message
                });
            }
        },
        async getBalanceSheetOpeningBalance() {
            let storage = localStorage.params && JSON.parse(localStorage.params);
            let clientId;
            if (storage && storage.length) {
                clientId = storage.find(item => item.name === 'clientId') && storage.find(item => item.name === 'clientId').value;
            }
            this.clientId = clientId || this.$route.query.clientId;
            let {data} = await this.$services.userService.getUserChartAccountOpeningBalance(clientId);
            if (!data) {
                return;
            }
            this.month = data.month;
            this.year = data.year;
        },
        async openBalanceSheetOpeningBalance() {
            let storage = localStorage.params && JSON.parse(localStorage.params);
            let clientId;
            if (storage && storage.length) {
                clientId = storage.find(item => item.name === 'clientId') && storage.find(item => item.name === 'clientId').value;
            }
            this.clientId = clientId || this.$route.query.clientId;
            let {data} = await this.$services.userService.getUserChartAccountOpeningBalance(clientId);
            await this.$refs.balanceSheetOpeningBalance.open(clientId, data);
        },
    },
    filters: {
        mapUrlGoogleStorage(url) {
            return mapUrlGoogleStorage(url);
        }
    },
};
</script>
