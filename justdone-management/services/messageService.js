export default class MessageService {
    constructor(axios) {
        this.axios = axios;
    }

    sendMessageToRole(groupReceive, content) {
        return this.axios.post(`/api/message`, {
            groupReceive,
            content
        });
    }

    getMessageByRole(role = '', page, limit) {
        return this.axios.get(`/api/message?role=${role}&page=${page}&limit=${limit}`);
    }

    getCountMessageByRole(role = '') {
        return this.axios.get(`/api/message/count?role=${role}`);
    }
};
