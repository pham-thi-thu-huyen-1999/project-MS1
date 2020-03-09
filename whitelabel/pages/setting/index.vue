<template>
    <section class="setting">
        <div class="row general">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <page-title :titles="titles"/>
                <div class="row">
                    <div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">
                        <menu-page :listMenu="listMenu"></menu-page>
                    </div>
                    <div class="col-md col-sm-12 col-xs-12">
                        <div class="box-center">     
                            <div class="col-md-12 col-sm-12 col-xs-12">
                                <h3 class="setting-title">General settings</h3>
                                <div class="row">
                                    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                        <label class="setting-label">Product name</label>
                                    </div>
                                    <div class="col-lg-8 col-md-9 col-sm-8 col-xs-12">
                                        <input type="text" class="form-control form-input" v-model="data.name">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                        <label class="setting-label">Logo</label>
                                    </div>
                                    <div class="col-lg-10 col-md-9 col-sm-8 col-xs-12">
                                        <img v-if="data.logo" class="setting-logo" :src="data.logo"/>
                                        <label for="file-upload-logo"  class="form-btn small">CHANGE IMAGE</label>
                                        <input class="ip-upload" id="file-upload-logo" type="file" @change="uploadLogoOrFaviconProduct(data._id, $event, ImageProduct.Logo)">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                        <label class="setting-label">Favicon</label>
                                    </div>
                                    <div class="col-lg-10 col-md-9 col-sm-8 col-xs-12">
                                        <img  v-if="data.favicon" class="setting-logo favicon" :src="data.favicon"/>
                                        <label for="file-upload-favicon"  class="form-btn small">CHANGE IMAGE</label>
                                        <input class="ip-upload" id="file-upload-favicon" type="file" @change="uploadLogoOrFaviconProduct(data._id, $event, ImageProduct.Favicon)">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                        <label class="setting-label">Color scheme</label>
                                    </div>
                                    <div class="col-lg-10 col-md-9 col-sm-8 col-xs-12">
                                        <div class="form-group">
                                            <label class="label-theme">Option1<input type="radio" class="" name="select-theme" @click="checkColor(data._id, 1)" :checked="data.config.colorScheme === 1"></label>
                                            <ul class="group-color">
                                                <li class="color-item" style="background-color:#0096D0;border-color:#0096D0">#0096D0</li>
                                                <li class="color-item" style="background-color:#143F6A;border-color:#143F6A">#143F6A</li>
                                                <li class="color-item" style="background-color:#727272;border-color:#727272">#727272</li>
                                                <li class="color-item" style="background-color:#FFFFFF;color: #7e8188;">#FFFFFF</li>
                                            </ul>
                                        </div>
                                         <div class="form-group">
                                            <label class="label-theme">Option2<input type="radio" class="" name="select-theme" @click="checkColor(data._id, 2)" :checked="data.config.colorScheme === 2"></label>
                                            <ul class="group-color">
                                                <li class="color-item" style="background-color:#00c9a3;border-color:#00c9a3">#00C9A3</li>
                                                <li class="color-item" style="background-color:#ff5050;border-color:#ff5050">#FF5050</li>
                                                <li class="color-item" style="background-color:#727272;border-color:#727272">#727272</li>
                                                <li class="color-item" style="background-color:#FFFFFF;color: #7e8188;">#FFFFFF</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-2 col-md-3 col-sm-2 col-xs-12">
                                        <label class="setting-label">Domain</label>
                                    </div>
                                    <div class="col-lg-8 col-md-9 col-sm-8 col-xs-12">
                                        <input type="text" disabled class="form-control form-input" v-model="data.config.domain">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-2 col-md-3 col-sm-2 col-xs-12">
                                        <label class="setting-label">Sender Name</label>
                                    </div>
                                    <div class="ol-lg-8 col-md-9 col-sm-8 col-xs-12">
                                        <input type="text" class="form-control form-input" v-model="data.config.nameSupport">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-2 col-md-3 col-sm-2 col-xs-12">
                                        <label class="setting-label">Sender Mail</label>
                                    </div>
                                    <div class="ol-lg-8 col-md-9 col-sm-8 col-xs-12">
                                        <input type="text" class="form-control form-input" v-model="data.config.emailSupport">
                                    </div>
                                </div>
                                <span class="form-label" style="color: red;">{{errorText ? errorText : ''}}</span>
                                <div class="row justify-content-center">
                                    <div class="col-lg-4 offset-lg-1 col-md-6 col-sm-5 col-9">
                                        <button @click="updateGeneralSettings(data._id)" class="form-btn">save changes</button>
                                    </div>
                                    <!-- <div class="col-lg-4 col-md-6 col-sm-5 col-9">
                                        <button class="form-btn grey">cancel</button>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-auto col-sm-12 col-xs-12">
                        <history-logs></history-logs>
                    </div>
                </div>
                
            </div>
            <loading :isShowLoading="showLoading"/>
            <popup-confirm id="popup-image-product" ref="popupConfirm" :title="confirm.title" :buttonName1="confirm.buttonName1"/>
        </div>
    </section>  
</template>

<script>
import HistoryLogs from '~/components/HistoryLogs';
import MenuPage from '~/components/MenuPage';
import PageTitle from '~/components/PageTitle';
import {mapUrlGoogleStorage, Themes} from '~/helpers/dataHelper';
import EventBus from '~/plugins/event-bus';
import {ImageProduct} from '~/common/commonType';
import PopupConfirm from '~/components/PopupConfirm';
import Loading from '~/components/Loading';

export default {
    data() {
        return {
            listMenu: null,
            titles: ['Settings'],
            data: null,
            errorText: null,
            ImageProduct: ImageProduct,
            confirm: {},
            showLoading: false,
        };
    },
    created() {
        this.search();
    },
    watch: {

    },
    components: {
        HistoryLogs,
        MenuPage,
        PageTitle,
        PopupConfirm,
        Loading
    },
    methods: {
        reset() {
            this.errorText = '';
            this.listMenu = [];
            this.data = {
                name: '',
                logo: '',
                favicon: '',
                config: {
                    domain: '',
                    colorScheme: null,
                    emailSupport: '',
                    nameSupport: '',
                },
            };
            this.ImageProduct = ImageProduct;
            this.confirm = {
                title: '',
                buttonName1: ''
            };
        },
        async search() {
            this.reset();
            await this.getListMenu();
            await this.getProduct();
        },
        async getProduct() {
            let productId = this.$store.state.userAuth.permission.product._id;
            if (!productId)
                return {};

            let {data, error} = await this.$services.userService.getProduct(productId);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: 'Get product\'s information fail'});

            if (data) {
                if (data.logo)
                    data.logo = mapUrlGoogleStorage(data.logo);
                else if (!data.logo)
                    data.logo = '/images/logo.svg';
                if (data.favicon)
                    data.favicon = mapUrlGoogleStorage(data.favicon);
                else if (!data.favicon)
                    data.favicon = '/favicon.ico';
            }
            else {
                data.logo = '/images/logo.svg';
                data.favicon = '/favicon.ico';
            }
            this.data = data;
        },
        async uploadLogoOrFaviconProduct(_id, event, imageProductType) {
            let files = event.target.files;
            let formData = new FormData();
            if (imageProductType === ImageProduct.Logo) {
                let imageExtensions = ['image/jpg', 'image/png', 'image/jpeg'];
                let result = files[0] && imageExtensions.find((item) => item === files[0].type);
                if (!result) {
                    this.confirm = {
                        title: 'Please! Choose jpg, png, jpeg image!',
                        buttonName1: 'Ok'
                    };
                    this.$refs.popupConfirm.open();
                    return;
                }
            }
            else if (imageProductType === ImageProduct.Favicon) {
                let imageExtensions = ['image/vnd.microsoft.icon', 'image/jpg', 'image/png', 'image/jpeg'];
                let result = files[0] && imageExtensions.find((item) => item === files[0].type);
                if (!result) {
                    this.confirm = {
                        title: 'Please! Choose ico, jpg, png, jpeg image!',
                        buttonName1: 'Ok'
                    };
                    this.$refs.popupConfirm.open();
                    return;
                }
            }
            this.showLoading = true;
            formData.append('productLogo', files[0]);
            let {data, error} = await this.$services.userService.uploadLogoOrFaviconProduct(_id, formData, imageProductType);
            if (error) {
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: 'Upload logo product failed'});
                this.showLoading = false;
                return;
            }
            if (data) {
                if (imageProductType === ImageProduct.Logo) {
                    this.data.logo = data && mapUrlGoogleStorage(data);
                    EventBus.$emit('LOGO_PRODUCT', this.data.logo);
                }
                if (imageProductType === ImageProduct.Favicon) {
                    this.data.favicon = data && mapUrlGoogleStorage(data);
                    EventBus.$emit('FAVICON_PRODUCT', this.data.favicon);
                }
            }
            this.showLoading = false;
        },
        async updateGeneralSettings(_id) {
            if (!this.validateName(this.data.name)) {
                this.errorText = 'Name Product entered incorrect or Name Product must have atleast 4 chars and less than 20 chars';
                return;
            }

            if (!this.data.config.colorScheme) {
                this.errorText = 'Color scheme no check';
                return;
            }
            if (!this.data.config.domain) {
                this.errorText = 'Sub domain entered incorrect or Sub domain must have atleast 4 chars';
                return;
            }
            if (!this.validateName(this.data.config.nameSupport)) {
                this.errorText = 'Supporter entered incorrect or Supporter must have atleast 4 chars and less than 20 chars';
                return;
            }
            if (!this.validateEmail())
                return;

            let domain = this.data.config.domain;
            if (domain.indexOf('//') !== -1)
                domain = domain.split('//')[1];
            if (domain.indexOf('/') !== -1)
                domain = domain.split('/')[0];
            this.data.config.domain = domain;

            let data = {
                name: this.data.name,
                config: {
                    domain,
                    colorScheme: this.data.config.colorScheme,
                    emailSupport: this.data.config.emailSupport,
                    nameSupport: this.data.config.nameSupport,
                },
            };
            let result = await this.$services.userService.updateProduct(_id, data);
            if (result.error)
                this.errorText = result.error.message;
            else {
                result.data = data;
                this.$notify({
                    group: 'success',
                    title: 'update config completed',
                    text: 'Thank you'
                });
                let head = {
                    title: data.name,
                    theme: Themes(data.config.colorScheme)
                };
                EventBus.$emit('HEAD', head);
            }
        },
        getListMenu() {
            let data = this.$services.commonService.getSettingLinks();
            if (data) {
                this.listMenu = data;
            }
            else {
                console.log('error');
            }
        },
        async checkColor(id, color) {
            this.data.config.colorScheme = color;
            // let data = {colorScheme: color};
            // let result = await this.$services.userService.updateTheme(id, data);
            // if (result.error)
            //     this.errorText = result.error.message;
            // else {
            //     let head = {
            //         theme: Themes(color)
            //     };
            //     EventBus.$emit('HEAD', head);
            // }
        },
        validateName(name) {
            if (!name || name.trim().length === 0 || name.trim().length > 20)
                return false;
            return true;
        },
        validateEmail() {
            this.data.config.emailSupport = this.data.config.emailSupport.toLowerCase().trim();
            var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
            if (!regExp.test(this.data.config.emailSupport)) {
                this.errorText = 'Email is invalid!';
                return false;
            }
            return true;
        },
    }
};
</script>

