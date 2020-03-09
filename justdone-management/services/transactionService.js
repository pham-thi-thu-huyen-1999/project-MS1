export default class TransactionService {
    constructor(axios) {
        this.axios = axios;
    }

    // getCrunchTransactions(clientId, type, year, month, page, limit) {
    //     return this.axios.get(`api/transaction/crunch/${clientId}?type=${type}&year=${year}&month=${month}&page=${page}&limit=${limit}`);
    // }
    getTransactions(userId, accountId, type, year, month, page, limit) {
        return this.axios.get(`api/transaction/search?userId=${userId}&accountId=${accountId}&type=${type}&year=${year}&month=${month}&page=${page}&limit=${limit}`);
    }

    getCountTransactions(userId, type, year, month) {
        return this.axios.get(`api/transaction/count-search?userId=${userId}&type=${type}&year=${year}&month=${month}`);
    }

    getTransactionsToCrunch(userId, accountId, type, year, month, page, limit) {
        return this.axios.get(`/api/transaction/transaction-to-crunch?userId=${userId}&accountId=${accountId}&type=${type}&year=${year}&month=${month}&page=${page}&limit=${limit}`);
    }

    getCountTransactionsToCrunch(userId, type, year, month) {
        return this.axios.get(`/api/transaction/count-transaction-to-crunch?userId=${userId}&type=${type}&year=${year}&month=${month}`);
    }

    getTransactionsToExpenses(userId, type, year, month, page, limit) {
        return this.axios.get(`/api/transaction/expenses?userId=${userId}&type=${type}&year=${year}&month=${month}&page=${page}&limit=${limit}`);
    }

    getCountTransactionsToExpenses(userId, type, year, month) {
        return this.axios.get(`/api/transaction/count-expenses?userId=${userId}&type=${type}&year=${year}&month=${month}`);
    }

    getChartAccountForExpenses(userId, type, year, month) {
        return this.axios.get(`/api/transaction/chart-account-for-expenses?userId=${userId}&type=${type}&year=${year}&month=${month}`);
    }

    getTransactionsToExpensesAndChartAccount(userId, type, year, month, coaId, page, limit) {
        return this.axios.get(`/api/transaction/expenses/chart-account?userId=${userId}&type=${type}&year=${year}&month=${month}&coaId=${coaId}&page=${page}&limit=${limit}`);
    }

    getCountTransactionsToExpensesAndChartAccount(userId, type, year, month, coaId) {
        return this.axios.get(`/api/transaction/expenses/count-chart-account?userId=${userId}&type=${type}&year=${year}&month=${month}&coaId=${coaId}`);
    }

    getTransactionsToDrawings(userId, type, year, month, page, limit) {
        return this.axios.get(`/api/transaction/drawings?userId=${userId}&type=${type}&year=${year}&month=${month}&page=${page}&limit=${limit}`);
    }

    getCountTransactionsToDrawings(userId, type, year, month) {
        return this.axios.get(`/api/transaction/count-drawings?userId=${userId}&type=${type}&year=${year}&month=${month}`);
    }

    getTransactionsToIncome(userId, type, year, month, page, limit) {
        return this.axios.get(`/api/transaction/income?userId=${userId}&type=${type}&year=${year}&month=${month}&page=${page}&limit=${limit}`);
    }

    getCountTransactionsToIncome(userId, type, year, month) {
        return this.axios.get(`/api/transaction/count-income?userId=${userId}&type=${type}&year=${year}&month=${month}`);
    }

    getTransactionsToOther(userId, type, year, month, page, limit) {
        return this.axios.get(`/api/transaction/other?userId=${userId}&type=${type}&year=${year}&month=${month}&page=${page}&limit=${limit}`);
    }

    getCountTransactionsToOther(userId, type, year, month) {
        return this.axios.get(`/api/transaction/count-other?userId=${userId}&type=${type}&year=${year}&month=${month}`);
    }

    getTransactionByName(userId, month, year, name) {
        return this.axios.get(`/api/transaction/gj?userId=${userId}&month=${month}&year=${year}&search=${name}`);
    }

    getManualTransaction(manualTransaction, userId, accountId, type, year, month) {
        return this.axios.get(`/api/transaction/manual-transaction?manualTransaction=${manualTransaction}&userId=${userId}&accountId=${accountId}&type=${type}&year=${year}&month=${month}`);
    }

    async createTransactionWithoutId(data) {
        return this.axios.post('api/transaction/createTransaction', data, {timeout: 60000});
    }

    deleteAndUpdateStatement(data) {
        return this.axios.post('api/transaction/delete-and-update-statement', data);
    }

    checkTransactionByMonth(data) {
        return this.axios.post('api/transaction/check-statement-by-month', data);
    }

    createFullStatement(data) {
        return this.axios.post('api/transaction/find-start-statement', data);
    }

    updateCrunchType(_id, data) {
        return this.axios.put(`/api/transaction/crunch-type/${_id}`, data);
    }

    addChartAccountToTransaction(_id, data) {
        return this.axios.put(`/api/transaction/chart-account/${_id}`, data);
    }

    deleteCrunchType(_id) {
        return this.axios.delete(`/api/transaction/crunch-type/${_id}`);
    }

    crunchAutomation(userId, accountId, type, year, month) {
        return this.axios.get(`/api/transaction/crunch-automation?userId=${userId}&accountId=${accountId}&type=${type}&year=${year}&month=${month}`);
    }

    previewCrunchAutomation(userId, type, year, month, data) {
        return this.axios.post(`/api/transaction/preview-crunch-automation?userId=${userId}&type=${type}&year=${year}&month=${month}`, data);
    }

    removeTransaction(_id) {
        if (!_id)
            return;
        return this.axios.put(`/api/transaction/remove-transaction/${_id}`);
    }

    removeWarning(_id) {
        if (!_id)
            return;
        return this.axios.put(`/api/transaction/remove-warning/${_id}`);
    }

    updateManualTransaction(data) {
        return this.axios.put('/api/transaction/update-manual-trans', data);
    }
};
