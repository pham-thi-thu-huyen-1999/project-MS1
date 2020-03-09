<template>
  <div class="box-content">
        <div class="section-password">
            <h3 class="box-center-title">Change Password</h3>
            <kform :state="changepassword" name="changepassword" @submit.prevent='changePassword'>
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="form-group">
                            <label class="form-label">old password</label>
                            <input  class="form-control form-input"  type="password" name="oldPassword" required minlength="4" v-model="oldPassword">
                            <!-- <span v-if="oldPasswordSuccess" class="icon-success"></span>
                            <span v-else class="icon-war" :class="{active : errorOldPassword}"><span class="tooltip-error">{{ errorText }}</span></span> -->
                        </div>
                    </div>
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="form-group">
                            <label class="form-label">New password</label>
                            <input  class="form-control form-input"  type="password" name="password" required minlength="4" v-model="password">
                            <!-- <span v-if="passwordSuccess" class="icon-success"></span>
                            <span v-else class="icon-war" :class="{active : errorPassword}"><span class="tooltip-error">{{ errorText }}</span></span> -->
                        </div>
                    </div>
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="form-group">
                            <label class="form-label">confirm password</label>
                            <input class="form-control form-input" :confirm-pass="password" type="password" v-model="confirmPassword" name="confirmPassword" required minlength="4">
                            <!-- <span v-if="confirmPasswordSuccess" class="icon-success"></span> -->
                            <!-- <span v-else class="icon-war" :class="{active : errorCfPassword}"><span class="tooltip-error">{{ errorText }}</span></span> -->
                        </div>
                        <button type="submit" class="form-btn btn" >Save change</button>    
                    </div>
                </div>
            </kform>
            <span v-if="text" class="form-label-error mt-20">{{text}}</span>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            changepassword: {},
            oldPasswordSuccess: false,
            passwordSuccess: false,
            confirmPasswordSuccess: false,
            oldPassword: '',
            password: '',
            confirmPassword: '',
            isError: false,
            text: '',
            errorText: '',
            errorOldPassword: false,
            errorPassword: false,
            errorCfPassword: false,
        };
    },
    methods: {
        initError() {
            this.errorText = '';
            this.oldPasswordSuccess = false;
            this.passwordSuccess = false;
            this.confirmPasswordSuccess = false;
            this.errorOldPassword = false;
            this.errorPassword = false;
            this.errorCfPassword = false;
        },
        async changePassword() {
            if (this.changepassword.$invalid) return;
            this.initError();
            if (!this.oldPassword || this.oldPassword.length < 8) {
                this.oldPasswordSuccess = false;
                this.errorOldPassword = true;

                // this.hasError('Password entered incorrect and at least 8 characters', true);
                this.errorText = 'Password entered incorrect and at least 8 characters';
                return false;
            }

            if (!this.validatePassword(this.password)) {
                this.passwordSuccess = false;
                this.errorPassword = true;

                // this.hasError('The password must contain at least 8 characters with one upper case letter, one lower case letter, one number and one special character!', true);
                this.errorText = 'The password must contain at least 8 characters with one upper case letter, one lower case letter, one number and one special character!';
                return false;
            }

            if (this.password !== this.confirmPassword) {
                this.confirmPasswordSuccess = false;
                this.errorCfPassword = true;

                // this.hasError('The confirm password is incorrect!', true);
                this.errorText = "These passwords don't match. Try again?";
                return false;
            }

            let body = {
                oldPassword: this.oldPassword,
                newPassword: this.password
            };

            try {
                let {data, error} = await this.$services.userService.changePassword(body);
                if (error || !data)
                    this.hasError('Change password failed', true);
                else
                    this.$notify({
                        group: 'success',
                        title: 'Update completed',
                        text: 'Thank you'
                    });
            }
            catch (e) {
                this.hasError('Change password failed', true);
            }
        },
        validatePassword(password) {
            let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,20}$/;
            return regExp.test(password);
        },
        hasError(text, isError) {
            this.text = text;
            if (isError) {
                this.isError = true;
                return true;
            }
            this.isError = false;
            return false;
        }
    }
};
</script>
