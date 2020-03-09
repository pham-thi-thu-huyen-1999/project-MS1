export default class UsageBudget {
    constructor(axios) {
        this.axios = axios;
    }

    getCoaUsageBudget() {
        return this.axios.get(`/api/usage-budget/coa`);
    }

    getByBeginYear(userId, beginYear) {
        return this.axios.get(`/api/usage-budget?userId=${userId}&beginYear=${beginYear}`);
    }

    createUsageBudget(data) {
        return this.axios.post(`/api/usage-budget`, data);
    }

    updateUsageBudget(data) {
        return this.axios.put(`/api/usage-budget`, {usageBudgets: data});
    }
};
