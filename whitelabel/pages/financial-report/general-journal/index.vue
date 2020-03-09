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
                                <a class="btn dropdown-toggle not-arrow" @click="createGJ">
                                  CREATE NEW
                                </a>
                            </div>
                        </div>
                        <div class="col-12 page-filter">
                            <product-lookup :class="{'border-red': isCheck && !condition.product.code}" v-model="condition.product" :autoSelect="condition.autoSelect" :exclude-codes="[this.$store.state.productCode]" :queryCode="$route.query.productCode || ''"/>  
                            <lookup-client :class="{'border-red': isCheck && !client._id }" ref="lookupClient" @change="changeClient" :selectOne="true" :selectId="$route.query.userId || ''"/>
                            <dropdown-date-one :class="{'border-red': isCheck && !yearSelect.year }" @changeDate="changeDate" :onlyYear="true" :financial="true" :yearSelected="$route.query.year"></dropdown-date-one>
                            <button class="form-btn btn-filter" @click="getList">VIEW</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12 page-list gj-list-custom">
                    <div class="row">
                        <div class="col-md">
                            <div class="box">
                                <div class="box-item pdr-15">
                                    <div class="row row-label" style="margin: 0px -15px;">
                                        <div class="col-2"><label class="col-label">Product</label></div>
                                        <div class="col-2"><label class="col-label">GJ ID</label></div>
                                        <div class="col-2"><label class="col-label">Create date</label></div>
                                        <div class="col-2"><label class="col-label">CLIENT NAME</label></div>
                                        <div class="col-1"><label class="col-label">Transactions</label></div>
                                        <div class="col-2"><label class="col-label">Memo</label></div>
                                        <div class="col-1 text-right"><label class="col-label">ACTIONS</label></div>
                                    </div>
                                    <div class="row row-item" v-for="(item, index) in list" :key="index">
                                        <div class="col-2 align-self-center">
                                            <span class="item-normal">{{item.productId.name}}</span>
                                        </div>
                                        <div class="col-2 align-self-center">
                                            <span class="item-normal">{{item.code}}</span>
                                            <img class="label-include" :src="item.isTaxInclude ? '/images/inclusve.svg' : '/images/exclusive.svg'"/>
                                        </div>
                                        <div class="col-2 align-self-center">
                                            <span class="item-normal">{{item.createdAt | formatDate}}</span>
                                        </div>
                                        <div class="col-2 align-self-center">
                                            <span class="item-normal">{{item.userId.fullName}}</span>
                                        </div>
                                        <div class="col-1 align-self-center">
                                            <span class="item-normal">{{item.totalTransactions}}</span>
                                        </div>
                                        <div class="col-2 align-self-center" :title="item.note">
                                            <span class="item-normal">{{item.note}}</span>
                                        </div>
                                        <div class="col-1 align-self-center text-right">
                                            <!-- <a :href="`/financial-report/general-journal/${item._id}?userId=${$route.query.userId}&code=${item.code}&year=${$route.query.year}`" class="btn-normal grey">VIEW</a> -->
                                            <!-- <nuxt-link @click.native="view(item._id, item.code, item.note)" :to="`/financial-report/general-journal/${item._id}?userId=${client._id ? client._id : $route.query.userId ? $route.query.userId : ''}&year=${yearSelect.year || $route.query.year}`" class="btn-normal grey">VIEW</nuxt-link> -->
                                            <!-- <button class="btn-normal grey" @click="deleteGeneralJournal(item._id)">DELETE</button> -->
                                            <div class="dropdown">
                                                <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                                    ...
                                                </a>
                                                <ul class="dropdown-menu" style="opacity:1">
                                                    <li><nuxt-link @click.native="view(item._id, item.code, item.note)" :to="`/financial-report/general-journal/${item._id}?userId=${client._id ? client._id : $route.query.userId ? $route.query.userId : ''}&year=${yearSelect.year || $route.query.year}`" class="option-item">VIEW</nuxt-link></li>
                                                    <li v-if="$store.state.userAuth && $store.state.userAuth.permission.role.code === roles.SuperAdmin"><a class="option-item" @click="deleteGeneralJournal(item._id)">DELETE</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="paginate">
                        <no-ssr>
                            <pagination id="team-pagination" :page="page" :limit="limit" :total="total" @change="changePage" />
                        </no-ssr>
                    </div>
                </div>
            </div>
            <popup-confirm id="confirm-delete" ref="confirm_delete" description='Do you really want to delete these records? This process cannot be undone.' @success ="handlerDelete"/>
        </section>
    </div>
</template>

<script>
import LookupClient from '~/components/Report/LookupClientAll';
import VerticalMenu from '~/components/Report/VerticalMenu';
import ProductLookup from '~/components/product/ProductLookup';
import PageTitle from '~/components/PageTitle';
import Pagination from '~/components/Pagination';
import PopupConfirm from '~/components/PopupConfirm';
import {RoleCode} from '~/common/commonType';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import {formatDate} from '~/helpers/dateHelper';
import DropdownDateOne from '~/components/Report/DropdownDateOneCus';
import {setTimeout} from 'timers';

export default {
    data: () => ({
        titles: ['Financial Report', 'General Journal'],
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
        client: {},
        list: [],
        page: 1,
        limit: 10,
        total: 0,
        isCheck: false,
        yearSelect: {},
        roles: RoleCode
    }),
    components: {
        LookupClient,
        ProductLookup,
        PageTitle,
        VerticalMenu,
        Pagination,
        DropdownDateOne,
        PopupConfirm
    },
    async created() {
        if (this.$route.query.userId && this.$route.query.year) {
            this.getGeneralJournal();
            this.getGeneralJournalTotal();
        }
        localStorage.params = JSON.stringify([]);
        localStorage.gJitemtitle = '';
        localStorage.gJitemnote = '';
    },
    watch: {
        'condition.product': {
            async handler(product) {
                if (product) {
                    if (product.code)
                        this.changeParam('productCode', product.code);
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
            this.changeParam('userId', this.client._id);
        },
        changePage(page) {
            this.page = page;
        },
        changeDate(data) {
            if (data) {
                this.yearSelect = data;
                this.changeParam('year', this.yearSelect.year);
            }
        },
        getList() {
            this.isCheck = true;
            if ((!this.client || !this.client._id) && !this.$route.query.userId) {
                this.$notify({
                    group: 'error',
                    title: 'Get failed',
                    text: 'Please select Client.'
                });
                return false;
            }
            else if (!this.yearSelect || !this.yearSelect.year) {
                this.$notify({
                    group: 'error',
                    title: 'Get failed',
                    text: 'Please select Year.'
                });
                return false;
            }
            this.getGeneralJournal();
            this.getGeneralJournalTotal();
        },
        async getGeneralJournal() {
            let {data, error} = await this.$services.generalJournalService.getGeneralJournal((this.client && this.client._id) ? (this.client && this.client._id) : this.$route.query.userId, this.yearSelect && this.yearSelect.year ? this.yearSelect.year : this.$route.query.year, this.page, this.limit);

            if (error)
                console.log('error', error);
            if (data)
                this.list = data;
        },
        async getGeneralJournalTotal() {
            let {data, error} = await this.$services.generalJournalService.getGeneralJournalTotal((this.client && this.client._id) ? (this.client && this.client._id) : this.$route.query.userId, this.yearSelect && this.yearSelect.year ? this.yearSelect.year : this.$route.query.year);

            if (error)
                console.log('error', error);
            if (data)
                this.total = data;
        },
        async createGJ() {
            // let obData = {userId: this.client && this.client._id, beginYear: this.yearSelect.year};
            // let {data, error} = await this.$services.generalJournalService.createGeneralJournal(obData);

            // if (error)
            //     console.log('error', error);
            // if (data) {
            //     this.$notify({
            //         group: 'success',
            //         title: 'Create success',
            //         text: 'Thank you'
            //     });
            //     this.getList();
            // }
            this.isCheck = true;
            if ((!this.client || !this.client._id) && !this.$route.query.userId) {
                this.$notify({
                    group: 'error',
                    title: 'Get failed',
                    text: 'Please select Client.'
                });
                return false;
            }
            else if (!this.yearSelect || !this.yearSelect.year) {
                this.$notify({
                    group: 'error',
                    title: 'Get failed',
                    text: 'Please select Year.'
                });
                return false;
            }
            setTimeout(() => {
                this.$router.push(`/financial-report/general-journal/create-gj?userId=${this.client._id ? this.client._id : this.$route.query.userId ? this.$route.query.userId : ''}&year=${this.yearSelect.year || this.$route.query.year}`);
            }, 300);
        },
        view(id, name, note) {
            let storage = JSON.parse(localStorage.params);
            let year;
            let client;
            if (storage.length) {
                year = storage.find(item => item.name === 'year');
                client = storage.find(item => item.name === 'userId');
            }

            let dataGJ = {};
            dataGJ.userId = (this.client && this.client._id) ? this.client._id : this.$route.query.userId ? this.$route.query.userId : client ? client.value : '';
            dataGJ.year = this.yearSelect.year ? this.yearSelect.year : this.$route.query.year ? this.$route.query.year : year ? year.value : '';
            localStorage.gJitemtitle = name;
            localStorage.gJitemnote = note || '';

            this.$router.push(`/financial-report/general-journal/${id}?userId=${dataGJ.userId}&year=${dataGJ.year}`);
        },
        async deleteGeneralJournal(id) {
            this.$refs.confirm_delete.open(id);
        },
        async handlerDelete(id) {
            let {data, error} = await this.$services.generalJournalService.deleteGeneralJournal(id);
            if (error)
                console.log('error', error);
            if (data) {
                this.$notify({
                    group: 'success',
                    title: 'Delete success',
                    text: 'Thank you'
                });
                this.getList();
            }
        },
        changeParam(name, value) {
            // New
            let storage;
            if (localStorage.params) {
                storage = JSON.parse(localStorage.params);
            }
            else {
                storage = [];
            }

            if (storage.length) {
                let exist = storage.findIndex(item => item.name === name);
                if (exist >= 0)
                    storage[exist].value = value;
                else storage.push({name: name, value: value});
            }
            else storage.push({name: name, value: value});

            localStorage.params = JSON.stringify(storage);

            console.log('localStorage.params', localStorage.params);

            // Old
            let urlNew;

            if (window.location.search) {
                if (!window.location.search.includes(name + '=')) {
                    urlNew = window.location.href + '&' + name + '=' + value;
                }
                else {
                    let param = new URLSearchParams(window.location.search);
                    param.set(name, value);
                    urlNew = window.location.pathname + '?' + param;
                }
            }
            else urlNew = window.location.href + '?' + name + '=' + value;

            window.history.pushState({path: urlNew}, '', urlNew);
        }
    },
    filters: {
        mapUrlGoogleStorage(url) {
            return mapUrlGoogleStorage(url);
        },
        formatDate(date) {
            return formatDate(date);
        }
    }
};
</script>
