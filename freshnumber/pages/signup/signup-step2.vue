<template>
    <section class="container-fluid form-container signup">
        <div class="form-box information">
            <kform method="POST" :state="userInfo" name="userInfo" @submit.prevent='createUserInfo'>
                <h1 class="form-heading">Personal Information</h1>
                <h3 class="form-description">Please enter your personal details below.</h3>
                <div class="form-group">
                    <label class="form-label" for="first_name">FIRST NAME</label>
                    <input v-model="data.firstName" type="text" id="first_name" class="form-control form-input">
                    <span v-if="errorText.name" class="label-error">{{errorText.name}}</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="last_name">LAST NAME</label>
                    <input v-model="data.lastName" type="text" id="last_name" name="lastName" class="form-control form-input">
                    <span v-if="errorText.lastName" class="label-error">{{errorText.lastName}}</span>

                    <!-- <span v-if="errorMessage" class="icon-war" :class="{active : errorMessage}"><span class="tooltip-error">Wrong phone format !!</span></span> -->
                </div>
                <div class="form-group">
                    <label class="form-label" for="mobile_number">MOBILE NUMBER</label>
                    <input v-model="data.personalInfo.phone" type="number" id="mobile_number" name="phone" class="form-control form-input">
                    <span v-if="errorText.phone" class="label-error">{{errorText.phone}}</span>
                </div>
                <dropdown-date-options :day="true" :month="true" :year="true" v-model="data.personalInfo.birthday"></dropdown-date-options>
                <hr style="margin: 50px 0; border-color: #f0f2f5;">
                <h2 class="form-heading">Your Business Information</h2>
                <h3 class="form-description">Please enter your business details below including your ABN. Your business name will be automatically populated.</h3>
                <div class="form-group">
                    <label class="form-label" for="ip_abn">ABN</label>
                    <input v-model="data.businessInfo.abnCode" v-mask="'## ### ### ###'" type="text" placeholder="Enter ABN (11 111 xxx xxx)" class="form-control form-input">
                    <span v-if="errorText.abn" class="label-error">{{errorText.abn}}</span>
                    <!-- <span v-if="errorMessageAbnCode" class="icon-war" :class="{active : errorMessageAbnCode}"><span class="tooltip-error">Abn is invalid !!</span></span> -->
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="form-group">
                            <label class="form-label" for="enity_name">ENTITY NAME</label>
                            <input v-bind:value="data.businessInfo.entityName" type="text" id="enity_name" class="form-control form-input" disabled>
                        
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label class="form-label" for="enity_type">ENTITY TYPE</label>
                            <input v-bind:value="data.businessInfo.entityType" type="text" id="enity_type" class="form-control form-input" disabled>
                        </div>
                    </div>
                </div>
                <loading :isShowLoading="showLoading" />
                <button type="submit" class="form-btn btn">Complete Signup</button>
            </kform>
        </div>
    </section>
</template>
<script>
import Loading from '~/components/Loading';
import DropdownDateOptions from '~/components/DropdownDateOptions';
import EventBus from '~/plugins/event-bus';

export default {
    layout: 'blank',
    components: {
        Loading,
        DropdownDateOptions,
    },
    data() {
        return {
            userInfo: {},
            showLoading: false,
            validateAll: false,
            data: {
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                fullName: '',
                personalInfo: {
                    phone: '',
                    birthday: '',
                },
                businessInfo: {
                    abnCode: '',
                    entityName: '',
                    entityType: '',
                }
            },
            errorMessage: false,
            errorMessageAbnCode: false,
            errorText: {
                name: '',
                lastName: '',
                phone: '',
                abn: ''
            }
        };
    },
    mounted() {
        let sessionStoraged = sessionStorage.getItem('signup-step1');
        let data = JSON.parse(sessionStoraged);
        if (data && data.email.length > 0 && data.password.length > 0) {
            this.data.email = data.email;
            this.data.password = data.password;
            // this.data.email = this.$store.state.signupUserInfo.email;
            // this.data.password = this.$store.state.signupUserInfo.password;
        }
        else {
            this.$router.push('/signup');
        }
    },
    watch: {
        'data.firstName': function(newData) {
            if (!newData)
                this.errorText.name = 'First name is required.';
            else this.errorText.name = '';
        },
        'data.lastName': function(newData) {
            if (!newData)
                this.errorText.lastName = 'Last name is required.';
            else this.errorText.lastName = '';
        },
        'data.personalInfo.phone': function(newData) {
            if (!newData || newData.length < 7)
                this.errorText.phone = 'Phone is invalid.';
            else this.errorText.phone = '';
        },
        'data.businessInfo.abnCode': {
            async handler(value) {
                if (!value) {
                    this.errorText.abn = 'ABN is required.';
                }
                else {
                    this.errorText.abn = '';
                    clearTimeout(this.keypressTimeout);
                    this.keypressTimeout = setTimeout(() => this.getBusinessInfoByAbnCode(), 1200);
                }
            }
        },
    },
    methods: {
        async createUserInfo() {
            if (this.userInfo.$invalid) return;
            if (!this.data.email || !this.data.password) {
                alert('The account or password was emptied');
                this.$router.push('/signup');
            }
            this.checkFieldRequired();
            if (this.validateAll) {
                this.showLoading = true;
                this.data.fullName = this.data.firstName + ' ' + this.data.lastName;
                let {error, data} = await this.$services.userService.signup(this.$store.state.productCode, this.data);
                if (error || !data)
                    this.errorText = error && error.message;
                else {
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
                        sessionStorage.removeItem('signup-step1');
                    }
                    this.errorText = '';
                    this.$router.push('/');
                }
                this.showLoading = false;
            }
        },
        checkFieldRequired() {
            if (!this.data.firstName)
                this.errorText.name = 'First name is invalid.';

            if (!this.data.lastName)
                this.errorText.lastName = 'Last name is required.';
            if (!this.data.personalInfo.phone || this.data.personalInfo.phone.length < 7)
                this.errorText.phone = 'Phone is invalid.';
            if (!this.data.businessInfo.abnCode)
                this.errorText.abn = 'ABN is required.';

            if (!this.errorText.name && !this.errorText.lastName && !this.errorText.abn && !this.errorText.phone)
                this.validateAll = true;
            else this.validateAll = false;

            // console.log('this.errorText', this.errorText);
        },
        setLocalStorage(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        async getBusinessInfoByAbnCode() {
            let abnCode = await this.data.businessInfo.abnCode.replace(/ /g, '');
            if (abnCode.length !== 11)
                this.errorText.abn = 'ABN is invalid.';
            let checkNubmerType = /^\d{11}$/g;
            if (checkNubmerType.test(abnCode)) {
                this.showLoading = true;
                let {data, error} = await this.$services.userService.getBusinessInfoByAbnCode(abnCode);
                if (error || !data) {
                    this.errorMessageAbnCode = true;
                    this.data.businessInfo.entityName = '';
                    this.data.businessInfo.entityType = '';
                    this.errorText.abn = error && error.message;
                    EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error && error.message});
                }
                else {
                    this.data.businessInfo.entityName = data.entityName || data.title;
                    this.data.businessInfo.entityType = data.entityType || data.company_type;
                    this.data.businessInfo.address = data.address_snippet || '';
                    this.errorMessageAbnCode = false;
                    this.errorText.abn = '';
                }
            }
            this.showLoading = false;
        },
    }
};
</script>