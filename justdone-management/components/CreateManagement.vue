<template>
    <div class="modal box-popup fade show" :id="id" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
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
                        <input type="password" class="form-control form-input" placeholder="Password"  v-model="data.password">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Confirm password</label>
                        <input type="password" class="form-control form-input" placeholder="Confirm Password"  v-model="data.cfpassword">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Product</label>
                        <div class="dropdown btn-input">
                            <button class="dropdown-toggle form-input not-arrow" type="button" data-toggle="dropdown">
                                {{nameProduct ? nameProduct : 'Select product'}} 
                                <i class="fa fa-angle-up" aria-hidden="true"></i>
                                <i class="fa fa-angle-down" aria-hidden="true"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li v-for="(product, index) in products" :key="index" class="dropdown-menu-link" @click="selectProduct(product)">
                                    {{product.name}}
                                </li>
                               
                            </ul>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Role</label>
                        <div class="dropdown btn-input">
                            <button class="dropdown-toggle form-input not-arrow" type="button" data-toggle="dropdown">
                                {{nameRole ? nameRole : 'Select role'}} 
                                <i class="fa fa-angle-up" aria-hidden="true"></i>
                                <i class="fa fa-angle-down" aria-hidden="true"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li v-for="(role, index) in roles" :key="index" class="dropdown-menu-link" @click="selectRole(role)">
                                    {{role.name}}
                                </li>
                               
                            </ul>
                        </div>
                    </div>
                    <!-- <div class="form-group" v-show="isProduct">
                        <label class="form-label">Product</label>
                        <div class="dropdown btn-input">
                            <button class="dropdown-toggle form-input not-arrow" type="button" data-toggle="dropdown">
                                {{nameProduct ? nameProduct : 'Select product'}} 
                                <i class="fa fa-angle-up" aria-hidden="true"></i>
                                <i class="fa fa-angle-down" aria-hidden="true"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li v-for="(product, index) in products" :key="index" class="dropdown-menu-link" @click="selectProduct(product)">
                                    {{product.name}}
                                </li>
                               
                            </ul>
                        </div>
                    </div> -->
                      <span v-if="errorText" class="form-label-error">{{errorText}}</span>
                      <div class="row">
                          <div class="col-6"><button class="form-btn" @click="createManager">CREATE</button></div>
                          <div class="col-6"><button class="form-btn grey" data-dismiss="modal">cancel</button></div>
                      </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import {RoleCode} from '~/common/commonType';

export default {
    data() {
        return {
            data: null,
            roles: null,
            products: null,
            errorText: null,
            nameRole: null,
            nameProduct: null,
            isProduct: true,
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
    methods: {
        reset() {
            this.roles = [];
            this.products = [];
            this.nameRole = '';
            this.nameProduct = '';
            this.selectedProductCode = '';
            this.errorText = '';
            this.data = {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                cfpassword: '',
                role: '',
            };
            this.$setLoading(false);
            this.isProduct = false;
        },
        open(data) {
            this.reset();
            this.getProducts();
            $('#' + this.id).modal('show');
        },
        close() {
            $('#' + this.id).modal('hide');
        },
        async getRoles() {
            let {data, error} = await this.$services.roleService.getRoles(this.selectedProductCode);
            if (error)
                return false;
            if (data && data.length > 0) {
                if (this.selectedProductCode !== this.$store.state.productCode) {
                    data.forEach((item, index) => {
                        if (item.code === RoleCode.Client)
                            data.splice(index, 1);
                    });
                }
                this.roles = data;
            }
        },
        async getProducts() {
            let listProducts = [];
            if (this.$store.state.userAuth && this.$store.state.userAuth.permission) {
                if (this.$store.state.userAuth.permission.role.code) {
                    let roleCde = this.$store.state.userAuth.permission.role.code;
                    if (roleCde !== RoleCode.SuperAdmin)
                        if (this.$store.state.userAuth.permission.product.code) {
                            let productCode = Number(this.$store.state.userAuth.permission.product.code);
                            listProducts.push(productCode);
                        }
                }
            }
            let {data, error} = await this.$services.productService.lookup(listProducts);
            if (error)
                return false;
            if (data && data.length > 0) {
                this.products = data;
            }
        },
        selectRole(role) {
            this.data.role = role.code;
            this.nameRole = role.name;
            // if (role.code === RoleCode.ProductManager || role.code === RoleCode.ProductAdmin) {
            //     this.getProducts();
            //     this.isProduct = true;
            // }
            // else {
            //     this.isProduct = false;
            // }
        },
        selectProduct(product) {
            this.nameProduct = product.name;
            this.selectedProductCode = product.code;
            if (this.selectedProductCode)
                this.getRoles();
        },
        async createManager() {
            let productCode = 0;
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
                this.errorText = 'The password must have at least 8 chars and up to 20 chars with one uppercase letter, one lower case letter, one digit and one special character!';
                return false;
            }

            if (!this.validatePassword(this.data.cfpassword) || !await this.validateCfPassword(this.data.password, this.data.cfpassword)) {
                this.data.password = '';
                this.data.cfpassword = '';
                this.errorText = 'The confirm password not match! ';
                return false;
            }

            if (!this.data.role) {
                this.errorText = 'The role is incorrect!';
                return false;
            }

            let body = {
                firstName: this.data.firstName,
                lastName: this.data.lastName,
                email: this.data.email,
                password: this.data.password,
                // roleCode: this.data.role,
                // productCode: this.$store.state.productCode,
            };

            this.$setLoading();
            if (this.selectedProductCode)
                productCode = this.selectedProductCode;
            let {data, error} = await this.$services.userService.createManager(productCode, this.data.role, body);
            if (error)
                this.errorText = error.message;
            else if (data) {
                this.$notify({
                    type: 'success',
                    title: 'Create manager completed',
                    text: 'Thank you'
                });
                this.$emit('success', {data: data, isNew: true});
                this.close();
            }
            else
                this.errorText = 'Cannot get the manager created!';
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

