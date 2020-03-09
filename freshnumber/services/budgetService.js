export default class BudgetService {
    constructor(axios) {
        this.axios = axios;
    }

    getBudgetFinancial(productCode, userId, beginYear, beginMonth, endYear, endMonth, page, limit, keyword = '') {
        return this.axios.get(`/api/budget?productCode=${productCode}&clientId=${userId}&beginYear=${beginYear}&beginMonth=${beginMonth}&endYear=${endYear}&endMonth=${endMonth}&keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    getCountBudget(productCode, userId, keyword = '') {
        return this.axios.get(`/api/budget/count?productCode=${productCode}&clientId=${userId}&keyword=${keyword}`);
    }

    createAndUpdateBudgets(data) {
        return this.axios.post('/api/budget', data);
    }
};
