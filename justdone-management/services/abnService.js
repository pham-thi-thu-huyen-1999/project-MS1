export default class AbnService {
    constructor(axios) {
        this.axios = axios;
    }

    lookupABN(abn) {
        let config = {
            timeout: 10000
        };
        return this.axios.get(`/api/abn/${process.env.location ? 'abn-uk-lookup' : 'abn-lookup'}?keyword=` + abn, config);
    }
};
