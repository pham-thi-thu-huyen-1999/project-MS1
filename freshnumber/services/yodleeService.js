export default class YodleeService {
    constructor(axios) {
        this.axios = axios;
    }

    searchProvider(searchTerm) {
        if (!searchTerm)
            return;
        return this.axios.get(`/api/yodlee/providers?searchTerm=${searchTerm}&page=1&limit=10`);
    }

    getProviders() {
        return this.axios.get('/api/yodlee/providers?page=1&limit=30');
    }

    getFormLoginBank(bankId) {
        let config = {
            timeout: 10000
        };
        return this.axios.get('/api/yodlee/form-login-bank/' + bankId, config);
    }

    getConnectBankStatus(providerAccountId) {
        let config = {
            timeout: 20000
        };
        return this.axios.get('/api/yodlee/connecting-bank-status/' + providerAccountId, config);
    }

    getBankAccounts(type) {
        let config = {
            timeout: 10000
        };
        return this.axios.get(`/api/yodlee/bank-accounts?type=${type}`, config);
    }

    getPublicKey() {
        let config = {
            timeout: 20000
        };
        return this.axios.get('/api/yodlee/public-key', config);
    }

    loadTransactionAndSave(typeTransaction) {
        return this.axios.get(`/api/yodlee/transaction?bankType=${typeTransaction}`);
    }

    addBank(providerId, loginForm, type) {
        let data = {
            providerId: providerId,
            loginForm: loginForm,
            type: type
        };
        let config = {
            timeout: 20000
        };
        return this.axios.post('/api/yodlee/bank', data, config);
    }

    reconnectBank(providerId, loginForm, bankType) {
        if (!bankType || typeof bankType !== 'number' || !loginForm || !providerId)
            return;
        let data = {
            loginForm: loginForm,
            providerId: providerId,
            type: bankType
        };
        // console.log(data);
        return this.axios.put(`/api/yodlee/bank`, data);
    }

    removeBank(providerId) {
        let reqBody = {
            providerId: providerId
        };
        return this.axios.delete('/api/yodlee/remove-bank' + reqBody);
    }

    getFormUpdateBank(bankType) {
        if (!bankType || typeof bankType !== 'number')
            return;
        return this.axios.get(`/api/yodlee/form-update-bank?type=${bankType}`);
    }

    validateYodlee(track, step) {
        let reqBody = {
            track: track,
            mtp: step
        };
        let config = {
            timeout: 20000
        };
        return this.axios.post('/api/yodlee', reqBody, config);
    }
};
