// import Transactions from '~/assets/datajson/cron.json';

export default class TransactionService {
    constructor(axios) {
        this.axios = axios;
    }

    getTransactions(userId, type, year, month, page, limit) {
        return this.axios.get(`api/transaction/search?userId=${userId}&type=${type}&year=${year}&month=${month}&page=${page}&limit=${limit}`);
    }

    getCountTransactions(userId, type, year, month) {
        return this.axios.get(`api/transaction/count-search?userId=${userId}&type=${type}&year=${year}&month=${month}`);
    }

    getTransactionByName(userId, month, year, name) {
        return this.axios.get(`/api/transaction/gj?userId=${userId}&month=${month}&year=${year}&search=${name}`);
    }

    // getTransactions(type, year, month, page, limit) {
    //     let result = {
    //         data: []
    //     };

    //     Transactions.find((transaction, index) => {
    //         if (transaction.month === month && transaction.year === year && transaction.type === type) {
    //             if (index >= page && index <= limit) {
    //                 result.data.push(transaction);
    //             }
    //         }
    //     });
    //     return result;
    // }
};
