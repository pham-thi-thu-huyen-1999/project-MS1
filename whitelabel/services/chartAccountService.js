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
    getChartAccounts(page, limit, keyword) {
        return this.axios.get(`/api/chart-account/search/?page=${page}&limit=${limit}&keyword=${keyword}`);
    }
}
