<template>
    <section class="balance-opening">
          <div class="modal" id="opening-balance-sheet" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Balance Sheet Opening Balance</h5>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <client-only aria-placeholder="">
                                <vue-monthly-picker
                                    v-model="selectedMonth"
                                    alignment="center"
                                    dateFormat="MM/YYYY"
                                    name="name"
                                    :max="maxDate"
                                    @selected="selectDate"
                                    >
                                </vue-monthly-picker>
                            </client-only>
                        </div>
                    </div>
                    <div>
                        <div class="row mt-10">
                            <div class="col-md-6">
                                <label class="col-label">COA NAME</label>
                            </div>
                            <div class="col-md-6">
                                <label class="col-label">AMOUNT</label>
                            </div>
                        </div>
                        <div class="row mt-10 row-item edit" v-for="(x, index) in listBalanceSheet" :key="index">
                            <div class="col-md-6 align-self-center">
                                <div class="dropdown">
                                    <input type="text" autocomplete="off" name="coa name" data-toggle="dropdown" class="dropdown-toggle form-control mb-7" @input="searchCoa(listBalanceSheet[index].coaName, index)" v-model="listBalanceSheet[index].coaName">
                                    <!-- <span class="input-loading" v-if="item.after.coa.loading"></span> -->
                                    <ul class="dropdown-menu" :class="'new-coa-'+index">
                                        <li class="dropdown-menu-link" v-for="(itemCoa, index1) in coa.list" :key="index1" @click="selectCoa(itemCoa, index)">{{itemCoa.coa.name}}</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-5">
                                <div class="input-group mb-2">
                                    <input
                                    type="number"
                                    class="form-control aud-amount"
                                    v-model="listBalanceSheet[index].openingBalance"
                                    autocomplete="off"
                                    required
                                    />
                                </div>
                            </div>
                            <div class="col-md-1">
                                <span class="icon-delete grey mt-10" @click="deleteFiel(index)"> </span>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="mt-add mb-add ml-add add-feild" @click="addField()">+ ADD FIELD</button>
                <div class="modal-footer">
                <button type="button" class="grey form-btn" data-dismiss="modal" @click="cancel">Close</button>
                <button type="button" class="blue form-btn" @click="onSubmit">Save changes</button>
                </div>
            </div>
            </div>
        </div>
    </section>
</template>

<script>

import moment from 'moment';
import {GstType, CrunchType} from '~/common/commonType';
// import VueMonthlyPicker from 'vue-monthly-picker';

export default {
    data() {
        return {
            clientId: null,
            list: [],
            listBalanceSheet: [],
            timeout: null,
            coa: {
                isLoad: true,
                list: [],
                page: 1,
                limit: 20,
                total: null,
                timeout: null,
            },
            date: null,
            month: null,
            year: null,
            GstType: GstType,
            crunchType: CrunchType,
            selectedMonth: moment(),
            maxDate: moment(new Date()),
            dataCreate: null,
        };
    },
    async mounted() {
        await this.getChartAccount();
    },
    methods: {
        addField() {
            let itemBalance = {
                coaId: null,
                openingBalance: null,
                coaName: ''
            };
            // convert and push to transactions[]
            let item = JSON.stringify(itemBalance);
            this.listBalanceSheet.push(JSON.parse(item));
        },
        async deleteFiel(index) {
            this.listBalanceSheet.splice(index, 1);
        },
        async selectDate(date) {
            this.date = date;
            let dateMonth = date._i;
            let arrDate = dateMonth.split('/');
            this.month = arrDate[1];
            this.year = arrDate[0];
        },

        open(clientId, data) {
            this.clientId = clientId || null;
            this.list = data || null;
            let itemBalance = {
                coaId: null,
                openingBalance: null,
                coaName: ''
            };

            if (this.list && this.list.dataCoaOpeningBalance && this.list.dataCoaOpeningBalance.length > 0) {
                this.listBalanceSheet = [];
                this.year = this.list.year;
                this.month = this.list.month;
                this.selectedMonth = moment().year(this.year).month(this.month - 1);
                for (let i = 0; i < this.list.dataCoaOpeningBalance.length; i++) {
                    itemBalance = {
                        coaId: this.list.dataCoaOpeningBalance[i].coaId ? this.list.dataCoaOpeningBalance[i].coaId._id : null,
                        openingBalance: this.list.dataCoaOpeningBalance[i].openingBalance,
                        coaName: this.list.dataCoaOpeningBalance[i].coaId ? this.list.dataCoaOpeningBalance[i].coaId.name : this.list.dataCoaOpeningBalance[i].specialCoaName
                    };
                    let item = JSON.stringify(itemBalance);
                    this.listBalanceSheet.push(JSON.parse(item));
                }
            }
            else {
                this.listBalanceSheet = [];
                // convert and push to transactions[]
                let item = JSON.stringify(itemBalance);
                this.listBalanceSheet.push(JSON.parse(item));
            }

            $('#opening-balance-sheet').modal('show');
        },

        success() {
            $('#opening-balance-sheet').modal('hide');
            this.$emit('success', this.data);
        },

        cancel() {
            $('#opening-balance-sheet').modal('hide');
        },

        searchCoa(keyword, index) {
            // this.list[index].after.coa.loading = true;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(async () => {
                await this.getChartAccount(keyword);
                this.$forceUpdate();
            }, 600);
        },

        async getChartAccount(keyword) {
            if (!this.coa.isLoad)
                return;
            this.coa.isLoad = false;

            let {data} = await this.$services.chartAccountService.search(keyword, this.coa.page, this.coa.limit);

            if (data && data.length) {
                this.coa.list = data;

                let coaPlus = [
                    {coa: {name: 'Drawing', gstType: this.GstType.NotReporTable}},
                    {coa: {name: 'Other', gstType: this.GstType.NotReporTable}}];
                this.coa.list = [...this.coa.list, ...coaPlus];
            }
            this.coa.isLoad = true;
        },

        selectCoa(coa, index) {
            this.listBalanceSheet[index].coaName = coa.coa.name;
            this.listBalanceSheet[index].coaId = coa.coa._id || null;
        },

        async onSubmit() {
            for (let i = 0; i < this.listBalanceSheet.length; i++) {
                if (this.listBalanceSheet[i].coaName !== 'Drawing') {
                    if (!this.listBalanceSheet[i].coaId) {
                        this.$notify({
                            type: 'error',
                            title: 'Create failed',
                            text: 'Create list balance sheet failed'
                        });
                        return;
                    }
                }
            }
            let dataCreate = {
                data: {
                    month: Number(this.month),
                    year: Number(this.year),
                    dataCoaOpeningBalance: this.listBalanceSheet
                }
            };
            let {data} = await this.$services.userService.createAndUpdateChartAccountOpeningBalance(this.clientId, dataCreate);
            if (data === true) {
                this.$forceUpdate();
                this.$emit('refreshCruncher');
                $('#opening-balance-sheet').modal('hide');
                this.$notify({
                    type: 'success',
                    text: 'Create list balance sheet successful'
                });
            }
        }
    },
};
</script>
