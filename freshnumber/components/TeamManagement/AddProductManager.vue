<template>
    <div class="modal box-popup fade show" id="popUp" role="dialog" data-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <h3 class="popup-title">Add new product manager</h3>    
                    <div class="row">
                        <div class="col-6 pdr-5">
                            <div class="form-group">
                                <label class="form-label">First Name</label>
                                <input type="text" class="form-control form-input" placeholder="First Name" v-model="data.firstName">
                            </div>
                        </div>
                        <div class="col-6 pdl-5">
                            <div class="form-group">
                                <label class="form-label">Last Name</label>
                                <input type="text" class="form-control form-input" placeholder="Last Name" v-model="data.lastName">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="text" class="form-control form-input" placeholder="Email" v-model="data.email">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-control form-input" placeholder="" v-model="data.password">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Confirm Password</label>
                        <input type="password" class="form-control form-input" placeholder="" v-model="data.cfPassword">
                    </div>
                    <div class="form-group" style="text-align: center;" v-if="errorText">
                        <label class="form-label" style="color: red;">{{ errorText }}</label>                        
                    </div>
                    
                    <div class="col-12 two-btn text-center">
                            <button class="form-btn" @click="create()">DONE</button>
                            <button data-dismiss="modal" class="form-btn grey">cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import {RoleCode} from '~/common/commonType';

export default {
    data: () => ({
        data: {
            firstName: null,
            lastName: null,
            email: null,
            productCode: null,
            roleCode: null,
            password: null,
            cfPassword: null
        },
        errorText: null,
        emailSuccess: null,
    }),
    methods: {
        open() {
            this.reset();
            $('#popUp').modal('show');
        },
        close() {
            $('#popUp').modal('hide');
        },
        reset() {
            this.data = {
                firstName: '',
                lastName: '',
                email: '',
                productCode: this.$store.state.productCode,
                roleCode: RoleCode.ProductManager,
                emailSuccess: false,
                password: null,
                cfPassword: null,
            };
            this.errorText = '';
        },
        async create() {
            if (!this.validataName(this.data.firstName) || !this.validataName(this.data.lastName)) {
                this.errorText = 'Info invalid!';
                return;
            }

            if (!this.validateEmail())
                return;

            if (!this.validatePassword())
                return false;

            if (!this.validateCfPassword())
                return false;

            this.data.fullName = this.firstName + ' ' + this.lastName;

            let result = await this.$services.userService.createProductManager([this.data.productCode], RoleCode.ProductManager, this.data);
            if (result.error)
                this.errorText = result.error.message;
            else {
                this.$notify({
                    group: 'success',
                    title: 'Create Manager completed',
                    text: 'Thank you'
                });
                this.$emit('success', {data: result.data, isNew: true});
                this.close();
            }
        },
        validataName(name) {
            if (!name || name.trim().length === 0 || name.trim().length > 20)
                return false;
            return true;
        },
        validateEmail() {
            this.data.email = this.data.email.toLowerCase().trim();
            var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
            if (!regExp.test(this.data.email)) {
                this.errorText = 'Email is invalid!';
                return false;
            }
            return true;
        },
        validatePassword() {
            let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,20}$/;
            if (!regExp.test(this.data.password)) {
                this.errorText = 'The password must have atleast 8 chars and less than 20 chars with one uppercase letter, one lower case letter, one digit and one special character!';
                return false;
            }
            return true;
        },
        validateCfPassword() {
            if (this.data.password !== this.data.cfPassword) {
                this.errorText = "These passwords don't match. Try again?";
                return false;
            }
            return true;
        },
    }
};
</script>