<template>
    <div class="product-item" :id="data.product._id" v-if="data && data.product">
        <div class="product-head">
            <div class="row">
                <div class="col-md-4">
                    <img :src="data.product.favicon ? mapUrlGoogleStorage(data.product.favicon) : (data.product.logo ? mapUrlGoogleStorage(data.product.logo) : logoDefault)" class="product-logo" alt=""/>
                    <h2 class="product-name">{{data.product.name}}</h2>
                    <div class="product-accounts" v-if="data.productAdmins && data.productAdmins.length">
                        <div class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="dropdown-item" v-for="(productAdmin, index) in data.productAdmins" :key="index"><a href="#">{{productAdmin.email}}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-8 text-right">
                    <a class="link-product" :href="data.product.config && data.product.config.domain ? '//' + data.product.config.domain : '#'" target="_blank"><img class="icon-link" src="~/assets/images/link.svg"/>{{data.product.config && data.product.config.domain ? data.product.config.domain : `Don't have domain yet`}}</a>
                    <!-- <div class="feature-available">
                        <div class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                Features Available
                            </a>
                            <ul class="dropdown-menu">
                                <li class="dropdown-item"><a href="#"><span class="dot">.</span>Action</a></li>
                                <li class="dropdown-item"><a href="#"><span class="dot">.</span>Action</a></li>
                                <li class="dropdown-item"><a href="#"><span class="dot">.</span>Action</a></li>
                            </ul>
                        </div>
                    </div> -->
                    <p class="type-label">Product type: <span class="type-name">{{data.product.type | displayProductType}}</span></p>
                    <!-- <button style="display:none" class="access-product" @click="accessProduct">Access Product</button> -->
                </div>
            </div>
            <!-- <span class="product-status">Server Status <span :class="{ red : !statusServer}" class="product-status-dot"></span></span> -->
        </div>
        <div class="product-body">
            <div class="row justify-content-center">
                <div class="col-lg col-md-6">
                    <div class="product-border">
                        <label class="product-label">Clients</label>
                        <span class="product-percent"><i v-if="percentClient && percentClient.number > 0 && percentClient && percentClient.total" class="i-con icon-up" :class="{ down: percentClient && percentClient.operator === 1}"></i>{{percentClient && percentClient.number || 0}}%</span>
                        <span class="product-value" :title="data.countClients" @click="navigateClientManagement">{{data.countClients}}</span>
                        <div class="bg-rectangle"><img src="~/assets/images/icon-man.svg" class="icon"/></div>
                    </div>
                </div>
                <div class="col-lg col-md-6">
                    <div class="product-border">
                        <label class="product-label">Cancel client</label>
                        <span class="product-percent red"><i v-if="cancelPercent && cancelPercent.number > 0 && cancelPercent && cancelPercent.total" class="i-con icon-up red" :class="{ down: cancelPercent && cancelPercent.operator === 1}"></i>{{cancelPercent && cancelPercent.number || 0}}%</span>
                        <span class="product-value" :title="data.countCancelClients" @click="navigateClientManagementDisabled">{{data.countCancelClients}}</span>
                        <div class="bg-rectangle red"><img src="~/assets/images/icon-man.svg" class="icon"/><img src="~/assets/images/icon-x.svg" class="icon-cancel"></div>
                    </div>
                </div>
                <div class="col-lg col-md-6">
                    <div class="product-border">
                        <label class="product-label">Manager team</label>
                        <span class="product-percent"><i v-if="percentManager && percentManager.number > 0 && percentManager && percentManager.total" class="i-con icon-up" :class="{ down: percentManager && percentManager.operator === 1}"></i>{{percentManager && percentManager.number || 0}}%</span>
                        <span class="product-value" :title="data.countManagers" @click="navigateTeamManagement">{{data.countManagers}}</span>
                        <div class="bg-rectangle violet"><img src="~/assets/images/icon-woman.svg" class="icon"/></div>
                    </div>
                </div>
                <!-- <div class="col-lg col-md-6">
                    <div class="product-border">
                        <label class="product-label">income</label>
                        <hr>
                        <span class="product-percent"><i v-if="percentIncome && percentIncome.number > 0 && percentIncome && percentIncome.total" class="i-con icon-up" :class="{ down: percentIncome && percentIncome.operator === 1}"></i>{{percentIncome && percentIncome.number || 0}}%</span>
                        <span class="product-value" :title="income">{{income | convertToCurrency}}</span>
                        <div class="bg-rectangle green"><img src="~/assets/images/icon-dollar.svg" class="icon"/></div>
                    </div>
                </div> -->
            </div>
        </div>
        <div v-if="!data.product.isCompleted" class="product-setting-up">
            <h2 class="setting-up-title">{{data && data.product && data.product.name}} is setting up</h2>
            <p class="seting-up-est">Estimation time 24 hours</p>
            <img src="~/assets/images/icon-time.svg"/>
            <wdt-loading :shouldCheckFirstItem="true" :isError="StError" :items="StatusList" :index="StIndex" />
        </div>
    </div>
</template>

<script>
import WdtLoading from '~/components/WdtLoading';
import logoWL from '~/assets/images/icon-whitelabel.svg';
import {ProductType, RoleCode} from '~/common/commonType';
import {convertToCurrency, mapUrlGoogleStorage} from '~/helpers/dataHelper';

export default {
    props: {
        data: {},
        // code: {
        //     type: Number,
        //     default: 0
        // },
        // name: {
        //     type: String,
        //     default: ''
        // },
        // logo: {
        //     type: String,
        //     default: ''
        // },
        // favicon: {
        //     type: String,
        //     default: ''
        // },
        // domain: {
        //     type: String,
        //     default: ''
        // },
        // statusServer: {
        //     type: Boolean,
        // },
        // createdAt: {
        //     type: String,
        //     default: ''
        // },
        // client: {
        //     type: Number,
        //     default: 0
        // },
        // manager: {
        //     type: Number,
        //     default: 0
        // },
        // managers: {
        //     type: Array,
        // },
        // income: {
        //     type: Number,
        //     default: 0
        // },
        // isCompleted: {
        //     type: Boolean,
        //     default: false
        // },
        // cancel: {
        //     type: Number,
        //     default: 0
        // },
        cancelPercent: {},
        percentClient: {},
        percentManager: {},
        percentIncome: {},
        // id: {
        //     type: Number,
        //     default: ''
        // },
        // type: {
        //     type: String,
        //     default: ''
        // }
    },
    data() {
        return {
            marginTop: null,
            StError: null,
            StIndex: null,
            StTime: null,
            logoDefault: logoWL,
            settingUp: null,
            status: null,
            urlImage: null,
            interval: null,
            StatusList: null,
        };
    },
    components: {
        WdtLoading
    },
    computed: {
        tickTime: function() {
            return Math.floor(this.StTime / this.StatusList.length * 60000);
        }
    },
    created() {
        this.reset();
        this.StIndex = this.calculateCurrentStep();
        if (this.StIndex > -1) {
            this.interval = setInterval(() => {
                this.StIndex += 1;
                if (this.StIndex > this.StatusList.length) {
                    this.settingUp = false;
                    clearInterval(this.interval);
                }
            }, this.tickTime);
        }
    },
    methods: {
        reset() {
            this.marginTop = 10;
            this.StError = '';
            this.StIndex = 0;
            this.StTime = 0.8;
            // this.logoDefault = '~/assets/images/icon-whitelabel.svg';
            this.settingUp = true;
            this.status = false;
            this.urlImage = 'https://storage.googleapis.com';
            this.interval = null;
            this.StatusList = [
                `Acquiring the current step`, // 1
                `Initializing product ${this.data && this.data.product && this.data.product.name} info`, // 2
                'Setting up server infrastructure', // 3
                `Creating server ${this.data && this.data.product && this.data.product.name}`, // 4
                `Initializing product admin`, // 5
                'Encrypting admin info and account', // 6
                'Setting up server permissions', // 7
                'Setting up system roles', // 7
                'Checking the security connection', // 8
                'Validating cloud storage and network', // 9
                'Finalizing the process' // 9
            ];
        },
        calculateCurrentStep() {
            let start = this.data.product.createdAt ? new Date(this.data.product.createdAt).getTime() : new Date().getTime();
            let end = start + this.StTime * 60000;
            let current = new Date().getTime();

            if (current >= end) {
                if (this.data.product.isCompleted === false)
                    return 8;
                this.settingUp = false;
                return -1;
            }
            let delta = current - start;
            let index = Math.floor(delta / this.tickTime);

            this.settingUp = true;
            return index;
        },
        // async accessProduct() {
        //     let {data, error} = await this.$services.userService.getUserAuthorization(this.code, RoleCode.ProductAdmin);
        //     if (error)
        //         console.log(error);
        //     else if (data && data.permission && data.permission.product) {
        //         let user = data;
        //         let result = await this.$services.userService.getPermission(user.token.accessToken);
        //         if (result.error)
        //             console.log(result.error);
        //         else if (result.data.claims || result.data.customs) {
        //             this.setCookie(`userAuth.${this.type}.${this.code}`, user, 2);
        //             this.setLocalStorage(`claimPermission.${this.type}.${this.code}`, result.data.claims);
        //             this.setLocalStorage(`customPermission.${this.type}.${this.code}`, result.data.customs);
        //             setTimeout(() => {
        //                 window.location.replace('https://' + this.domain);
        //             }, 100);
        //         }
        //     }
        // },
        // setCookie(cname, cvalue, exdays) {
        //     let d = new Date();
        //     d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        //     let expires = 'expires=' + d.toUTCString();
        //     document.cookie = cname + '=' + JSON.stringify(cvalue) + ';' + expires + ';path=/;domain=' + this.domain + ';';
        // },
        // setLocalStorage(key, value) {
        //     localStorage.setItem(key, JSON.stringify(value));
        // },
        mapUrlGoogleStorage(url) {
            return mapUrlGoogleStorage(url);
        },
        navigateClientManagement() {
            this.$router.push(`/client-management?productCode=${this.data.product.code}`);
        },
        navigateClientManagementDisabled() {
            this.$router.push(`/client-management?productCode=${this.data.product.code}&showDisabled=true`);
        },
        navigateTeamManagement() {
            this.$router.push(`/team-management?productCode=1&roleCode=${RoleCode.CaseManager}&productAssignment=${this.data.product.code}`);
        }
    },
    filters: {
        convertToCurrency(value) {
            return convertToCurrency(value);
        },
        displayProductType(type) {
            return Object.keys(ProductType)[Object.values(ProductType).indexOf(type)];
        }
    }
};
</script>
