<template>
    <div class="connect-bank">
        <loading :isShowLoading="shouldShowLoading"/>
        <!-- Step 1 -->
        <div class="connect-step1" v-if="step === 1 && editable">
            <h3 class="step-title">CONNECT YOUR BANK ACCOUNT</h3>
            <bank-autocomplete @bankSelected="handleSelectedBank($event)"></bank-autocomplete>
            <button class="form-btn" @click="getFormLoginBank()">connect</button>
        </div>

        <!-- Step 2 -->
        <div class="connect-step2" v-if="step === 2 && editable">
            <template v-if="!isConnectingToBank">
                <div class="row">
                    <div class="col-lg-8 col-md-8 col-sm-7 col-xs-7">
                        <div class="box-border text-left" v-if="!isReconnectBank">
                            <img :src="choosedBank ? choosedBank.favicon : ''" class="bank-img" alt="">
                            <label class="bank-name">{{choosedBank.name}} {{ choosedBank.languageISOCode ? choosedBank.languageISOCode : '' | lowercase }} {{ choosedBank.languageISOCode && choosedBank.countryISOCode ? '-' : ''}} {{ choosedBank.countryISOCode ? choosedBank.countryISOCode : '' | uppercase}}</label>
                        </div>  
                        <div class="box-border text-left" v-else>
                            <img v-if="reconnectBank" :src="reconnectBank.logo ? reconnectBank.logo : ''" class="bank-img" alt="">
                            <label v-if="reconnectBank" class="bank-name">{{reconnectBank.bankName}} ({{reconnectBank.languageISOCode}})</label>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-5 col-xs-5" v-if="!isReconnectBank">
                        <div class="box-border">
                            <button @click="getOtherBank()" class="btn-other-bank" >
                                Other Bank
                            </button>
                        </div>
                    </div>
                    <div class="col-md-12 col-sm-12 col-xs-12 text-left form-login">
                        <div class="form-group" v-for="(form, index) in bankLoginForm.loginForm" :key="index">
                            <label class="form-label">{{form.label}}</label>
                            <input v-if="form.field[0].type != 'option'" :id="'field_'+ form.field[0].id" v-bind:type="form.field[0].type" 
                            @keypress.enter.prevent="connectToBank()" class="form-control form-input"
                             @change="eventChangeFormData($event, form.field[0])">
                             <div v-else @change="eventChangeFormData($event, form.field[0].option)" v-for="(option, indexOption) in form.field[0].option" :key="indexOption"> 
                                <input type="radio" v-model="form.field[0].value" :value="option.optionValue">
                                {{option.displayText}}
                            </div>
                        </div>
                        <button class="form-btn" @click="connectToBank()" >connect</button>
                        <p class="form-label-error" v-if="connectBankError.length > 0">{{connectBankError}}</p>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="connectingLogin text-center">
                    <h3 class="step-title">PLEASE WAIT FOR CONNECTING</h3>
                    <img class="clock" src="~/assets/images/clock.gif" alt="loading">
                    <p class="es-time" style="font-size:13px;">We are currently connecting to your account <br>Estimate time: 2 mins<br/></p><br/><br/>
                    <wdt-loading :isError="connectingBankError" :items="connectingBankStatusList" :index="connectingBankIndex" />
                </div>
            </template>
        </div>

        <!-- Step 3 -->
        <div class="connect-step3" v-if="step === 3 && editable">
            <h3 class="step-title">Please select your account</h3>
            <div class="dropdown btn-input">
                <button v-if="!bankAccountName" class="dropdown-toggle form-input text-left" data-toggle="dropdown"> Please click there to select your account
                    <i class="fa fa-angle-up" aria-hidden="true"></i>
                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                </button>
                <button v-else class="dropdown-toggle form-input text-left select-account" data-toggle="dropdown"> 
                    <span class="acc-name">{{bankAccountName}} ({{bankAccountNumber ? bankAccountNumber : 'NA'}})</span>
                    <span class="acc-value">{{bankAccountBalance.amount | convertToCurrency }} {{bankAccountBalance.currency}}</span>
                    <i class="fa fa-angle-up" aria-hidden="true"></i>
                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                </button>
                <ul class="dropdown-menu">
                    <li class="dropdown-menu-link" v-for="(bankAccount, index) in listAccountBank" :key="index" @click="getAccountBank(bankAccount)">
                        <span class="acc-name">{{bankAccount.accountName}} ({{bankAccount.accountNumber ? bankAccount.accountNumber : 'NA'}})</span>
                        <span class="acc-value">{{bankAccount.balance.amount | convertToCurrency }} {{bankAccount.balance.currency}}</span>
                    </li>
                </ul>
            </div>
            <button class="form-btn" @click="addAccount()">ADD ACCOUNT</button>
        </div>

        <!-- Step 4 -->
        <div class="connect-step4" v-if="step === 4">
            <div class="infor-bank">
                <div class="row align-items-center">
                    <div class="col-md-6 col-sm-6 col-xs-12 text-left">
                        <div class="icon-bank-box">
                            <span class="icon-bank-min i-con"></span>
                        </div>
                        <span class="bank-name">{{userConnectedBank.connectedName ? userConnectedBank.connectedName : ''}}</span>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <div class="infor-detail">BSB: {{userConnectedBank.account.bankTransferCode ? userConnectedBank.account.bankTransferCode[0].id : 'NA'}} | Account No. {{userConnectedBank.account.accountNumber ? userConnectedBank.account.accountNumber: ''}}</div>
                    </div>
                </div>
            </div>
        </div>

        <!--This message show when user not connected and component is not editable-->
        <div class="BankStatement" v-if="(step === 1 || step ===2 || step ===3) && !editable">
            <div class="headerWrapper">
            </div>
            <div class="notConnect">
                <div class="row">
                    <div class="col-12" style="display:inline-block;text-align:center;width:100%;">
                        <p>NO ACCOUNT CONNECTED!</p>
                        <p>This user havent't yet connected to any account.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import Loading from '~/components/Loading';
import WdtLoading from '~/components/WdtLoading';
import BankAutocomplete from '~/components/BankAutocomplete';
import {convertMonthToWord} from '~/helpers/dateHelper';
import {convertToCurrency, encryptFormData} from '~/helpers/dataHelper';

export default {
    props: {
        accountType: {
            type: Number,
            default: 1
        },
        editable: {
            type: Boolean,
            default: true
        },
        clientId: {
            type: String,
            default: ''
        },
        shouldShowTitle: {
            type: Boolean,
            default: false
        },
    },
    components: {
        Loading,
        WdtLoading,
        BankAutocomplete
    },
    data() {
        return {
            step: 1, // step 1: List Banks, step 2: Form Login Bank + clock, step 3: List Accounts, Step 4: Connected
            isConnectingToBank: false,
            choosedBank: null,
            bankAccountName: '',
            bankAccountNumber: '',
            bankAccountBalance: '',
            userConnectedBank: null,
            listBanks: {
                type: Array,
                default: []
            },
            listBanksBin: {
                type: Array,
                default: []
            },
            bankingName: '',
            bankLoginForm: {},
            listAccountBank: {
                type: Array,
                default: []
            },
            reconnectBank: null,
            isReconnectBank: false,
            bankAccountChoose: {},
            getFormLoginBankError: '',
            connectBankError: '',
            isNoData: true,
            keyAlias: null,
            keyPem: null,

            connectingBankIndex: 0,
            connectingBankStatus: 'Requesting data from server',
            connectingBankTimeout: null,
            connectingBankStatusList: [
                'Requesting data from server', // 1
                'Encrypting login information', // 2
                'Checking the account information', // 3
                'Login in progress', // 4
                'Retrieving the account summary', // 5
                'Encrypting the account summary', // 6
                'Finalizing the data with bank server', // 7
                'Checking the security connection', // 8
                'Finalizing the account summary' // 9
            ],
            componentTitle: this.accountType === 1 ? 'Bank Accounts' : 'Credit Cards',
            shouldShowLoading: true,
            connectingBankError: false,
            keypressTimeout: null,
        };
    },
    async mounted() {
        await this.load();
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
        },
        clientId: function(newData) {
            if (!newData)
                return;
            this.load();
        },
        accountType: function(newData) {
            if (!newData)
                return;
            this.load();
        },
    },
    methods: {
        reset() {
            this.bankAccountName = '';
            this.bankAccountNumber = null;
            this.bankAccountBalance = null;
            this.bankAccountChoose = {};
            this.listAccountBank = [];
        },
        async load() {
            this.reset();
            if (this.editable)
                await this.getListBank();
            if (this.isReconnectBank)
                await this.hanleReconnectBank();
            else
                await this.getBankInfo(this.clientId);
        },
        async getBankInfo(clientId) {
            if (!this.$store.state.userAuth || !this.$store.state.userAuth._id)
                this.$router.push('/login');

            let result;
            if (!clientId || clientId === this.$store.state.userAuth._id)
                result = await this.$services.userService.getConnectedBanksByUserLogin();
            else
                result = await this.$services.userService.getConnectedBanksByUserId(clientId);

            // user chua connect bank
            if (!result || !result.data || result.data.length === 0) {
                this.step = 1;
                this.shouldShowLoading = false;

                this.$emit('changeStatus', {message: 'userNotConnectToBank'});
                return;
            }
            // neu connect bank roi
            // loc cac bank voi type = BankType
            let infoBankAccount = result.data.filter(item => item.type === this.accountType);
            // neu khong co bank nao thoa dieu kien
            // connect bank lai tu dau
            if (infoBankAccount.length === 0) {
                this.step = 1;
                this.shouldShowLoading = false;
                this.$emit('changeStatus', {message: 'userHaveNoBankType'});
                return;
            }
            // check xem user co nen
            // reconnect bank hay khong
            for (let i = 0; i < infoBankAccount.length; i++) {
                if (infoBankAccount[i]) {
                    if (infoBankAccount[i].isReconnectBank) {
                        await this.hanleReconnectBank();
                        this.$emit('changeStatus', {message: 'userReConnectToBank'});
                        return;
                    }
                }
            }
            // neu co bank
            // tien hanh check account
            if (infoBankAccount.length > 0 && (!infoBankAccount[0].providerId || !infoBankAccount[0].connectedId || !infoBankAccount[0].connectedName || infoBankAccount[0].connectedId === '' || infoBankAccount.connectedName === '')) {
                let {data, error} = await this.$services.yodleeService.getBankAccounts(this.accountType);
                if (data && data.account && data.account.length === 0) {
                    this.$emit('changeStatus', {message: 'userHaveNoAccount'});
                    this.getFormLoginBankError = '';
                    this.step = 1;
                    this.shouldShowLoading = false;
                    return;
                }
                if (data && data.account && data.account.length > 0) {
                    this.$emit('changeStatus', {message: 'userNotConnectToAccount'});
                    this.listAccountBank = data.account;
                    this.step = 3;
                    this.shouldShowLoading = false;
                    return;
                }
                if (error)
                    this.getFormLoginBankError = 'Cannot get bank accounts at the moment. Please try again shortly.';
                this.shouldShowLoading = false;
            }
            // Neu user connect bank thanh cong roi
            // hien thi thong tin bank len man hinh
            else {
                for (let i = infoBankAccount.length - 1; i >= 0; i--) {
                    if (infoBankAccount[i] && infoBankAccount[i].connectedName && infoBankAccount[i].connectedId && infoBankAccount[i].accounts && infoBankAccount[i].accounts.length > 0) {
                        this.userConnectedBank = infoBankAccount[i];
                        this.userConnectedBank = this.formatUserConnectedBank(this.userConnectedBank);
                        this.step = 4;
                        this.shouldShowLoading = false;
                        this.$emit('changeStatus', {message: 'userConnectAccountSuccess'});
                        return;
                    }
                }
                this.shouldShowLoading = false;
                this.step = 1;
            }
        },
        async hanleReconnectBank() {
            this.isReconnectBank = true;
            this.shouldShowLoading = true;

            let {data, error} = await this.$services.yodleeService.getFormUpdateBank(this.accountType);
            if (error) {
                this.step = 1;
                this.shouldShowLoading = false;
                this.getFormLoginBankError = 'Cannot get bank login form or bank logged is not exist';
                return;
            }
            else {
                this.reconnectBank = {
                    bankName: data.bankName,
                    logo: data.logo,
                    languageISOCode: data.languageISOCode,
                    providerId: data.providerId,
                };
                this.bankLoginForm.loginForm = data.loginForm.row;
            }
            this.shouldShowLoading = false;
            this.step = 2;
        },
        async getListBank() {
            this.shouldShowLoading = true;
            this.getKeyPem();
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
        async handleSelectedBank(event) {
            if (!event)
                return;
            if (event.choosedBank && event.bankingName) {
                this.choosedBank = event.choosedBank;
                this.bankingName = event.bankingName;
            }
        },
        async getFormLoginBank() {
            if (!this.choosedBank) {
                this.getFormLoginBankError = 'No bank choosed! Please select a bank to connect.';
                return;
            }
            this.shouldShowLoading = true;
            let {data, error} = await this.$services.yodleeService.getFormLoginBank(this.choosedBank.bankId);
            this.shouldShowLoading = false;
            if (error) {
                this.getFormLoginBankError = 'Cannot get form login for this bank at the moment. Please try again shortly.';
                return;
            }
            this.connectBankError = '';
            this.step = 2;
            this.bankLoginForm.providerId = data.providerId;
            this.bankLoginForm.loginForm = data.loginForm.row;
        },
        formatUserConnectedBank(connectedBank) {
            if (!connectedBank || !connectedBank.accounts || !connectedBank.accounts.length === 0)
                return;
            for (var i = 0; i < connectedBank.accounts.length; i++) {
                if (connectedBank.accounts[i].accountName === connectedBank.connectedName) {
                    connectedBank.account = connectedBank.accounts[i];
                    break;
                }
            };
            return connectedBank;
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
        async connectToBank() {
            this.connectingBankStatus = 'Requesting Yodlee Server';
            this.connectingBankError = false;
            clearTimeout(this.connectingBankTimeout);
            let isValid = this.validateForm();
            if (isValid) {
                await this.$services.yodleeService.validateYodlee(this.bankLoginForm, this.accountType);// remove
                this.connectingBankTimeout = setTimeout(() => {
                    this.connectingBankIndex = 1;
                }, 1800);
                if (this.keyAlias && this.keyPem && process.env.environment && process.env.environment !== 'Development')
                    this.bankLoginForm.loginForm = encryptFormData(this.bankLoginForm.loginForm, this.keyPem, this.keyAlias);
                this.isConnectingToBank = true;

                let result;
                if (this.isReconnectBank)
                    result = await this.$services.yodleeService.reconnectBank(this.reconnectBank.providerId, {row: this.bankLoginForm.loginForm}, this.accountType);
                else
                    result = await this.$services.yodleeService.addBank(this.bankLoginForm.providerId, {row: this.bankLoginForm.loginForm}, this.accountType);

                if (!result || result.error) {
                    this.connectingBankError = true;
                    this.connectingBankIndex = 2;
                    clearTimeout(this.connectingBankTimeout);
                    this.connectingBankTimeout = setTimeout(() => {
                        this.connectBankError = '';
                        this.step = 2;
                        this.isConnectingToBank = false;
                        this.connectBankError = 'Cannot connect to your bank at the moment. You can refresh the page or try connect again shortly.';
                    }, 2400);
                }
                else if (result && !result.data) {
                    this.connectingBankError = true;
                    this.connectingBankIndex = 2;
                    clearTimeout(this.connectingBankTimeout);
                    this.connectingBankTimeout = setTimeout(() => {
                        this.connectBankError = '';
                        this.step = 2;
                        this.isConnectingToBank = false;
                        this.connectBankError = 'Your account cannot be connected! Please check your ID or password and retry.';
                    }, 2400);
                }
                else if (result && result.data) {
                    this.connectingBankError = false;
                    this.connectingBankIndex = 2;
                    this.checkStatusConnectBank(result.data, async (error, data) => {
                        if (error) {
                            this.connectingBankError = true;
                            this.connectingBankIndex += 1;
                            clearTimeout(this.connectingBankTimeout);
                            this.connectingBankTimeout = setTimeout(() => {
                                this.connectBankError = '';
                                this.step = 2;
                                this.isConnectingToBank = false;
                                this.connectBankError = 'Your account cannot be connected! Please check your ID or password and retry.';
                            }, 2400);
                            return;
                        }
                        let resultBankAcc = await this.$services.yodleeService.getBankAccounts(this.accountType);

                        this.isConnectingToBank = false;
                        if (resultBankAcc.error) {
                            this.connectBankError = 'Canot get bank accounts at the moment. You can refresh the page or try again shortly.';
                            this.step = 2;
                            return;
                        }
                        this.listAccountBank = resultBankAcc.data.account;
                        if (this.listAccountBank.length === 0) {
                            this.connectBankError = 'You do not have any ' + this.componentTitle + ' account in your previously chosen bank. Please try connect bank again with another bank.';
                            this.step = 2;
                            return;
                        }

                        this.step = 3;
                    });
                }
            }
        },
        async addAccount() {
            this.shouldShowLoading = true;
            let dataUpdate = {
                connectedBank: {
                    providerId: this.bankAccountChoose.providerAccountId,
                    type: this.accountType,
                    connectedId: this.bankAccountChoose.id,
                    connectedName: this.bankAccountChoose.accountName,
                }
            };
            let result = await this.$services.userService.updateUserConnectBank(dataUpdate);
            this.shouldShowLoading = false;
            if (result.error) {
                this.step = 3;
                this.connectBankError = 'Cannot add this account. Please try again shortly.';
                return;
            }
            else {
                this.getBankInfo();
            }
            this.$services.yodleeService.loadTransactionAndSave(this.accountType);
        },
        validateForm(params) {
            let isValid = true;
            if (this.bankLoginForm.loginForm.length) {
                this.bankLoginForm.loginForm.forEach(item => {
                    if (!item.field[0] || !item.field[0].value) {
                        if (!item.field[0].isOptional) {
                            $('#err_' + item.field[0].id).remove();
                            $('#field_' + item.field[0].id).after(`<p class="form-label-error text-left " id="err_${item.field[0].id}">` + item.label.capitalize() + ' is required </b>');
                            isValid = false;
                        }
                    }
                    else {
                        $('#err_' + item.field[0].id).remove();
                    }
                });
            }
            else
                isValid = false;
            return isValid;
        },
        getOtherBank() {
            this.step = 1;
        },
        getAccountBank(accountBank) {
            this.bankAccountName = accountBank.accountName;
            this.bankAccountNumber = accountBank.accountNumber;
            this.bankAccountBalance = accountBank.balance;
            this.bankAccountChoose = accountBank;
        },
        getInfoBank(bank) {
            this.choosedBank = bank;
            this.bankingName = bank.name + ' (' + (this.choosedBank.languageISOCode ? this.choosedBank.languageISOCode.toLowerCase() : '') + '-' + (this.choosedBank.countryISOCode ? this.choosedBank.countryISOCode.toUpperCase() : '') + ')';
        },
        async eventChangeFormData(event, data) {
            let value = event.target.value;
            data.value = value;
            this.validateForm();
        },
        async checkStatusConnectBank(data, callback) {
            if (data && data.providerAccount && data.providerAccount.refreshInfo) {
                this.connectingBankError = false;
                if (data.providerAccount.refreshInfo.status === 'SUCCESS') {
                    if (this.isReconnectBank) {
                        await this.$services.yodleeService.removeReconnectBank(this.accountType);
                        this.$emit('changeStatus', {message: 'userConnectAccountSuccess'});
                        return;
                    }
                    this.connectingBankStatus = 'SUCCESS. NOW GET ' + this.componentTitle + ' ACCOUNT.';
                    this.connectingBankIndex = 8;
                    return callback(null, {providerId: data.providerAccount.providerId});
                }
                else if (data.providerAccount.refreshInfo.status === 'FAILED') {
                    this.connectingBankError = true;
                    this.connectingBankIndex += 1;
                    this.connectingBankStatus = 'FAILED';
                    return callback(new Error('Login bank failed'));
                }
                else {
                    if (this.connectingBankStatus.indexOf(data.providerAccount.refreshInfo.additionalStatus) >= 0) {
                        this.connectingBankStatus += '...';
                        this.connectingBankIndex += 1;
                    }
                    else {
                        if (data.providerAccount.refreshInfo.additionalStatus === 'LOGIN_IN_PROGRESS')
                            if (this.connectingBankIndex < 3)
                                this.connectingBankIndex = 3;
                            else
                                this.connectingBankIndex += 1;
                        else if (data.providerAccount.refreshInfo.additionalStatus === 'ACCOUNT_SUMMARY_RETRIEVED')
                            if (this.connectingBankIndex < 4)
                                this.connectingBankIndex = 4;
                            else
                                this.connectingBankIndex += 1;
                        this.connectingBankStatus = data.providerAccount.refreshInfo.additionalStatus;
                    }
                    setTimeout(async () => {
                        let result = await this.$services.yodleeService.getConnectBankStatus(data.providerAccount.id);
                        if (result && result.data)
                            this.checkStatusConnectBank(result.data, callback);
                    }, 15000);
                }
            }
            else {
                this.connectingBankError = true;
                this.connectingBankStatus = 'Login bank failed!';
                clearTimeout(this.connectingBankTimeout);
                this.connectingBankTimeout = setTimeout(() => {
                    return callback(new Error('Login bank failed'));
                }, 2400);
            }
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

