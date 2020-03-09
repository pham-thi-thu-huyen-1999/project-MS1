export default class HistoryService {
    constructor(axios) {
        this.axios = axios;
    }

    getByUserId(module, type, page, limit) {
        return this.axios.get(`/api/history?module=${module}&type=${type}&page=${page}&limit=${limit}`);
    }

    getCountByUserId(userId) {
        return this.axios.get(`/api/history/count`);
    }

    getListSignIn(isChoice, productCode) {
        return this.axios.get(`api/history/list-sign-in?isChoice=${isChoice}&productCode=${productCode}`);
    }
};
