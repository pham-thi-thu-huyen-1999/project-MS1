<template>
    <section class="container-fluid form-container signup">
        <div class="form-box">
            <h1 class="form-title"><img title="" alt="" :src="logo" /></h1>
            <h2 class="form-heading">Welcome</h2>
            <h3 class="form-description">Let’s create you an account to get started.</h3>
            <kform :state="signupStepOne" name="signupStepOne" @submit.prevent='signupStepTwo'>
                <div class="form-group">
                    <label class="form-label" for="ip_email">EMAIL ADDRESS</label>
                    <input v-model="data.email" name="email" required type="email" id="ip_email" class="form-control form-input">
                    <!-- <div v-if="!beginEmail">
                        <span v-if="emailSuccess" class="icon-success"></span>
                        <span v-else class="icon-war" :class="{active : errorMessage}"><span class="tooltip-error">{{errorMessageEmail}}</span></span>
                    </div> -->
                </div>
                <div class="form-group">
                    <label class="form-label" for="ip_password">PASSWORD</label>
                    <input v-model="data.password" pass-custom type="password" name="password" required minlength="5" id="ip_password" class="form-control form-input">
                    <!-- <div v-if="!beginPassword">
                        <span v-if="passwordSuccess" class="icon-success"></span>
                        <span v-else class="icon-war" :class="{active : requiredPassword}"><span class="tooltip-error">The password must have at least 8 chars with one uppercase letter, one lower case letter, one digit and one special character!</span></span>
                    </div> -->
                </div>
                <div class="form-group">
                    <label class="form-label" for="cf_password">Confirm Password</label>
                   <input v-model="cfPassword" :confirm-pass="data.password" name="confirmPassword" required minlength="5" type="password" id="cf_password" class="form-control form-input">
                </div>
                <loading :isShowLoading="showLoading" />
                 <span class="form-label-error" style="font-size:12px;" v-if="!isvalidMessage && !beginEmail">Email was already existed</span>
                <button type="submit" class="form-btn btn">Sign up</button>
                 <p class="form-paragraph">Already Register? <nuxt-link to="/" class="link">Login</nuxt-link></p>
                <p class="form-paragraph">By creating this account you agree to the <nuxt-link to="/" class="link">Terms & Conditions</nuxt-link></p>
            </kform>
        </div>
    </section>
</template>
<script>
import Loading from '~/components/Loading';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';

export default {
    layout: 'blank',
    components: {
        Loading
    },
    data() {
        return {
            signupStepOne: {},
            emailSuccess: false,
            passwordSuccess: false,
            cfpasswordSuccess: false,
            isvalidMessage: true,
            email: '',
            password: '',
            showLoading: false,
            requiredPassword: true,
            beginEmail: true,
            beginPassword: true,
            beginCfPassword: true,
            data: {
                email: '',
                password: '',
            },
            cfPassword: '',
            errorText: '',
            errorMessageEmail: 'Email is invalid!',
            logo: '/images/logo.png',
            domain: ''
        };
    },
    mounted() {
        this.domain = window.location.hostname;
        this.getLogoProduct();
        let sessionStoraged = sessionStorage.getItem('signup-step1');
        let data = JSON.parse(sessionStoraged);

        if (data && data.email.length > 0 && data.password.length > 0) {
            this.data.email = data.email;
            this.data.password = data.password;
            this.cfPassword = data.password;
            // this.validateEmail();
            // this.validatePassword();
            // this.validateCfPassword();
        }
    },
    methods: {
        async validateEmail() {
            // var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
            // if (!regExp.test(this.data.email)) {
            //     this.errorMessage = true;
            //     this.emailSuccess = false;
            //     this.errorMessageEmail = 'incorrect format email !!';
            //     return false;
            // }
            this.beginEmail = false;
            let {error, data} = await this.$services.userService.validateEmail(this.data.email);
            if (error || !data) {
                this.isvalidMessage = false;
                this.errorMessageEmail = 'email was already exist !!';
                // this.emailSuccess = false;
                return false;
            }
            this.isvalidMessage = true;
            this.beginEmail = true;
            return true;
            // this.emailSuccess = true;
        },
        async validatePassword() {
            if (this.data.password.length > 0)
                this.beginPassword = false;
            else
                this.beginPassword = true;

            let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,20}$/;
            if (!regExp.test(this.data.password)) {
                this.passwordSuccess = false;
                return false;
            }
            this.requiredPassword = false;
            this.passwordSuccess = true;
            return true;
        },
        validateCfPassword() {
            if (this.data.password !== this.cfPassword) {
                this.cfpasswordSuccess = true;
                return false;
            }
            this.cfpasswordSuccess = false;
            return true;
        },
        async signupStepTwo() {
            if (this.signupStepOne.$invalid) return;
            await this.validateEmail();

            if (this.isvalidMessage && this.validateCfPassword()) {
                // await this.$store.commit('SET_SIGNUP_USER_INFO', this.data);
                sessionStorage.setItem('signup-step1', JSON.stringify(this.data));
                this.$router.push('/signup/signup-step2');
            }
        },
        async getLogoProduct() {
            // let domain = window.location.hostname;
            if (!this.domain)
                return {};
            let {data} = await this.$services.productService.getProductByDomain(this.domain);
            if (data) {
                if (data.logo)
                    this.logo = mapUrlGoogleStorage(data.logo);
                else
                    this.logo = '/images/logo.png';
            }
            else {
                this.logo = '/images/logo.png';
            }
        },
    }
};
</script>