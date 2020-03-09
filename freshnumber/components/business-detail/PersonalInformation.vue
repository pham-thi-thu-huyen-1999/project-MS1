<template>
    <div class="box-content">
        <h3 class="box-center-title">Personal Information</h3>
        <div class="section-picture">
            <div class="row">
                <div class="col-md-6 col-sm-6 col-xs-12">
                    <label class="form-label">PROFILE PICTURE</label>
                    <img class="avatar" :src="getImageAvatar()">
                    <label :hidden="clientId" for="file-upload" class="form-btn small">UPDATE IMAGE</label>
                    <input :disabled="clientId" class="ip-upload" id="file-upload"  @change="uploadAvatar($event)" type="file">
                </div>
                <div class="col-md-6 col-sm-6 col-xs-12">
                    <label class="form-label">BUSINESS LOGO</label>
                    <img class="avatar" :src="getImageAvatarBusiness()">
                    <label :hidden="clientId" for="file-upload-logo"  class="form-btn small">UPDATE IMAGE</label>
                    <input :disabled="clientId" class="ip-upload" id="file-upload-logo" @change="uploadAvatarBusiness($event)" type="file">
                </div>
            </div>
        </div>
        <div class="section-profile">
            <kform :state="updateprofile" name="updateprofile" @submit.prevent='updateProfile'>
            <div class="row form-box">
                <div class="col-md-6 col-sm-12 col-xs-12">
                    <div class="form-group">
                        <label class="form-label">FIRST NAME</label>
                        <input :disabled="clientId" class="form-control form-input" type="text" v-model="data.firstName" name="firstName" required>
                    </div>
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                    <div class="form-group">
                        <label class="form-label">LAST NAME</label>
                        <input :disabled="clientId" class="form-control form-input" type="text" v-model="data.lastName" name="lastName" required>
                        <!-- <span v-if="errorFirstName || errorLastName" class="tooltip-error" :class="{all: errorFirstName || errorLastName}">{{text}}</span> -->
                    </div>    
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="form-group">
                        <label class="form-label">RESIDENTIAL ADDRESS</label>
                        <input :disabled="clientId" @input="inputResidentAddress()" class="form-control form-input" type="text" placeholder="100 Example St, Suburb, City, Country, 00000" name="residentAddress" required minlength="4" v-model="data.personalInfo.address">
                        <span v-if="residentAddressSpiner" class="input-loading"></span>
                        <div v-if="residentAddressList" class="dropdown-address">
                            <ul>
                                <li @click="selectResidentAddress(item)" v-for="(item, index) in listAddress" :key="index"><span>{{item}}</span></li>                                                   
                            </ul>
                        </div>
                        <div class="icon-war" :class="{active: errorResidentialAddress}"><span class="tooltip-error">{{text}}</span></div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="form-group">
                        <label class="form-label">POSTAL ADDRESS</label>
                        <input :disabled="clientId" @input="inputPostalAddress()" class="form-control form-input" type="text" placeholder="100 Example St, Suburb, City, Country, 00000" name="postalAddress" required minlength="4" v-model="data.personalInfo.postalName">
                        <span v-if="postalAddressSpiner" class="input-loading"></span>
                        <div v-if="postalAddressList" class="dropdown-address">
                            <ul>
                                <li @click="selectPostalAddress(item)" v-for="(item, index) in listAddress" :key="index"><span>{{item}}</span></li>                                                   
                            </ul>
                        </div>
                        <div class="icon-war" :class="{active: errorPostalName}"><span class="tooltip-error">{{text}}</span></div>
                    </div>    
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="form-group">
                        <label class="form-label">EMAIL</label>
                        <input type="text" disabled class="form-input form-control" v-model="data.email" name="email" required minlength="4">
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="form-group">
                        <label class="form-label">CONTACT NUMBER</label>
                        <input :disabled="clientId" type="text" class="form-input form-control" placeholder="" v-model="data.personalInfo.phone" name="phone" required phone>
                        <div class="icon-war" :class="{active: errorPhone}"><span class="tooltip-error">{{text}}</span></div>
                    </div>
                </div>
                <div class="col-md-4 col-sm-4 col-xs-12">
                    <div class="form-group">
                        <label class="form-label" style="width: 62px">BIRTH DATE</label>
                        <div class="dropdown btn-input">
                            <button :disabled="clientId" class="dropdown-toggle form-input" type="button" data-toggle="dropdown">{{ data.dayBOD }}
                                <i class="fa fa-angle-up" aria-hidden="true"></i>
                                <i class="fa fa-angle-down" aria-hidden="true"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li class="dropdown-menu-link" v-for="item in listDay" :key="item" @click="data.dayBOD = item">
                                    <a>{{ item }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 col-sm-4 col-xs-12">
                    <div class="form-group"><label class="form-label hidden-xs">&nbsp;</label>
                        <div class="dropdown btn-input">
                            <button :disabled="clientId" class="dropdown-toggle form-input" type="button" data-toggle="dropdown">{{ data.monthBOD }}
                                <i class="fa fa-angle-up" aria-hidden="true"></i>
                                <i class="fa fa-angle-down" aria-hidden="true"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li class="dropdown-menu-link" v-for="item in listMonth" :key="item" @click="data.monthBOD = item">
                                    <a>{{ item }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 col-sm-4 col-xs-12">
                    <div class="form-group">
                        <label class="form-label hidden-xs">&nbsp;</label>
                        <div class="dropdown btn-input">
                            <button :disabled="clientId" class="dropdown-toggle form-input" type="button" data-toggle="dropdown">{{ data.yearBOD }}
                                <i class="fa fa-angle-up" aria-hidden="true"></i>
                                <i class="fa fa-angle-down" aria-hidden="true"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li class="dropdown-menu-link" v-for="item in listYear" :key="item" @click="data.yearBOD = item"><a>{{ item }}</a></li>
                            </ul>
                        </div>
                        <span class="tooltip-error" :class="{all: errorBOD && !errorResidentialAddress}">{{text}}</span>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div :class="[isError ? 'error-text' : 'completed-text', 'validate-text' ]">{{ text }}</div>
                    </div>
                    <button :hidden="clientId" type="submit" class="form-btn btn">Save change</button>
                </div>
            </div>
            </kform>
        </div>
    </div>
</template>

<script>
import {getImageByResource, mapUrlGoogleStorage} from '~/helpers/dataHelper';
import EventBus from '~/plugins/event-bus';

export default {
    props: {
        clientId: {
            type: String
        }
    },
    data() {
        return {
            data: {
                email: '',
                firstName: null,
                lastName: '',
                personalInfo: {
                    phone: null,
                    birthday: null,
                    address: null,
                    postalName: null,
                },
                avatar: '',
                avatarBusiness: '',
                dayBOD: '',
                monthBOD: '',
                yearBOD: '',
            },
            updateprofile: {},
            listDay: this.generateListDay(),
            listMonth: this.generateListMonth(),
            listYear: this.generateListYear(),
            isError: false,
            text: '',
            listAddress: [],
            keypressTimeout: null,
            residentAddressSpiner: false,
            residentAddressList: false,
            postalAddressSpiner: false,
            postalAddressList: false,
            businessAddressSpiner: false,
            businessAddressList: false,
            errorMess: true,
            errorLastName: false,
            errorFirstName: false,
            errorPhone: false,
            errorBOD: false,
            errorResidentialAddress: false,
            errorPostalName: false,
        };
    },
    async created() {
        if (!this.clientId) {
            this.getData();
        }
        else {
            this.getDataByClient(this.clientId);
        }
    },
    components: {

    },
    methods: {
        async getData() {
            try {
                let result = await this.$services.userService.getUserProfile();
                if (result.data) {
                    this.data.firstName = result.data.firstName;
                    this.data.lastName = result.data.lastName;
                    this.data.email = result.data.email;
                    this.data.avatar = result.data.avatar && mapUrlGoogleStorage(result.data.avatar);
                }
                result = await this.$services.userService.getUserPersonalInfo();
                if (result.data) {
                    this.data.personalInfo.phone = result.data.phone;
                    this.data.personalInfo.address = result.data.address ? result.data.address : null;
                    this.data.personalInfo.postalName = result.data.postalName ? result.data.postalName : null;
                    if (result.data.birthday) {
                        this.data.personalInfo.birthday = result.data.birthday;
                        let date = new Date(result.data.birthday);
                        this.data.dayBOD = date.getDate();
                        this.data.monthBOD = date.getMonth() + 1;
                        this.data.yearBOD = date.getFullYear();
                    }
                }
                result = await this.$services.userService.getUserBusinessInfo();
                if (result.data) {
                    this.data.avatarBusiness = result.data.avatar && mapUrlGoogleStorage(result.data.avatar.url);
                }
            }
            catch (error) {
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            }
        },
        async getDataByClient(clientId) {
            try {
                let result = await this.$services.userService.getClientInfo(clientId);
                if (result.data) {
                    this.data.firstName = result.data.profile.firstName;
                    this.data.lastName = result.data.profile.lastName;
                    this.data.email = result.data.profile.email;
                    this.data.avatar = result.data.profile.avatar && mapUrlGoogleStorage(result.data.profile.avatar);
                }
                result = await this.$services.userService.getPersonalInfo(clientId);
                if (result.data) {
                    this.data.personalInfo.phone = result.data.phone;
                    this.data.personalInfo.address = result.data.address;
                    this.data.personalInfo.postalName = result.data.postalName;
                    if (result.data.birthday) {
                        this.data.personalInfo.birthday = result.data.birthday;
                        let date = new Date(result.data.birthday);
                        this.data.dayBOD = date.getDate();
                        this.data.monthBOD = date.getMonth() + 1;
                        this.data.yearBOD = date.getFullYear();
                    }
                }
                result = await this.$services.userService.getBusinessInfo(clientId);
                if (result.data) {
                    this.data.avatarBusiness = result.data.avatar && mapUrlGoogleStorage(result.data.avatar.url);
                }
            }
            catch (error) {
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            }
        },
        async updateProfile() {
            if (this.updateprofile.$invalid) return;
            let data = {};
            let personalInfo = {};

            if (this.data.firstName || this.validateName(this.data.firstName)) {
                data.firstName = this.data.firstName;
                this.errorFirstName = false;
            }
            else {
                this.errorMess = false;
                this.errorFirstName = true;
                this.hasError('FirstName entered incorrect', true);
                return false;
            }
            if (this.data.lastName || this.validateName(this.data.lastName)) {
                data.lastName = this.data.lastName;
                this.errorLastName = false;
            }
            else {
                this.errorMess = false;
                this.errorLastName = true;
                this.hasError('LastName entered incorrect', true);
                return false;
            }

            if (!this.validateDate(parseInt(this.data.dayBOD), parseInt(this.data.monthBOD), parseInt(this.data.yearBOD))) {
                this.errorBOD = true;
                this.errorMess = false;
                this.hasError('Invalid birth date', true);
                return false;
            }

            let date = new Date();
            date.setDate(this.data.dayBOD);
            date.setMonth(this.data.monthBOD - 1);
            date.setFullYear(this.data.yearBOD);
            personalInfo.birthday = date;

            if (!this.data.personalInfo.phone || !this.validatePhone(this.data.personalInfo.phone)) {
                this.errorPhone = true;
                this.errorMess = false;
                this.hasError('Invalid phone', true);
                return false;
            }
            else {
                this.errorPhone = false;
                personalInfo.phone = this.data.personalInfo.phone.replace(/[^0-9]/g, '');
            }

            if (this.data.personalInfo.address && this.validateAddress(this.data.personalInfo.address)) {
                this.errorResidentialAddress = false;
                personalInfo.address = this.data.personalInfo.address;
            }
            else {
                this.errorResidentialAddress = true;
                this.errorMess = false;
                this.hasError('Invalid Residential Address', true);
                return false;
            }
            if (this.data.personalInfo.postalName && this.validateAddress(this.data.personalInfo.postalName)) {
                this.errorPostalName = false;
                personalInfo.postalName = this.data.personalInfo.postalName;
            }
            else {
                this.errorPostalName = true;
                this.errorMess = false;
                this.hasError('Invalid Postal Address', true);
                return false;
            }

            data.personalInfo = personalInfo;
            try {
                let result = await this.$services.userService.updateUserProfile(data);
                if (result.data) {
                    let user = JSON.parse(JSON.stringify(this.$store.state.userAuth));
                    if (user && user.profile) {
                        user.profile.firstName = result.data.firstName;
                        user.profile.lastName = result.data.lastName;
                    }
                    this.$store.commit('SET_USER_INFO', user);
                    this.$notify({
                        group: 'success',
                        title: 'Update completed',
                        text: 'Thank you'
                    });
                    return true;
                }
                this.hasError('Update failed', true);
            }
            catch (error) {
                this.hasError('Update failed', true);
            }
        },
        inputResidentAddress() {
            if (this.data.personalInfo.address) {
                clearTimeout(this.keypressTimeout);
                // this.residentAddressList = true;
                // this.residentAddressSpiner = true;
                // this.keypressTimeout = setTimeout(() => this.getAddressAutoComplete(this.data.personalInfo.address), 1000);
            }
        },
        inputPostalAddress() {
            if (this.data.personalInfo.postalName) {
                clearTimeout(this.keypressTimeout);
                // this.postalAddressList = true;
                // this.postalAddressSpiner = true;
                // this.keypressTimeout = setTimeout(() => this.getAddressAutoComplete(this.data.personalInfo.postalName), 1000);
            }
        },
        async getAddressAutoComplete(searchTerm) {
            try {
                let result = await this.$services.userService.getAddressAutoComplete(searchTerm, 10);
                if (result['data'] && result['data'].length > 0) {
                    this.listAddress = result['data'];
                }
                else if (result['data'] && result['data'].length === 0) {
                    this.listAddress = ['Address not exist! Retry.'];
                }
                this.residentAddressSpiner = false;
                this.postalAddressSpiner = false;
                this.businessAddressSpiner = false;
            }
            catch (error) {
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            }
        },
        selectResidentAddress(address) {
            if (address === 'Address not exist! Retry.') {
                this.data.personalInfo.address = '';
            }
            else {
                this.data.personalInfo.address = address;
            }
            this.listAddress = [];
            this.residentAddressSpiner = false;
            this.residentAddressList = false;
        },
        selectPostalAddress(address) {
            if (address === 'Address not exist! Retry.') {
                this.data.personalInfo.postalName = '';
            }
            else {
                this.data.personalInfo.postalName = address;
            }
            this.listAddress = [];
            this.postalAddressList = false;
            this.postalAddressSpiner = false;
        },
        validateName(name) {
            let regExp = /.{4,20}/;
            if (regExp.test(name))
                return true;
            return false;
        },
        validateAddress(name) {
            let regExp = /.{4,50}/;
            if (regExp.test(name))
                return true;
            return false;
        },
        validatePhone(value) {
            let phone = value.replace(/[^0-9]/g, '');
            if (phone.length >= 9 && phone.length <= 12)
                return true;
            return false;
        },
        validateDate(day, month, year) {
            if (day === 0 || !day) {
                return false;
            }
            if (month === 0 || !month) {
                return false;
            }
            if (year === 0 || !year) {
                return false;
            }

            let month31Day = [1, 3, 5, 7, 8, 10, 12];
            let month30Day = [4, 6, 9, 11];
            let month28Day = [2];
            let isYearLeap = ((year % 4 === 0) && (year % 100 !== 0));
            let result = (month31Day.indexOf(month) !== -1 && day <= 31) || (month30Day.indexOf(month) !== -1 && day <= 30) || (month28Day.indexOf(month) !== -1 && day <= 28) || (month28Day.indexOf(month) !== -1 && day <= 29 && isYearLeap);
            return result;
        },
        generateListDay() {
            let result = [];
            for (var i = 1; i <= 31; i++) {
                result.push(i);
            };
            return result;
        },
        generateListMonth() {
            let result = [];
            for (var i = 1; i <= 12; i++) {
                result.push(i);
            };
            return result;
        },
        generateListYear() {
            let result = [];
            let currentYear = new Date().getFullYear();
            for (var i = currentYear - 100; i < currentYear; i++) {
                result.push(i);
            };
            result.sort(function(a, b) {
                if (a < b) return 1;
                if (a > b) return -1;
                return 0;
            });
            return result;
        },
        getImageAvatar() {
            return getImageByResource(this.data.avatar);
        },
        getImageAvatarBusiness() {
            return getImageByResource(this.data.avatarBusiness);
        },
        async uploadAvatar(event) {
            let files = event.target.files;
            let allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
            let checkImage = allowedExtensions.find(item =>
                item === files[0].type
            );
            if (!checkImage) {
                this.hasError('This file does not exist', true);
            }
            else {
                let formData = new FormData();
                formData.append('avatar', files[0]);
                let {data, error} = await this.$services.userService.uploadAvatar(formData);

                if (error) {
                    this.hasError('upload Avatar False', true);
                    EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
                }
                else if (data) {
                    let user = JSON.parse(JSON.stringify(this.$store.state.userAuth));
                    if (user && user.profile)
                        user.profile.avatar = data;

                    this.$store.commit('SET_USER_INFO', user);
                    this.data.avatar = mapUrlGoogleStorage(data);
                }
            }
        },
        async uploadAvatarBusiness(event) {
            let files = event.target.files;
            let allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
            let checkImage = allowedExtensions.find(item =>
                item === files[0].type
            );
            if (!checkImage) {
                this.hasError('This file does not exist', true);
            }
            else {
                let formData = new FormData();
                formData.append('businessLogo', files[0]);
                let {data, error} = await this.$services.userService.uploadAvatarBusiness(formData);
                if (error) {
                    this.hasError('upload Avatar Business False', true);
                    EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
                }
                this.data.avatarBusiness = data && mapUrlGoogleStorage(data);
            }
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
