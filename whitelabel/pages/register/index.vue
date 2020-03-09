<template>
    <section class="container-fluid form-container">
        <div class="form-box">
            <form @submit.prevent @keyup.enter="signup">
                <h1 class="form-title"><img title="" alt="" :src="logo" /></h1>
                <h3 class="form-description">Welcome to White Label system </h3>
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <div class="form-group">
                            <label class="form-label">FIRST NAME</label>
                            <input type="text" class="form-control form-input" placeholder="" v-model="data.firstName">
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <div class="form-group">
                            <label class="form-label">LAST NAME</label>
                            <input type="text" class="form-control form-input" placeholder="" v-model="data.lastName">
                            <span :class="{all : lastNameError || firstNameError }" class="tooltip-error right name">First name or Last name is invalid!</span>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="ip_email">EMAIL</label>
                    <input type="text" id="ip_email" class="form-control form-input" :value="data.email" disabled style="cursor: not-allowed">
                    <span v-if="emailSuccess" class="icon-success"></span>
                    <span v-else class="icon-war" :class="{active : emailError}"><span class="tooltip-error">{{ emailError }}</span></span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="ip_password">PASSWORD</label>
                    <input type="password" id="ip_password" class="form-control form-input" v-model="data.password">
                    <span v-if="passwordSuccess" class="icon-success"></span>
                    <span v-else class="icon-war" :class="{active : passwordError}"><span class="tooltip-error">{{ passwordError }}</span></span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="cf_password">Confirm Password</label>
                    <input type="password" id="cf_password" class="form-control form-input" v-model="data.cfPassword">
                    <span v-if="cfpasswordSuccess" class="icon-success"></span>
                    <span v-else class="icon-war" :class="{active : confirmPasswordError}"><span class="tooltip-error">{{ confirmPasswordError }}</span></span>
                </div>
                <loading :isShowLoading="showLoading" />
                <button type="button" class="form-btn btn" @click="signup">Sign up</button>
            </form>
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
            emailSuccess: false,
            passwordSuccess: false,
            cfpasswordSuccess: false,
            errorMessage: true,
            isInvited: false,
            data: {
                email: '',
                password: '',
                cfPassword: '',
                firstName: '',
                lastName: '',
                fullName: ''
            },
            emailError: '',
            passwordError: '',
            firstNameError: '',
            lastNameError: '',
            confirmPasswordError: '',
            showLoading: false,
            logo: '/images/logo.svg',
        };
    },
    async created() {
        await this.validateInvitation();
        await this.getLogoProduct();
    },
    methods: {
        reset() {
            this.emailSuccess = false;
            this.passwordSuccess = false;
            this.cfpasswordSuccess = false;
            this.errorMessage = true;
            this.isInvited = false;
            this.data = {
                email: '',
                password: '',
                cfPassword: '',
                firstName: '',
                lastName: '',
                fullName: ''
            };
            this.emailError = '';
            this.passwordError = '';
            this.firstNameError = '';
            this.lastNameError = '';
            this.confirmPasswordError = '';
            this.showLoading = false;
            this.logo = this.logo ? this.logo : '/images/logo.svg';
        },
        async validateInvitation() {
            let query = this.$route.query;
            if (query && query.token) {
                let {data, error} = await this.$services.userService.verifyInvitation(query.token);
                if (!data || error)
                    this.$router.push('/error/invitation-expired');
                else {
                    this.isInvited = true;
                    this.data.email = data.email;
                    this.data.firstName = data.firstName;
                    this.data.lastName = data.lastName;
                }
                return;
            }
            this.$router.push('/register');
        },
        validatePassword() {
            let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,20}$/;
            if (!regExp.test(this.data.password)) {
                this.passwordSuccess = false;
                this.passwordError = 'The password must have atleast 8 chars with one uppercase letter, one lower case letter, one digit and one special character!';
                return false;
            }
            this.passwordSuccess = true;
            return true;
        },
        validateCfPassword() {
            if (this.data.password !== this.data.cfPassword) {
                this.cfPasswordSuccess = false;
                this.confirmPasswordError = "These passwords don't match. Try again?";
                return false;
            }
            this.cfPasswordSuccess = true;
            this.confirmPasswordError = '';
            this.passwordError = '';
            return true;
        },
        validateEmail() {
            this.data.email = this.data.email.toLowerCase().trim();
            var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
            if (!regExp.test(this.data.email)) {
                this.emailSuccess = false;
                this.errorTitle = 'Email is invalid!';
                this.emailError = 'Email is invalid!';
            }
            else {
                this.emailSuccess = true;
                this.emailError = '';
                this.errorTitle = '';
            }
            return this.emailSuccess;
        },
        async signup() {
            if (!this.data.firstName) {
                this.firstNameError = 'FirstName is invalid';
                return false;
            }
            if (!this.data.lastName) {
                this.lastNameError = 'LastName is invalid';
                return false;
            }
            if (!this.data.email || !this.validateEmail(this.data.email))
                return false;
            if (!this.validatePassword())
                return false;
            if (!this.validateCfPassword())
                return false;

            this.data.fullName = this.data.firstName + ' ' + this.data.lastName;
            try {
                this.showLoading = true;
                let query = this.$route.query;
                let {data, error} = await this.$services.userService.signup(this.$store.state.productCode, this.data, query.token);
                if (error) {
                    this.errorMessage = true;
                    this.showLoading = false;
                }
                else {
                    if (!data || !data.permission || !data.permission.product) {
                        this.errorMessage = true;
                        this.showLoading = false;
                        return;
                    }

                    let user = data;
                    let result = await this.$services.userService.getPermission(user.token.accessToken);
                    if (result.error) {
                        this.errorMessage = true;
                        this.showLoading = false;
                    }
                    else {
                        if (!result.data.claims && !result.data.customs)
                            return;
                        let permission = {
                            claimPermissions: result.data.claims,
                            customPermissions: result.data.customs
                        };

                        this.$store.commit('SET_AUTH_USER', user);
                        this.$store.commit('SET_PERMISSION', permission);
                        this.setLocalStorage(this.$store.state.claimPermissionKey, result.data.claims);
                        this.setLocalStorage(this.$store.state.customPermissionKey, result.data.customs);

                        this.showLoading = false;
                        this.reset();
                        setTimeout(() => this.$router.push('/'), 100);
                    }
                }
            }
            catch (e) {
                console.log('Error signup: ', e);
                this.showLoading = false;
            }
        },
        setLocalStorage(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        async getLogoProduct() {
            let domain = window.location.hostname;
            let port = window.location.port;
            if (!domain)
                return {};
            let {data, error} = await this.$services.productService.getProductByDomain(domain, port);
            if (error)
                return;
            if (data) {
                if (data.logo)
                    this.logo = mapUrlGoogleStorage(data.logo);
                else
                    this.logo = '/images/logo.svg';
            }
            else {
                this.logo = '/images/logo.svg';
            }
        }
    }
};
</script>