<template>
    <header>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4 col-sm-4 col-xs-4">
                    <h1 class="logo">
                        <nuxt-link :to="$auth.checkPermission($module.MENU.claim.DASHBOARD.code) ? '/dashboard' : ''"><img
                                src="/images/logo.svg"
                                alt=""
                                title=""
                            /></nuxt-link>
                    </h1>
                </div>
                <div class="col-md-8 col-sm-8 col-xs-8">
                    <div class="user-header">
                        <div class="user-notify">
                            <a
                                class="dropdown-toggle"
                                @click="initNotification()"
                                data-toggle="dropdown"
                            >
                                <img src="~/assets/images/ico_bell.svg" /><span
                                    class="icon-circle"
                                    v-if="notification.totalNoRead"
                                >{{ notification.totalNoRead }}</span>
                            </a>
                            <div
                                class="setPoint"
                                v-if="notification.totalNoRead"
                            >
                                <div class="point"></div>
                            </div>
                            <div
                                class="setPoint bg-point"
                                v-else
                            >
                            </div>
                            <ul class="dropdown-menu">
                                <li>
                                    <ul class="list-notify init-loadmore">
                                        <ul
                                            class="list-loadmore"
                                            v-if="notification.list.length"
                                        >
                                            <li
                                                v-for="(notify, index) in notification.list"
                                                :key="index"
                                            >
                                                <a class="dropdown-menu-link">
                                                    <!--<img class="notify-img" src="/images/default-avatar.jpg">-->
                                                    <span
                                                        class="notify-description"
                                                        v-html="notify.message"
                                                    ></span>
                                                    <span v-bind:class="[{'active': !notify.isRead}, 'notify-time']">{{ notify.createdAt | timeFromNow}}</span>
                                                </a>
                                            </li>
                                        </ul>
                                        <ul
                                            class="list-loadmore"
                                            v-else
                                        >
                                            <li
                                                v-if="!notification.isLoad"
                                                class="loading-pulse"
                                            ></li>
                                            <li v-else>
                                                <a
                                                    class="dropdown-menu-link"
                                                    style="border-bottom:0"
                                                >
                                                    <span class="notify-description">No data.</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div class="dropdown">
                            <button
                                class="btn btn-primary dropdown-toggle"
                                type="button"
                                :data-toggle="listMenu && listMenu.length > 0 ? 'dropdown' : ''"
                            >
                                <span
                                    :title="name"
                                    class="text-name"
                                >{{name}}</span>
                                <span class="user-position">{{role}}</span>
                                <i
                                    v-if="listMenu && listMenu.length > 0"
                                    class="fa fa-caret-down"
                                    aria-hidden="true"
                                ></i>
                            </button>
                            <ul
                                class="dropdown-menu"
                                v-if="listMenu && listMenu.length > 0"
                            >
                                <li
                                    v-for="(item, index) in listMenu"
                                    :key="index"
                                >
                                    <nuxt-link
                                        :to="item.link"
                                        class="dropdown-menu-link"
                                    >{{item.title}}</nuxt-link>
                                </li>
                            </ul>
                        </div>
                        <div class="user-avatar">
                            <img
                                v-if="avatar"
                                :src="avatar"
                                :title="name"
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import EventBus from '~/plugins/event-bus';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import {timeFromNow} from '~/helpers/dateHelper';

export default {
    data() {
        return {
            name: '',
            avatar: '',
            role: '',
            listMenu: [],
            notification: {
                list: [],
                page: 1,
                limit: 10,
                total: 0,
                totalNoRead: 0,
                isGet: true,
                isLoad: false
            },
            userId: '',
            intervalid: null
        };
    },
    created() {
        this.userId = this.$store.state.userAuth._id;
        this.initProfileInfo(this.$store.state.userAuth);
        this.listMenu = this.$services.commonService.getAvatarLinks(this.$store.state.userAuth);
        EventBus.$on('USER_INFO', userInfo => {
            this.initProfileInfo(userInfo);
        });
        this.getCountNoReadByUserId();
    },
    mounted() {
        this.intervalid = setInterval(() => {
            this.getCountNoReadByUserId();
        }, 30000);
    },
    updated() {
        this.loadMoreNotification();
    },
    beforeDestroy() {
        clearInterval(this.intervalid);
    },
    methods: {
        reset() {
            this.name = '';
            this.avatar = '';
            this.role = '';
            this.notification = {
                list: [],
                page: 1,
                limit: 10,
                total: 0,
                totalNoRead: 0,
                isGet: true,
                isLoad: false
            };
        },
        resetNotification() {
            this.notification = {
                list: [],
                page: 1,
                limit: 10,
                total: 0,
                totalNoRead: 0,
                isGet: true,
                isLoad: false
            };
        },
        async initProfileInfo(userInfo) {
            this.reset();

            if (userInfo && userInfo.profile) {
                this.role = userInfo.permission.role.name;
                // if (userInfo.profile.avatar)
                //     this.avatar = userInfo.profile.avatar ? mapUrlGoogleStorage(userInfo.profile.avatar) : '/images/default-avatar.jpg';
                // else {
                let result = await this.$services.userService.getProfile();
                if (result.data) {
                    this.name = result.data.firstName + ' ' + result.data.lastName;
                    this.avatar = result.data.avatar ? mapUrlGoogleStorage(result.data.avatar) : '/images/default-avatar.jpg';
                }
                // }
            }
        },
        async initNotification() {
            this.resetNotification();

            let userNotifiEl = document.querySelector('.user-notify');

            if (userNotifiEl.classList.contains('show'))
                return;

            await this.getCountNotification();
            await this.getNotification();
            await this.getCountNoReadByUserId();
        },
        async getCountNoReadByUserId() {
            let {data, error} = await this.$services.notificationService.getCountNoReadByUserId(this.userId);
            if (error)
                return 'Error';
            else
                this.notification.totalNoRead = data;
        },
        async getCountNotification() {
            let {data, error} = await this.$services.notificationService.getCountByUserId(this.userId);
            if (error)
                return 'Error';
            else
                this.notification.total = data;
        },
        async getNotification() {
            this.notification.isLoad = false;
            let {data, error} = await this.$services.notificationService.getByUserId(this.userId, this.notification.page, this.notification.limit);
            if (error) {
                this.notification.isLoad = true;
                return false;
            }
            else
                this.notification.list = this.notification.list.concat(data);
            this.notification.isLoad = true;
        },
        loadMoreNotification() {
            let initLoadMoreEl = document.querySelector('.init-loadmore');
            let listLoadMoreEl = document.querySelector('.list-loadmore');
            initLoadMoreEl.addEventListener('scroll', async () => {
                if ((initLoadMoreEl.scrollTop + initLoadMoreEl.offsetHeight) > (listLoadMoreEl.offsetHeight - 10)) {
                    if (this.notification.list.length < this.notification.total) {
                        if (this.notification.isLoad) {
                            this.notification.page += 1;
                            await this.getNotification();
                            await this.getCountNoReadByUserId();
                        }
                    }
                }
            });
        },
    },
    filters: {
        timeFromNow(date) {
            return timeFromNow(date);
        }
    }
};
</script>