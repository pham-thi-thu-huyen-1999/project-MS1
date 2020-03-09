<template>
    <section class="client-in-management">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-6">
                        <page-title :titles="titles" />
                    </div>
                    <div class="col-6 text-right">
                        <div class="dropdown normal-btn">
                            <button
                                class="btn dropdown-toggle not-arrow"
                                type="button"
                                v-if="!showDisabled"
                                @click="showClientsDisabled(true)"
                            >
                                DISABLED LIST
                            </button>
                            <button
                                class="btn dropdown-toggle not-arrow"
                                type="button"
                                v-else
                                @click="showClientsDisabled(false)"
                            >
                                LIST CLIENT MANAGEMENT
                            </button>
                        </div>
                        <div class="dropdown normal-btn">
                            <button
                                @click="createClient"
                                class="btn dropdown-toggle not-arrow"
                                type="button"
                            >
                                ADD NEW
                            </button>
                        </div>
                    </div>
                    <div class="col-12 page-filter">
                        <product-lookup
                            v-model="condition.product"
                            :query-code="$route.query.productCode"
                            :autoSelect="condition.autoSelect"
                            :isSelectAll="true"
                            :exclude-codes="[this.$store.state.productCode]"
                        />
                        <lookup-keyword
                            v-model="condition.keyword"
                            :isSelectAll="false"
                        />
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <div class="row">
                    <div class="col-md">
                        <div
                            v-if="total"
                            class="box"
                        >
                            <div class="row row-label">
                                <div class="col-3"><label class="col-label">Clients (Total {{total}})</label></div>
                                <!-- <div class="col text-center"><label class="col-label">ABN NO.</label></div> -->
                                <div class="col text-center"><label class="col-label">Products</label></div>
                                <div class="col text-center"><label class="col-label">Managements</label></div>
                                <div class="col text-center"><label class="col-label">Last Access</label></div>
                                <div class="col text-center"><label class="col-label">Cruncher status</label></div>
                                <div class="col-1 text-center"><label class="col-label">dashboard</label></div>
                                <div class="col-1 text-right"><label class="col-label">Options</label></div>
                            </div>
                            <div class="box-item pdr-15">
                                <div
                                    class="row row-item"
                                    v-for="(client, index) in list"
                                    :key="index"
                                >
                                    <div class="col-3 align-self-center">
                                        <img
                                            class="item-img"
                                            :src="client.avatar || '/images/default-avatar.jpg'"
                                            title=""
                                            alt=""
                                        />
                                        <span
                                            class="item-name"
                                            :title="client.businessInfo && client.businessInfo.entityName ? client.businessInfo.entityName : client.fullName"
                                        >{{client.businessInfo && client.businessInfo.entityName ? client.businessInfo.entityName : client.fullName}}</span>
                                        <span
                                            class="item-email"
                                            :title="client.businessInfo && client.businessInfo.abnCode ? client.businessInfo.abnCode : client.email"
                                        >{{client.businessInfo && client.businessInfo.abnCode ? client.businessInfo.abnCode : client.email}}</span>
                                    </div>
                                    <!-- <div class="col align-self-center text-center">
                                        <span class="item-abn">{{client.abn}}</span>
                                    </div> -->
                                    <div class="col align-self-center text-center">
                                        <!--<span class="item-normal" v-for="(item, index) in client.permission.products" :key="index" v-if="index === 0">
                                            {{item.name}}
                                        </span>-->
                                        <span
                                            class="item-normal"
                                            v-if="client.permission && client.permission.product"
                                        >
                                            {{client.permission.product.name}}
                                        </span>
                                    </div>
                                    <div class="col align-self-center text-center col-static">
                                        <ul
                                            class="item-managements"
                                            @click="openBoxManager(client._id)"
                                        >
                                            <template v-if="listAvatarManager[index] && listAvatarManager[index].managers.length > 3">
                                                <li
                                                    class="item-managements-child"
                                                    v-for="(item, idx) in 2"
                                                    :key="idx"
                                                >
                                                    <img
                                                        class="item-managements-img"
                                                        :src="listAvatarManager[index].managers[idx].avatar ? listAvatarManager[index].managers[idx].avatar : '/images/default-avatar.jpg'"
                                                    />
                                                </li>
                                                <li class="item-managements-child">
                                                    <span class="item-managements-img"><span class="item-managements-num">+{{client.countManagement - 2}}</span></span>
                                                </li>
                                            </template>
                                            <template v-if="listAvatarManager[index] && listAvatarManager[index].managers.length <= 3">
                                                <li
                                                    class="item-managements-child"
                                                    v-for="(item, idx) in listAvatarManager[index].managers"
                                                    :key="idx"
                                                >
                                                    <img
                                                        class="item-managements-img"
                                                        :src="item.avatar ? item.avatar : '/images/default-avatar.jpg'"
                                                    />
                                                </li>
                                            </template>
                                        </ul>
                                        <box-manager
                                            :id="client._id"
                                            ref="boxManagers"
                                        ></box-manager>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span
                                            v-if="client.lastAccess"
                                            :class="{green: isNearTime}"
                                            class="item-status"
                                        >{{client.lastAccess | formatDate}} {{client.lastAccess | formatTime}}</span>
                                        <span
                                            v-if="!client.lastAccess"
                                            class="red item-status"
                                        >Not yet</span>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <!-- <span :class="{green:index===0, red:index===1, miss:index===3}"  class="item-status">
                                            <img class="item-miss" src="~/assets/images/noti-misscrunch.svg" alt="" title="">
                                            {{client.statusCrunch}}
                                        </span> -->

                                        <span
                                            class="item-status"
                                            v-if="client.crunchStatus && client.crunchStatus.status && client.crunchStatus.status.amendedAt"
                                        >
                                            Amendments
                                        </span>
                                        <span
                                            class="green item-status"
                                            v-else-if="client.crunchStatus && client.crunchStatus.status && client.crunchStatus.status.completedAt"
                                        >
                                            Completed
                                        </span>
                                        <!-- <span class="item-status" v-else-if="client.crunchStatus && client.crunchStatus.status && client.crunchStatus.status.completedAt">
                                            Awaiting Approval
                                        </span> -->
                                        <span
                                            class="red item-status"
                                            v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.startedAt && client.crunchStatus.status.overdue > 0"
                                        >
                                            Overdue {{client.crunchStatus.status.overdue}} days
                                        </span>
                                        <span
                                            class="item-status"
                                            v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.startedAt"
                                        >
                                            Not started
                                        </span>
                                        <span
                                            class="green item-status"
                                            v-else-if="client.crunchStatus && client.crunchStatus.status && client.crunchStatus.status.startedAt"
                                        >
                                            Inprogress
                                        </span>
                                        <span
                                            class="item-status"
                                            v-else
                                        >
                                            No data
                                        </span>

                                        <!-- <ul v-if="client.crunchStatus && client.crunchStatus.details && client.crunchStatus.details.length > 0" class="item-list-crunch">
                                            <li class="list-crunch-label">
                                                <span class="crunch-label">Month</span>
                                                <span class="crunch-label">Bank</span>
                                                <span class="crunch-label">Credit card</span>
                                            </li>
                                            <li v-for="(crunch, index) in client.crunchStatus.details" :key="index" class="list-crunch-item">
                                                <span class="crunch-item-month" >{{crunch.month | convertMonthToWord}} {{crunch.year | sliceString}}</span>

                                                <template v-for="(status, index) in crunch.status">
                                                    <span class="crunch-item-status" :key="index" v-show="index === 0 | index === (crunch.status.length - 1)">
                                                        {{status.text}}
                                                    </span>
                                                </template>
                                            </li>
                                            <li class="list-crunch-item">
                                                <span class="crunch-item-month">July 17</span>
                                                <span class="crunch-item-status">Completed</span>
                                                <span class="crunch-item-status">Completed</span>
                                            </li>
                                            <li class="list-crunch-item">
                                                <span class="crunch-item-month">August 17</span><span class="crunch-item-status">Completed</span><span class="crunch-item-status">Completed</span>
                                            </li>
                                            <li class="list-crunch-item">
                                                <span class="crunch-item-month">September 17</span><span class="crunch-item-status red">Overdue 30 days</span><span class="crunch-item-status">Completed</span>
                                            </li>
                                            <li class="list-crunch-item">
                                                <span class="crunch-item-month">October 17</span><span class="crunch-item-status">Awaiting approval</span><span class="crunch-item-status">Awaiting approval</span>
                                            </li>
                                            <li class="list-crunch-item">
                                                <span class="crunch-item-month">November 17</span><span class="crunch-item-status green">In progress</span><span class="crunch-item-status">Awaiting approval</span>
                                            </li>
                                        </ul> -->

                                    </div>
                                    <div class="col-1 align-self-center text-center">
                                        <button
                                            class="btn-normal"
                                            @click="viewCrunch(client)"
                                        >VIEW</button>
                                        <!-- <nuxt-link :to="`/client/${client._id}/transaction`" class="btn-normal">VIEW</nuxt-link> -->
                                    </div>
                                    <div class="col-1 align-self-center text-right">
                                        <div class="dropdown">
                                            <a
                                                class="item-option dropdown-toggle"
                                                :data-toggle="$auth.checkPermission($module.MANAGER.claim.ASSIGN_MANAGER.code, client.permission.role.code) || $auth.checkPermission($module.MANAGER.claim.DELETE.code, client.permission.role.code) ? 'dropdown' : 'dropdown'"
                                            >
                                                ...
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li v-if="$auth.checkPermission($module.MANAGER.claim.ASSIGN_MANAGER.code, client.permission.role.code)"><a
                                                        class="option-item"
                                                        @click="openAssignManager(client._id, client.fullName, client.email,  client.permission.product.code, client.permission.role.code)"
                                                    >Assign Managers</a></li>
                                                <li v-if="$auth.checkPermission($module.MANAGER.claim.DELETE_CLIENT.code, client.permission.role.code) && !showDisabled"><a
                                                        class="option-item red"
                                                        data-toggle="modal"
                                                        @click="confirmDeleteClient(client._id)"
                                                    >Disable Client</a></li>
                                                <li v-if="$auth.checkPermission($module.MANAGER.claim.DELETE_CLIENT.code, client.permission.role.code) && showDisabled"><a
                                                        class="option-item red"
                                                        data-toggle="modal"
                                                        @click="confirmRestoreClient(client._id)"
                                                    >Restore Client</a></li>
                                                <li><a
                                                        class="option-item blue"
                                                        data-toggle="modal"
                                                        @click="addFinancialYear(client)"
                                                    >Add Financial Year</a></li>
                                            </ul>
                                        </div>
                                        <assign-managers
                                            @close="handleClose"
                                            :id="'manager_' + client._id"
                                            ref="AssignManagers"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="box"
                            v-else
                        >
                            <div class="row row-label">
                                <div class="col-3"><label class="col-label">Clients (Total {{total}})</label></div>
                                <div class="col text-center"><label class="col-label">ABN NO.</label></div>
                                <div class="col text-center"><label class="col-label">Products</label></div>
                                <div class="col text-center"><label class="col-label">Managements</label></div>
                                <div class="col text-center"><label class="col-label">Last Access</label></div>
                                <div class="col text-center"><label class="col-label">Cruncher status</label></div>
                                <div class="col-1 text-center"><label class="col-label">dashboard</label></div>
                                <div class="col-1 text-right"><label class="col-label">Options</label></div>
                            </div>
                            <div class="no-data text-center">
                                <img
                                    src="~/assets/images/no-data.png"
                                    alt="no data"
                                >
                                <p class="text-note">No data available.</p>
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
                        <popup-confirm
                            id="popup-confirm"
                            ref="popupConfirm"
                            :title="confirm.title"
                            :buttonName1="confirm.buttonName1"
                            buttonName2="Cancel"
                            @success="handleConfirm"
                        />
                        <add-financial-year-popup
                            id="add-financial"
                            ref="addFinancialYearPopup"
                            :title="confirm.title"
                        />
                        <client-detail
                            ref="clientDetail"
                            id="client-detail"
                            @success="handleSuccess"
                        />
                        <popup-confirm
                            id="popup-confirm-financial-year"
                            ref="popupConfirmFinancialYear"
                            :title="confirmFinancialYear.title"
                            :buttonName1="confirmFinancialYear.buttonName1"
                            buttonName2="Cancel"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import ProductLookup from '~/components/product/ProductLookup';
import LookupKeyword from '~/components/LookupKeyword';
import Pagination from '~/components/Pagination';
import HistoryLogs from '~/components/HistoryLogs';
import PopupConfirm from '~/components/PopupConfirm';
import AddFinancialYearPopup from '~/components/Report/AddFinancialYearPopup';
import BoxManager from '~/components/BoxManager';
import AssignManagers from '~/components/AssignManagers';
import {convertMonthToWord, formatDate, formatTime} from '~/helpers/dateHelper';
import ClientDetail from '~/components/user/ClientDetail';
import {mapUrlGoogleStorage, changePageManagementSearch} from '~/helpers/dataHelper';
import PageTitle from '~/components/PageTitle';

export default {
    data() {
        return {
            list: [],
            condition: {
                keyword: '',
                product: null,
                autoSelect: true
            },
            confirm: {
                title: '',
                buttonName1: ''
            },
            confirmFinancialYear: {
                title: '',
                buttonName1: ''
            },
            showDisabled: false,
            page: 1,
            limit: 10,
            total: 1,
            timeout: null,
            listAvatarManager: [],
            isNearTime: false,
            titles: ['Client management'],
            pageSearch: 0,
        };
    },
    components: {
        ProductLookup,
        Pagination,
        HistoryLogs,
        BoxManager,
        LookupKeyword,
        AssignManagers,
        PopupConfirm,
        AddFinancialYearPopup,
        ClientDetail,
        PageTitle
    },
    created() {
        this.showDisabled = this.$route.query.showDisabled === 'true';
        if (this.$route.query.page)
            this.pageSearch = this.$route.query.page;
    },
    mounted() {
        $(document).on('click', function(e) {
            if ($(e.target).is('.item-managements, .box-manager') === false) {
                $('.box-manager').removeClass('active');
            }
        });
    },
    watch: {
        'condition.keyword': function(value) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.search(), 1200);
        },
        'condition.product': {
            handler(value) {
                this.search();
            },
            deep: true
        }
    },
    methods: {
        reset() {
            if (this.pageSearch) {
                this.list = [];
                this.page = Number(this.pageSearch);
                this.total = 0;
            }
            else {
                this.list = [];
                this.page = 1;
                this.total = 1;
            }
        },
        async search() {
            this.reset();
            await this.getClients();
            this.getCountClients();
        },
        async getClients() {
            this.$setLoading();
            let clientIds = [];
            this.list = [];
            let productCodes = this.condition && this.condition.product && this.condition.product.code ? [this.condition.product.code] : [];
            let {data, error} = await this.$services.userService.getClients(productCodes, [], this.condition.keyword, this.showDisabled, this.page, this.limit);
            if (error)
                return false;
            if (data && data.length) {
                data.forEach(client => {
                    client.avatar = mapUrlGoogleStorage(client.avatar);
                    clientIds.push(client._id);
                    if (client.lastAccess)
                        this.compareLastAcessAndNowDate(new Date(client.lastAccess), new Date());
                });
                let crunchStatus = await this.$services.userService.getCrunchStatus(clientIds);
                let countManagement = await this.$services.userService.getCountManagersByUsers([this.$store.state.productCode], [], clientIds);
                await this.getAvatarManagers(clientIds);
                if (crunchStatus && crunchStatus.data && countManagement && countManagement.data) {
                    let crunchData = crunchStatus.data;
                    let managementData = countManagement.data;

                    data.forEach((item, index) => {
                        if (item._id === crunchData[index].userId) {
                            let crunchsStatus = crunchData[index].details;

                            crunchsStatus.sort((a, b) => {
                                if (b.year === a.year)
                                    return b.month - a.month;
                                return b.year - a.year;
                            });

                            let tmp = [];

                            crunchsStatus.forEach(status => {
                                let merge = tmp.find(s => s.month === status.month && s.year === status.year);
                                let statusCrunch = crunchsStatus.filter(c => c.month === status.month && c.year === status.year);
                                statusCrunch = statusCrunch.map(s => {
                                    let text = 'Not Start';
                                    if (s.isNoTransaction) {
                                        text = 'No Data';
                                    }
                                    if (s.overdue && s.overdue) {
                                        text = `Overdue ${s.overdue} days`;
                                    }
                                    if (s.overdue && !s.overdue) {
                                        text = `Inprogress`;
                                    }

                                    if (s.amendedAt) {
                                        text = 'Amendments';
                                    }
                                    if (s.completedAt) {
                                        // if (s.approvedAt)
                                        text = 'Completed';
                                        // else
                                        //     text = 'Awaiting Approval';
                                    }
                                    return {
                                        type: s.type,
                                        text: text
                                    };
                                });
                                statusCrunch.sort((a, b) => {
                                    return a.type - b.type;
                                });
                                if (!merge) {
                                    let obj = {
                                        month: status.month,
                                        year: status.year,
                                        status: statusCrunch,
                                    };
                                    tmp.push(obj);
                                }
                            });
                            crunchData[index].details = tmp;
                            item.crunchStatus = crunchData[index];
                        }
                        if (item._id === managementData[index]._id) {
                            item.countManagement = managementData[index].count;
                        }
                    });
                }
                this.list = data;
            }
            this.$setLoading(false);
        },
        async getCountClients() {
            let productCodes = this.condition && this.condition.product && this.condition.product.code ? [this.condition.product.code] : [];
            let {data, error} = await this.$services.userService.getCountClients(productCodes, this.condition.keyword, this.showDisabled);
            if (error)
                return false;
            this.total = data;
        },
        async changePage(page) {
            this.page = page;
            this.pageSearch = page;
            changePageManagementSearch('page', page);
            this.getClients();
        },
        showClientsDisabled(value) {
            this.showDisabled = value;
            this.search();
        },
        createClient() {
            this.$refs.clientDetail.open();
        },
        async handleSuccess({data, isNew}) {
            let dataAsignCoas = {
                clientId: data._id,
                product: data.permission.product
            };
            let {result, error} = await this.$services.systemService.assignCoas(dataAsignCoas);
            if (error) {
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Auto asign coas failed !'
                });
            }
            if (isNew && result)
                this.search();
        },
        openAssignManager(_id, fullName, email, productCode, roleCode) {
            this.$refs.AssignManagers.find(b => b.id === 'manager_' + _id).open(_id, fullName, email, productCode, roleCode, 'CLIENT_MANAGEMENT');
        },
        openBoxManager(_id) {
            $('.box-manager').removeClass('active');
            this.$refs.boxManagers.find(b => b.id === _id).open(_id);
        },
        confirmDeleteClient(_id) {
            this.confirm = {
                title: 'Are you sure want to disable this Client?',
                buttonName1: 'Disable'
            };
            this.$refs.popupConfirm.open({_id, isDelete: true});
        },
        confirmRestoreClient(_id) {
            this.confirm = {
                title: 'Are you sure want to restore this Client?',
                buttonName1: 'Restore'
            };
            this.$refs.popupConfirm.open({_id, isRestore: true});
        },
        async addFinancialYear(client) {
            let user = await this.$services.userService.getUserByEmail(client.email);
            let bankConnect = await this.$services.statementService.checkConnectBank(user.data._id);

            if (!bankConnect || !bankConnect.data.length) {
                this.confirmFinancialYear.title = 'Please Connect Bank First!';
                this.confirmFinancialYear.buttonName1 = 'Close';
                this.$refs.popupConfirmFinancialYear.open();
            }
            else {
                this.confirm = {
                    title: 'ADD FINANCIAL YEAR',
                };
                this.$refs.addFinancialYearPopup.open(user, bankConnect);
            }
        },

        closeModal() {
            this.$refs.modal.close();
        },
        async handleConfirm({_id, isDelete, isRestore}) {
            if (isDelete)
                await this.$services.userService.deleteUser(_id);
            else if (isRestore)
                await this.$services.userService.restoreUser(_id);
            this.search();
        },
        viewCrunch(client) {
            if (this.pageSearch === 0 || this.pageSearch === undefined) {
                this.pageSearch = 1;
            }
            changePageManagementSearch('page', this.pageSearch);
            this.$router.push({path: `/client/${client._id}/bank-connection`});
        },
        async getAvatarManagers(clientIds) {
            let {data, error} = await this.$services.userService.getManagersByUsers([], [], clientIds);
            if (error)
                return false;
            else {
                data.forEach(item => {
                    item.managers.forEach((manager) => {
                        if (manager.avatar)
                            manager.avatar = mapUrlGoogleStorage(manager.avatar);
                    });
                });
                this.listAvatarManager = data;
            }
        },
        async ApproveCruncher(clientId, type, year, month, permission) {
            let fromEmail = this.$store.state.userAuth.profile.email || '';
            let msg = {
                fromEmail: fromEmail,
                listManagers: permission ? permission.managers : [],
                productId: permission ? permission.product._id : 0,
            };
            await this.$services.crunchService.updateApprove(clientId, type, year, month, msg);
        },
        async compareLastAcessAndNowDate(lastAccess, current) {
            if (!lastAccess || !current)
                return;
            if (current.getTime() - lastAccess.getTime() < 3600000)
                this.isNearTime = true;
            else
                this.isNearTime = false;
        },
        handleClose() {
            this.search();
        },
    },
    filters: {
        formatDate,
        formatTime,
        convertMonthToWord(month) {
            if (month) {
                return convertMonthToWord(month);
            }
            return '';
        },
        sliceString(word) {
            if (!word) return '';
            return word.toString().slice(2);
        }
    },
    destroyed() {
        // let storage = localStorage.page && JSON.parse(localStorage.page);
        // if (storage)
        //     localStorage.removeItem('page');
    }
};
</script>
