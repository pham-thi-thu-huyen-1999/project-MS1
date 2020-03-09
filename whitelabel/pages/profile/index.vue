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
                        <kform :state="profile" name="profile" @submit.prevent='updateProfile'>
                            <div class="box-content personal-info">
                                <div class="text-center wrapper-info">
                                    <h2 class="tiltle-box">Personal Information</h2>
                                    <img :src="data && data.profile && data.profile.avatar ? data.profile.avatar : '/images/default-avatar.jpg'" class="img-user rounded-circle" alt="image-user"/>
                                    <h3 class="user-name">{{data.profile.firstName + ' ' + data.profile.lastName }}</h3>
                                    <label for="upload-file" class="form-btn small">Update image</label>
                                    <input id="upload-file" type="file" @change="uploadAvatar($event)" class="ip-upload"/>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6 col-12">
                                        <div class="form-group">
                                            <label class="form-label">First Name</label>
                                            <input type="text" v-model="data.profile.firstName" class="form-input" required name="firstname" minlength="4"/>
                                        </div>
                                    </div>
                                    <div class="col-sm-6 col-12">
                                        <div class="form-group">
                                            <label class="form-label">Last Name</label>
                                            <input type="text" v-model="data.profile.lastName" class="form-input" required name="lastname" minlength="4"/>
                                            <!-- <span v-if="errorFirstName || errorLastName" class="tooltip-error" :class="{all: errorFirstName || errorLastName}">{{errorLastName ? errorLastName : errorFirstName}}</span> -->
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input disabled v-model="data.profile.email" type="text" class="form-input" required name="email"/>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Countries</label>
                                    <input type="text" @input="inputAddress()" v-model="data.personalInfo.address" placeholder="100 Example St, Suburb, City, Country, 00000" class="form-input" required name="address" minlength="4"/>
                                    <span v-if="addressSpiner" class="input-loading"></span>
                                    <div v-if="addressList" class="dropdown-address">
                                        <ul>
                                            <li @click="selectAddress(item)" v-for="(item, index) in listAddress" :key="index"><span>{{item}}</span></li>                                                   
                                        </ul>
                                    </div>
                                    <!-- <div class="icon-war" :class="{active: errorAddress}"><span class="tooltip-error">{{errorAddress}}</span></div> -->
                                </div>
                                <div class="form-group">
                                    <label class="form-label">contact number</label>
                                    <input type="text" v-model="data.personalInfo.phone" class="form-input" required name="phone" phone/>
                                    <!-- <div class="icon-war" :class="{active: errorPhone}"><span class="tooltip-error">{{errorPhone}}</span></div> -->
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Birth Date</label>
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <div class="dropdown btn-input">
                                                <button class="dropdown-toggle form-input" type="button" data-toggle="dropdown">
                                                    {{data.dayBOD}}
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
                                        <div class="col-sm-4">
                                            <div class="form-group">
                                                 <div class="dropdown btn-input">
                                                    <button class="dropdown-toggle form-input" type="button" data-toggle="dropdown">
                                                        {{data.monthBOD}}
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
                                        <div class="col-sm-4">
                                            <div class="form-group">
                                                <div class="dropdown btn-input">
                                                    <button class="dropdown-toggle form-input" type="button" data-toggle="dropdown">
                                                        {{data.yearBOD}}
                                                        <i class="fa fa-angle-up" aria-hidden="true"></i>
                                                        <i class="fa fa-angle-down" aria-hidden="true"></i>
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li class="dropdown-menu-link" v-for="item in listYear" :key="item" @click="data.yearBOD = item">
                                                            <a>{{ item }}</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <span class="tooltip-error fixtop" :class="{all: errorBOD }">{{errorBOD}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <button type="submit" class="form-btn">save changes</button>
                                    </div>
                                </div>
                            </div>
                        </kform>
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
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';

export default {
    data() {
        return {
            profile: {},
            listMenu: [],
            titles: ['My Profile'],
            listDay: this.generateListDay(),
            listMonth: this.generateListMonth(),
            listYear: this.generateListYear(),
            listAddress: [],
            keypressTimeout: null,
            addressSpiner: false,
            addressList: false,
            errorFirstName: '',
            errorLastName: '',
            errorAddress: '',
            errorPhone: '',
            errorBOD: '',
            submitEnter: false,
            data: {
                profile: {
                    avatar: '',
                    firstName: '',
                    lastName: '',
                    email: ''
                },
                personalInfo: {
                    phone: null,
                    birthday: null,
                    address: null,
                },
                dayBOD: '',
                monthBOD: '',
                yearBOD: '',
            },
        };
    },
    created() {
        this.listMenu = this.$services.commonService.getProfileLinks();
        this.getProfile();
    },
    components: {
        HistoryLogs,
        MenuPage,
        PageTitle
    },
    methods: {
        async getProfile() {
            try {
                let result = await this.$services.userService.getUserProfile();
                if (result.data) {
                    this.data.profile = result.data;
                    this.data.profile.avatar = mapUrlGoogleStorage(this.data.profile.avatar);
                }
                result = await this.$services.userService.getUserPersonalInfo();
                if (result.data) {
                    this.data.personalInfo = result.data;
                    if (result.data.birthday) {
                        this.data.personalInfo.birthday = result.data.birthday;
                        let date = new Date(result.data.birthday);
                        this.data.dayBOD = date.getDate();
                        this.data.monthBOD = date.getMonth() + 1;
                        this.data.yearBOD = date.getFullYear();
                    }
                    this.data.personalInfo.address = result.data.address ? result.data.address : null;
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async updateProfile() {
            if (this.profile.$invalid) return;
            let dataUpdate = {
                personalInfo: {}
            };
            this.submitEnter = true;

            if (this.validataName(this.data.profile.firstName)) {
                dataUpdate.firstName = this.data.profile.firstName;
                this.errorFirstName = '';
            }
            else
                this.errorFirstName = 'Name entered incorrect';

            if (this.validataName(this.data.profile.lastName)) {
                dataUpdate.lastName = this.data.profile.lastName;
                this.errorLastName = '';
            }
            else
                this.errorLastName = 'Name entered incorrect';

            if (this.validataCountries(this.data.personalInfo.address)) {
                dataUpdate.personalInfo.address = this.data.personalInfo.address;
                this.errorAddress = '';
            }
            else
                this.errorAddress = 'Invalid Address';

            if (this.validatePhone(this.data.personalInfo.phone)) {
                dataUpdate.personalInfo.phone = this.data.personalInfo.phone;
                this.errorPhone = '';
            }
            else
                this.errorPhone = 'Invalid Phone';

            if (this.data.profile.avatar)
                dataUpdate.avatar = this.data.profile.avatar;
            if (!this.validateDate(parseInt(this.data.dayBOD), parseInt(this.data.monthBOD), parseInt(this.data.yearBOD))) {
                this.errorBOD = 'Invalid birth date';
            }
            else {
                this.errorBOD = '';
                let date = new Date();
                date.setDate(this.data.dayBOD);
                date.setMonth(this.data.monthBOD - 1);
                date.setFullYear(this.data.yearBOD);
                dataUpdate.personalInfo.birthday = date;
            }
            if (this.errorFirstName || this.errorLastName || this.errorAddress || this.errorPhone || this.errorBOD)
                return false;

            let result = await this.$services.userService.updateUserProfile(dataUpdate);
            if (result.data) {
                this.$notify({
                    group: 'success',
                    title: 'Update completed',
                    text: 'Thank you'
                });
                let user = JSON.parse(JSON.stringify(this.$store.state.userAuth));
                if (user && user.profile) {
                    user.profile.firstName = result.data.firstName;
                    user.profile.lastName = result.data.lastName;
                }
                this.$store.commit('SET_USER_INFO', user);
                return true;
            }
        },
        validataName(name) {
            if (!name || name.trim().length === 0 || name.trim().length > 20)
                return false;
            return true;
        },
        validataCountries(name) {
            if (!name || name.trim().length === 0 || name.trim().length > 50)
                return false;
            return true;
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
        async uploadAvatar(event) {
            let files = event.target.files;
            let formData = new FormData();
            formData.append('avatar', files[0]);
            let {data, error} = await this.$services.userService.uploadAvatar(formData);

            if (error) {
                this.$notify({
                    group: 'error',
                    title: 'upload Avatar False',
                    text: 'Please try again'
                });
                console.error(error);
            }
            else if (data) {
                let user = JSON.parse(JSON.stringify(this.$store.state.userAuth));
                if (user && user.profile)
                    user.profile.avatar = data;

                this.data.profile.avatar = mapUrlGoogleStorage(data);
                this.$forceUpdate();
                this.$store.commit('SET_USER_INFO', user);
            }
        },
        inputAddress() {
            if (this.data.personalInfo.address) {
                clearTimeout(this.keypressTimeout);
                this.addressList = true;
                this.addressSpiner = true;
                this.keypressTimeout = setTimeout(() => this.getAddressAutoComplete(this.data.personalInfo.address), 1000);
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
                this.addressSpiner = false;
            }
            catch (err) {
                console.log(err);
            }
        },
        selectAddress(address) {
            if (address === 'Address not exist! Retry.') {
                this.data.personalInfo.address = '';
            }
            else {
                this.data.personalInfo.address = address;
            }
            this.listAddress = [];
            this.addressSpiner = false;
            this.addressList = false;
        },
    }
};
</script>

