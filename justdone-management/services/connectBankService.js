export default class connectBankService {
    constructor(axios) {
        this.axios = axios;
    }

    deleteManualAccount(data) {
        return this.axios.delete('/api/connect-bank/manual', {_id: data});
    }
};
