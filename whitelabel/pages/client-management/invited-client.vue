<template>
    <section class="invited-client">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles"></page-title>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                        <div class="normal-btn">
                            <button class="btn dropdown-toggle not-arrow" type="button" @click="showFormInvite()">
                                INVITE
                            </button>
                        </div>
                        <div class="normal-btn">
                            <button class="btn dropdown-toggle not-arrow" type="button" @click="$router.go(-1)">
                                BACK
                            </button>
                        </div>
                    </div>
                    <div class="col-12 page-filter">
                        <lookup-keyword v-model="keyword"/>
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <div class="row">
                    <div class="col-md">
                        <div class="box">
                            <div class="row row-label">
                                <div class="col-3"><label class="col-label">Clients (Total {{ total }})</label></div>
                                <div class="col-3"><label class="col-label">Invited by</label></div>
                                <div class="col text-center"><label class="col-label">Time sent</label></div>
                                <div class="col text-center"><label class="col-label">Resend</label></div>
                                <div class="col-1 text-right"><label class="col-label">Options</label></div>
                            </div>
                            <div class="box-item pdr-15">
                                <div class="row row-item" v-for="(item, index) in list" :key="index">
                                    <div class="col-3 align-self-center">
                                        <img class="item-img" :src="item.avatar ? mapUrlGoogleStorage(item.avatar) : '/images/default-avatar.jpg'" title="" alt=""/>
                                        <span class="item-name">{{item.fullName}}</span>
                                        <span class="item-email">{{item.email}}</span>
                                    </div>
                                    <div class="col-3 align-self-center">
                                        <img class="item-img" :src="item.userId.avatar.length ? mapUrlGoogleStorage(item.userId.avatar[0].url) : '/images/default-avatar.jpg'" title="" alt=""/>
                                        <span class="item-name">{{item.userId.fullName}}</span>
                                        <span class="item-email">{{item.userId.email}}</span>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span class="item-time" v-if="item.status" style="color: green;">Pending</span>
                                        <span class="item-time" v-if="!item.status" style="color: red;">Expired</span>                                        
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <button class="btn-normal" data-toggle="modal" @click="reSendInvite(item._id)">Resend</button>
                                    </div>
                                    <div class="col-1 align-self-center text-right">
                                        <div class="dropdown">
                                            <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                                ...
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li @click="deleteInvitation(item._id)"><a class="option-item red">Delete</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-auto">
                        <!-- <started-list></started-list> -->
                        <history-logs></history-logs>
                    </div>
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="paginate">
                            <no-ssr>
                                <pagination id="user-pagination" :page="page" :limit="limit" :total="total" @change="changePage" />
                            </no-ssr>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <popup-confirm id="popup-confirm"  :title="title" @success="actionConfirm" ref="popupConfirm"></popup-confirm>
        <invite-client ref="inviteClient" :image="EmailImage" title="Invite clients to White Label system"></invite-client>        
    </section>
</template>

<script>
import LookupKeyword from '~/components/LookupKeyword';
import Pagination from '~/components/Pagination';
import StartedList from '~/components/StartedList';
import HistoryLogs from '~/components/HistoryLogs';
import PopupConfirm from '~/components/PopupConfirm';
import InviteClient from '~/components/InviteClient';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import EmailImage from '~/assets/images/icon-email.svg';
import PageTitle from '~/components/PageTitle';

export default {
    data: () => ({
        productCode: null,
        user: {},
        title: null,
        page: null,
        limit: null,
        keyword: '',
        list: null,
        total: null,
        timeout: null,
        titles: ['Invited clients'],
        EmailImage: EmailImage,
    }),
    components: {
        LookupKeyword,
        Pagination,
        StartedList,
        HistoryLogs,
        PopupConfirm,
        InviteClient,
        PageTitle,
    },
    watch: {
        keyword: function(value) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.loadData(), 800);
        }
    },
    created() {
        this.reset();
    },
    mounted() {
        this.loadData();
    },
    methods: {
        reset() {
            this.productCode = this.$store.state.productCode;
            this.title = '';
            this.page = 1;
            this.limit = 10;
            this.keyword = '';
            this.list = [];
            this.total = 0;
        },
        async loadData() {
            this.list = [];
            this.page = 1;
            this.total = 0;
            await this.getList();
            await this.getCount();

            let body = [];
            this.list.forEach(item => {
                body.push(item._id);
            });
            await this.getStatus(body);
        },
        async getList() {
            let {data, error} = await this.$services.userService.getClientInviteds(this.productCode, this.keyword, this.page, this.limit);
            if (error)
                return error;
            else
                this.list = data || [];
        },
        async getCount() {
            let result = await this.$services.userService.getCountClientInviteds(this.productCode, this.keyword);
            if (result.error)
                return result.error;
            else
                this.total = result.data || 0;
        },
        async getStatus(body) {
            if (!body || !body.length)
                return;
            let {data, error} = await this.$services.userService.getStatusInvited(body);
            if (error)
                return error;
            else {
                this.list.forEach(item => {
                    data.forEach(element => {
                        if (item._id === element._id)
                            item.status = element.status;
                    });
                });
                this.$forceUpdate();
            }
        },
        async reInvitation(inviteId) {
            if (!inviteId)
                return;

            let {data, error} = await this.$services.userService.reInvitation(inviteId);
            if (error)
                return 'Error';
            else {
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i]._id === data._id)
                        this.list[i].status = true;
                }
                this.$forceUpdate();
            }
        },
        async delete(inviteId) {
            if (!inviteId)
                return;

            let result = await this.$services.userService.deleteInvitation(inviteId);
            if (result.error || !result.data)
                return 'Error delete';
            else
                this.loadData();
        },
        changePage(page) {
            this.page = page;
            this.getList();
        },
        reSendInvite(inviteId) {
            if (!inviteId)
                return;
            let data = {
                inviteId: inviteId,
                action: 're-send'
            };
            this.title = 'Are you sure you want to resend this invitation?';
            this.$refs.popupConfirm.open(data);
        },
        deleteInvitation(inviteId) {
            if (!inviteId)
                return;
            let data = {
                inviteId: inviteId,
                action: 'delete'
            };
            this.title = 'Are you sure you want to cancel this delete?';
            this.$refs.popupConfirm.open(data);
        },
        actionConfirm(event) {
            if (event.action === 're-send')
                this.reInvitation(event.inviteId);
            else
                this.delete(event.inviteId);
        },
        mapUrlGoogleStorage(url) {
            return mapUrlGoogleStorage(url);
        },
        showFormInvite() {
            this.$refs.inviteClient.open();
        }
    },
};
</script>
