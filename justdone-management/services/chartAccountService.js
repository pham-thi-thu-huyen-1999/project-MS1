export default class ChartAccountService {
    constructor(axios) {
        this.axios = axios;
    }

    search(keyword = '', page, limit) {
        return this.axios.get(`/api/chart-account/search?keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    getCountSearch(keyword = '') {
        return this.axios.get(`/api/chart-account/search-count?keyword=${keyword}`);
    }

    getCoaByClient(productCode, userId, keyword = '', page, limit) {
        return this.axios.get(`/api/chart-account/chart-account-by-client?productCode=${productCode}&userId=${userId}&keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    getCountCoaByClient(productCode, userId, keyword = '') {
        return this.axios.get(`/api/chart-account/count-chart-account-by-client?productCode=${productCode}&userId=${userId}&keyword=${keyword}`);
    }

    getStatus(data) {
        return this.axios.post('/api/chart-account/status', data);
    }

    create(data) {
        return this.axios.post('/api/chart-account', data);
    }

    assginClients(data) {
        return this.axios.post('/api/chart-account/assign-clients', data);
    }

    removeClientAssgined(data) {
        return this.axios.post('/api/chart-account/client-assigned', data);
    }

    update(id, data) {
        return this.axios.put(`/api/chart-account/${id}`, data);
    }

    delete(id) {
        if (id)
            return this.axios.delete(`/api/chart-account/${id}`);
    }
};
