<template>
    <section class="team-management">
        <loading :isShowLoading="showLoading"/>
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <!-- <h1 class="page-title bookmark">Team management <i class="fa fa-star-o" aria-hidden="true"></i></h1> -->
                        <page-title :titles="titles"/>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                        <div class="dropdown normal-btn">
                            <button class="btn dropdown-toggle not-arrow" type="button" v-if="!showDisabled" @click="showManagersDisabled(true)">
                                DISABLED LIST
                            </button>
                            <button class="btn dropdown-toggle not-arrow" type="button" v-else @click="showManagersDisabled(false)">
                                LIST MANAGEMENT
                            </button>
                        </div>
                        <div class="dropdown normal-btn">
                            <button class="btn dropdown-toggle not-arrow" type="button" data-toggle="modal" @click="showFormCreate()">
                                ADD NEW
                            </button>
                        </div>
                    </div>
                    <div class="col-12 page-filter">
                        <lookup-keyword v-model="keyword" />
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <div class="row">
                    <div class="col-md">
                        <div class="box" v-if="!total">
                            <div class="row row-label">
                                <div :class="{'col-7': !showDisabled, 'col-8': showDisabled}"><label class="col-label">Managers (Total {{total}})</label></div>
                                <div v-if="!showDisabled" class="col text-center"><label class="col-label">Clients</label></div>
                                <div v-if="!showDisabled" class="col-2 text-center"><label class="col-label">Last login</label></div>
                                <div v-if="showDisabled" class="col-2 text-center"><label class="col-label">time disable</label></div>
                                <div v-if="showDisabled" class="col-2 text-center"><label class="col-label">enable account</label></div>
                                <div v-if="!showDisabled" class="col text-right"><label class="col-label">Options</label></div>
                                <div v-if="!showDisabled" class="col text-right"><label class="col-label">&ensp;</label></div>
                            </div>
                            <div class="box-item no-data">
                                <div class="row row-item" style="">
                                    <div class="no-data text-center">
                                        <img src="~/assets/images/no-data.png" alt="no data">
                                        <p class="text-note">No data available.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="accordion" class="box" v-else>
                            <div class="row row-label">
                                <div :class="{'col-7': !showDisabled, 'col-8': showDisabled}"><label class="col-label">Managers (Total {{total}})</label></div>
                                <div v-if="!showDisabled" class="col text-center"><label class="col-label">Clients</label></div>
                                <div v-if="!showDisabled" class="col-2 text-center"><label class="col-label">Last login</label></div>
                                <div v-if="showDisabled" class="col-2 text-center"><label class="col-label">time disable</label></div>
                                <div v-if="showDisabled" class="col-2 text-center"><label class="col-label">enable account</label></div>
                                <div v-if="!showDisabled" class="col text-right"><label class="col-label">Options</label></div>
                                <div v-if="!showDisabled" class="col text-right"><label class="col-label">&ensp;</label></div>
                            </div>
                            <div class="box-item pdr-15">
                                <div class="row row-item" v-for="(manager, index) in list" :key="index" :id="`row_manager_${manager._id}`">
                                    <div :class="{'col-7': !showDisabled, 'col-8': showDisabled}" class="align-self-center">
                                        <img class="item-img" :src="manager.img" title="" alt="" v-show="manager.img"/> 
                                        <img class="item-img" src="/images/default-avatar.jpg" alt="" v-show="!manager.img">
                                        <span class="item-name" :title="manager.fullName">{{manager.fullName}}</span>
                                        <span class="item-email" :title="manager.email">{{manager.email}}</span>
                                    </div>
                                    <div v-if="!showDisabled" class="col align-self-center text-center">
                                        <span class="item-normal">{{manager.total ? manager.total : 0}}</span>
                                        <loading :isLoadingPage="false" :size="24"/>
                                    </div>
                                    <div v-if="!showDisabled" class="col-2 align-self-center text-center">
                                        <span v-if="manager.lastAccess" :class="{green: isNearTimeManager}" class="item-time">{{manager.lastAccess | formatDate}} {{manager.lastAccess | formatTime}}</span>
                                        <span v-if="!manager.lastAccess" class="red item-time">Not yet</span>
                                    </div>
                                    <div v-if="showDisabled" class="col-2 align-self-center text-center">
                                        <span v-if="manager.lastAccess" :class="{green: isNearTimeManager}" class="item-time">{{manager.lastAccess | formatDate}} {{manager.lastAccess | formatTime}}</span>
                                        <span v-if="!manager.lastAccess" class="red item-time">Not yet</span>
                                    </div>
                                    <div v-if="showDisabled" class="col-2 align-self-center text-center">
                                        <button class="btn-normal" data-toggle="modal" @click="confirmRestoreManager(manager._id)">Restore Manager</button>
                                    </div>
                                    <div v-if="!showDisabled" class="col align-self-center text-center">
                                        <div class="dropdown dropdown-option">
                                            <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                                ...
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li><a class="option-item red" data-toggle="modal" @click="confirmDeleteManager(manager._id)">Disable Manager</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div v-if="!showDisabled" class="col align-self-center text-right">
                                        <a class="item-expand" data-toggle="collapse" :data-target="`#manager-${manager._id}`" @click="showClients(manager)">
                                            <i class="fa fa-caret-down" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                    <div v-if="!showDisabled" class="col-12 collapse box-client-assign" :id="`manager-${manager._id}`" data-parent="#accordion">
                                        <div class="list-client-assign">
                                            <div class="row row-label" v-if="!manager.total">
                                                <div class="no-data text-center small">
                                                    <img src="~/assets/images/no-data.png" alt="no data">
                                                    <p class="text-note">No data available.</p>
                                                </div>
                                            </div>
                                            <div class="row row-label" v-if="manager.total">
                                                <div class="col-3"><label class="col-label">Clients (Total {{manager.total}})</label></div>
                                                <!-- <div class="col"><label class="col-label">Entity name</label></div> -->
                                                <!-- <div class="col"><label class="col-label">ABN NO.</label></div> -->
                                                <div class="col-4"><label class="col-label">Managers</label></div>
                                                <div class="col text-center"><label class="col-label">Last access</label></div>

                                                <div class="col text-center"><label class="col-label">Cruncher status</label></div>
                                                <!--<div class="col text-right"><label class="col-label">Options</label></div>-->
                                            </div>
                                            <div class="box-item box-loading" v-if="manager.total">
                                                <loading :isLoadingPage="false" :fullBox="true" :size="24"/>
                                                <div class="row row-item" v-for="(client, index) in manager.clients" :key="index">
                                                    <div class="col-3 align-self-center">
                                                        <img class="item-img" :src="client.avatar || '/images/default-avatar.jpg'" :title="client.fullName" :alt="client.fullName"/>
                                                        <span class="item-name" :title="client.businessInfo && client.businessInfo.entityName ? client.businessInfo.entityName : client.fullName">{{client.businessInfo && client.businessInfo.entityName ? client.businessInfo.entityName : client.fullName}}</span>
                                                        <span class="item-email" :title="client.businessInfo && client.businessInfo.abnCode ? client.businessInfo.abnCode : client.email">{{client.businessInfo && client.businessInfo.abnCode ? client.businessInfo.abnCode : client.email}}</span>
                                                    </div>
                                                    <!-- <div class="col align-self-center">
                                                        <span class="item-entity">{{client.businessInfo ? client.businessInfo.entityName : ''}}</span>
                                                    </div> -->
                                                    <!-- <div class="col align-self-center">
                                                        <span class="item-abn">{{client.abn  ? client.abn : ''}}</span>
                                                    </div> -->
                                                    <div class="col-4 align-self-center">
                                                        <img class="item-img" v-if="client.permission && client.permission.manager" :src="client.permission.manager.avatar || '/images/default-avatar.jpg'" :title="client.permission.manager.fullName" :alt="client.permission.manager.fullName"/>
                                                        <span class="item-name" :title="client.permission && client.permission.manager && client.permission.manager.fullName">{{client.permission && client.permission.manager && client.permission.manager.fullName}}</span>
                                                        <span class="item-email" :title="client.permission && client.permission.manager && client.permission.manager.email">{{client.permission && client.permission.manager && client.permission.manager.email}}</span>
                                                    <!-- <div  class="col-3 align-self-center">
                                                        <span class="item-manager" @click="openBoxManager(client._id)"> Managers</span>
                                                        <box-manager :id="client._id" ref="boxManagers" /> -->
                                                    </div>
                                                    
                                                    <div class="col align-self-center text-center">
                                                        <span v-if="client.lastAccess" :class="{green: isNearTimeClient}" class="item-time">{{client.lastAccess | formatDate}} {{client.lastAccess | formatTime}}</span>
                                                        <span v-if="!client.lastAccess" class="red item-status">Not yet</span>
                                                    </div>
                                                    <div class="col align-self-center text-center">
                                                        <span v-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue === 0 && !client.crunchStatus.status.isFinished" class="item-status">
                                                            Not started
                                                        </span>

                                                        <span v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue > 7" class="red item-status">
                                                            Overdue {{client.crunchStatus.status.overdue}} days
                                                        </span>

                                                        <span v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue > 9" class="green item-status">
                                                            Inprogress ()
                                                        </span>

                                                        <span v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.isFinished" class="item-status">
                                                            Completed
                                                        </span>

                                                        <!-- <span class="miss item-status">
                                                            <img class="item-miss" src="~/assets/images/noti-misscrunch.svg" alt="" title="">
                                                            {{item.crunchStatus}}
                                                        </span> -->
                                                        <span v-else class="item-status">
                                                            no data
                                                        </span>

                                                        <ul v-if="client.crunchStatus && client.crunchStatus.details && client.crunchStatus.details.length > 0" class="item-list-crunch">
                                                            <li class="list-crunch-label">
                                                                <span class="crunch-label">Month</span>
                                                                <span class="crunch-label">Bank</span>
                                                                <span class="crunch-label">Credit card</span>
                                                            </li>
                                                            <li v-for="(crunch, index) in client.crunchStatus.details" :key="index" class="list-crunch-item">
                                                                <span class="crunch-item-month" >{{crunch.month | convertMonthToWord}} {{crunch.year | sliceString}}</span>
                                                                <template v-if="crunch ===1">
                                                                    <span v-if="!crunch.isFinished && crunch.overdue && crunch.overdue === 0" class="crunch-item-status">
                                                                        Not started
                                                                    </span>

                                                                    <span v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 7" class="red crunch-item-status">
                                                                        Overdue {{crunch.overdue}} days
                                                                    </span>

                                                                    <span v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 9" class="green crunch-item-status">
                                                                        Inprogress
                                                                    </span>

                                                                    <span v-else-if="crunch.isFinished" class="crunch-item-status">
                                                                        Completed
                                                                    </span>

                                                                    <span class="crunch-item-status" v-else>
                                                                        no data
                                                                    </span>
                                                                </template>
                                                                <template v-if="crunch.type === 2">
                                                                    <span v-if="!crunch.isFinished && crunch.overdue && crunch.overdue === 0" class="crunch-item-status">
                                                                        Not started
                                                                    </span>

                                                                    <span v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 7" class="red crunch-item-status">
                                                                        Overdue {{crunch.overdue}} days
                                                                    </span>

                                                                    <span v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 9" class="green crunch-item-status">
                                                                        Inprogress ()
                                                                    </span>

                                                                    <span v-else-if="crunch.isFinished" class="crunch-item-status">
                                                                        Completed
                                                                    </span>

                                                                    <span class="crunch-item-status" v-else>
                                                                        no data
                                                                    </span>
                                                                </template>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <!--<div class="col align-self-center text-right">
                                                        <div class="dropdown">
                                                            <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                                                ...
                                                            </a>
                                                            <ul class="dropdown-menu">
                                                                <li><a class="option-item red" @click="confirmDeleteClient(client._id)">Disable Account</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>-->
                                                </div>
                                            </div>
                                            <div class="paginate">
                                                <pagination :id="manager._id" :page="manager.page" :limit="manager.limit" :total="manager.total" @change="changePageClient" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-auto">
                        <!-- <started-list></started-list> -->
                        <history-logs></history-logs>
                        <popup-confirm id="popup-confirm" ref="popupConfirm" :title="confirm.title" :buttonName1="confirm.buttonName1" buttonName2="Cancel" @success="handleConfirm"/>
                    </div>
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <pagination id="team-pagination" :page="page" :limit="limit" :total="total" @change="changePage" />
                    </div>
                </div>
            </div>
        </div>
        <add-product-manager ref="formCreate" @success="handleSuccess"/>
    </section>
</template>

<script>
import SortBy from '~/components/SortBy';
import LookupKeyword from '~/components/LookupKeyword';
import Pagination from '~/components/Pagination';
import StartedList from '~/components/StartedList';
import HistoryLogs from '~/components/HistoryLogs';
import AddProductManager from '~/components/TeamManagement/AddProductManager';
import PopupConfirm from '~/components/PopupConfirm';
import Loading from '~/components/Loading';
import BoxManager from '~/components/BoxManager';
import {RoleCode} from '~/common/commonType';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import {formatDate, formatTime} from '~/helpers/dateHelper';
import PageTitle from '~/components/PageTitle';
import EventBus from '~/plugins/event-bus';

export default {
    data: () => ({
        keyword: '',
        list: [],
        page: 1,
        limit: 10,
        total: 0,
        showDisabled: false,
        timeout: null,
        confirm: {
            title: '',
            buttonName1: ''
        },
        titles: ['Team management'],
        showLoading: true,
        isLoad: false,
        managerShowed: {},
        isNearTimeManager: false,
        isNearTimeClient: false,
    }),
    components: {
        SortBy,
        Pagination,
        StartedList,
        HistoryLogs,
        AddProductManager,
        PopupConfirm,
        BoxManager,
        LookupKeyword,
        Loading,
        PageTitle,
    },
    created() {
        this.search();
    },
    watch: {
        keyword: function(value) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.search(), 1200);
        }
    },
    methods: {
        reset() {
            this.list = [];
            this.page = 1;
            this.total = 0;
            this.managerShowed = {};
        },
        async search() {
            this.reset();
            await this.getManagers();
            await this.getCountManagers();
            this.showLoading = false;
        },
        async getManagers() {
            this.showLoading = true;
            let {data, error} = await this.$services.userService.getManagers([this.$store.state.productCode], [RoleCode.ProductManager], this.keyword, this.showDisabled, this.page, this.limit);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            if (data) {
                data.forEach(item => {
                    item.avatar = mapUrlGoogleStorage(item.avatar);
                    if (item.lastAccess)
                        this.compareLastAcessAndNowDate(new Date(item.lastAccess), new Date(), 1);
                });
                this.list = data;

                let managerIds = this.list.map(item => item._id);
                let result = await this.$services.userService.getCountClientsByManagers(this.$store.state.productCode, managerIds, '', this.showDisabled);

                if (result.error)
                    EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: result.error});
                else {
                    result.data.forEach(item => {
                        let manager = this.list.find(manager => manager._id === item._id);
                        if (manager)
                            manager.total = item.count;
                    });
                    this.$forceUpdate();
                }
            }
            this.showLoading = false;
        },
        async getCountManagers() {
            this.showLoading = true;
            let {data, error} = await this.$services.userService.getCountManagers([this.$store.state.productCode], [RoleCode.ProductManager], this.keyword, this.showDisabled);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            this.total = data || 0;
            this.showLoading = false;
        },
        async showClients(manager) {
            $('.row-item').removeClass('bg-show');
            this.isLoad = false;
            this.showLoading = true;
            if (!manager) {
                this.showLoading = false;
                return;
            }
            if ($(`#manager-${manager._id}`).hasClass('show')) {
                $(`#row_manager_${manager._id}`).removeClass('bg-show');
                this.isLoad = true;
                this.showLoading = false;
            }
            manager.page = 1;
            manager.limit = 5;
            manager.total = 0;

            if (!this.isLoad) {
                $(`#row_manager_${manager._id}`).addClass('bg-show');
                await this.getClientsByManager(manager);
                await this.getCountClientsByManager(manager);
                this.showLoading = false;
            }
            this.managerShowed = manager;
        },
        async getClientsByManager(manager) {
            this.showLoading = true;
            if (!manager)
                return;

            let {data, error} = await this.$services.userService.getClientsByManager([this.$store.state.productCode], manager._id, '', this.showDisabled, manager.page, manager.limit);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            if (data) {
                data.forEach(client => {
                    client.avatar = mapUrlGoogleStorage(client.avatar);
                    if (client.lastAccess)
                        this.compareLastAcessAndNowDate(new Date(client.lastAccess), new Date(), 2);
                });
                manager.clients = data;
                this.$forceUpdate();

                let clientIds = manager.clients.map(client => client._id);
                if (!clientIds || !clientIds.length)
                    return;

                let result = await this.$services.userService.getManagersByClients([], [RoleCode.Supervisor], clientIds);
                if (result.error)
                    EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: result.error});
                if (result.data) {
                    manager.clients.forEach(client => {
                        let item = result.data.find(item => item._id === client._id);
                        client.permission.manager = item && item.managers ? item.managers[0] : {};
                    });
                    this.$forceUpdate();
                }
            }
            this.showLoading = false;
        },
        async getCountClientsByManager(manager) {
            this.showLoading = true;
            let {data, error} = await this.$services.userService.getCountClientsByManager([this.$store.state.productCode], manager._id, '', this.showDisabled);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            manager.total = data || 0;
            this.$forceUpdate();
            this.showLoading = false;
        },
        changePage(page) {
            this.page = page;
            this.getManagers();
        },
        changePageClient(page) {
            // let manager = this.list.find(item => item._id === context.id);
            // if (!manager)
            //     return;
            this.managerShowed.page = page;
            this.getClientsByManager(this.managerShowed);
        },
        showFormCreate() {
            this.$refs.formCreate.open();
        },
        handleSuccess({isNew}) {
            if (isNew)
                this.search();
        },
        showManagersDisabled(value) {
            this.showDisabled = value;
            this.search();
        },
        confirmDeleteManager(_id) {
            this.confirm = {
                title: 'Are you sure want to disable this account?',
                buttonName1: 'Disable'
            };
            this.$refs.popupConfirm.open({_id, isDelete: true});
        },
        confirmRestoreManager(_id) {
            this.confirm = {
                title: 'Are you sure want to restore this account?',
                buttonName1: 'Restore'
            };
            this.$refs.popupConfirm.open({_id, isRestore: true});
        },
        async compareLastAcessAndNowDate(lastAccess, current, group) {
            if (!lastAccess || !current)
                return;
            if (current.getTime() - lastAccess.getTime() < 3600000) {
                if (group === 1)
                    this.isNearTimeManager = true;
                else
                    this.isNearTimeClient = true;
            }
            else {
                if (group === 1)
                    this.isNearTimeManager = false;
                else
                    this.isNearTimeClient = false;
            }
        },
        async handleConfirm({_id, isDelete, isRestore}) {
            if (isDelete)
                await this.$services.userService.deleteUser(_id);
            else if (isRestore)
                await this.$services.userService.restoreUser(_id);
            this.search();
        },
        // confirmDeleteClient(_id) {

        // },
        openBoxManager(_id) {
            this.$refs.boxManagers.find(b => b.id === _id).open(_id);
        },
        // async deleteClient(_id) {
        //     await this.$services.userService.deleteUser(_id);
        //     this.search();
        // },
    },
    filters: {
        formatDate, formatTime
    }
};
</script>
