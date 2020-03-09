export default class NotificationService {
    constructor(axios) {
        this.axios = axios;
    }

    getByUserId(page, limit) {
        return this.axios.get(`/api/notification?page=${page}&${limit}`);
    }

    getCountByUserId() {
        return this.axios.get(`/api/notification/count`);
    }

    getCountNoReadByUserId() {
        return this.axios.get(`/api/notification/count-no-read`);
    }
};
