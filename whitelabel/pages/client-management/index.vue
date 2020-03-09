<template>
    <section class="client-management">
        <loading :isShowLoading="showLoading"/>
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles"></page-title>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                        <div class="dropdown normal-btn">
                            <button class="btn dropdown-toggle not-arrow" type="button" v-if="!showDisabled" @click="showClientsDisabled(true)">
                                DISABLED LIST
                            </button>
                            <button class="btn dropdown-toggle not-arrow" type="button" v-else @click="showClientsDisabled(false)">
                                LIST CLIENT
                            </button>
                        </div>
                        <div class="dropdown normal-btn">
                            <button class="btn dropdown-toggle not-arrow" type="button" data-toggle="modal" @click="showFormInvite()"> INVITE </button>
                        </div>
                        <div class="dropdown normal-btn">
                            <nuxt-link to="/client-management/invited-client" class="btn dropdown-toggle not-arrow"> INVITED LIST </nuxt-link>
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
                                <div class="col-3"><label class="col-label">Clients (Total {{total}})</label></div>
                                <!-- <div class="col text-center"><label class="col-label">entity name</label></div> -->
                                <!-- <div class="col text-center"><label class="col-label">ABN NO.</label></div> -->
                                <div class="col text-center"><label class="col-label">Managers</label></div>
                                <div class="col text-center"><label class="col-label">Last access</label></div>
                                <div class="col text-center"><label class="col-label">Cruncher status</label></div>
                                <div class="col-1 text-center"><label class="col-label">dashboard</label></div>
                                <div class="col-1 text-right"><label class="col-label">Options</label></div>
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
                        <div class="box" v-else>
                            <div class="row row-label">
                                <div class="col-3"><label class="col-label">Clients (Total {{total}})</label></div>
                                <!-- <div class="col text-center"><label class="col-label">entity name</label></div> -->
                                <!-- <div class="col text-center"><label class="col-label">ABN NO.</label></div> -->
                                <div class="col text-center"><label class="col-label">Managers</label></div>
                                <div class="col text-center"><label class="col-label">Last access</label></div>
                                <div class="col text-center"><label class="col-label">Cruncher status</label></div>
                                <div class="col-1 text-center"><label class="col-label">dashboard</label></div>
                                <div class="col-1 text-right"><label class="col-label">Options</label></div>
                            </div>
                            <div class="box-item pdr-15">
                                <div class="row row-item" v-for="(client, index) in clients" :key="index">
                                    <div class="col-3 align-self-center">
                                        <img class="item-img" :src="client.avatar" title="" alt="" v-show="client.avatar"/>
                                        <img class="item-img" src="/images/default-avatar.jpg" title="" alt="" v-show="!client.avatar"/>
                                        <span class="item-name" :title="client.businessInfo && client.businessInfo.entityName ? client.businessInfo.entityName : client.fullName">{{client.businessInfo && client.businessInfo.entityName ? client.businessInfo.entityName : client.fullName}}</span>
                                        <span class="item-email" :title="client.businessInfo && client.businessInfo.abnCode ? client.businessInfo.abnCode : client.email">{{client.businessInfo && client.businessInfo.abnCode ? client.businessInfo.abnCode : client.email}}</span>
                                    </div>
                                    <!-- <div class="col align-self-center text-center">
                                        <span class="item-entity">{{client.businessInfo ? client.businessInfo.entityName : ''}}</span>
                                    </div> -->
                                    <!-- <div class="col align-self-center text-center">
                                        <span class="item-abn">{{client.abn  ? client.abn : ''}}</span>
                                    </div> -->
                                    <div class="col align-self-center text-center">
                                        <span class="item-manager" @click="openBoxManager(client._id)">{{client.totalManager}} Managers</span>
                                        <box-manager :id="client._id" ref="boxManagers" />
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span v-if="client.lastAccess" :class="{green: isNearTime}" class="item-status">{{client.lastAccess | formatDate}} {{client.lastAccess | formatTime}}</span>
                                        <span v-if="!client.lastAccess" class="red item-status">Not yet</span>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span class="item-status" v-if="client.crunchStatus && client.crunchStatus.status && client.crunchStatus.status.amendedAt">
                                            Amendments
                                        </span>
                                        <span class="green item-status" v-else-if="client.crunchStatus && client.crunchStatus.status && client.crunchStatus.status.completedAt">
                                            Completed
                                        </span>
                                        <!-- <span class="item-status" v-else-if="client.crunchStatus && client.crunchStatus.status && client.crunchStatus.status.completedAt">
                                            Awaiting Approval
                                        </span> -->
                                        <span class="red item-status" v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.startedAt && client.crunchStatus.status.overdue > 0">
                                            Overdue {{client.crunchStatus.status.overdue}} days
                                        </span>
                                        <span class="item-status" v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.startedAt">
                                            Not started
                                        </span>
                                        <span class="green item-status" v-else-if="client.crunchStatus && client.crunchStatus.status && client.crunchStatus.status.startedAt">
                                            Inprogress
                                        </span>
                                        <span class="item-status" v-else>
                                            No data
                                        </span>

                                        <!-- <span v-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.completedAt && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue === 0 && !client.crunchStatus.status.isFinished" class="item-status">
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
                                        </span> -->

                                        <!-- <span v-else class="item-status">
                                            No data
                                        </span> -->
                                        
                                        <ul v-if="client.crunchStatus && client.crunchStatus.details && client.crunchStatus.details.length > 0" class="item-list-crunch">
                                            <li class="list-crunch-label">
                                                <span class="crunch-label">Month</span>
                                                <span class="crunch-label">Bank</span>
                                                <span class="crunch-label">Credit card</span>
                                            </li>
                                            <li v-for="(crunch, index) in client.crunchStatus.details" :key="index" class="list-crunch-item">
                                                <span class="crunch-item-month" >{{crunch.month | convertMonthToWord}} {{crunch.year | sliceString}}</span>
                                                <template v-if="crunch === 1">
                                                    <span v-if="!crunch.completedAt && crunch.overdue && crunch.overdue === 0" class="crunch-item-status">
                                                        Not started
                                                    </span>

                                                    <span v-else-if="!crunch.completedAt && crunch.overdue && crunch.overdue > 7" class="red crunch-item-status">
                                                        Overdue {{crunch.overdue}} days
                                                    </span>

                                                    <span v-else-if="!crunch.completedAt && crunch.overdue && crunch.overdue > 9" class="green crunch-item-status">
                                                        Inprogress
                                                    </span>

                                                    <span v-else-if="crunch.completedAt" class="crunch-item-status">
                                                        Completed
                                                    </span>

                                                    <span class="crunch-item-status" v-else>
                                                        No data
                                                    </span>
                                                </template>
                                                <template v-if="crunch.type === 2">
                                                    <span v-if="!crunch.completedAt && crunch.overdue && crunch.overdue === 0" class="crunch-item-status">
                                                        Not started
                                                    </span>

                                                    <span v-else-if="!crunch.completedAt && crunch.overdue && crunch.overdue > 7" class="red crunch-item-status">
                                                        Overdue {{crunch.overdue}} days
                                                    </span>

                                                    <span v-else-if="!crunch.completedAt && crunch.overdue && crunch.overdue > 9" class="green crunch-item-status">
                                                        Inprogress ()
                                                    </span>

                                                    <span v-else-if="crunch.completedAt" class="crunch-item-status">
                                                        Completed
                                                    </span>

                                                    <span class="crunch-item-status" v-else>
                                                        No data
                                                    </span>
                                                </template>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-1 align-self-center text-center">
                                        <nuxt-link :to="`/client/${client._id}/transaction?type=1`" class="btn-normal">VIEW</nuxt-link>
                                    </div>
                                    <div class="col-1 align-self-center text-right">
                                        <div class="dropdown">
                                            <a class="item-option dropdown-toggle" :data-toggle="$auth.checkPermission($module.MANAGER.claim.DELETE_CLIENT.code, client.permission.role.code ? client.permission.role.code : RoleCode.Client) ? 'dropdown' : ''">
                                                ...
                                            </a>
                                            <ul class="dropdown-menu" v-if="$auth.checkPermission($module.MANAGER.claim.DELETE_CLIENT.code, client.permission.role.code ? client.permission.role.code : RoleCode.Client)">
                                                <li v-if="showDisabled"><a class="option-item red" @click="confirmRestoreClient(client._id)">Restore Client</a></li>
                                                <li v-else><a class="option-item red" @click="confirmDeleteClient(client._id)">Disable Client</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="paginate">
                            <no-ssr>
                                <pagination v-show="total > 0" id="team-pagination" :page="page" :limit="limit" :total="total" @change="changePage" />
                            </no-ssr>
                        </div>
                    </div>
                    <div class="col-md-auto">
                        <!-- <started-list></started-list> -->
                        <history-logs></history-logs>
                        <popup-confirm id="popup-confirm" ref="popupConfirm" :title="confirm.title" :buttonName1="confirm.buttonName1" buttonName2="Cancel" @success="handleConfirm"/>
                    </div>
                </div>
            </div>
        </div>
        <invite-client ref="inviteClient" :image="EmailImage" :title="`Invite clients to ${productName} system`"></invite-client>
    </section>
</template>

<script>
import LookupKeyword from '~/components/LookupKeyword';
import Pagination from '~/components/Pagination';
import StartedList from '~/components/StartedList';
import HistoryLogs from '~/components/HistoryLogs';
import BoxManager from '~/components/BoxManager';
import PopupConfirm from '~/components/PopupConfirm';
import InviteClient from '~/components/InviteClient';
import EmailImage from '~/assets/images/icon-email.svg';
import {convertMonthToWord, formatDate, formatTime} from '~/helpers/dateHelper';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import PageTitle from '~/components/PageTitle';
import Loading from '~/components/Loading';
import {RoleCode} from '~/common/commonType';

export default {
    data: () => ({
        keyword: '',
        clients: [],
        managers: [],
        confirm: {
            title: '',
            buttonName1: ''
        },
        page: 1,
        limit: 10,
        total: 20,
        showDisabled: false,
        EmailImage: EmailImage,
        timeout: null,
        titles: ['Client management'],
        showLoading: true,
        isNearTime: false,
        RoleCode: RoleCode,
        productName: ''
    }),
    components: {
        LookupKeyword,
        Pagination,
        StartedList,
        HistoryLogs,
        BoxManager,
        InviteClient,
        PopupConfirm,
        PageTitle,
        Loading
    },
    async created() {
        await this.search();
        await this.getProduct();
        this.showLoading = false;
    },
    watch: {
        keyword: function(keyword) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.search(), 1200);
        }
    },
    mounted() {
        $(document).on('click', function(e) {
            if ($(e.target).is('.item-managements, .box-manager, .item-manager') === false) {
                $('.box-manager').removeClass('active');
            }
        });
    },
    methods: {
        reset() {
            this.list = [];
            this.page = 1;
            this.total = 0;
        },
        async search() {
            await this.reset();
            await this.getClients();
            await this.getCountClients();
        },
        async getClients() {
            this.showLoading = true;
            let arrId = [];
            let {data} = await this.$services.userService.getClients(this.$store.state.productCode, this.keyword, this.showDisabled, this.page, this.limit);
            if (data) {
                data.forEach(client => {
                    client.avatar = mapUrlGoogleStorage(client.avatar);
                    arrId.push(client._id);
                    if (client.lastAccess)
                        this.compareLastAcessAndNowDate(new Date(client.lastAccess), new Date());
                });

                let result = await this.$services.userService.getCrunchStatus(arrId);
                if (result.error) {
                    this.showLoading = true;
                    return;
                }
                else {
                    if (result.data && result.data.length) {
                        data.forEach((item, index) => {
                            if (result.data[index] && item._id === result.data[index].userId) {
                                item.crunchStatus = result.data[index];
                            }
                        });
                    }
                }
                this.clients = data || [];
            }
            this.showLoading = false;
        },
        async getCountClients() {
            this.showLoading = true;
            let {data, error} = await this.$services.userService.getCountClients(this.$store.state.productCode, this.keyword, this.showDisabled);
            if (error)
                console.error(error.message);
            else
                this.total = data;
            this.showLoading = false;
        },
        showClientsDisabled(value) {
            this.showDisabled = value;
            this.search();
        },
        async changePage(page) {
            this.showLoading = true;
            this.page = page;
            let {data, error} = await this.$services.userService.getClients(this.$store.state.productCode, this.keyword, this.showDisabled, this.page, this.limit);
            if (!error) {
                this.clients = data || [];
                this.$forceUpdate();
            }
            this.showLoading = false;
        },
        openBoxManager(_id) {
            this.$refs.boxManagers.find(b => b.id === _id).open(_id);
        },
        confirmDeleteClient(_id) {
            this.confirm = {
                title: 'Are you sure want to disable this account?',
                buttonName1: 'Disable'
            };
            this.$refs.popupConfirm.open({_id, isDelete: true});
        },
        confirmRestoreClient(_id) {
            this.confirm = {
                title: 'Are you sure want to restore this account?',
                buttonName1: 'Restore'
            };
            this.$refs.popupConfirm.open({_id, isRestore: true});
        },
        async handleConfirm({_id, isDelete, isRestore}) {
            if (isDelete)
                await this.$services.userService.deleteUser(_id);
            else if (isRestore)
                await this.$services.userService.restoreUser(_id);
            this.search();
        },
        // async deleteManager(_id) {
        //     this.showLoading = true;
        //     await this.$services.userService.deleteUser(_id);
        //     this.search();
        //     this.$forceUpdate();
        //     this.showLoading = false;
        // },
        showFormInvite() {
            this.$refs.inviteClient.open();
        },
        async compareLastAcessAndNowDate(lastAccess, current) {
            if (!lastAccess || !current)
                return;
            if (current.getTime() - lastAccess.getTime() < 3600000)
                this.isNearTime = true;
            else
                this.isNearTime = false;
        },
        async getProduct() {
            let productId = this.$store.state.userAuth.permission.product._id;
            if (!productId)
                return {};

            let {data, error} = await this.$services.userService.getProduct(productId);
            if (error)
                console.log('error', error);

            if (data)
                this.productName = data.name;
        },
    },
    filters: {
        convertMonthToWord(month) {
            if (month)
                return convertMonthToWord(month);
            return '';
        },
        sliceString(word) {
            if (!word) return '';
            return word.toString().slice(2);
        },
        formatDate,
        formatTime
    }
};
</script>
