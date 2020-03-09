<template>
    <div>
        <vertical-menu @view="handlerView" />
        <section class="financial-template">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <page-title :titles="titles" />
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                            <div class="dropdown normal-btn">
                                <a
                                    class="btn dropdown-toggle not-arrow"
                                    @click="createGJ"
                                >
                                    CREATE NEW
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12 page-list gj-list-custom">
                    <div class="row">
                        <div class="col-md">
                            <div class="box">
                                <div class="box-item pdr-15">
                                    <div
                                        class="row row-label"
                                        style="margin: 0px -15px;"
                                    >
                                        <div class="col-2"><label class="col-label">Product</label></div>
                                        <div class="col-2"><label class="col-label">GJ ID</label></div>
                                        <div class="col-2"><label class="col-label">Create date</label></div>
                                        <div class="col-2"><label class="col-label">CLIENT NAME</label></div>
                                        <div class="col-1"><label class="col-label">Transactions</label></div>
                                        <div class="col-2"><label class="col-label">Memo</label></div>
                                        <div class="col-1 text-right"><label class="col-label">ACTIONS</label></div>
                                    </div>
                                    <div
                                        class="row row-item"
                                        v-for="(item, index) in list"
                                        :key="index"
                                    >
                                        <div class="col-2 align-self-center">
                                            <span class="item-normal">{{item.productId.name}}</span>
                                        </div>
                                        <div class="col-2 align-self-center">
                                            <span class="item-normal">{{item.code}}</span>
                                            <img
                                                class="label-include"
                                                :src="item.isTaxInclude ? '/images/inclusve.svg' : '/images/exclusive.svg'"
                                            />
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
                                        <div
                                            class="col-2 align-self-center"
                                            :title="item.note"
                                        >
                                            <span class="item-normal">{{item.note}}</span>
                                        </div>
                                        <div class="col-1 align-self-center text-right">
                                            <!-- <a :href="`/financial-report/general-journal/${item._id}?userId=${$route.query.userId}&code=${item.code}&year=${$route.query.year}`" class="btn-normal grey">VIEW</a> -->
                                            <!-- <nuxt-link @click.native="view(item._id, item.code, item.note)" :to="`/financial-report/general-journal/${item._id}?userId=${client._id ? client._id : $route.query.userId ? $route.query.userId : ''}&year=${yearSelect.year || $route.query.year}`" class="btn-normal grey">VIEW</nuxt-link> -->
                                            <!-- <button class="btn-normal grey" @click="deleteGeneralJournal(item._id)">DELETE</button> -->
                                            <div class="dropdown">
                                                <a
                                                    class="item-option dropdown-toggle"
                                                    data-toggle="dropdown"
                                                >
                                                    ...
                                                </a>
                                                <ul
                                                    class="dropdown-menu"
                                                    style="opacity:1"
                                                >
                                                    <li>
                                                        <nuxt-link
                                                            @click.native="view(item._id, item.code, item.note)"
                                                            :to="`/financial-report/general-journal/${item._id}?productCode=${productCode}&clientId=${$route.query.clientId ? $route.query.clientId : ''}&beginMonth=${yearSelect.beginDate.month}&beginYear=${yearSelect.beginDate.year}&endMonth=${yearSelect.endDate.month}&endYear=${yearSelect.endDate.year}&nemo=${item.note}`"
                                                            class="option-item"
                                                        >VIEW</nuxt-link>
                                                    </li>
                                                    <li v-if="$store.state.userAuth && $store.state.userAuth.permission.role.code === roles.SuperAdmin"><a
                                                            class="option-item"
                                                            @click="deleteGeneralJournal(item._id)"
                                                        >DELETE</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="paginate">
                        <client-only>
                            <pagination
                                id="team-pagination"
                                :page="page"
                                :limit="limit"
                                :total="total"
                                @change="changePage"
                            />
                        </client-only>
                    </div>
                </div>
            </div>
            <popup-confirm
                id="confirm-delete"
                ref="confirm_delete"
                description='Do you really want to delete these records? This process cannot be undone.'
                @success="handlerDelete"
            />
        </section>
    </div>
</template>

<script>
import VerticalMenu from '~/components/Report/VerticalMenu';
import PageTitle from '~/components/PageTitle';
import Pagination from '~/components/Pagination';
import PopupConfirm from '~/components/PopupConfirm';
import {RoleCode} from '~/common/commonType';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import {formatDate} from '~/helpers/dateHelper';
// import {setTimeout} from 'timers';

export default {
    data() {
        return {
            titles: ['Financial Report', 'General Journal'],
            client: {},
            list: [],
            page: 1,
            limit: 10,
            total: 0,
            isCheck: false,
            yearSelect: {},
            roles: RoleCode,
            beginMonth: null,
            beginYear: null,
            endMonth: null,
            endYear: null,
            clientId: null,
            productCode: '',
        };
    },
    components: {
        PageTitle,
        VerticalMenu,
        Pagination,
        PopupConfirm
    },
    async created() {
        this.clientId = this.$route.query.clientId || null;
        this.userId = this.$store && this.$store.state && this.$store.state.userAuth._id;
        if (this.clientId && this.yearSelect && this.yearSelect.beginDate && this.yearSelect.beginDate.year) {
            this.getGeneralJournal();
            this.getGeneralJournalTotal();
        }
        localStorage.params = JSON.stringify([]);
        localStorage.gJitemtitle = '';
        localStorage.gJitemnote = '';
        this.handlerView();
    },
    methods: {
        changePage(page) {
            this.page = page;
            this.getList();
        },
        async handlerView() {
            this.$setLoading();
            // Get from localStorage
            let storage = localStorage.params && JSON.parse(localStorage.params);

            if (storage && storage.length) {
                this.beginMonth = storage.find(item => item.name === 'beginMonth') && storage.find(item => item.name === 'beginMonth').value;
                this.beginYear = storage.find(item => item.name === 'beginYear') && storage.find(item => item.name === 'beginYear').value;
                this.endMonth = storage.find(item => item.name === 'endMonth') && storage.find(item => item.name === 'endMonth').value;
                this.endYear = storage.find(item => item.name === 'endYear') && storage.find(item => item.name === 'endYear').value;
                this.clientId = storage.find(item => item.name === 'clientId') && storage.find(item => item.name === 'clientId').value;
                this.productCode = storage.find(item => item.name === 'productCode') && storage.find(item => item.name === 'productCode').value;
            }

            // this.clientId = clientId || this.$route.query.clientId;
            this.userId = this.$store && this.$store.state && this.$store.state.userAuth._id;
            this.yearSelect = {
                beginDate: {
                    month: this.beginMonth || this.$route.query.beginMonth,
                    year: this.beginYear || this.$route.query.beginYear
                },
                endDate: {
                    month: this.endMonth || this.$route.query.endMonth,
                    year: this.endYear || this.$route.query.endYear
                },
            };
            // End get

            await this.getList();
            this.$setLoading(false);
        },
        async getList() {
            this.isCheck = true;
            let storage = localStorage.params && JSON.parse(localStorage.params);

            if (storage && storage.length) {
                this.productCode = storage.find(item => item.name === 'productCode') && storage.find(item => item.name === 'productCode').value;
            }
            await this.getGeneralJournal();
            await this.getGeneralJournalTotal();
        },
        async getGeneralJournal() {
            let {data} = await this.$services.generalJournalService.getGeneralJournal(this.clientId, this.beginMonth, this.beginYear, this.endMonth, this.endYear, this.page, this.limit);
            if (data) {
                this.list = data;
            }
        },
        async getGeneralJournalTotal() {
            let {data} = await this.$services.generalJournalService.getGeneralJournalTotal(this.clientId, this.beginMonth, this.beginYear, this.endMonth, this.endYear);
            if (data)
                this.total = data;
        },
        async createGJ() {
            this.isCheck = true;
            this.$router.push(`/financial-report/general-journal/create-gj?productCode=${this.productCode}&clientId=${this.clientId}&beginMonth=${this.beginMonth}&beginYear=${this.beginYear}&endMonth=${this.endMonth}&endYear=${this.endYear}`);
        },
        view(id, name, note) {
            let dataGJ = {};
            dataGJ.userId = this.clientId;
            dataGJ.year = this.yearSelect.beginDate.year || this.beginYear;
            localStorage.gJitemtitle = name;
            localStorage.gJitemnote = note || '';

            this.$router.push(`/financial-report/general-journal/${id}?productCode=${this.productCode || this.$route.query.productCode ? this.$route.query.productCode : ''}&userId=${this.client._id ? this.client._id : this.$route.query.userId ? this.$route.query.userId : this.clientId}&beginMonth=${this.beginMonth || this.$route.query.beginMonth ? this.$route.query.beginMonth : ''}&beginYear=${this.beginYear || this.$route.query.beginYear ? this.$route.query.beginYear : ''}&endMonth=${this.endMonth || this.$route.query.endMonth ? this.$route.query.endMonth : ''}&endYear=${this.endYear || this.$route.query.endYear ? this.$route.query.endYear : ''}&nemo=${localStorage.gJitemnote}`);
        },
        async deleteGeneralJournal(id) {
            this.$refs.confirm_delete.open(id);
        },
        async handlerDelete(id) {
            let {data} = await this.$services.generalJournalService.deleteGeneralJournal(id);
            if (data) {
                this.$notify({
                    type: 'success',
                    title: 'Delete success',
                    text: 'Thank you'
                });
                this.getList();
            }
        },
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
