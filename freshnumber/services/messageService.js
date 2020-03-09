export default class MessageService {
    constructor(axios) {
        this.axios = axios;
    }

    getMessageByRole(page, limit) {
        return this.axios.get(`/api/message?page=${page}&limit=${limit}`);
    }

    getCountMessageByRole() {
        return this.axios.get(`/api/message/count`);
    }
};
