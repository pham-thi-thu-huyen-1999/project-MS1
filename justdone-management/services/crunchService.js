export default class CrunchService {
    constructor(axios) {
        this.axios = axios;
    }

    getCrunchFilterById(_id) {
        return this.axios.get(`/api/crunch/crunch-filter-by-id?crunchfilterId=${_id}`);
    }

    getTotalIncome() {
        return this.axios.get('/api/crunch/get-total-income');
    }

    getCrunch(userId, type, beginYear) {
        let data = {userId: userId, type: type, beginYear: beginYear};
        return this.axios.post(`/api/crunch/crunchs`, data);
    }

    getCrunchFilter(userId, isGlobal, startDate, endDate, searchText, page, limit) {
        return this.axios.get(`/api/crunch/cruncher-filter?userId=${userId}&isGlobal=${isGlobal}&startDate=${startDate}&endDate=${endDate}&searchText=${searchText}&page=${page}&limit=${limit}`);
    }

    getCountCrunchFilter(userId, isGlobal, startDate, endDate, searchText) {
        return this.axios.get(`/api/crunch/count-cruncher-filter?userId=${userId}&isGlobal=${isGlobal}&startDate=${startDate}&endDate=${endDate}&searchText=${searchText}`);
    }

    getDataCrunchsReports(data) {
        return this.axios.post('/api/crunch/data-reports', data);
    }

    updateCompleted(userId, accountId, type, year, month) {
        return this.axios.put(`/api/crunch/complete?userId=${userId}&accountId=${accountId}&type=${type}&year=${year}&month=${month}`);
    }

    updateApprove(userId, type, year, month, msg) {
        let data = {userId: userId, type: type, year: year, month: month, msg: msg};
        return this.axios.post(`/api/crunch/aprove`, data);
    }

    createCrunchFilter(data) {
        return this.axios.post(`/api/crunch/crunch-filter`, data);
    }

    updateCrunchFilter(_id, data) {
        return this.axios.put(`/api/crunch/crunch-filter?crunchfilterId=${_id}`, data);
    }

    deleteCrunchFilter(_id) {
        return this.axios.delete(`/api/crunch/crunch-filter?crunchfilterId=${_id}`);
    }
};
