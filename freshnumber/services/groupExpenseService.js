export default class GroupExpenseService {
    constructor(axios) {
        this.axios = axios;
    }

    listGroup(page, limit) {
        return this.axios.get(`/api/group-expenses/list?page=${page}&limit=${limit}`);
    }

    getCoaWithGroup(groupId) {
        if (!groupId) return;
        return this.axios.get(`/api/group-expenses/${groupId}`);
    }

    getGroupById(groupId) {
        if (!groupId) return;
        return this.axios.get(`/api/group-expenses/${groupId}`);
    }

    searchChartAccount(userId, keyword) {
        if (!userId || !keyword)
            return;
        return this.axios.get(`/api/chart-account/${userId}/search?keyword=${keyword}`);
    }

    creatGroup(data) {
        if (!data) return;
        return this.axios.post('/api/group-expenses', data);
    }

    getChartAccountByProduct(page, limit, keyword = '') {
        return this.axios.get(`/api/chart-account/search-by-product?keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    getCountWithProduct(keyword) {
        if (!keyword)
            return this.axios.get(`/api/chart-account/count-search-by-product`);
        else
            return this.axios.get(`/api/chart-account/count-search-by-product?keyword=${keyword}`);
    }

    addCoA(groupId, data) {
        if (!groupId || !data)
            return;
        return this.axios.put(`/api/group-expenses/${groupId}/add-chart-account`, data);
    }

    removeCoa(groupId, coaId) {
        if (!groupId || !coaId)
            return;
        return this.axios.put(`/api/group-expenses/${groupId}/${coaId}/remove-coa`);
    }

    updateGroup(groupId, data) {
        if (!groupId || !data) return;
        return this.axios.put(`/api/group-expenses/${groupId}`, data);
    }

    orderGroup(order) {
        return this.axios.post(`/api/group-expenses/order-group-expenses`, order);
    }

    deleteGroup(groupId) {
        if (!groupId) return;
        return this.axios.delete(`/api/group-expenses/${groupId}`);
    }
};
