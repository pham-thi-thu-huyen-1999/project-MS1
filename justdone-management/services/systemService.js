export default class YodleeService {
    constructor(axios) {
        this.axios = axios;
    }

    getStatus() {
        return this.axios.get('/api/system');
    }

    assignCoas(data) {
        return this.axios.post('/api/system/init-assign-coas', data);
    }
}
