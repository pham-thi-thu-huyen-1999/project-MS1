export default class CrunchService {
    constructor(axios) {
        this.axios = axios;
    }

    getDataCrunchsReport(data) {
        return this.axios.post('/api/crunch/data-report', data);
    }

    getDataCrunchsReports(data) {
        return this.axios.post('/api/crunch/data-reports', data);
    }

    totalIncomeForDate(data) {
        return this.axios.post('/api/crunch/total-income-for-date', data);
    }

    totalChartAccountForDate(data) {
        return this.axios.post('/api/crunch/total-coa-for-date', data);
    }
};
