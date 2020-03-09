export default class NotificationService {
    constructor(axios) {
        this.axios = axios;
    }

    getByUserId(userId, page, limit) {
        return this.axios.get(`/api/notification?&page=${page}&${limit}`);
    }

    getCountByUserId(userId) {
        return this.axios.get(`/api/notification/count`);
    }

    getCountNoReadByUserId(userId) {
        return this.axios.get(`/api/notification/count-no-read`, {timeout: 4000});
    }

    createMultipleNotify(data) {
        return this.axios.post(`/api/notification/create-multi-notify`, data);
    }
};
