<template>
    <div class="modal box-popup fade show" :id="id" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog box-loading">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Product</label>
                        <div class="dropdown btn-input">
                            <button class="dropdown-toggle form-input not-arrow" type="button" data-toggle="dropdown">
                               {{nameProduct ? nameProduct : 'Select Product'}} 
                                <i class="fa fa-angle-up" aria-hidden="true"></i>
                                <i class="fa fa-angle-down" aria-hidden="true"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li v-for="(item, index) in products" :key="index" class="dropdown-menu-link" @click="selectProduct(item)">
                                    {{item.name}}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6 pdr-5">
                            <div class="form-group">
                                <label class="form-label">first name</label>
                                <input type="text" class="form-control form-input" placeholder="First name" v-model="data.firstName">
                            </div>
                        </div>
                        <div class="col-6 pdl-5">
                            <div class="form-group">
                                <label class="form-label">last name</label>
                                <input type="text" class="form-control form-input" placeholder="Last name" v-model="data.lastName">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="text" class="form-control form-input" placeholder="Email"  v-model="data.email">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-control form-input" placeholder="Password" v-model="data.password">
                    </div>
                     <div class="form-group">
                        <label class="form-label">Confirm password</label>
                          <input type="password" class="form-control form-input" placeholder="Confirm Password"  v-model="data.cfpassword">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="ip_abn">ABN</label>
                        <input type="text" v-model="data.businessInfo.abnCode" placeholder="Enter ABN (11 111 xxx xxx)" id="ip_abn" name="abnCode" class="form-control form-input">
                    </div>
                    <div class="row">
                        <div class="col-6 pdr-5">
                            <div class="form-group">
                                <label class="form-label" for="enity_name">ENTITY NAME</label>
                                <input type="text" v-model="data.businessInfo.entityName" id="enity_name" class="form-control form-input" disabled>
                            </div>
                        </div>
                        <div class="col-6 pdl-5">
                            <div class="form-group">
                                <label class="form-label" for="enity_type">ENTITY TYPE</label>
                                <input type="text" v-model="data.businessInfo.entityType" id="enity_type" class="form-control form-input" disabled>
                            </div>
                        </div>
                    </div>
                    
                     <span v-if="errorText" class="form-label-error">{{errorText}}</span>
                    <div class="row">
                        <div class="col-6 pdr-5"><button class="form-btn" @click="createClient">CREATE</button></div>
                        <div class="col-6 pdl-5"><button class="form-btn grey" data-dismiss="modal">cancel</button></div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import {setTimeout} from 'timers';

export default {
    data() {
        return {
            data: null,
            products: null,
            errorText: null,
            nameProduct: null,
        };
    },
    created() {
        this.reset();
    },
    props: {
        id: {
            type: String,
            default: ''
        },
    },
    watch: {
        'data.businessInfo.abnCode': function(newData) {
            if (newData) {
                this.$setLoading(false);
                clearTimeout(this.keypressTimeout);
                this.keypressTimeout = setTimeout(() => this.getBusinessInfoByAbnCode(), 1200);
            }
        }
    },
    methods: {
        reset() {
            this.products = [];
            this.nameProduct = '';
            this.errorText = '';
            this.data = {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                cfpassword: '',
                product: '',
                businessInfo: {
                    abnCode: '',
                    entityName: '',
                    entityType: ''
                }
            };
        },
        open(data) {
            this.reset();
            this.getProducts();
            $('#' + this.id).modal('show');
        },
        close() {
            $('#' + this.id).modal('hide');
        },
        async getProducts() {
            let {data, error} = await this.$services.productService.lookup();
            if (error)
                return false;
            this.products = data;

            // Management ko co Client
            // => Disable Product Management when create client
            if (this.$route.name === 'client-management')
                this.products = this.products.filter(item => item.code !== this.$store.state.productCode);
        },
        selectProduct(product) {
            this.data.product = product.code;
            this.nameProduct = product.name;
        },
        async createClient() {
            if (!this.data.firstName || this.data.firstName.trim().length > 20) {
                this.errorText = 'The first name is required and up to 20 characters!';
                return false;
            }

            if (!this.data.lastName || this.data.lastName.trim().length > 20) {
                this.errorText = 'The last name is required and up to 20 characters!';
                return false;
            }

            if (!this.validateEmail(this.data.email)) {
                this.errorText = 'The email address is incorrect!';
                return false;
            }
            if (!this.validatePassword(this.data.password)) {
                this.errorText = 'The password must have atleast 8 and up to 20 chars with one uppercase letter, one lower case letter, one digit and one special character!';
                return false;
            }
            if (!this.validatePassword(this.data.cfpassword) || !await this.validateCfPassword(this.data.password, this.data.cfpassword)) {
                this.data.password = '';
                this.data.cfpassword = '';
                this.errorText = 'The confirm password not match!';
                return false;
            }
            if (!this.data.product) {
                this.errorText = 'The product is incorrect!';
                return false;
            }
            if (!this.data.businessInfo.abnCode) {
                this.errorText = 'The ABN is incorrect!';
                return false;
            }

            if (this.errorText)
                return false;

            let body = {
                firstName: this.data.firstName,
                lastName: this.data.lastName,
                email: this.data.email,
                password: this.data.password,
                businessInfo: this.data.businessInfo
                // productCode: this.data.product,
            };

            this.$setLoading();
            let {data, error} = await this.$services.userService.createClient(this.data.product, body);
            if (error)
                this.errorText = error.message;
            else if (data) {
                this.$notify({
                    type: 'success',
                    title: 'Create client completed',
                    text: 'Thank you'
                });
                this.$emit('success', {data: data, isNew: true});
                this.close();
            }
            else
                this.errorText = 'Cannot get the client created!';
            this.$setLoading(false);
        },
        async getBusinessInfoByAbnCode() {
            let abnCode = await this.data.businessInfo.abnCode.replace(/ /g, '');
            let checkNubmerType = /^\d{11}$/g;
            if (!checkNubmerType.test(abnCode)) {
                this.errorText = 'The ABN is incorrect!';
                return false;
            }

            this.$setLoading();
            let {data, error} = await this.$services.abnService.lookupABN(abnCode);
            if (error || !data) {
                this.errorMessageAbnCode = true;
                this.data.businessInfo.entityName = '';
                this.data.businessInfo.entityType = '';
                this.errorText = 'The ABN is incorrect!';
            }
            else {
                this.data.businessInfo.entityName = data.entityName || data.title;
                this.data.businessInfo.entityType = data.entityType || data.company_type;
                this.data.businessInfo.address = data.address_snippet || '';
                this.errorText = '';
            }
            this.$setLoading(false);
        },
        validateEmail(email) {
            email = email.toLowerCase().trim();
            var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
            if (!email || !regExp.test(email))
                return false;
            return true;
        },
        validatePassword(password) {
            let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,20}$/;
            if (!password || !regExp.test(password))
                return false;
            return true;
        },
        validateCfPassword(password, cfpassword) {
            if (password !== cfpassword)
                return false;
            return true;
        },
    }
};
</script>

