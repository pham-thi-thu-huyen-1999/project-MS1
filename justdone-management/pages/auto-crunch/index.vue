<template>
    <section class="crunch-auto">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-6">
                        <page-title :titles="titles" />
                    </div>
                    <div class="col-6 text-right">
                        <div class="dropdown normal-btn">
                            <nuxt-link
                                :to="'/auto-crunch/create-condition'"
                                class="btn dropdown-toggle not-arrow"
                            >
                                CREATE NEW
                            </nuxt-link>
                        </div>
                    </div>
                    <div class="col-12 page-filter">
                        <lookup-manager
                            v-show="$auth.checkPermission($module.AUTOCRUNCHER.claim.GET_MANAGER.code, this.RoleCaseManager)"
                            v-model="condition.manager"
                        />
                        <dropdown-date-picker
                            :multiple="true"
                            :value="dataPicker"
                            v-model="condition.date"
                        />
                        <lookup-type v-model="isGlobal" />
                        <lookup-keyword v-model="condition.keyword" />
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <!-- <div class="box" v-if="!crunchFilter.list || crunchFilter.list.length < 1">
                            <div class="no-data">
                                No data.
                            </div>
                        </div> -->
                        <div class="box">
                            <div class="row row-label">
                                <div class="col"><label class="col-label">Crunch type</label></div>
                                <div class="col"><label class="col-label">Coa</label></div>
                                <div class="col"><label class="col-label">bank</label></div>
                                <div class="col"><label class="col-label">Account Type</label></div>
                                <div class="col"><label class="col-label">type</label></div>
                                <div class="col-2"><label class="col-label">created by</label></div>
                                <div class="col"><label class="col-label">created date</label></div>
                                <div class="col text-center"><label class="col-label">quantity</label></div>
                                <div class="col-1 text-right"><label class="col-label">Options</label></div>
                            </div>
                            <div
                                class="box-item pdl-0 pdr-0"
                                v-if="!crunchFilter.list.length"
                            >
                                <div class="no-data text-center">
                                    <img
                                        src="~/assets/images/no-data.png"
                                        alt="no data"
                                    >
                                    <p class="text-note">No data available.</p>
                                </div>
                            </div>
                            <div
                                class="box-item pdr-15"
                                v-else
                            >
                                <div
                                    class="row row-item"
                                    v-for="(crunch, index) in crunchFilter.list"
                                    :key="index"
                                >
                                    <div class="col align-self-center">
                                        <span class="item-normal">
                                            {{ crunch.groupName }}
                                        </span>
                                    </div>
                                    <div class="col align-self-center">
                                        <span class="item-normal">
                                            {{ crunch.coaName }}
                                        </span>
                                    </div>
                                    <div class="col align-self-center">
                                        <span class="item-normal">
                                            {{ crunch.bank.length ? crunch.bank[0].name : 'None'}}
                                        </span>
                                    </div>
                                    <div class="col align-self-center">
                                        <span class="item-normal">
                                            {{ crunch.accountType | changeACtype }}
                                        </span>
                                    </div>
                                    <div class="col align-self-center">
                                        <span class="item-normal">
                                            {{ crunch.isGlobal ? 'Global' : 'Specific' }}
                                        </span>
                                    </div>

                                    <div class="col-2 align-self-center">
                                        <img
                                            class="item-img"
                                            :src="'/images/default-avatar.jpg'"
                                            title=""
                                            alt=""
                                        />
                                        <span
                                            class="item-name"
                                            :title="crunch.user && crunch.user.fullName"
                                        >{{crunch.user && crunch.user.fullName}}</span>
                                        <span
                                            class="item-email"
                                            :title="crunch.user && crunch.user.email"
                                        >{{crunch.user && crunch.user.email}}</span>
                                    </div>
                                    <div class="col align-self-center">
                                        <span class="item-normal">
                                            {{crunch.createdAt | formatDate}}
                                        </span>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span class="item-normal">
                                            {{crunch.used}}
                                        </span>
                                    </div>
                                    <div class="col-1 align-self-center text-right">
                                        <div
                                            class="dropdown"
                                            v-if="accessAction()"
                                        >
                                            <a
                                                class="item-option dropdown-toggle"
                                                data-toggle="dropdown"
                                            >
                                                ...
                                            </a>
                                            <ul class="dropdown-menu bot custom">
                                                <li>
                                                    <a
                                                        class="option-item"
                                                        @click="updateCrunchFilter(crunch._id, pageSearch)"
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
                                                        class="option-item dropdown-toggle"
                                                        @click="deleteCrunchFilter(crunch._id)"
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
                                    :page="crunchFilter.page"
                                    :limit="crunchFilter.limit"
                                    :total="crunchFilter.total"
                                    @change="changePage"
                                />
                            </client-only>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import LookupKeyword from '~/components/LookupKeyword';
import LookupManager from '~/components/LookupManager';
import Pagination from '~/components/Pagination';
import PageTitle from '~/components/PageTitle';
import DropdownDatePicker from '~/components/DropdownDatePicker';
import LookupType from '~/components/LookupType';
import {formatDate} from '~/helpers/dateHelper';
import {RoleCode} from '~/common/commonType';
import {changePageSearch} from '~/helpers/dataHelper';

export default {
    data() {
        return {
            crunchFilter: {
                list: [],
                page: 1,
                limit: 10,
                total: 0
            },
            condition: {
                keyword: '',
                date: {
                    start: '',
                    end: ''
                },
                isGlobal: true,
                manager: {
                    _id: ''
                }
            },
            titles: ['Automation Crunch'],
            dataPicker: {
                start: '',
                end: ''
            },
            confirm: {
                title: '',
                buttonName1: ''
            },
            RoleCaseManager: 0,
            isGlobal: '',
            user: null,
            pageSearch: 0
        };
    },
    components: {
        Pagination,
        PageTitle,
        LookupKeyword,
        LookupManager,
        DropdownDatePicker,
        LookupType,
    },
    created() {
        if (this.$router.page)
            this.pageSearch = this.$router.page;
        this.RoleCaseManager = RoleCode.CaseManager;
        this.user = this.$store.state.userAuth;
        if (this.$route.query.page) {
            this.crunchFilter.list = [];
            this.crunchFilter.page = Number(this.$route.query.page);
            this.crunchFilter.total = 0;
        }
        else {
            this.crunchFilter.list = [];
            this.crunchFilter.page = 1;
            this.crunchFilter.total = 0;
        }
        this.search();
    },
    watch: {
        'isGlobal': {
            handler(value) {
                this.condition.isGlobal = JSON.parse(value);
                this.search();
            },
            deep: true
        },
        'condition.keyword': function(value) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.search(), 800);
        },
        'condition.manager': {
            handler(value) {
                this.search();
            },
            deep: true
        },
        'condition.date': {
            handler(value) {
                this.search();
            },
            deep: true
        }
    },
    methods: {
        search() {
            this.fetchCrunchFilter();
        },
        async getCrunchFilter() {
            let {data} = await this.$services.crunchService.getCrunchFilter(this.condition.manager && this.condition.manager._id, this.condition.isGlobal, this.condition.date.start, this.condition.date.end, this.condition.keyword, this.crunchFilter.page, this.crunchFilter.limit);
            this.crunchFilter.list = data || [];
        },
        async getCountCrunchFilter() {
            let {data} = await this.$services.crunchService.getCountCrunchFilter(this.condition.manager && this.condition.manager._id, this.condition.isGlobal, this.condition.date.start, this.condition.date.end, this.condition.keyword, this.crunchFilter.page, this.crunchFilter.limit);
            this.crunchFilter.total = data || 0;
        },
        async fetchCrunchFilter() {
            this.$setLoading();
            await this.getCrunchFilter();
            await this.getCountCrunchFilter();
            this.$setLoading(false);
        },
        changePage(page) {
            this.crunchFilter.page = page;

            this.getCrunchFilter();
            changePageSearch('page', page);
        },
        updateCrunchFilter(_id) {
            if (this.pageSearch === 0)
                this.pageSearch = 1;

            changePageSearch('page', this.pageSearch);
            this.$router.push(`/auto-crunch/create-condition?id=${_id}&page=${this.pageSearch}`);
        },
        deleteCrunchFilter(_id) {
            this
                .$notify({
                    type: 'warning',
                    titleText: 'Are you sure to delete this item?'
                })
                .then(() => {
                    this.handleConfirm({_id, isDelete: true});
                })
                .catch(() => { })
            ;
        },
        async handleConfirm({_id, isDelete}) {
            if (isDelete) {
                let {data, error} = await this.$services.crunchService.deleteCrunchFilter(_id);
                if (!data || error)
                    return false;

                if (this.crunchFilter.total - 1 <= this.crunchFilter.limit)
                    this.crunchFilter.page = 1;
                this.fetchCrunchFilter();
            }
        },
        accessAction() {
            if (this.user) {
                if (this.user.permission.role.code === RoleCode.CaseManager) {
                    if (this.condition.isGlobal)
                        return false;
                    else
                        return true;
                }
                else if (this.user.permission.role.code === RoleCode.SuperAdmin) {
                    return true;
                }
                else
                    return false;
            }
            else
                return false;
        }
    },
    filters: {
        changeACtype(item) {
            if (item && item === 1)
                return 'Bank';
            else if (item && item === 2)
                return 'Credit Card';
            else
                return 'None';
        },
        formatDate
    },
    destroyed() {
        let storage = localStorage.page && JSON.parse(localStorage.page);
        if (storage)
            localStorage.removeItem('page');
    }
};
</script>
