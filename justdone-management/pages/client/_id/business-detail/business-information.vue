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
                        <div class="box-center">
                            <div class="box-content">
                                <div class="section-business">
                                    <h3 class="box-center-title">Business Information</h3>
                                    <div class="row form-box">
                                        <div class="col-md-12 col-sm-12 col-xs-12">
                                            <div class="form-group">
                                                <label class="form-label">ABN</label>
                                                <input
                                                    :disabled="list.businessInfo.abnCode && list.businessInfo.abnCode.length === 11"
                                                    @blur="transformText"
                                                    @focus="transformDigit"
                                                    @input="lookupABN"
                                                    class="form-control form-input"
                                                    type="text"
                                                    v-model="list.businessInfo.abnCode"
                                                    :placeholder="abnTemplate"
                                                >
                                                <span
                                                    class="icon-war"
                                                    :class="{active: errorABNCode}"
                                                ><span class="tooltip-error">Invalid ABN</span></span>
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-sm-12 col-xs-12">
                                            <div class="form-group">
                                                <label class="form-label">Entity Name</label>
                                                <input
                                                    disabled
                                                    class="form-control form-input"
                                                    type="text"
                                                    v-model="list.businessInfo.entityName"
                                                    placeholder="..."
                                                >
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-sm-12 col-xs-12">
                                            <div class="form-group">
                                                <label class="form-label">Entity Type</label>
                                                <input
                                                    disabled
                                                    class="form-control form-input"
                                                    type="text"
                                                    v-model="list.businessInfo.entityType"
                                                    placeholder="..."
                                                >
                                                <span
                                                    v-if="errorEntityName || errorEntityType"
                                                    class="tooltip-error big"
                                                    :class="{all: errorEntityName || errorEntityType}"
                                                >Invalid Entity Name or Entity Type</span>
                                            </div>
                                        </div>
                                        <div class="col-md-12 col-sm-12 col-xs-12">
                                            <div class="form-group">
                                                <label class="form-label">Business address</label>
                                                <input
                                                    :disabled="clientId"
                                                    @input="inputBusinessAddress()"
                                                    class="form-control form-input"
                                                    type="text"
                                                    placeholder="100 Example St, Suburb, City, Country, 00000"
                                                    v-model="list.businessInfo.address"
                                                >
                                                <span
                                                    v-if="businessAddressSpiner"
                                                    class="input-loading"
                                                ></span>
                                                <div
                                                    v-if="businessAddressList"
                                                    class="dropdown-address"
                                                >
                                                    <ul>
                                                        <li
                                                            class="dropdown-address-item"
                                                            @click="selectBusinessAddress(item)"
                                                            v-for="(item, index) in listAddress"
                                                            :key="index"
                                                        ><span>{{item}}</span></li>
                                                    </ul>
                                                </div>
                                                <div
                                                    class="icon-war"
                                                    :class="{active: errorAddress}"
                                                ><span class="tooltip-error">Invalid Business Address</span></div>
                                            </div>
                                            <div class="col-md-12 col-sm-12 col-xs-12">
                                                <div :class="[isError ? 'error-text' : 'completed-text', 'validate-text' ]">{{ text }}</div>
                                            </div>
                                            <button
                                                :hidden="clientId"
                                                type="button"
                                                class="form-btn btn"
                                                @click="updateBusinessInfo()"
                                            >UPDATE</button>
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
import {transformText, transformDigit} from '~/helpers/dataHelper';

export default {
    data() {
        return {
            titles: ['Business detail', 'Business information'],
            listMenu: [],
            clientId: null,
            list: {
                businessInfo: {
                    abnCode: null,
                    entityName: null,
                    entityType: null,
                    address: null
                }
            },
            abnTemplate: 'xxx xxxx xxxx',
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
        if (this.$store.state && this.$store.state.client._id)
            this.clientId = this.$route.params.id;
        this.listMenu = this.$services.commonService.getBusinessLinks(this.$store.state.client._id, this.$store.state.productCode);
        this.getData();
    },
    components: {
        HistoryLogs,
        MenuPage,
        PageTitle
    },
    methods: {
        async getData() {
            try {
                let result = await this.$services.userService.getUserBusinessInfo(this.clientId);
                if (result.data) {
                    this.list.businessInfo.abnCode = result.data.abnCode;
                    this.list.businessInfo.entityName = result.data.entityName;
                    this.list.businessInfo.entityType = result.data.entityType;
                    this.list.businessInfo.address = result.data.address;
                }
            }
            catch (error) {
                return false;
            }
        },
        async updateBusinessInfo() {
            let dataBusiness = {};
            if (this.list.businessInfo.abnCode)
                dataBusiness.abnCode = this.list.businessInfo.abnCode;
            else {
                this.errorABNCode = true;
                this.hasError('Invalid ABN', true);
                return false;
            }
            if (this.list.businessInfo.entityName)
                dataBusiness.entityName = this.list.businessInfo.entityName;
            else {
                this.errorEntityName = true;
                this.hasError('Invalid Enity Name', true);
                return false;
            }
            if (this.list.businessInfo.entityType)
                dataBusiness.entityType = this.list.businessInfo.entityType;
            else {
                this.errorEntityType = true;
                this.hasError('Invalid Enity Type', true);
                return false;
            }
            if (this.list.businessInfo.address)
                dataBusiness.address = this.list.businessInfo.address;
            else {
                this.errorAddress = true;
                this.hasError('Invalid Address', true);
                return false;
            }

            try {
                let userBusinessInfo = await this.$services.userService.updateBusinessInfo(dataBusiness);
                if (userBusinessInfo.data) {
                    // this.hasError('Update info completed.', false);
                    this.$notify({
                        type: 'success',
                        title: 'Update completed',
                        text: 'Thank you'
                    });
                    return true;
                }
                else {
                    this.hasError('Update failed', true);
                    return false;
                }
            }
            catch (error) {
                this.hasError('Update failed', true);
                return false;
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
                return false;
            }
        },
        selectBusinessAddress(address) {
            if (address === 'Address not exist! Retry.') {
                this.list.businessInfo.address = '';
            }
            else {
                this.list.businessInfo.address = address;
            }
            this.listAddress = [];
            this.businessAddressList = false;
            this.businessAddressSpiner = false;
        },
        async lookupABN() {
            if (this.list.businessInfo.abnCode) {
                clearTimeout(this.keypressTimeout);
                this.keypressTimeout = setTimeout(async () => {
                    let {data, error} = await this.$services.abnService.lookupABN(this.list.businessInfo.abnCode.replace(/\D/g, ''));
                    if (error) {
                        this.hasError(error.message, true);
                        this.list.businessInfo.entityName = '';
                        this.list.businessInfo.entityType = '';
                    }
                    else {
                        this.hasError(null, false);
                        this.list.businessInfo.entityName = data.entityName || data.title;
                        this.list.businessInfo.entityType = data.entityType || data.company_type;
                        this.list.businessInfo.address = data.address_snippet || '';
                    }
                }, 500);
            }
            else {
                this.list.businessInfo.entityName = '';
                this.list.businessInfo.entityType = '';
            }
        },
        inputBusinessAddress() {
            if (this.list.businessInfo.address) {
                clearTimeout(this.keypressTimeout);
                this.businessAddressList = true;
                this.businessAddressSpiner = true;
                this.keypressTimeout = setTimeout(() => this.getAddressAutoComplete(this.list.businessInfo.address), 1000);
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
            this.list.businessInfo.abnCode = transformDigit(this.list.businessInfo.abnCode);
        },
        transformText() {
            this.list.businessInfo.abnCode = transformText(this.abnTemplate, this.list.businessInfo.abnCode);
        }
    }
};
</script>

