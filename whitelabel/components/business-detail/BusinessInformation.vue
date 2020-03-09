<template>
  <div class="box-content">
    <div class="section-business">
        <h3 class="box-center-title">Business Information</h3>
        <kform :state="business" name="business" @submit.prevent='updateBusinessInfo'>
        <div class="row form-box">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="form-group">
                    <label class="form-label">ABN</label>
                    <input :disabled="data.user.businessInfo.abnCode && data.user.businessInfo.abnCode.length === 11" @blur="transformText" @focus="transformText" @input="lookupABN" class="form-control form-input" type="text" required name="abn" v-model="data.user.businessInfo.abnCode" :placeholder="abnTemplate">
                    <!-- <span class="icon-war" :class="{active: errorABNCode}"><span class="tooltip-error">Invalid ABN</span></span> -->
                </div>
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="form-group">
                    <label class="form-label">Entity Name</label>
                    <input disabled class="form-control form-input" type="text" v-model="data.user.businessInfo.entityName" placeholder="...">
                </div>
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="form-group">
                    <label class="form-label">Entity Type</label>
                    <input  disabled class="form-control form-input" type="text" v-model="data.user.businessInfo.entityType" placeholder="...">
                    <!-- <span v-if="errorEntityName || errorEntityType" class="tooltip-error big" :class="{all: errorEntityName || errorEntityType}">Invalid Entity Name or Entity Type</span> -->
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="form-group">
                    <label class="form-label">Business address</label>
                    <input :disabled="clientId" class="form-control form-input" type="text" placeholder="100 Example St, Suburb, City, Country, 00000" required name="businessaddress" minlength="4" v-model="data.user.businessInfo.address">
                    <!-- <span v-if="businessAddressSpiner" class="input-loading"></span>
                    <div v-if="businessAddressList" class="dropdown-address">
                        <ul>
                            <li class="dropdown-address-item" @click="selectBusinessAddress(item)" v-for="(item, index) in listAddress" :key="index"><span>{{item}}</span></li>                                                   
                        </ul>
                    </div> -->
                    <!-- <div class="icon-war" :class="{active: errorAddress}"><span class="tooltip-error">Invalid Business Address</span></div> -->
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div :class="[isError ? 'error-text' : 'completed-text', 'validate-text' ]">{{ text }}</div>
                </div>
                <button :hidden="clientId" type="submit" class="form-btn btn" >UPDATE</button>
            </div>
        </div>
        </kform>
    </div>
</div>
</template>

<script>
import {transformText, transformDigit} from '~/helpers/dataHelper';

export default {
    props: {
        clientId: {
            type: String
        }
    },
    data() {
        return {
            data: {
                user: {
                    businessInfo: {
                        abnCode: null,
                        entityName: null,
                        entityType: null,
                        address: null
                    }
                }
            },
            business: {},
            abnTemplate: 'xx xxx xxx xxx',
            abnCodeModified: '',
            isError: false,
            text: '',
            listAddress: [],
            businessAddressSpiner: false,
            businessAddressList: false,
            errorABNCode: false,
            errorEntityName: false,
            errorEntityType: false,
            errorAddress: false,
        };
    },
    created() {
        if (!this.clientId) {
            this.getData();
        }
        else {
            this.getDataByClient(this.clientId);
        }
    },
    components: {

    },
    watch: {

    },
    methods: {
        async getData() {
            try {
                let result = await this.$services.userService.getUserBusinessInfo();
                if (result.data) {
                    this.data.user.businessInfo.abnCode = result.data.abnCode ? result.data.abnCode : null; ;
                    this.data.user.businessInfo.entityName = result.data.entityName;
                    this.data.user.businessInfo.entityType = result.data.entityType;
                    this.data.user.businessInfo.address = result.data.address ? result.data.address : null;
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async getDataByClient(clientId) {
            try {
                let result = await this.$services.userService.getBusinessInfo(clientId);
                if (result.data) {
                    this.data.user.businessInfo.abnCode = result.data.abnCode;
                    this.data.user.businessInfo.entityName = result.data.entityName;
                    this.data.user.businessInfo.entityType = result.data.entityType;
                    this.data.user.businessInfo.address = result.data.address;
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async updateBusinessInfo() {
            if (this.business.$invalid) return;
            let dataBusiness = {};
            if (this.data.user.businessInfo.abnCode) {
                this.errorABNCode = false;
                dataBusiness.abnCode = this.data.user.businessInfo.abnCode;
            }
            else {
                this.errorABNCode = true;
                this.hasError('Invalid ABN', true);
                return false;
            }
            if (this.data.user.businessInfo.entityName) {
                this.errorEntityName = false;
                dataBusiness.entityName = this.data.user.businessInfo.entityName;
            }
            else {
                this.errorEntityName = true;
                this.hasError('Invalid Enity Name', true);
                return false;
            }

            if (this.data.user.businessInfo.entityType) {
                this.errorEntityType = false;
                dataBusiness.entityType = this.data.user.businessInfo.entityType;
            }
            else {
                this.errorEntityType = true;
                this.hasError('Invalid Enity Type', true);
                return false;
            }
            if (this.data.user.businessInfo.address) {
                this.errorAddress = false;
                dataBusiness.address = this.data.user.businessInfo.address;
            }
            else {
                this.errorAddress = true;
                this.hasError('Invalid Address', true);
                return false;
            }
            try {
                let userBusinessInfo = await this.$services.userService.updateBusinessInfo(dataBusiness);
                if (userBusinessInfo.data) {
                    // this.hasError('Update info completed.', false);
                    // update flag error auto off when success
                    this.errorAddress = false;
                    this.errorEntityName = false;
                    this.errorEntityType = false;
                    this.$notify({
                        group: 'success',
                        title: 'Update completed',
                        text: 'Thank you'
                    });
                }
                else
                    this.hasError('Update failed', true);
            }
            catch (error) {
                this.hasError('Update failed', true);
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
            catch (err) {
                console.log(err);
            }
        },
        selectBusinessAddress(address) {
            if (address === 'Address not exist! Retry.') {
                this.data.user.businessInfo.address = '';
            }
            else {
                this.data.user.businessInfo.address = address;
            }
            this.listAddress = [];
            this.businessAddressList = false;
            this.businessAddressSpiner = false;
        },
        async lookupABN() {
            if (this.data.user.businessInfo.abnCode) {
                clearTimeout(this.keypressTimeout);
                this.keypressTimeout = setTimeout(async () => {
                    let {data, error} = await this.$services.abnService.lookupABN(this.data.user.businessInfo.abnCode.replace(/\D/g, ''));
                    if (error) {
                        this.hasError(error.message, true);
                        this.data.user.businessInfo.entityName = '';
                        this.data.user.businessInfo.entityType = '';
                    }
                    else {
                        this.hasError(null, false);
                        this.data.user.businessInfo.entityName = data.entityName || data.title;
                        this.data.user.businessInfo.entityType = data.entityType || data.company_type;
                        this.data.user.businessInfo.address = data.address_snippet || '';
                    }
                }, 500);
            }
            else {
                this.data.user.businessInfo.entityName = '';
                this.data.user.businessInfo.entityType = '';
            }
        },
        inputBusinessAddress() {
            if (this.data.user.businessInfo.address) {
                clearTimeout(this.keypressTimeout);
                // this.businessAddressList = true;
                // this.businessAddressSpiner = true;
                // this.keypressTimeout = setTimeout(() => this.getAddressAutoComplete(this.data.user.businessInfo.address), 1000);
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
        },
        transformDigit() {
            this.data.user.businessInfo.abnCode = transformDigit(this.data.user.businessInfo.abnCode);
        },
        transformText() {
            this.transformDigit();
            this.data.user.businessInfo.abnCode = transformText(this.abnTemplate, this.data.user.businessInfo.abnCode);
        }
    }
};
</script>