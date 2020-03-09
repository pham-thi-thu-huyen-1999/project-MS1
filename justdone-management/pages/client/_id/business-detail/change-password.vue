<template>
    <section class="business-detail">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <page-title :titles="titles" />
                <div class="row">
                    <div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">
                        <menu-page :listMenu="listMenu"></menu-page>
                    </div>
                    <div class="col-md col-sm-12 col-xs-12">
                        <div class="box-center form-box">
                            <div class="box-content">
                                <div class="section-password">
                                    <h3 class="box-center-title">Change Password</h3>
                                    <div class="row">
                                        <div class="col-md-12 col-sm-12 col-xs-12">
                                            <div class="form-group">
                                                <label class="form-label">old password</label>
                                                <input
                                                    class="form-control form-input"
                                                    type="password"
                                                    v-model="oldPassword"
                                                >
                                                <span
                                                    v-if="oldPasswordSuccess"
                                                    class="icon-success"
                                                ></span>
                                                <span
                                                    v-else
                                                    class="icon-war"
                                                    :class="{active : errorOldPassword}"
                                                ><span class="tooltip-error">{{errorOldPassword}}</span></span>
                                            </div>
                                        </div>
                                        <div class="col-md-12 col-sm-12 col-xs-12">
                                            <div class="form-group">
                                                <label class="form-label">NEW password</label>
                                                <input
                                                    class="form-control form-input"
                                                    type="password"
                                                    v-model="password"
                                                >
                                                <span
                                                    v-if="passwordSuccess"
                                                    class="icon-success"
                                                ></span>
                                                <span
                                                    v-else
                                                    class="icon-war"
                                                    :class="{active : errorPassword}"
                                                ><span class="tooltip-error">{{errorPassword}}</span></span>
                                            </div>
                                        </div>
                                        <div class="col-md-12 col-sm-12 col-xs-12">
                                            <div class="form-group">
                                                <label class="form-label">confirm password</label>
                                                <input
                                                    class="form-control form-input"
                                                    type="password"
                                                    v-model="confirmPassword"
                                                >
                                                <span
                                                    v-if="confirmPasswordSuccess"
                                                    class="icon-success"
                                                ></span>
                                                <span
                                                    v-else
                                                    class="icon-war"
                                                    :class="{active : errorCfPassword}"
                                                ><span class="tooltip-error">{{errorCfPassword}}</span></span>
                                            </div>
                                            <button
                                                type="button"
                                                class="form-btn btn"
                                                v-on:click="changePassword()"
                                            >Save change</button>
                                        </div>
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
            titles: ['Business detail', 'Change password'],
            listMenu: [],
            oldPasswordSuccess: false,
            passwordSuccess: false,
            confirmPasswordSuccess: false,
            oldPassword: '',
            password: '',
            confirmPassword: '',
            isError: false,
            text: '',
            errorOldPassword: false,
            errorPassword: false,
            errorCfPassword: false,
        };
    },
    created() {
        this.listMenu = this.$services.commonService.getBusinessLinks(this.$store.state.client._id, this.$store.state.productCode);
    },
    components: {
        HistoryLogs,
        MenuPage,
        PageTitle
    },
    methods: {
        async changePassword() {
            if (!this.oldPassword || this.oldPassword.length < 8) {
                this.oldPasswordSuccess = false;
                this.hasError('Password entered incorrect and at least 8 characters', true);
                this.errorOldPassword = 'Password entered incorrect and at least 8 characters';
                return false;
            }

            if (!this.validatePassword(this.password)) {
                this.passwordSuccess = false;
                this.hasError('The password must contain at least 8 characters with one upper case letter, one lower case letter, one number and one special character!', true);
                this.errorPassword = 'The password must contain at least 8 characters with one upper case letter, one lower case letter, one number and one special character!';
                return false;
            }

            if (this.password !== this.confirmPassword) {
                this.confirmPasswordSuccess = false;
                this.hasError('The confirm password is incorrect!', true);
                this.errorCfPassword = "These passwords don't match. Try again?";
                return false;
            }

            let data = {
                oldPassword: this.oldPassword,
                newPassword: this.password
            };

            try {
                let result = await this.$services.userService.changePassword(data);
                if (result.data) {
                    // this.hasError('Done!!!', false);
                    this.$notify({
                        type: 'success',
                        title: 'Update completed',
                        text: 'Thank you'
                    });
                    this.errorOldPassword = '';
                    this.errorPassword = '';
                    this.errorCfPassword = '';
                    return true;
                }
                this.oldPasswordSuccess = false;
                // this.errorOldPassword = result.error.message;
                this.hasError('Change password failed', true);
                this.errorOldPassword = 'Change password failed';
                return false;
            }
            catch (e) {
                this.hasError('Change password failed', true);
                return false;
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

