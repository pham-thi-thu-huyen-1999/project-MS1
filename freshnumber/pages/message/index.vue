<template>
    <section class="message">
        <loading :isShowLoading="showLoading" :limit="true"/>
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-12">
                         <page-title :titles="titles"/>
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list" >
                <div class="wrapper-white">
                    <div class="message-left">
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                            <li class="nav-item title">
                                <a class="nav-link title">All teams</a>
                            </li>
                            <li class="nav-item active">
                                <a class="nav-link">
                                    <span class="circle">SA</span>
                                    <div class="info">
                                        <span class="text">Super Admin</span>
                                        <span class="description">{{lastMess || 'No message.'}}</span>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="message-right">
                        <div class="tab-content" id="myTabContent">
                            <!-- $auth.checkPermission($module.MESSAGE.claim.GET.code, $store.state.userAuth.permission.role.code) -->
                            <div class="tab-pane fade show active init-loadmore-message" id="admin" role="tabpanel" aria-labelledby="admin-tab"> <!--v-if="list && list.length > 0 && $auth.checkPermission($module.MESSAGE.claim.GET.code)"-->
                                <div class="list-loadmore-message">
                                    <!-- <loading :isShowLoading="showLoadingMessage"/> -->
                                    <div v-if="!list || (list && !list.length)" class="timeline-message">
                                        <div class="no-data text-center">
                                            <img src="~/assets/images/no-data.png" alt="no data">
                                            <p class="text-note">No data available.</p>
                                        </div>
                                    </div>                 
                                    <div v-if="list && list.length > 0" class="timeline-message" v-for="(msg, index) in list" :key="index" :id="'item-' + msg._id" >
                                        <div class="content-message">
                                            <p class="paragraph">{{ msg.content }}</p>
                                            <p class="time">{{ msg.createdAt | timeFromNow }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                            <div class="send-message" v-if="$auth.checkPermission($module.MESSAGE.claim.CREATE.code)">
                                <div class="row no-gutters">
                                    <div class="col-md col-sm">
                                        <input type="text" name="message" class="ip-message" placeholder="Typing your message...">
                                    </div>
                                    <div class="col-md-auto col-sm-auto">
                                        <div class="btn-send"><img src="~/assets/images/icon-send.svg" alt="icon"></div>
                                    </div>
                                </div>
                                <!-- <div style="color:red" v-if="textError">
                                    {{textError}}
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import PageTitle from '~/components/PageTitle';
import Loading from '~/components/Loading';
import {timeFromNow} from '~/helpers/dateHelper';
import EventBus from '~/plugins/event-bus';

export default {
    data() {
        return {
            titles: ['Message'],
            list: [],
            page: 1,
            limit: 10,
            total: 0,
            showLoading: false,
            isLoad: true,
            lastMess: null
        };
    },
    components: {
        PageTitle,
        Loading
    },
    mounted() {
        this.initMessage();
    },
    updated() {
        this.loadMoreMessage();
    },
    methods: {
        async initMessage() {
            await this.getMessageByRole(this.page, this.limit);
            await this.getCountMessageByRole();
            this.lastMess = this.list[this.list.length - 1].content;
            let initLoadMoreEl = document.querySelector('.init-loadmore-message');
            initLoadMoreEl.scrollTop = initLoadMoreEl.scrollHeight;
        },
        async getMessageByRole() {
            if (!this.isLoad)
                return;
            this.isLoad = false;
            this.showLoading = true;
            let {data, error} = await this.$services.messageService.getMessageByRole(this.page, this.limit);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            else if (data && data.length) {
                let lastItem = data[0];
                this.list = data.reverse().concat(this.list);
                setTimeout(() => {
                    if (lastItem && this.list.length > 1) {
                        let messageEl = document.querySelector(`#item-${lastItem._id}`);
                        let initLoadMoreEl = document.querySelector('.init-loadmore-message');
                        initLoadMoreEl.scrollTop = messageEl.offsetTop;
                    }
                    this.isLoad = true;
                }, 400);
            }
            this.showLoading = false;
        },
        async getCountMessageByRole() {
            let {data} = await this.$services.messageService.getCountMessageByRole();
            if (data)
                this.total = data || 0;
        },
        loadMoreMessage() {
            let initLoadMoreEl = document.querySelector('.init-loadmore-message');
            // let listLoadMoreEl = document.querySelector('.list-loadmore-message');
            initLoadMoreEl.addEventListener('scroll', async () => {
                if (this.isLoad) {
                    if (initLoadMoreEl.scrollTop < 10) {
                        if (this.list.length < this.total) {
                            this.page += 1;
                            await this.getMessageByRole();
                        }
                    }
                }
            });
        }
    },
    filters: {
        timeFromNow,
    }
};
</script>