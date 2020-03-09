export default class YodleeService {
    constructor(axios) {
        this.axios = axios;
    }

    searchProvider(searchTerm) {
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

    getBankAccounts(providerAccountId, providerId) {
        if (!providerAccountId || !providerId)
            return;
        let config = {
            timeout: 10000
        };
        return this.axios.get(`/api/yodlee/bank-accounts?providerAccountId=${providerAccountId}&providerId=${providerId}`, config);
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

    updateOpenBalance(data) {
        return this.axios.put('/api/yodlee/update-openbalance', data);
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
        return this.axios.put(`/api/yodlee/bank`, data);
    }

    removeReconnectBank(bankType) {
        if (!bankType || typeof bankType !== 'number')
            return;
        let data = {
            type: bankType
        };
        return this.axios.put(`/api/yodlee/remove-reconect`, data);
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

    getBanksConnected(clientId) {
        return this.axios.get(`/api/connect-bank${clientId ? '?id=' + clientId : '/'}`);
    }

    getAllConnectBank(clientId) {
        return this.axios.get(`/api/connect-bank/find-all-connect-bank${clientId ? '?id=' + clientId : '/'}`);
    }

    addAccounts(id, data) {
        if (!id || !data)
            return;
        return this.axios.post(`/api/connect-bank/add-accounts?connectBankId=${id}`, data);
    }

    updateConnectBank(id, data) {
        if (!id || !data)
            return;
        return this.axios.put(`/api/connect-bank/${id}`, data);
    }

    activeAccountBank(id) {
        if (!id)
            return;
        return this.axios.get(`/api/active-connect-bank/${id}`);
    }

    updateOpenbalanceMultiBank(requestBody) {
        return this.axios.put('/api/statement/update-open-balance-and-manual', requestBody);
    }

    createManualAccountNumber(requestBody) {
        return this.axios.post('/api/connect-bank/create-manual-account-number', requestBody);
    }
};
