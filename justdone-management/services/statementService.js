export default class StatementService {
    constructor(axios) {
        this.axios = axios;
    }

    getStatementOfClient(userId, accountId, type, year, month) {
        return this.axios.get(`/api/statement/year-month/${userId}?accountId=${accountId}&type=${type}&year=${year}&month=${month}`);
    }

    getStatementsByFinancialYear(userId, accountId, type, beginYear, endYear) {
        if (!userId || !type || !beginYear || !endYear)
            return {data: null};
        return this.axios.get(`/api/statement/finance-year?userId=${userId}&accountId=${accountId}&type=${type}&beginYear=${beginYear}&endYear=${endYear}`);
    }

    checkConnectBank(userId) {
        return this.axios.get(`/api/statement/check-connect-bank/${userId}`);
    }

    createStatementByAccountId(data) {
        return this.axios.post('/api/statement/create-statement-by-accountId', data);
    }
};
