// import Statements from '~/assets/datajson/statement.json';

export default class StatementService {
    constructor(axios) {
        this.axios = axios;
    }
    getStatementsByFinancialYear(userId, type, beginYear, endYear) {
        if (!userId || !type || !beginYear || !endYear)
            return {data: null};
        return this.axios.get(`/api/statement/finance-year?userId=${userId}&type=${type}&beginYear=${beginYear}&endYear=${endYear}`);
    }
    // getStatementsByFinancialYear(banktype, begin, end, page, limit) {
    //     let result = {
    //         data: []
    //     };

    //     Statements.find((statement, index) => {
    //         if (statement.year >= begin && statement.year <= end && statement.type === banktype) {
    //             statement.page = page;
    //             statement.limit = limit;
    //             statement.total = Statements.length;
    //             result.data.push(statement);
    //         }
    //     });
    //     return result;
    // }
};
