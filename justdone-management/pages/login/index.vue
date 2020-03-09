<template>
    <section class="container-fluid form-container">
        <div class="form-box">
            <kform :state="formLogin" method="POST" name="formLogin" @submit.prevent='login'>
                <h1 class="form-title"><img title="" alt="" src="/images/logo.svg" /></h1>
                <h3 class="form-description">Please login to your account</h3>
                <div class="form-group">
                    <label class="form-label" for="ip_email">EMAIL</label>
                    <input v-model="email" name="email" maxlength="255" type="email" required class="form-control form-input">
                    <!-- <span v-if="emailSuccess" class="icon-success"></span>
                    <span v-else class="icon-war" :class="{active : errorMessage}"><span class="tooltip-error">Email is invalid!</span></span>
                    <span :class="{all : errorMessage && passwordSuccess && emailSuccess}" class="tooltip-error right">Email or Password incorrect!</span> -->
                </div>
                <div class="form-group">
                    <label class="form-label" for="ip_password">PASSWORD</label>
                    <input v-model="password" name="password" type="password" required class="form-control form-input">
                    <!-- <span v-if="passwordSuccess" class="icon-success"></span>
                    <span v-else class="icon-war" :class="{active : errorMessage}"><span class="tooltip-error">Password is invalid!</span></span> -->
                    <span v-show="errorMessage" style="font-size:13px" class="form-label-error right">Email or password not available.</span>
                    <nuxt-link class="forgot-password txt-link" to="/forgot-password">Forgot your password?</nuxt-link>
                </div>
                <button type="submit" class="form-btn btn">LOGIN</button>
            </kform>
        </div>
    </section>
</template>
<script>

export default {
    layout: 'blank',
    data() {
        return {
            formLogin: {},
            emailSuccess: false,
            passwordSuccess: false,
            errorMessage: false,
            email: '',
            password: '',
        };
    },
    methods: {
        checkLogin() {
            this.emailSuccess = this.email.length > 12;
            this.passwordSuccess = this.password.length > 5;
        },
        async login() {
            if (this.formLogin.$valid) {
                try {
                    this.$setLoading();
                    let {data, error} = await this.$services.userService.signin(this.$store.state.productCode, this.email, this.password);
                    if (error) {
                        this.errorMessage = true;
                        this.$setLoading(false);
                    }
                    else {
                        if (!data || !data.permission || !data.permission.product) {
                            this.errorMessage = true;
                            this.$setLoading(false);
                            return;
                        }

                        let user = data;
                        let result = await this.$services.userService.getPermission(user.token.accessToken);
                        if (result.error) {
                            this.errorMessage = true;
                            this.$setLoading(false);
                        }
                        else {
                            if (!result.data.claims && !result.data.customs) {
                                this.errorMessage = true;
                                this.$setLoading(false);
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

                            this.$setLoading(false);
                            setTimeout(() => this.$router.push('/'), 100);
                        }
                    }
                }
                catch (error) {
                    this.$setLoading(false);
                    return false;
                }
            }
        },
        setLocalStorage(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
};
</script>