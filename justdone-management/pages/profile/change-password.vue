<template>
    <section class="setting-profile form-box">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
                    <page-title :titles="titles"/>
                <div class="row">
                    <div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">
                        <menu-page :listMenu="listMenu"></menu-page>
                    </div>
                    <div class="col-md col-sm-12 col-xs-12">
                        <div class="box-center">
                            <div class="box-content change-password">
                                <div class="text-center wrapper-info">
                                    <h2 class="tiltle-box">Change Password</h2>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">old password</label>
                                    <input type="password" v-model="oldPassword" class="form-input"/>
                                    <span class="icon-war" :class="{active : errorOldPassword}"><span class="tooltip-error">{{errorOldPassword}}</span></span>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">NEW password</label>
                                    <input type="password" v-model="password" class="form-input"/>
                                    <span class="icon-war" :class="{active : errorPassword}"><span class="tooltip-error">{{errorPassword}}</span></span>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">confirm password</label>
                                    <input type="password" v-model="confirmPassword" class="form-input"/>
                                     <span class="icon-war" :class="{active : errorCfPassword}"><span class="tooltip-error">{{errorCfPassword}}</span></span>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <button @click="changePassword()" class="form-btn">save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-auto col-sm-12 col-xs-12">
                        <history-logs></history-logs>
                    </div>
                </div>
            </div>
        </div>
    </section>  
</template>

<script>
import HistoryLogs from '~/components/HistoryLogs';
import MenuPage from '~/components/MenuPage';
import PageTitle from '~/components/PageTitle';

export default {
    data() {
        return {
            listMenu: [],
            titles: ['My Profile'],
            oldPassword: '',
            password: '',
            confirmPassword: '',
            isError: false,
            text: '',
            errorOldPassword: '',
            errorPassword: '',
            errorCfPassword: '',
        };
    },
    created() {
        this.listMenu = this.$services.commonService.getProfileLinks();
    },
    components: {
        HistoryLogs,
        MenuPage,
        PageTitle
    },
    methods: {
        async changePassword() {
            if (!this.validatePassword(this.oldPassword)) {
                this.errorOldPassword = 'Password entered incorrect and at least 8 characters and more than 20 characters';
                return false;
            }
            else
                this.errorOldPassword = '';

            if (!this.validatePassword(this.password) || !this.validatePassword(this.confirmPassword)) {
                this.errorPassword = 'The password must contain at least 8 characters more than 20 characters with one upper case letter, one lower case letter, one number and one special character!';
                return false;
            }
            else
                this.errorPassword = '';

            if (this.password !== this.confirmPassword) {
                this.errorCfPassword = "These passwords don't match. Try again?";
                return false;
            }
            else
                this.errorCfPassword = '';

            let data = {
                oldPassword: this.oldPassword,
                newPassword: this.password
            };

            try {
                let result = await this.$services.userService.changePassword(data);
                if (result.data) {
                    this.$notify({
                        type: 'success',
                        title: 'Update completed',
                        text: 'Thank you'
                    });
                }
                else
                    this.errorOldPassword = 'Old password incorrect !';
            }
            catch (e) {
                this.hasError('Change password failed', true);
                this.$notify({
                    type: 'error',
                    title: 'Error',
                    text: 'Update error'
                });
            }
        },

        validatePassword(password) {
            let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,20}$/;
            if (!password || !regExp.test(password))
                return false;
            return true;
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

