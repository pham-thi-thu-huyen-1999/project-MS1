<template>
    <section class="container-fluid form-container">
        <div class="form-box">
            <form>
                <h1 class="form-title"><img title="" alt="" src="/images/logo.svg" /></h1>
                <h3 class="form-description">Forgot password</h3>
                <div class="form-group">
                    <label class="form-label" for="ip_email">EMAIL</label>
                    <input type="email" required id="ip_email" class="form-control form-input" v-model="email">
                    <!-- <span v-if="emailSuccess" class="icon-success"></span> -->
                    <!-- <span v-else class="icon-war" :class="{active : errorMessage}"><span class="tooltip-error">Email is invalid!</span></span> -->
                    <!-- <span :class="{all : errorMessage && passwordSuccess && emailSuccess}" class="tooltip-error right">Email or Password incorrect!</span> -->
                </div>
                <p class="register text-center">If you don’t have the account please <nuxt-link class="txt-link" to="/signup">Register Here</nuxt-link>
                <br>- Or <nuxt-link class="txt-link" to="/login">Back</nuxt-link></p>
                <button type="button" class="form-btn btn" @click="retrieveForgotKey()">get my password</button>
            </form>
        </div>
    </section>
</template>

<script>
export default {
    layout: 'blank',
    data() {
        return {
            email: null,
            emailSuccess: false,
            passwordSuccess: false,
            errorMessage: false,
        };
    },
    methods: {
        async retrieveForgotKey() {
            let result = await this.$services.userService.forgotPassword(this.email, this.$store.state.productCode);
            if (result.data) {
                alert('Your new password has been sent to your primary email address.');
                setTimeout(() => this.$router.push('/login'));
            }
            else {
                alert('Email not exist!');
            }
        }
    }
};
</script>