<template>
         <div class="modal add-account-number-modal" tabindex="-1" role="dialog" id="modal-add-account-number">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title font-weight-bold">ADD ACCOUNT NUMBER</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                   <div class="form-group">
                       <label>Bank</label>
                        <!-- <input tabindex="4" class="form-input" placeholder="Find your bank..." type="text" v-model="bankingName" /> -->
                        <input class="form-control" placeholder="Find your bank..." data-toggle="dropdown" @input="(event) => this.getBankList(event.target.value)" v-model="searchBankName" />
                        <ul v-if="banks.length > 0" class="dropdown-menu">
                           <li v-for="bank in banks" :key="bank._id" @click="setBank(bank)" class="bank-item">
                                <img class="bank-img" v-bind:src="bank.favicon" v-bind:title="bank.name">
                                <span class="bank-name">{{bank.name}} ({{ bank.languageISOCode ? bank.languageISOCode : '' | lowercase }}{{ bank.languageISOCode && bank.countryISOCode ? '-' : ''}}{{ bank.countryISOCode ? bank.countryISOCode : '' | uppercase}})</span>
                           </li>
                        </ul>
                   </div>
                   <div class="form-group">
                       <label>ACCOUNT NAME</label>
                       <input class="form-control" placeholder="Name..." v-model="accountName" />
                   </div>
                    <div class="form-group">
                       <label>ACCOUNT NUMBER</label>
                       <input class="form-control" placeholder="Number..." v-model="accountNumber" />
                   </div>
                    <div class="form-group">
                       <label>ACCOUNT TYPE</label>
                       <div class="row">
                            <div class="col-6">
                               <button 
                                    class="btn btn-account-type"
                                    :class="{active: type === 1}"
                                    @click="changeType(1)"
                                >
                                BANK ACCOUNT
                                </button>
                           </div>
                           <div class="col-6">
                               <button 
                                    class="btn btn-account-type"
                                    :class="{active: type === 2}"
                                    @click="changeType(2)"
                                >
                                CREDIT CARD
                                </button>
                           </div>
                       </div>
                   </div>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-primary outline"
                        @click="addAccountNumber"
                    >
                        Save
                    </button>
                    <button type="button" class="btn btn-secondary outline" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'modal-add-account-number',
    data() {
        return {
            banks: [],
            selectedbank: {},
            searchBankName: '',
            accountName: '',
            accountNumber: '',
            type: 1,
            timeout: null
        };
    },
    created() {
        this.getBankList();
    },
    methods: {
        changeType(type) {
            this.type = type;
        },
        async getBankList(search = '') {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(async () => {
                const response = await this.$services.yodleeService.searchProvider(search);
                if (response && response.data) {
                    this.banks = response.data;
                    this.$forceUpdate();
                }
            }, 1000);
        },
        setBank(bank = {}) {
            this.selectedbank = bank || {};
            this.searchBankName = this.selectedbank.name + ' ' + `(${this.selectedbank.languageISOCode}-${this.selectedbank.countryISOCode})`;
        },
        hideModal() {
            $('#modal-add-account-number').modal('hide');
            this.selectedbank = {};
            this.searchBankName = '';
            this.accountNumber = '';
            this.accountName = '';
        },
        async addAccountNumber() {
            let clientId = this.$route.params.id;
            if (this.selectedbank._id && this.accountNumber && this.accountName && this.type) {
                const {favicon, name, bankId} = this.selectedbank;
                const {accountName, accountNumber, type} = this;
                const requestBody = {
                    userId: clientId,
                    provider: {
                        favicon,
                        name,
                        bankId
                    },
                    account: {
                        accountName,
                        accountNumber,
                        type
                    }
                };
                this.$setLoading();
                const {data} = await this.$services.yodleeService.createManualAccountNumber(requestBody);
                if (data) {
                    this.$notify({
                        type: 'success',
                        text: 'Add account number successfully'
                    });
                    this.hideModal();
                }
                else {
                    this.$notify({
                        type: 'error',
                        text: 'Fail to add account number'
                    });
                }
                this.$setLoading(false);
                this.$emit('refresh');
            }
        }
    },
    filters: {
        lowercase(value) {
            return value.toLowerCase();
        },
        uppercase(value) {
            return value.toUpperCase();
        }
    }
};
</script>