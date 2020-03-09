<template>
    <section class="container-fluid form-container">
        <div class="form-box">
            <form>
                <h1 class="form-title"><img title="" alt="" :src="logo" /></h1>
                <h3 class="form-description">Reset password</h3>
                <div class="form-group">
                    <label class="form-label" for="ip_email">New Password</label>
                    <input type="password" id="ip_email" class="form-control form-input" v-model="newPassword">
                    <span v-if="passwordSuccess" class="icon-success"></span>
                    <span v-else class="icon-war" :class="{active : passwordError}"><span class="tooltip-error">{{ passwordError }}</span></span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="ip_email">Confirm Password</label>
                    <input type="password" id="ip_email" class="form-control form-input" v-model="cfPassword">
                    <span v-if="cfpasswordSuccess" class="icon-success"></span>
                    <span v-else class="icon-war" :class="{active : confirmPasswordError}"><span class="tooltip-error">{{ confirmPasswordError }}</span></span>
                </div>
                <button type="button" class="form-btn btn" @click="resetPassword()">reset password</button>
                <p class="text-center" style="margin-top: 15px">{{successMessager}}</p>
            </form>
        </div>
    </section>
</template>
<script>
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';

export default {
    layout: 'blank',
    data() {
        return {
            newPassword: null,
            cfPassword: null,
            confirmPasswordError: null,
            passwordError: null,
            passwordSuccess: false,
            cfpasswordSuccess: false,
            successMessager: null,
            logo: ''
        };
    },
    mounted() {
        this.getLogoProduct();
    },
    methods: {
        validatePassword() {
            let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,20}$/;
            if (!regExp.test(this.newPassword)) {
                this.passwordSuccess = false;
                this.passwordError = 'The password must have atleast 8 chars with one uppercase letter, one lower case letter, one digit and one special character!';
                return false;
            }
            this.passwordSuccess = true;
            return true;
        },
        validateCfPassword() {
            if (this.newPassword !== this.cfPassword) {
                this.cfpasswordSuccess = false;
                this.confirmPasswordError = "These passwords don't match. Try again?";
                return false;
            }
            this.cfpasswordSuccess = true;
            this.confirmPasswordError = '';
            this.passwordError = '';
            return true;
        },
        async resetPassword() {
            if (!this.validatePassword())
                return false;
            if (!this.validateCfPassword())
                return false;
            if (!this.$route.query.token)
                return false;
            else {
                let data = {
                    forgotKey: this.$route.query.token,
                    password: this.newPassword
                };
                let result = await this.$services.userService.resetPassword(data);
                if (result.data) {
                    this.successMessager = 'Reset success';
                    alert('Reset success');
                    setTimeout(() => this.$router.push('/login'), 500);
                }
                else
                    this.successMessager = 'Reset not success';
            }
        },
        async getLogoProduct() {
            let domain = window.location.hostname;
            if (!domain)
                return {};
            let {data, error} = await this.$services.productService.getProductByDomain(domain);
            if (error)
                return;
            console.log(data);
            if (data && data.logo)
                this.logo = mapUrlGoogleStorage(data.logo);
            else
                this.logo = '/images/logo.png';
        },
    }
};
</script>