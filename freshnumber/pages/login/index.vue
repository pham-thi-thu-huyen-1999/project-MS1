<template>
    <section class="container-fluid form-container">
        <div class="form-box">
            <h1 class="form-title"><img title="" alt="" :src="logo" /></h1>
            <h3 class="form-description">Please login to your account</h3>
            <kform :state="formLogin" name="formLogin" @submit.prevent='login'>
                <div class="form-group">
                    <label class="form-label" for="ip_email">EMAIL</label>
                    <input v-model="email" type="email" name="email" required id="ip_email" class="form-control form-input">
                    <!-- <span v-if="emailSuccess" class="icon-success"></span>
                    <span v-else class="icon-war" :class="{active : errorMessage}"><span class="tooltip-error">Email is invalid!</span></span>
                    <span :class="{all : errorMessage && passwordSuccess && emailSuccess}" class="tooltip-error right">Email or Password incorrect!</span> -->
                </div>
                <div class="form-group">
                    <label class="form-label" for="ip_password">PASSWORD</label>
                    <input v-model="password" type="password" required minlength="5" name="password" id="ip_password" class="form-control form-input">
                    <span v-show="errorMessage" style="font-size:13px" class="form-label-error right">Email or Password incorrect!</span>
                    <!-- <span v-if="passwordSuccess" class="icon-success"></span>
                    <span v-else class="icon-war" :class="{active : errorMessage}"><span class="tooltip-error">Password is invalid!</span></span> -->
                    <nuxt-link class="forgot-password txt-link" to="/forgot-password">Forgot your password?</nuxt-link>
                </div>
                <loading :isShowLoading="showLoading" />
                <button type="submit" class="form-btn btn">LOGIN</button>
                <p class="form-paragraph">You don’t have an account yet? <nuxt-link to="/signup" class="link">Register Here</nuxt-link></p>                
            </kform>
        </div>
    </section>
</template>
<script>
import Loading from '~/components/Loading';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import EventBus from '~/plugins/event-bus';

export default {
    layout: 'blank',
    components: {
        Loading
    },
    data() {
        return {
            formLogin: {},
            emailSuccess: false,
            passwordSuccess: false,
            errorMessage: false,
            email: '',
            password: '',
            showLoading: false,
            logo: '',
        };
    },
    mounted() {
        this.getLogoProduct();
    },
    methods: {
        checkLogin() {
            this.emailSuccess = this.email.length > 12;
            this.passwordSuccess = this.password.length > 5;
        },
        async getLogoProduct() {
            let domain = window.location.hostname;
            if (!domain)
                return {};
            let {data, error} = await this.$services.productService.getProductByDomain(domain);
            if (error)
                return;
            if (data && data.logo)
                this.logo = mapUrlGoogleStorage(data.logo);
            else
                this.logo = '/images/logo.png';
        },
        async login() {
            if (this.formLogin.$invalid) return;
            try {
                this.showLoading = true;
                let {data, error} = await this.$services.userService.signin(this.$store.state.productCode, this.email, this.password);
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
                        if (!result.data.claims && !result.data.customs) {
                            this.errorMessage = true;
                            this.showLoading = false;
                            return;
                        }

                        let permission = {
                            claimPermissions: result.data.claims,
                            customPermissions: result.data.customs
                        };

                        this.$store.commit('SET_AUTH_USER', user);
                        this.$store.commit('SET_PERMISSION', permission);
                        this.setLocalStorage(this.$store.state.claimPermissionKey, result.data.claims);
                        this.setLocalStorage(this.$store.state.customPermissionKey, result.data.customs);

                        this.showLoading = false;
                        setTimeout(() => this.$router.push('/'), 100);
                    }
                }
            }
            catch (error) {
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
                this.showLoading = false;
            }
        },
        setLocalStorage(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },

    }
};
</script>