<template>
    <div class="modal show fade box-popup product-detail" id="add-product" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content box-loading">
                <loading :isLoadingPage="false" :fullBox="true" :isShowLoading="showLoading"/>
                <div class="modal-body">   
                    <div class="form-group">
                        <div class="row">
                            <div class="col-12">
                                <label class="form-label">Product type</label>                                                                   
                                <div class="dropdown btn-input">
                                    <button class="dropdown-toggle form-input not-arrow" type="button" data-toggle="dropdown">
                                        {{ nameProductType ? nameProductType : 'Select product type' | convertNameProduct }}
                                        <i class="fa fa-angle-up" aria-hidden="true"></i>
                                        <i class="fa fa-angle-down" aria-hidden="true"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li class="dropdown-menu-link special" v-for="(value, key, index) in productTypes" :key="index" @click="selectProductType(value, key)" v-if="value !== productTypes.Management">
                                            <label for="menu" class="label-check">{{ key | convertNameProduct}}</label>                                            
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="col-12">
                                <label class="form-label">Product name</label>
                                <input  v-model="data.product.name" type="text" class="form-control form-input" placeholder="Name"> 
                                <!-- @input="changeProductName" -->
                            </div>
                            <div class="col-12">
                                <label class="form-label">url</label>
                                <input v-model="data.product.config.domain" type="text" class="form-control form-input" >
                            </div>

                            <!-- <div class="col-6 pdr-0">
                                <label class="form-label">Begin month</label>
                                <div class="dropdown btn-input">
                                    <button class="dropdown-toggle form-input not-arrow" type="button" data-toggle="dropdown">
                                        {{data.product.config.financialYear.beginMonth | convertMonthToWord}}
                                        <i class="fa fa-angle-up" aria-hidden="true"></i>
                                        <i class="fa fa-angle-down" aria-hidden="true"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li @click="selectBeginMonth(item)" v-for="(item, index) in listMonth" :key="index" class="dropdown-menu-link">
                                            {{item | convertMonthToWord}}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-6">
                                <label class="form-label">End month</label>
                                <div class="dropdown btn-input">
                                    <button disabled class="dropdown-toggle form-input not-arrow" type="button" data-toggle="dropdown">
                                        {{data.product.config.financialYear.endMonth | convertMonthToWord}}
                                    </button>
                                </div>
                            </div> -->

                            <!-- <div class="col-12">
                                <p class="system-logo-text" style="width:100%;display:inline-block;text-align:center;font-size:11px;">{{`Product's financial year will start from ${convertMonthToWord(data.product.config.financialYear.beginMonth)} ${new Date().getFullYear()} to ${convertMonthToWord(data.product.config.financialYear.endMonth)} ${data.product.config.financialYear.endMonth === 12 ? new Date().getFullYear() : new Date().getFullYear() + 1}`}}</p>
                            </div> -->

                            <div class="col-12">
                                <label class="form-label">Available menu</label>
                                <div class="dropdown btn-input">
                                    <button class="dropdown-toggle form-input not-arrow" type="button" data-toggle="dropdown">
                                        {{claims.length}} Menu
                                        <i class="fa fa-angle-up" aria-hidden="true"></i>
                                        <i class="fa fa-angle-down" aria-hidden="true"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li class="dropdown-menu-link special" v-for="(value, key, index) in menu" :key="index" @click.stop="getListMenuRemove(value.code)" v-if="value.code === 17007">
                                            <input :id="`menu-${index}`" type="checkbox" name="" v-model="claims" :value="value.code">
                                            <label :for="`menu-${index}`" class="label-check">{{ key }}</label>                                            
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div class="col-12">
                                <label class="form-label">system logo</label>
                                <div class="system-logo">
                                    <p class="system-logo-text">{{file.name}}</p>
                                    <img id="uploadPreview" v-if="file.size" class="icon-upload" style="width: 50px; height: 50px;margin: -8px auto 10px auto;"/><br/>
                                    <label for="file-upload" style="max-width: 90px" class="btn btn-small">
                                        Browse
                                    </label>
                                    <input @change="previewImage($event, 1)" class="ip-upload" id="file-upload" type="file" />
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label">system favicon</label>
                                <div class="system-logo">
                                    <p class="system-logo-text">{{favicon.name}}</p>
                                    <img id="faviconPreview" v-if="favicon.size" class="icon-upload" style="width: 50px; height: 50px;margin: -8px auto 10px auto;"/><br/>
                                    <label for="favicon-upload" style="max-width: 90px" class="btn btn-small">
                                        Browse
                                    </label>
                                    <input @change="previewImage($event, 2)" class="ip-upload" id="favicon-upload" type="file" />
                                </div>
                            </div>

                            <div class="col-6 pdr-0">
                                <label class="form-label">First name</label>
                                <input v-model="data.user.firstName" placeholder="First name" type="text" class="form-control form-input" >
                            </div>

                            <div class="col-6">
                                <label class="form-label">Last name</label>
                                <input v-model="data.user.lastName" placeholder="Last name" type="text" class="form-control form-input">
                            </div>

                            <div class="col-12">
                                <label class="form-label">Email</label>
                                <input v-model="data.user.email" placeholder="Email" type="text" class="form-control form-input">
                            </div>

                            <div class="col-12">
                                <label class="form-label">Password</label>
                                <input v-model="data.user.password" placeholder="Password" type="password" class="form-control form-input">
                            </div>

                            <div class="col-12">
                                <label class="form-label">Confirm password</label>
                                <input v-model="data.user.cfpassword" placeholder="Confirm Password" type="password" class="form-control form-input mb-0">
                            </div>
                        </div>
                        
                    </div>
                    <div class="row">
                        <div class="col-12 text-center">
                        <p v-if="errorText" class="form-label-error" style="font-size:11px;">{{errorText}}</p>    
                        </div>
                        <div class="col-6"><button @click="submit" class="form-btn">create</button></div>
                        <div class="col-6"><button class="form-btn grey" data-dismiss="modal">cancel</button></div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import {ProductType, UserStatus, ImageProduct} from '~/common/commonType';
import {convertMonthToWord} from '~/helpers/dateHelper';
import {convertNameProduct} from '~/helpers/dataHelper';
import Loading from '~/components/Loading';

export default {
    data() {
        return {
            data: null,
            file: null,
            favicon: null,
            errorText: null,
            prefix: null,
            listMonth: null,
            showLoading: false,
            menu: [],
            claims: [],
            productTypes: {},
            nameProductType: ''
        };
    },
    components: {
        Loading
    },
    created() {
        this.reset();
        this.productTypes = ProductType;
    },
    methods: {
        reset() {
            this.data = {
                product: {
                    name: '',
                    type: null,
                    config: {
                        financialYear: {
                            beginMonth: 7,
                            endMonth: 6
                        },
                        domain: '',
                    }
                },
                user: {
                    firstName: '',
                    lastName: '',
                    fullName: '',
                    email: '',
                    password: '',
                    cfpassword: '',
                    status: UserStatus.Active,
                },
                removeClaims: [],
            };
            this.file = {
                name: 'Upload product logo'
            };
            this.favicon = {
                name: 'Upload product favicon'
            };
            this.listMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            this.errorText = '';
            this.prefix = 'https://whitelabel.system';
            this.showLoading = false;
            this.claims = [];
            this.nameProductType = '';
        },
        open() {
            this.menu = this.$module.MENU.claim;
            $('#add-product').modal('show');
            this.reset();
            document.querySelector('#file-upload').value = '';
            document.querySelector('#favicon-upload').value = '';

            for (let key in this.menu) {
                if (this.menu[key].code === 17007)
                    this.claims.push(this.menu[key].code);
            }
        },
        close() {
            $('#add-product').modal('hide');
            this.reset();
        },
        async submit() {
            this.showLoading = true;
            this.data.user.fullName = `${this.data.user.firstName} ${this.data.user.lastName}`;

            if (!await this.validateProductFields(this.data.product)) {
                this.showLoading = false;
                return;
            }

            if (!await this.validateUserFields(this.data.user)) {
                this.showLoading = false;
                return;
            }

            if (!await this.validateEmail(this.data.user.email)) {
                this.showLoading = false;
                return;
            }

            if (!await this.validatePassword(this.data.user.password)) {
                this.showLoading = false;
                return;
            }

            if (!await this.validatePassword(this.data.user.cfpassword) || !await this.validateCfPassword(this.data.user.password, this.data.user.cfpassword)) {
                this.showLoading = false;
                return;
            }

            if (!this.file.size) {
                this.errorText = 'Product logo must not be null';
                this.showLoading = false;
                return;
            }

            this.data.user.fullName = `${this.data.user.firstName} ${this.data.user.lastName}`;
            let product = await this.setupProduct(this.data);

            if (!product) {
                // this.showLoading = false;
                return null;
            }
            else {
                let faviconUrl = '';
                let logoUrl = await this.uploadLogo(product._id, this.file, ImageProduct.Logo);
                if (this.favicon.size)
                    faviconUrl = await this.uploadLogo(product._id, this.favicon, ImageProduct.Favicon);
                if (!logoUrl) {
                    this.showLoading = false;
                    return null;
                }
                product.logo = '';
                product.favicon = '';
                product.logo = logoUrl;
                product.favicon = faviconUrl;
                this.showLoading = false;

                this.$emit('createSuccess', product);
                this.close();
            }
        },
        async setupProduct(body) {
            if (!body || !body.product || !body.user) {
                this.errorText = `Setup product ${this.data.product.name} failed.`;
                this.showLoading = false;
                return;
            }
            let {data, error} = await this.$services.productService.setup(body);
            if (error) {
                this.errorText = `Setup product ${this.data.product.name} failed. ${error.message}`;
                this.showLoading = false;
                return;
            }
            return data;
        },
        async uploadLogo(productId, file, type) {
            let formData = this.hanldeFormData(file, type);

            let {data, error} = await this.$services.productService.uploadLogo(productId, formData, type);

            if (error) {
                this.errorText = `Upload failed. ${error.message}`;
                this.showLoading = false;
                return;
            }
            return data;
        },
        hanldeFormData(file, type) {
            if (!file)
                return null;
            // let key = Object.keys(ImageProduct)[Object.values(ImageProduct).indexOf(type)];
            // formData.append('product' + key, file);
            let formData = new FormData();
            formData.append('productLogo', file);

            return formData;
        },
        previewImage(event, type) {
            if (type === ImageProduct.Logo) {
                this.file = event.target.files[0];

                let fileReader = new FileReader();
                fileReader.readAsDataURL(this.file);

                fileReader.onload = function(event) {
                    document.getElementById('uploadPreview').src = event.target.result;
                };
            }
            else {
                this.favicon = event.target.files[0];

                let fileReader = new FileReader();
                fileReader.readAsDataURL(this.favicon);

                fileReader.onload = function(event) {
                    document.getElementById('faviconPreview').src = event.target.result;
                };
            }
        },
        // changeProductName() {
        //     this.data.product.name = this.data.product.name.toLowerCase().replace(/\s/g, ' ');
        // },
        selectBeginMonth(month) {
            let endMonth;
            if (month === 1)
                endMonth = 12;
            else
                endMonth = month - 1;
            this.data.product.config.financialYear.beginMonth = month;
            this.data.product.config.financialYear.endMonth = endMonth;
        },
        convertMonthToWord(month) {
            return convertMonthToWord(month);
        },
        async validateProductFields(product) {
            if (!product) {
                this.errorText = 'Product must contain data!';
                return false;
            }
            if (!product.name || product.name.trim().length > 50 || product.name.trim().length < 3) {
                this.errorText = 'Product name must have at least 3 and up to 50 characters long!';
                return false;
            }
            if (!product.config.domain) {
                this.errorText = 'Product url must not be null!';
                return false;
            }
            if (!product.config.financialYear.beginMonth || product.config.financialYear.beginMonth < 0 || product.config.financialYear.beginMonth > 12) {
                this.errorText = 'Product begin month must be correct month!';
                return false;
            }
            if (!product.config.financialYear.endMonth || product.config.financialYear.endMonth < 0 || product.config.financialYear.endMonth > 12) {
                this.errorText = 'Product end month must be correct month!';
                return false;
            }
            if (!(product.config.financialYear.beginMonth === 1 ? product.config.financialYear.endMonth === 12 : product.config.financialYear.beginMonth > product.config.financialYear.endMonth)) {
                this.errorText = 'Product financial year is not correct!';
                return false;
            }
            return true;
        },
        async validateUserFields(user) {
            if (!user) {
                this.errorText = 'Admin must contain data!';
                return false;
            }
            if (!user.firstName) {
                this.errorText = 'Admin first name is required!';
                return false;
            }
            if (!user.lastName) {
                this.errorText = 'Admin last name is required!';
                return false;
            }
            if (!user.email) {
                this.errorText = 'Admin email must not be null!';
                return false;
            }
            if (!user.password) {
                this.errorText = 'Admin password must not be null!';
                return false;
            }
            if (!user.cfpassword) {
                this.errorText = 'Admin confirm password must not be null!';
                return false;
            }
            return true;
        },
        async validateEmail(email) {
            var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
            if (!regExp.test(email)) {
                this.errorText = 'Email is not correct!';
                return false;
            }
            let {data, error} = await this.$services.userService.validateEmail(email);
            if (error) {
                this.errorText = `Validate email failed! ${error.message}`;
                return false;
            }
            if (!data) {
                this.errorText = `Email already exsited! Please use another email.`;
                return false;
            }
            this.errorText = '';
            return true;
        },
        async validatePassword(password) {
            let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,20}$/;
            if (!regExp.test(password)) {
                this.errorText = 'The password must have at least 8 chars and up to 20 chars with one uppercase letter, one lower case letter, one digit and one special character!';
                return false;
            }
            this.errorText = '';
            return true;
        },
        async validateCfPassword(password, cfpassword) {
            if (password !== cfpassword) {
                this.errorText = 'The confirm password not match!';
                return false;
            }
            return true;
        },
        getListMenuRemove(claim) {
            let index = this.data.removeClaims.indexOf(claim);
            if (index < 0)
                this.data.removeClaims.push(claim);
            else
                this.data.removeClaims.splice(index, 1);
        },
        selectProductType(number, name) {
            this.data.product.type = number;
            this.nameProductType = name;
        }
    },
    filters: {
        convertMonthToWord(month) {
            return convertMonthToWord(month);
        },
        convertNameProduct
    }
};
</script>

