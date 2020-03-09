<template>
    <section class="chart-of-account">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles" />
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                        <button
                            class="btn-normal color-second"
                            type="button"
                            @click="openCoaDetail"
                        >
                            <span class="btn-title">ADD NEW</span>
                        </button>
                    </div>
                    <div class="col-12 page-filter">
                        <lookup-keyword
                            :title="'Search COA'"
                            :classPlus="'normal-with'"
                            v-model="keyword"
                        />
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <div class="row">
                    <div class="col-md">
                        <div class="box">
                            <div class="row row-label">
                                <div class="col-1"><label class="col-label">Code</label></div>
                                <div class="col-3"><label class="col-label">Name</label></div>
                                <div class="col-2"><label class="col-label">Products</label></div>
                                <div class="col-2"><label class="col-label">Clients assigned</label></div>
                                <div class="col-3"><label class="col-label">Cruncher status</label></div>
                                <div class="col-1 text-right"><label class="col-label">Options</label></div>
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
                                            <p class="text-note">No data available.</p>
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
                                        <span class="item-normal">{{ item.coa.code }}</span>
                                    </div>
                                    <div class="col-3 align-self-center">
                                        <span class="item-normal">{{ item.coa.name }}</span>
                                    </div>
                                    <div class="col-2 align-self-center">
                                        <span class="item-normal">{{ item.product }}</span>
                                    </div>
                                    <div class="col-2 align-self-center">
                                        <span class="item-normal">{{ item.client }}</span>
                                    </div>
                                    <div
                                        class="col-3 align-self-center"
                                        v-if="item.statusCrunch"
                                    >
                                        <span class="item-status">
                                            {{ item.statusCrunch === 2 ? 'Used' : 'Never used' }}
                                        </span>
                                    </div>
                                    <div
                                        class="col-3 align-self-center"
                                        v-else
                                    >
                                        <span class="item-status">
                                            Loading...
                                        </span>
                                    </div>
                                    <div class="col-1 align-self-center text-right">
                                        <div class="dropdown">
                                            <a
                                                class="item-option dropdown-toggle"
                                                data-toggle="dropdown"
                                            >
                                                ...
                                            </a>
                                            <ul class="dropdown-menu bot">
                                                <li>
                                                    <a
                                                        @click="openCoaDetail(item.coa)"
                                                        class="option-item"
                                                    >
                                                        <img
                                                            class="option-icon"
                                                            src="~/assets/images/icon-edit.svg"
                                                        >
                                                        <span class="option-label">Edit</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        @click="deleteChartAccount(item.coa._id)"
                                                        class="option-item dropdown-toggle"
                                                    >
                                                        <img
                                                            class="option-icon"
                                                            src="~/assets/images/icon-delete.svg"
                                                        >
                                                        <span class="option-label">Delete</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                    <div class="col-md-auto">
                        <history-logs></history-logs>
                    </div>
                </div>
            </div>
        </div>
        <coa-detail
            ref="coaDetail"
            @success="updateCoaSuccess"
        />
    </section>
</template>

<script>
import Dropdown from '~/components/Dropdown';
import Pagination from '~/components/Pagination';
import CoaDetail from '~/components/ChartAccount/CoaDetail';
import HistoryLogs from '~/components/HistoryLogs';
import LookupKeyword from '~/components/LookupKeyword';
import PageTitle from '~/components/PageTitle';
import EventBus from '~/plugins/event-bus';

export default {
    data() {
        return {
            list: [],
            page: 1,
            limit: 10,
            total: 0,
            keyword: '',
            timeOut: null,
            titles: ['Chart of account'],
            confirm: {
                title: '',
                buttonName1: ''
            }
        };
    },
    components: {
        Dropdown,
        Pagination,
        HistoryLogs,
        CoaDetail,
        LookupKeyword,
        PageTitle
    },
    async created() {
        this.$setLoading();
        await this.getChartAccounts();
        await this.getCountChartAccounts();
        this.$setLoading(false);
    },
    watch: {
        keyword: function(keyword) {
            this.keyword = keyword;
            this.search();
        }
    },
    methods: {
        openCoaDetail(coa) {
            this.$refs.coaDetail.open(coa);
        },
        search() {
            clearTimeout(this.timeOut);
            this.timeOut = setTimeout(async () => {
                this.list = [];
                this.page = 1;
                this.total = 0;

                this.getChartAccounts();
                this.getCountChartAccounts();
            }, 1200);
        },
        async getChartAccounts() {
            let {data, error} = await this.$services.chartAccountService.search(this.keyword, this.page, this.limit);
            if (error) {
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: 'Load process has encountered a problem!'});
            }
            else {
                this.list = data;
                setTimeout(() => this.getChartAccountStatus(), 2000);
            }
        },
        async getCountChartAccounts(keyword) {
            let {data, error} = await this.$services.chartAccountService.getCountSearch(this.keyword);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: 'Load process has encountered a problem!'});
            else
                this.total = data;
        },
        async getChartAccountStatus() {
            if (!this.list.length)
                return;

            let ids = [];
            this.list.forEach(item => {
                ids.push(item.coa._id);
            });
            let body = {
                ids: ids
            };
            let {data, error} = await this.$services.chartAccountService.getStatus(body);
            if (error)
                return error;
            else {
                this.list.forEach(item => {
                    data.forEach(element => {
                        if (item.coa._id === element._id)
                            item.statusCrunch = element.statusCrunch;
                    });
                });
                this.$forceUpdate();
            }
        },
        async changePage(page) {
            this.page = page;
            await this.getChartAccounts(this.keyword);
        },
        updateCoaSuccess(data) {
            this.getChartAccounts();
            this.getCountChartAccounts();
        },
        deleteChartAccount(id) {
            this
                .$notify({
                    type: 'warning',
                    titleText: 'Are you sure to delete this item?'
                })
                .then((response) => {
                    this.handleConfirm({id, isDelete: true});
                }).catch(() => {
                });
        },
        async handleConfirm({id, isDelete}) {
            if (isDelete) {
                let {data, error} = await this.$services.chartAccountService.delete(id);
                if (error) {
                    EventBus.$emit('NOTIFICATION_ERROR', {title: 'Delete failed', description: 'Chart of Account used!'});
                }
                if (data) {
                    this.getChartAccounts(this.keyword);
                    this.getCountChartAccounts(this.keyword);
                }
            }
        }
    },
};
</script>
