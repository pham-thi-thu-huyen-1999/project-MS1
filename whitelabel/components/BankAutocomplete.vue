<template>
    <div class="dropdown bank-autocomplete btn-input">
        <div class="dropdown-toggle" style="position: relative;" data-toggle="dropdown">
            <input tabindex="4" class="form-input" placeholder="Find your bank..." type="text" v-model="bankingName" />
            <i aria-hidden="true" class="fa fa-angle-up"></i><i aria-hidden="true" class="fa fa-angle-down"></i>
        </div>
        <ul class="dropdown-menu" v-show="listBanks.length > 0">
            <template v-if="listBanks.length > 0">
                <li class="dropdown-menu-link" v-for="(bank, index) in listBanks" @click="getInfoBank(bank)" :key="index">
                    <img class="bank-img" v-bind:src="bank.favicon" v-bind:title="bank.name">
                    <span class="bank-name">{{bank.name}} ({{ bank.languageISOCode ? bank.languageISOCode : '' | lowercase }}{{ bank.languageISOCode && bank.countryISOCode ? '-' : ''}}{{ bank.countryISOCode ? bank.countryISOCode : '' | uppercase}})</span>
                </li>
            </template>
        </ul>
        <p v-if="getFormLoginBankError.length > 0" class="error-message">{{getFormLoginBankError}}</p>
    </div>
</template>

<script>
import {convertMonthToWord} from '~/helpers/dateHelper';
import {convertToCurrency, encryptFormData} from '~/helpers/dataHelper'; //eslint-disable-line

export default {
    props: {
        editable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            listBanks: {
                type: Array,
                default: []
            },
            listBanksBin: {
                type: Array,
                default: []
            },
            getFormLoginBankError: '',
            choosedBank: null,
            bankingName: null,
            keypressTimeout: null,
        };
    },
    async mounted() {
        if (this.editable)
            await this.getListBank();
    },
    watch: {
        bankingName: function(newData) {
            if (newData) {
                clearTimeout(this.keypressTimeout);
                this.keypressTimeout = setTimeout(() => {
                    this.searchBanksBySearchTerm(newData);
                }, 400);
            }
            else {
                this.listBanks = this.listBanksBin;
                this.choosedBank = null;
            }
        }
    },
    created() {
    },
    methods: {
        async getListBank() {
            this.shouldShowLoading = true;
            await this.getKeyPem();
            let result = await this.$services.yodleeService.getProviders();
            this.shouldShowLoading = false;
            if (!result || !result.data) {
                this.getFormLoginBankError = 'Cannot get list banks at the moment. This is due to network issue or unresponsive Yodlee server. You can refresh or try again shortly.';
                this.listBanks = [];
                this.listBanksBin = this.listBanks;
                return;
            }
            this.listBanks = result.data;
            this.listBanksBin = this.listBanks;
        },
        async searchBanksBySearchTerm(searchTerm) {
            let {data, error} = await this.$services.yodleeService.searchProvider(searchTerm);
            if (error)
                this.getFormLoginBankError = 'Cannot find bank! Please try with another name or refresh the page';
            else
                this.listBanks = data;
        },
        async getKeyPem() {
            if ((!this.keyAlias || !this.keyPem) && process.env.environment && process.env.environment !== 'Development') {
                this.shouldShowLoading = true;
                let {data, error} = await this.$services.yodleeService.getPublicKey();
                this.shouldShowLoading = false;
                if (error)
                    this.getFormLoginBankError = 'Cannot get key to request list banks. This is due to network issue or unresponsive server. You can refresh or try again shortly.';
                else if (data) {
                    this.keyPem = data.keyAsPemString;
                    this.keyAlias = data.keyAlias;
                }
            }
        },
        getInfoBank(bank) {
            this.choosedBank = bank;
            this.bankingName = bank.name + ' (' + (this.choosedBank.languageISOCode ? this.choosedBank.languageISOCode.toLowerCase() : '') + '-' + (this.choosedBank.countryISOCode ? this.choosedBank.countryISOCode.toUpperCase() : '') + ')';
            this.$emit('bankSelected', {choosedBank: this.choosedBank, bankingName: this.bankingName});
            this.listBanks = [];
        },
    },
    filters: {
        convertMonthToWord(month) {
            return convertMonthToWord(month);
        },
        convertToCurrency(value) {
            return convertToCurrency(value);
        },
        lowercase(value) {
            return value.toLowerCase();
        },
        uppercase(value) {
            return value.toUpperCase();
        }
    }
};
</script>