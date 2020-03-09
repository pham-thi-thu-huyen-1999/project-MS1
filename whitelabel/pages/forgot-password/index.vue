<template>
    <section class="container-fluid form-container">
        <div class="form-box">
            <kform :state="forgot" name="forgot" @submit.prevent='retrieveForgotKey'>
                <h1 class="form-title"><img title="" alt="" :src="logo" /></h1>
                <h3 class="form-description">Forgot password</h3>
                <div class="form-group">
                    <label class="form-label" for="ip_email">EMAIL</label>
                    <input type="email" name="email" required id="ip_email" class="form-control form-input" v-model="email">
                    <!-- <span v-if="emailSuccess" class="icon-success"></span>
                    <span v-else class="icon-war" :class="{active : errorMessage}"><span class="tooltip-error">Email is invalid!</span></span>
                    <span :class="{all : errorMessage && passwordSuccess && emailSuccess}" class="tooltip-error right">Email or Password incorrect!</span> -->
                    <!-- <span v-show="errorMessage" style="font-size:13px" class="form-label-error right">Email not exist!</span> -->
                </div>
                <p class="register text-right">
                <br><nuxt-link class="txt-link" to="/login">Back Login Page</nuxt-link></p>
                <button type="submit" class="form-btn btn" >get my password</button>
            </kform>
        </div>
    </section>
</template>

<script>
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';

export default {
    layout: 'blank',
    data() {
        return {
            forgot: {},
            email: null,
            emailSuccess: false,
            passwordSuccess: false,
            errorMessage: false,
            logo: ''
        };
    },
    mounted() {
        this.getLogoProduct();
    },
    methods: {
        async retrieveForgotKey() {
            if (this.forgot.$invalid) return;
            let result = await this.$services.userService.forgotPassword(this.email, this.$store.state.productCode);
            if (result.data) {
                alert('Your new password has been sent to your primary email address.');
                setTimeout(() => this.$router.push('/login'));
            }
            else {
                alert('Email not exist!');
                // this.errorMessage = true;
            }
        },
        async getLogoProduct() {
            let domain = window.location.hostname;
            let port = window.location.port;
            if (!domain)
                return {};
            let {data} = await this.$services.productService.getProductByDomain(domain, port);
            if (data && data.logo)
                this.logo = mapUrlGoogleStorage(data.logo);
            else {
                this.logo = '/images/logo.svg';
            }
        }
    }
};
</script>