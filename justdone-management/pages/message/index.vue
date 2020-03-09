<template>
    <client-only>
        <section class="message">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                    <div class="row">
                        <div class="col-12">
                            <page-title :titles="titles" />
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                    <div class="wrapper-white">
                        <div
                            class="message-left"
                            v-if="$auth.checkPermission($module.MESSAGE.claim.CREATE.code)"
                        >
                            <ul
                                class="nav nav-tabs"
                                id="myTab"
                                role="tablist"
                            >
                                <li class="nav-item title">
                                    <a class="nav-link title">All teams</a>
                                </li>
                                <li
                                    class="nav-item"
                                    v-for="(role, index) in listRole"
                                    :key="index"
                                    :class="{'active': role.active}"
                                >
                                    <a
                                        @click="selectRole(role, index)"
                                        class="nav-link"
                                        :id="`${role.stand}-tab`"
                                        data-toggle="tab"
                                        role="tab"
                                        :aria-controls="role.stand"
                                        :aria-selected="role.active ? true : false"
                                    >
                                        <span
                                            :class="role.color ? role.color : ''"
                                            class="circle"
                                        >{{role.stand}}</span>
                                        <div class="info">
                                            <span class="text">{{role.name}}</span>
                                            <span class="description">{{lastMess[role.role] || 'No message.'}}</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div
                            class="message-left"
                            v-else
                        >
                            <ul
                                class="nav nav-tabs"
                                id="myTab"
                                role="tablist"
                            >
                                <li class="nav-item title">
                                    <a class="nav-link title">All teams</a>
                                </li>
                                <li class="nav-item active">
                                    <a class="nav-link">
                                        <span class="circle">SA</span>
                                        <div class="info">
                                            <span class="text">Super Admin</span>
                                            <span class="description">{{lastMess[this.roleCode] || 'No message.'}}</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="message-right">
                            <div
                                class="tab-content"
                                id="myTabContent"
                            >
                                <!-- $auth.checkPermission($module.MESSAGE.claim.GET.code, $store.state.userAuth.permission.role.code) -->
                                <div
                                    class="tab-pane fade show active init-loadmore-message"
                                    id="admin"
                                    role="tabpanel"
                                    aria-labelledby="admin-tab"
                                >
                                    <!--v-if="list && list.length > 0 && $auth.checkPermission($module.MESSAGE.claim.GET.code)"-->
                                    <div class="list-loadmore-message">
                                        <div
                                            v-if="!list || (list && !list.length)"
                                            class="timeline-message"
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
                                            v-if="list && list.length > 0"
                                            class="timeline-message"
                                            v-for="(msg, index) in list"
                                            :key="index"
                                            :id="'item-' + msg._id"
                                        >
                                            <div class="content-message">
                                                <p class="paragraph">{{ msg.content }}</p>
                                                <p class="time">{{ msg.createdAt | timeFromNow }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="send-message"
                                    v-if="$auth.checkPermission($module.MESSAGE.claim.CREATE.code)"
                                >
                                    <div class="row no-gutters">
                                        <div class="col-md col-sm">
                                            <input
                                                @keyup.enter="sendMessageToRole()"
                                                v-model="messageNotify"
                                                type="text"
                                                name="message"
                                                class="ip-message"
                                                placeholder="Typing your message..."
                                            >
                                        </div>
                                        <div class="col-md-auto col-sm-auto">
                                            <div
                                                @click="sendMessageToRole()"
                                                class="btn-send"
                                            ><img
                                                    src="~/assets/images/icon-send.svg"
                                                    alt="icon"
                                                ></div>
                                        </div>
                                    </div>
                                    <div
                                        style="color:red"
                                        v-if="textError"
                                    >
                                        {{textError}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </client-only>
</template>

<script>
import PageTitle from '~/components/PageTitle';
import {RoleCode} from '~/common/commonType';
import {timeFromNow} from '~/helpers/dateHelper';
import {setTimeout} from 'timers';

export default {
    data() {
        return {
            titles: ['Message'],
            showLoadingMessage: false,
            list: null,
            listRole: [],
            activeRole: null,
            roleCode: null,
            messageNotify: null,
            total: null,
            page: null,
            textError: null,
            allowLoadMore: false,
            isLoad: true,
            lastMess: []
        };
    },
    components: {
        PageTitle,
    },
    created() {
        this.isLoad = true;
        this.reset();
        this.getRolesName();
        this.loadAllMessageLastest();
    },
    mounted() {
        this.search();
    },
    updated() {
        this.loadMoreMessage();
    },
    methods: {
        reset() {
            this.showLoadingMessage = false;
            this.list = [];
            this.listRole = [];
            this.activeRole = false;
            this.roleCode = RoleCode.ProductAdmin;
            this.messageNotify = '';
            this.total = 0;
            this.page = 1;
            this.limit = 8;
            this.textError = '';
            this.isLoad = true;
            this.lastMess = [];
        },
        async search() {
            this.roleCode = this.listRole[0] && this.listRole[0].role ? this.listRole[0].role : 0;
            await this.getMessageByRole(this.roleCode);
            await this.getCountMessageByRole(this.roleCode);

            let initLoadMoreEl = document.querySelector('.init-loadmore-message');
            initLoadMoreEl.scrollTop = initLoadMoreEl.scrollHeight;
        },
        async sendMessageToRole() {
            if (!this.roleCode) {
                this.textError = 'Please! choose a Role to send message';
                return;
            }
            // if (!this.validataMessage(this.messageNotify)) {
            //     this.textError = 'The message is required or least 4 lettes!';
            //     return;
            // }
            let groupReceive = {
                role: this.roleCode,
                product: undefined
            };
            let {data, error} = await this.$services.messageService.sendMessageToRole(groupReceive, this.messageNotify);
            if (error) {
                this.textError = 'send message failed';
                return;
            }

            if (data) {
                this.messageNotify = '';
                this.textError = '';
                this.$notify({
                    type: 'success',
                    title: 'Send message completed',
                    text: 'Thank you'
                });
                this.list.push(data);
                setTimeout(() => {
                    let initLoadMoreEl = document.querySelector('.init-loadmore-message');
                    initLoadMoreEl.scrollTop = initLoadMoreEl.scrollHeight;
                }, 200);
            }

            this.getMessageLastest(this.roleCode);
        },
        async getMessageByRole(role) {
            if (!this.isLoad)
                return;

            this.isLoad = false;
            this.showLoadingMessage = true;

            let {data, error} = await this.$services.messageService.getMessageByRole(role, this.page, this.limit);
            if (error) {
                return;
            }
            if (data && data.length) {
                let lastItem = data[0];
                this.list = data.reverse().concat(this.list);

                setTimeout(() => {
                    if (lastItem && this.list.length > 1) {
                        let messageEl = document.querySelector(`#item-${lastItem._id}`);
                        let initLoadMoreEl = document.querySelector('.init-loadmore-message');

                        initLoadMoreEl.scrollTop = messageEl.offsetTop;
                    }
                    this.isLoad = true;
                    this.showLoadingMessage = false;
                }, 400);
            }
            else if (data && !data.length) {
                this.showLoadingMessage = false;
            }
        },
        async getCountMessageByRole(role) {
            let {data, error} = await this.$services.messageService.getCountMessageByRole(role);
            if (error)
                return;
            if (data)
                this.total = data;
        },
        pushRole(role) {
            let ob = {};
            switch (Number(role)) {
            case RoleCode.RegionAdmin:
                ob = {
                    role: RoleCode.RegionAdmin,
                    name: 'Region Admin',
                    stand: 'RA',
                    color: ''
                };
                this.listRole.push(ob);
                break;
            case RoleCode.Supervisor:
                ob = {
                    role: RoleCode.Supervisor,
                    name: 'Supervisor',
                    stand: 'SV',
                    color: 'black'
                };
                this.listRole.push(ob);
                break;
            case RoleCode.CaseManager:
                ob = {
                    role: RoleCode.CaseManager,
                    name: 'CaseManager',
                    stand: 'CM',
                    color: 'green'
                };
                this.listRole.push(ob);
                break;
            case RoleCode.ProductAdmin:
                ob = {
                    role: RoleCode.ProductAdmin,
                    name: 'Product Admin',
                    stand: 'PA',
                    color: 'yellow'
                };
                this.listRole.push(ob);
                break;
            case RoleCode.ProductManager:
                ob = {
                    role: RoleCode.ProductManager,
                    name: 'Product Manager',
                    stand: 'PM',
                    color: 'black'
                };
                this.listRole.push(ob);
                break;
            case RoleCode.Client:
                ob = {
                    role: RoleCode.Client,
                    name: 'Client',
                    stand: 'C',
                    color: 'yellow'
                };
                this.listRole.push(ob);
                break;
            default:
                break;
            }
            this.listRole[0].active = true;
        },
        async getRolesName() {
            this.listRole = [];
            this.pushRole(RoleCode.RegionAdmin);
            this.pushRole(RoleCode.Supervisor);
            this.pushRole(RoleCode.CaseManager);
            this.pushRole(RoleCode.ProductAdmin);
            this.pushRole(RoleCode.ProductManager);
            this.pushRole(RoleCode.Client);
        },
        async getMessageLastest(role) {
            let {data} = await this.$services.messageService.getMessageByRole(role, 1, 1);
            if (data && data[0]) {
                this.lastMess[role] = data[0].content;
            }
        },
        loadAllMessageLastest() {
            this.listRole.forEach((val, key) => {
                this.getMessageLastest(val.role);
            });
        },
        async selectRole(role, index) {
            this.list = [];
            this.page = 1;
            this.listRole.map((val, key) => {
                val.active = false;
            });
            this.listRole[index].active = true;
            if (role && role.role)
                this.roleCode = role.role;
            setTimeout(() => {
                let initLoadMoreEl = document.querySelector('.init-loadmore-message');
                initLoadMoreEl.scrollTop = initLoadMoreEl.scrollHeight;
            }, 200);
            this.isLoad = true;
            await this.getMessageByRole(this.roleCode);
            await this.getCountMessageByRole(this.roleCode);
        },
        loadMoreMessage() {
            let initLoadMoreEl = document.querySelector('.init-loadmore-message');

            initLoadMoreEl && initLoadMoreEl.addEventListener('scroll', async () => {
                if (this.isLoad) {
                    if (initLoadMoreEl.scrollTop < 10) { // (listLoadMoreEl.offsetHeight / 4)
                        if (this.list.length < this.total) {
                            this.page += 1;
                            await this.getMessageByRole(this.roleCode);
                        }
                    }
                }
            });
        },
        validataMessage(message) {
            if (!message || message.toString().length === 0 || message.toString().length > 50) {
                return false;
            }
            return true;
        }
    },
    filters: {
        timeFromNow
    }
};
</script>